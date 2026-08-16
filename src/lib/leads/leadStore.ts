import { insertLead, supabaseConfig } from "./supabaseLeadStore";
import type { ParsedLead } from "./validation";

/**
 * The single seam between the lead API route and wherever leads are actually
 * stored — same pattern as `vehicle-pricing/pricingSource.ts`. The route
 * imports only from here, so changing the backing store is a one-file change.
 *
 * Today: Supabase over PostgREST when `SUPABASE_URL` and
 * `SUPABASE_SERVICE_ROLE_KEY` are set; otherwise nothing is stored and the
 * caller is told so explicitly.
 *
 * **`not-configured` is deliberately not treated as success.** It would be
 * easy to log the lead and return "thanks, we'll be in touch" — and that is
 * exactly the kind of thing this project doesn't do. A person handing over
 * their phone number is owed an accurate answer about whether it went
 * anywhere. The dialog surfaces this as a labeled demo rather than a fake
 * confirmation, which is also what the form said before it had a backend.
 */
export type LeadStoreResult = "stored" | "not-configured";

export function isLeadStoreConfigured(): boolean {
  return supabaseConfig() !== null;
}

export async function storeLead(lead: ParsedLead): Promise<LeadStoreResult> {
  const config = supabaseConfig();
  if (!config) return "not-configured";

  await insertLead(lead, config);
  return "stored";
}
