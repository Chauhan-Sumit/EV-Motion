import { insertEvents, supabaseConfig } from "./supabaseEventStore";
import type { ParsedBatch } from "./validation";

/**
 * The single seam between the analytics ingest route and wherever events are
 * stored — same pattern as `leads/leadStore.ts` and
 * `vehicle-pricing/pricingSource.ts`.
 *
 * Today: the same Supabase project the leads table lives in, when
 * credentials are configured; otherwise nothing is stored.
 *
 * **What this is honestly worth.** It gives you raw, queryable, first-party
 * event data that you own — which is genuinely useful, and enough to answer
 * "what are people searching for that we don't stock?" That is not the same
 * thing as a monitoring product: there are no dashboards, no alerting, no
 * anomaly detection, and nothing pages anyone at 3am. If error volume ever
 * needs to trigger a response rather than be looked up after the fact, a
 * dedicated service (Sentry, PostHog) is the right answer, and this seam is
 * where it would attach.
 */
export type EventStoreResult = "stored" | "not-configured";

export function isEventStoreConfigured(): boolean {
  return supabaseConfig() !== null;
}

export async function storeEvents(batch: ParsedBatch): Promise<EventStoreResult> {
  const config = supabaseConfig();
  if (!config) return "not-configured";

  await insertEvents(batch, config);
  return "stored";
}
