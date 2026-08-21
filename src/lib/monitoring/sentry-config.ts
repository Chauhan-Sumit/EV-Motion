import type { ErrorEvent, NodeOptions } from "@sentry/nextjs";

/**
 * Central Sentry configuration, and the one place that decides whether Sentry
 * is active at all.
 *
 * **Sentry is entirely optional.** With no DSN set, every entry point below
 * short-circuits and the app behaves exactly as it did before Sentry was
 * installed — no network calls, no init, no build-time source-map upload.
 * That is the same "unconfigured degrades honestly" posture the site already
 * takes for Supabase (`supabaseConfig()`) and ImageKit (`IMAGEKIT_CONFIGURED`),
 * and it means shipping without a Sentry account is a supported state rather
 * than a broken one.
 *
 * The existing Supabase error pipeline (`analytics/reportError.ts` ->
 * `analytics_events`) is deliberately NOT removed. It is vendor-free, already
 * works, and remains the fallback record. Sentry adds what that pipeline was
 * explicitly documented as not being (CLAUDE.md #25): something that can
 * alert a human rather than be looked up afterwards.
 */

/** Browser-visible DSN. Safe to expose — a DSN is a write-only ingest endpoint, not a secret. */
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";

export const SENTRY_ENABLED = SENTRY_DSN.length > 0;

/**
 * Which deployment this is. Vercel sets `VERCEL_ENV` to
 * production/preview/development, which is more useful than NODE_ENV because
 * preview deploys build in production mode.
 */
export const SENTRY_ENVIRONMENT =
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";

/** Ties an error to the exact deploy that produced it. Vercel injects the commit SHA. */
export const SENTRY_RELEASE = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA;

/**
 * Options shared by the browser, server and edge runtimes.
 *
 * `tracesSampleRate` is 0: performance tracing is a separate product decision
 * with its own quota cost, and the problem being solved here is "nobody knows
 * when the site breaks", not "which route is slow". Turn it on deliberately.
 *
 * `sendDefaultPii` is false, and must stay false. This site's whole privacy
 * position — stated on `/privacy` — is that it collects no more than it needs
 * and stores no IP addresses. Letting an error reporter quietly attach IPs and
 * request headers would make that page untrue.
 */
export const sentryBaseOptions: NodeOptions = {
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  release: SENTRY_RELEASE,
  tracesSampleRate: 0,
  sendDefaultPii: false,
  /** Errors we can neither fix nor act on, and which would otherwise dominate the quota. */
  ignoreErrors: [
    // Benign: fires when a user navigates away mid-request.
    "AbortError",
    "The operation was aborted",
    // Browser extensions and injected scripts, not our code.
    "ResizeObserver loop completed with undelivered notifications",
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],
};

/**
 * Last line of defence before an event leaves the browser or server.
 *
 * Two jobs. First, drop anything that arrives while Sentry is not configured
 * (belt and braces — nothing should get this far). Second, strip the request
 * data Sentry attaches by default that could carry personal data: a lead form
 * posts a name, phone and email, and `/privacy` states plainly that we do not
 * log those. An error report is not an exemption from that promise.
 */
export function scrubEvent(event: ErrorEvent): ErrorEvent | null {
  if (!SENTRY_ENABLED) return null;

  if (event.request) {
    // Request bodies are where lead submissions live. Never send them.
    delete event.request.data;
    delete event.request.cookies;
    if (event.request.headers) {
      for (const header of ["authorization", "cookie", "x-forwarded-for", "x-real-ip"]) {
        delete event.request.headers[header];
      }
    }
  }

  return event;
}
