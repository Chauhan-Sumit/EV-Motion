import type { AnalyticsBatch, AnalyticsEvent, AnalyticsEventName } from "./types";

/**
 * Validates an untrusted analytics batch. Same posture as the lead endpoint:
 * allow-list based, length-capped, and the server's copy is the real gate
 * regardless of what the browser sent.
 *
 * Analytics is a public, unauthenticated write endpoint, which makes it the
 * easiest thing on the site to pollute. The defence is that nothing here is
 * free-form: event names come from a fixed set, prop keys are capped in
 * number, values are capped in length and type, and a batch is capped in
 * size. A caller can still send junk, but it cannot send *large* junk or
 * junk that changes the shape of the table.
 */

const EVENT_NAMES: AnalyticsEventName[] = ["search", "vehicle_view", "compare_view", "lead_submitted", "error"];

const MAX_EVENTS_PER_BATCH = 20;
const MAX_PROPS_PER_EVENT = 10;
const MAX_KEY_LENGTH = 40;
const MAX_VALUE_LENGTH = 300;
const MAX_PATH_LENGTH = 200;
const MAX_SESSION_ID_LENGTH = 64;

/** Clock skew tolerance either side of "now" — anything further out is clamped. */
const MAX_CLOCK_SKEW_MS = 24 * 60 * 60 * 1000;

function clampString(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function parseProps(raw: unknown): AnalyticsEvent["props"] {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return undefined;

  const out: NonNullable<AnalyticsEvent["props"]> = {};
  let count = 0;

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (count >= MAX_PROPS_PER_EVENT) break;
    const safeKey = clampString(key, MAX_KEY_LENGTH);
    if (!safeKey) continue;

    if (typeof value === "string") out[safeKey] = clampString(value, MAX_VALUE_LENGTH);
    else if (typeof value === "number") out[safeKey] = Number.isFinite(value) ? value : null;
    else if (typeof value === "boolean" || value === null) out[safeKey] = value;
    else continue; // objects, arrays, functions — dropped rather than stringified

    count += 1;
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

export interface ParsedBatch {
  sessionId: string;
  events: AnalyticsEvent[];
}

export function parseAnalyticsBatch(body: unknown, now = Date.now()): ParsedBatch | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Partial<AnalyticsBatch> & Record<string, unknown>;

  const sessionId = typeof raw.sessionId === "string" ? clampString(raw.sessionId, MAX_SESSION_ID_LENGTH) : "";
  if (!sessionId) return null;

  if (!Array.isArray(raw.events) || raw.events.length === 0) return null;

  const events: AnalyticsEvent[] = [];
  for (const candidate of raw.events.slice(0, MAX_EVENTS_PER_BATCH)) {
    if (typeof candidate !== "object" || candidate === null) continue;
    // `raw.events` is typed as AnalyticsEvent[] via the Partial<AnalyticsBatch>
    // cast above, but it is untrusted input — re-widen through `unknown` and
    // check every field, rather than letting the declared type vouch for it.
    const event = candidate as unknown as Record<string, unknown>;

    const name = event.name;
    if (typeof name !== "string" || !EVENT_NAMES.includes(name as AnalyticsEventName)) continue;

    // Clock is client-supplied, so treat it as untrusted: a wildly wrong
    // timestamp would otherwise scatter rows across the table's time index.
    const rawAt = typeof event.at === "number" && Number.isFinite(event.at) ? event.at : now;
    const at = Math.abs(rawAt - now) > MAX_CLOCK_SKEW_MS ? now : rawAt;

    events.push({
      name: name as AnalyticsEventName,
      path: typeof event.path === "string" ? clampString(event.path, MAX_PATH_LENGTH) || undefined : undefined,
      props: parseProps(event.props),
      at,
    });
  }

  return events.length > 0 ? { sessionId, events } : null;
}
