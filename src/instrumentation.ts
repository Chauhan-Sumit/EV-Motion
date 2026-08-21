import type { Instrumentation } from "next";
import { reportServerError } from "@/lib/monitoring/serverErrors";
import { SENTRY_ENABLED, scrubEvent, sentryBaseOptions } from "@/lib/monitoring/sentry-config";

/**
 * Server and edge instrumentation. `register()` runs once per server
 * instance, before any request is handled (Next.js 16 file convention — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md).
 *
 * Sentry is imported dynamically and only when a DSN is configured, so a
 * deployment without one pays nothing: no SDK on the server, no init, no
 * outbound calls.
 */
export async function register(): Promise<void> {
  if (!SENTRY_ENABLED) return;

  // `NEXT_RUNTIME` tells us which runtime this instance is; the Node and edge
  // builds of the SDK are different entry points.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({ ...sentryBaseOptions, beforeSend: scrubEvent });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({ ...sentryBaseOptions, beforeSend: scrubEvent });
  }
}

/**
 * Called whenever the Next.js server captures an error — a throwing Server
 * Component, a failing route handler, a rendering error.
 *
 * **This closes a real gap that predates Sentry.** Client errors have been
 * captured since the 2026-08-16 hardening pass (`analytics/reportError.ts`),
 * but nothing captured *server* errors: they went to the platform log and
 * nowhere else. `reportServerError` records them regardless of whether Sentry
 * is configured, so this hook is worth having on its own.
 *
 * Must never throw: an error in the error handler would be invisible and
 * could take a request down with it.
 */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  try {
    await reportServerError(err, {
      path: typeof request.path === "string" ? request.path : undefined,
      method: typeof request.method === "string" ? request.method : undefined,
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
    });

    if (SENTRY_ENABLED) {
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureRequestError(err, request, context);
    }
  } catch {
    // Reporting a failure must never itself fail — same rule as
    // analytics/track.ts. A dropped error report is bad; a crashed request
    // handler is worse.
  }
};
