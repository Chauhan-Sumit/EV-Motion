import { SENTRY_ENABLED, scrubEvent, sentryBaseOptions } from "@/lib/monitoring/sentry-config";

/**
 * Browser instrumentation, run before the app hydrates (Next.js 16 file
 * convention — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.md).
 *
 * The `SENTRY_ENABLED` guard is the important line: `NEXT_PUBLIC_*` is inlined
 * at build time, so a build with no DSN compiles this to a dead branch and the
 * dynamic import is never reached. **No Sentry code reaches the browser bundle
 * of a deployment that has no DSN** — which matters on a site that spent a
 * whole hardening batch getting 110-130 KB of JavaScript back out of every
 * page (CLAUDE.md #23).
 *
 * The existing client pipeline (`analytics/reportError.ts`) is unchanged and
 * keeps working either way.
 */
if (SENTRY_ENABLED) {
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      ...sentryBaseOptions,
      beforeSend: scrubEvent,
      // Session Replay records what a user did before an error. It is a
      // meaningful privacy decision (it captures page content and input
      // interactions) and would contradict `/privacy`'s "no durable
      // identifier, no cross-visit tracking" position, so it stays off unless
      // that page is updated first.
      replaysOnErrorSampleRate: 0,
      replaysSessionSampleRate: 0,
    });
  });
}

/**
 * Reports client-side navigation timing to Sentry. Exported unconditionally
 * because Next.js looks for this symbol; it no-ops when Sentry is off.
 */
export async function onRouterTransitionStart(
  ...args: Parameters<NonNullable<Awaited<ReturnType<typeof loadSentry>>["captureRouterTransitionStart"]>>
): Promise<void> {
  if (!SENTRY_ENABLED) return;
  const Sentry = await loadSentry();
  Sentry.captureRouterTransitionStart?.(...args);
}

function loadSentry() {
  return import("@sentry/nextjs");
}
