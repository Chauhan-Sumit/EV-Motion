import type { AnalyticsEvent, AnalyticsEventName } from "./types";

/**
 * Client-side event tracking.
 *
 * **Two rules this module must never break**, because analytics is never
 * worth degrading the actual product for:
 *
 *  1. It never throws. Every entry point is wrapped; a failure to record an
 *     event must not break the interaction that produced it.
 *  2. It never blocks. Events are queued and flushed on a timer or at page
 *     hide, via `sendBeacon` where available so a flush survives navigation.
 *
 * No cookies and no persistent id — see the privacy note in `./types`.
 */

const ENDPOINT = "/api/events";
const SESSION_KEY = "ev-motion:analytics-session";
const FLUSH_INTERVAL_MS = 5000;
const MAX_QUEUE = 20;

let queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let listenersBound = false;

/**
 * Suppresses an identical event repeated within this window.
 *
 * React StrictMode double-invokes effects in development, so every
 * `TrackPageView` fired twice a few milliseconds apart — confirmed against
 * the database, two `vehicle_view` rows 3ms apart from one page load. That
 * is dev-only (a production build fires once, also confirmed), but it still
 * silently doubled the counts for anyone browsing their own dev server, and
 * any future remount — a layout change, a fast-refresh, a re-keyed template —
 * would do the same in production.
 *
 * One second is chosen to be long enough to absorb a remount and far shorter
 * than any genuine repeat: a person navigating away and back, or searching
 * the same term again, is a real second event and is still recorded.
 */
const DEDUPE_WINDOW_MS = 1000;
const recentlyTracked = new Map<string, number>();

/**
 * Tab-scoped anonymous id. `sessionStorage`, not `localStorage`, so it dies
 * with the tab and cannot be used to recognise a returning visitor. Falls
 * back to an ephemeral in-memory id when storage is unavailable (private
 * mode, storage disabled) rather than failing.
 */
let memorySessionId: string | null = null;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = newId();
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    memorySessionId ??= newId();
    return memorySessionId;
  }
}

function send(events: AnalyticsEvent[]): void {
  if (events.length === 0) return;
  const body = JSON.stringify({ sessionId: sessionId(), events });

  try {
    // sendBeacon survives the page going away, which is exactly when the
    // last and most interesting events tend to be queued.
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    // keepalive lets the request outlive the document too, for the fallback path.
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Swallowed on purpose — see rule 1.
  }
}

export function flushAnalytics(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  const pending = queue;
  queue = [];
  send(pending);
}

function bindLifecycleListeners(): void {
  if (listenersBound || typeof document === "undefined") return;
  listenersBound = true;
  // `visibilitychange` -> hidden is the reliable signal across browsers;
  // `pagehide` covers bfcache navigations that never fire unload.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushAnalytics();
  });
  window.addEventListener("pagehide", flushAnalytics);
}

/** Records an event. Safe to call from anywhere, including render paths and error handlers. */
export function track(
  name: AnalyticsEventName,
  props?: AnalyticsEvent["props"],
  path?: string,
): void {
  try {
    if (typeof window === "undefined") return;

    bindLifecycleListeners();

    const at = Date.now();
    const resolvedPath = path ?? window.location.pathname;
    const key = `${name}|${resolvedPath}|${JSON.stringify(props ?? {})}`;

    const lastSeen = recentlyTracked.get(key);
    if (lastSeen !== undefined && at - lastSeen < DEDUPE_WINDOW_MS) return;
    recentlyTracked.set(key, at);
    // Keep the map from growing across a long session — entries older than the
    // window can never suppress anything again.
    if (recentlyTracked.size > 50) {
      for (const [k, t] of recentlyTracked) {
        if (at - t >= DEDUPE_WINDOW_MS) recentlyTracked.delete(k);
      }
    }

    queue.push({ name, props, path: resolvedPath, at });

    if (queue.length >= MAX_QUEUE) {
      flushAnalytics();
      return;
    }
    flushTimer ??= setTimeout(flushAnalytics, FLUSH_INTERVAL_MS);
  } catch {
    // Swallowed on purpose — see rule 1.
  }
}

/** Test seam — drops anything queued without sending it, and clears the dedupe window. */
export function resetAnalyticsQueue(): void {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = null;
  queue = [];
  memorySessionId = null;
  recentlyTracked.clear();
}

/** Test seam — current queue depth. */
export function pendingAnalyticsCount(): number {
  return queue.length;
}
