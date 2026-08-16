import type { ParsedLead } from "./validation";

/**
 * Supabase-backed lead storage, over PostgREST.
 *
 * **Server-side only.** It uses the service-role key, which bypasses Row
 * Level Security — that key must never be exposed to the browser, so this
 * module must never be imported from a `"use client"` component and its env
 * vars must never carry a `NEXT_PUBLIC_` prefix.
 *
 * Uses `fetch` rather than `@supabase/supabase-js` on purpose: this is a
 * single INSERT, the whole call is a dozen lines, and it keeps a dependency
 * out of a project that currently has no backend libraries at all. Swapping
 * to the official client later means rewriting only this file — nothing
 * imports it directly except `leadStore.ts`.
 *
 * See `supabase/migrations/0001_leads.sql` for the table and its RLS policy.
 */

const TABLE = "leads";

/**
 * Which class of API key is configured. This is not a cosmetic distinction —
 * it decides which RLS setup the database needs:
 *
 *  - `secret`      (`sb_secret_…`, or a legacy `service_role` JWT) bypasses
 *                  RLS. Pair it with `0001_leads.sql` alone, which enables
 *                  RLS with *no* policies. The endpoint here is then the only
 *                  path that can write a lead. Recommended.
 *  - `publishable` (`sb_publishable_…`, or a legacy `anon` JWT) is subject to
 *                  RLS and is public by design. It needs the insert-only
 *                  policy in `0002_leads_publishable_key_policy.sql`, and the
 *                  trade-off is real: anyone holding the key can POST rows
 *                  straight to PostgREST, skipping this route's validation,
 *                  honeypot and rate limiting. The table's CHECK constraints
 *                  become the only remaining guard.
 */
export type SupabaseKeyMode = "secret" | "publishable";

export interface SupabaseConfig {
  url: string;
  key: string;
  mode: SupabaseKeyMode;
}

/**
 * Reads config from the environment, or null when it isn't set up yet.
 *
 * A secret key wins if both are present. Supabase renamed these keys
 * (`service_role` -> secret, `anon` -> publishable), so both generations of
 * variable name are accepted.
 */
export function supabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  if (!url) return null;
  const normalizedUrl = url.replace(/\/$/, "");

  const secret = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
  if (secret) return { url: normalizedUrl, key: secret, mode: "secret" };

  const publishable = (
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )?.trim();
  if (publishable) return { url: normalizedUrl, key: publishable, mode: "publishable" };

  return null;
}

/** The row shape written to `public.leads`. Snake_case to match Postgres convention. */
function toRow(lead: ParsedLead) {
  return {
    kind: lead.kind,
    name: lead.fields.name ?? null,
    mobile: lead.fields.mobile ?? null,
    email: lead.fields.email ?? null,
    company: lead.fields.company ?? null,
    message: lead.fields.message ?? null,
    vehicle_slug: lead.context.vehicleSlug ?? null,
    city: lead.context.city ?? null,
    source_path: lead.context.path ?? null,
  };
}

export async function insertLead(lead: ParsedLead, config: SupabaseConfig): Promise<void> {
  const response = await fetch(`${config.url}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      // `return=minimal` — don't echo the inserted row back; it would put the
      //   submitter's personal details in the response body for no reason.
      // `resolution=ignore-duplicates` — compiles to ON CONFLICT DO NOTHING,
      //   so the `leads_dedupe_idx` double-click guard absorbs a repeat
      //   submission silently instead of raising a 409 that would surface to
      //   the person filling the form as a failure. Their lead is already
      //   recorded, so reporting success is accurate.
      Prefer: "return=minimal, resolution=ignore-duplicates",
    },
    body: JSON.stringify(toRow(lead)),
    // A hung request must not hold the route open indefinitely.
    signal: AbortSignal.timeout(8000),
  });

  // Belt and braces: if the Prefer hint above is ever dropped or unsupported,
  // a duplicate surfaces as 409 / SQLSTATE 23505. That still means the lead is
  // in the table, so treat it as stored rather than failing the submission.
  if (response.status === 409) return;

  if (!response.ok) {
    // Include the status and PostgREST's error message, but never the row —
    // it holds the submitter's name, phone and email.
    const detail = await response.text().catch(() => "");

    // The single most likely misconfiguration, called out by name so it
    // doesn't get debugged as a generic failure: a publishable key against
    // the deny-all policy set produces a 401/403 with no policy match.
    const hint =
      config.mode === "publishable" && (response.status === 401 || response.status === 403)
        ? " — a publishable key is subject to RLS; apply supabase/migrations/0002_leads_publishable_key_policy.sql, or switch to a secret key"
        : "";

    throw new Error(`Supabase insert failed (${response.status}): ${detail.slice(0, 300)}${hint}`);
  }
}
