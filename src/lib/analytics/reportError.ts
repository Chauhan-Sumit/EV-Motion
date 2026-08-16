import { flushAnalytics, track } from "./track";

/**
 * Error reporting, on top of the same event pipeline as everything else.
 *
 * Errors are flushed immediately rather than batched on the usual timer: an
 * error is often the last thing that happens before a page is abandoned or
 * reloaded, so waiting up to five seconds is a good way to never hear about
 * the errors that matter most.
 *
 * **Only the message, name and digest are sent — never the stack.** Stacks
 * on a Next.js production build are minified and near-useless without source
 * maps, and they can incidentally carry URL fragments or props. `digest` is
 * the thing worth having: Next.js logs the same digest server-side, so a
 * client report can be matched to its server-side cause.
 */
export function reportError(error: unknown, context?: Record<string, string | number | boolean | null>): void {
  try {
    const err = error instanceof Error ? error : undefined;
    track("error", {
      message: (err?.message ?? String(error)).slice(0, 300),
      name: err?.name ?? "unknown",
      digest: (error as { digest?: string })?.digest ?? null,
      ...context,
    });
    flushAnalytics();
  } catch {
    // Reporting a failure must never itself fail — see the rules in ./track.
  }
}
