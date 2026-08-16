import { checkRateLimit, clientKey } from "@/lib/leads/rateLimit";
import { isLeadStoreConfigured, storeLead } from "@/lib/leads/leadStore";
import { isHoneypotTripped, parseLeadSubmission } from "@/lib/leads/validation";
import type { LeadOutcome } from "@/lib/leads/types";

/**
 * `POST /api/leads` — the one entry point for every lead-capture CTA on the
 * site (Get Best Price, Book Test Drive, Notify Me, Advertiser Kit).
 *
 * Ordering matters here: rate limit first (cheapest, and the thing that
 * protects everything after it), then the honeypot, then validation, and
 * only then storage. Nothing touches the database until the payload has been
 * fully validated and normalized server-side.
 *
 * The route is always dynamic — it must never be cached or pre-rendered.
 */
export const dynamic = "force-dynamic";

function json(outcome: LeadOutcome, status: number, headers?: HeadersInit): Response {
  return Response.json(outcome, { status, headers });
}

export async function POST(request: Request): Promise<Response> {
  const limit = checkRateLimit(clientKey(request.headers));
  if (!limit.allowed) {
    return json({ status: "rate-limited", retryAfterSeconds: limit.retryAfterSeconds }, 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ status: "invalid", errors: { kind: "Malformed request." } }, 400);
  }

  // Bots fill every field they can see, including the hidden one. Answer 202
  // rather than an error: a rejection tells the author what to change next
  // time, whereas an accepted-looking response gives them nothing to tune.
  // Nothing is stored.
  if (isHoneypotTripped(body)) {
    return json({ status: "stored" }, 202);
  }

  const parsed = parseLeadSubmission(body);
  if (!parsed.ok) {
    return json({ status: "invalid", errors: parsed.errors }, 400);
  }

  try {
    const result = await storeLead(parsed.lead);
    if (result === "not-configured") {
      // Validated fine, but there is nowhere to put it. Reported honestly so
      // the dialog can say so instead of showing a fake confirmation.
      return json({ status: "not-configured" }, 200);
    }
    return json({ status: "stored" }, 201);
  } catch (error) {
    // Never log the lead itself — it holds the submitter's name, phone and
    // email. The message from the store is already PII-free by construction.
    console.error("[leads] storage failed:", error instanceof Error ? error.message : "unknown error");
    return json({ status: "error" }, 502);
  }
}

/** Lets the dialog decide up front whether to present itself as live or as a demo. */
export function GET(): Response {
  return Response.json({ configured: isLeadStoreConfigured() });
}
