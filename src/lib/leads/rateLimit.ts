/**
 * A small fixed-window rate limiter for the lead endpoint.
 *
 * **Know what this is and isn't.** State lives in the module scope of one
 * server process, so it limits per instance, not globally: on a platform
 * that runs several instances or recycles serverless workers, an attacker
 * spreading requests across them gets a proportionally higher effective
 * limit, and the counters reset on redeploy. It raises the cost of casual
 * form-spamming; it is not a defence against a determined flood.
 *
 * The honest upgrade path when that matters is a shared store (Upstash
 * Redis, Vercel KV, or a Postgres counter in the same Supabase project) —
 * only `check()` would change. It is deliberately not pretending to be that
 * today.
 */

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the current window resets. Sent as `Retry-After`. */
  retryAfterSeconds: number;
}

interface Window {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
/** Cap on tracked keys, so a flood of unique IPs can't grow this map without bound. */
const MAX_TRACKED_KEYS = 10_000;

const windows = new Map<string, Window>();

function sweep(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  { windowMs = WINDOW_MS, max = MAX_REQUESTS_PER_WINDOW }: { windowMs?: number; max?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) sweep(now);
    // Still full of live windows after sweeping — shed rather than grow.
    if (windows.size >= MAX_TRACKED_KEYS) {
      return { allowed: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  if (existing.count >= max) {
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort client identity for rate limiting.
 *
 * `x-forwarded-for` is spoofable in general; it is trustworthy only because
 * the hosting platform's proxy rewrites it. Never use this value for
 * anything but rate limiting, and never store it — it is personal data under
 * Indian DPDP and the GDPR, and this endpoint has no need to retain it.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/** Test seam — clears all windows between cases. */
export function resetRateLimits(): void {
  windows.clear();
}
