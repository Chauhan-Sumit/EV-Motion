import { supabaseConfig } from "@/lib/leads/supabaseLeadStore";
import type { ParsedBatch } from "./validation";

/**
 * Supabase-backed analytics storage, over PostgREST.
 *
 * **Server-side only** — reuses the same credentials as lead storage, which
 * for a secret key means bypassing RLS. Never import from a client file.
 *
 * Reusing `supabaseConfig()` rather than introducing a second pair of env
 * vars is deliberate: one project, one set of credentials, one place to
 * rotate. If analytics ever moves to a different provider, only this file and
 * `eventStore.ts` change.
 *
 * See `supabase/migrations/0003_analytics_events.sql` for the table.
 */

const TABLE = "analytics_events";

export { supabaseConfig };

function toRows(batch: ParsedBatch) {
  return batch.events.map((event) => ({
    session_id: batch.sessionId,
    name: event.name,
    path: event.path ?? null,
    props: event.props ?? {},
    // The client's own timestamp, already sanity-checked for clock skew, so
    // batched events keep their real order rather than all sharing the
    // moment the batch happened to be flushed.
    occurred_at: new Date(event.at).toISOString(),
  }));
}

export async function insertEvents(batch: ParsedBatch, config: NonNullable<ReturnType<typeof supabaseConfig>>) {
  const response = await fetch(`${config.url}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(toRows(batch)),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Analytics insert failed (${response.status}): ${detail.slice(0, 300)}`);
  }
}
