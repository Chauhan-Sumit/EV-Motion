import { storeEvents } from "@/lib/analytics/eventStore";

/**
 * Records a server-side error into the same `analytics_events` table the
 * client error pipeline uses.
 *
 * **This exists independently of Sentry and works without it.** Client errors
 * have been captured since the 2026-08-16 hardening pass
 * (`analytics/reportError.ts` -> `POST /api/events`), but *server* errors —
 * a throwing Server Component, a failing route handler — went to the platform
 * log and nowhere queryable. Next.js 16's `onRequestError` hook
 * (`src/instrumentation.ts`) is the supported place to catch them, and this is
 * where they land.
 *
 * Server-side, so it writes through `storeEvents` directly rather than
 * `track()`, which is a browser module (sessionStorage, sendBeacon).
 *
 * **Privacy rules are the same as every other event** (see
 * `analytics/types.ts`): message, error name and digest only — never the
 * stack, never request bodies, never headers. A stack from a minified
 * production build is near-useless without source maps and can incidentally
 * carry URL fragments or props; the `digest` is the genuinely useful part,
 * because Next.js logs the same digest and it ties a report to its cause.
 */
export interface ServerErrorContext {
  path?: string;
  method?: string;
  routerKind?: string;
  routePath?: string;
  routeType?: string;
}

/** Matches `AnalyticsEvent["props"]` — scalars only, so nothing structured can leak in. */
type Props = Record<string, string | number | boolean | null>;

export async function reportServerError(error: unknown, context: ServerErrorContext = {}): Promise<void> {
  try {
    const err = error instanceof Error ? error : undefined;
    const digest = typeof error === "object" && error !== null && "digest" in error ? String(error.digest) : null;

    const props: Props = {
      message: (err?.message ?? String(error)).slice(0, 300),
      name: err?.name ?? "unknown",
      digest,
      side: "server",
      method: context.method ?? null,
      routerKind: context.routerKind ?? null,
      routePath: context.routePath ?? null,
      routeType: context.routeType ?? null,
    };

    await storeEvents({
      // No session: this did not happen in anyone's tab. A synthetic id would
      // imply a visitor session that does not exist.
      sessionId: "server",
      events: [
        {
          name: "error",
          path: context.path?.slice(0, 200),
          props,
          at: Date.now(),
        },
      ],
    });
  } catch {
    // Never throw from the error path — `onRequestError` runs inside request
    // handling, and a failure here would be both invisible and harmful.
  }
}
