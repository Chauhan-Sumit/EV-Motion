import { checkRateLimit, clientKey } from "@/lib/leads/rateLimit";
import { isEventStoreConfigured, storeEvents } from "@/lib/analytics/eventStore";
import { parseAnalyticsBatch } from "@/lib/analytics/validation";
import type { AnalyticsOutcome } from "@/lib/analytics/types";

/**
 * `POST /api/events` — analytics ingest.
 *
 * Deliberately more permissive on rate than `/api/leads` (60 batches/minute
 * vs 5 submissions), because a browsing session legitimately produces far
 * more events than form submissions, and each batch carries up to 20 of
 * them. Still bounded, so a single client cannot flood the table.
 *
 * The client's IP is used for that rate limit and then discarded — it is
 * never stored with an event. See the privacy note in `lib/analytics/types`.
 *
 * Failures here are answered with 204, not an error: analytics must never
 * surface as a broken request in a visitor's console, and the client has no
 * useful way to respond to a failure anyway.
 */
export const dynamic = "force-dynamic";

const RATE_LIMIT = { windowMs: 60_000, max: 60 };

export async function POST(request: Request): Promise<Response> {
  if (!checkRateLimit(`events:${clientKey(request.headers)}`, RATE_LIMIT).allowed) {
    return json({ status: "rate-limited" }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ status: "invalid" }, 400);
  }

  const batch = parseAnalyticsBatch(body);
  if (!batch) return json({ status: "invalid" }, 400);

  try {
    const result = await storeEvents(batch);
    if (result === "not-configured") return json({ status: "not-configured" }, 200);
    return json({ status: "accepted", count: batch.events.length }, 202);
  } catch (error) {
    // Log and move on. A dropped analytics batch is not worth an error
    // response, and definitely not worth retrying into a failing database.
    console.error("[analytics] store failed:", error instanceof Error ? error.message : "unknown error");
    return new Response(null, { status: 204 });
  }
}

function json(outcome: AnalyticsOutcome, status: number): Response {
  return Response.json(outcome, { status });
}

/** Lets the client skip queuing entirely when there is nowhere to send events. */
export function GET(): Response {
  return Response.json({ configured: isEventStoreConfigured() });
}
