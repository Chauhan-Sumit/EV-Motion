-- EV Motion — first-party analytics events.
--
-- Run this once against the Supabase project, same as 0001_leads.sql. It
-- reuses the credentials already configured for lead capture; there is no
-- separate key to set.
--
-- PRIVACY: this table holds NO personal data and must stay that way.
--   * No IP address. The ingest route uses it for rate limiting and discards it.
--   * No cookies and no durable identifier — session_id is tab-scoped
--     (sessionStorage) and rotates when the tab closes, so it cannot be used
--     to recognise a returning visitor or follow anyone across sites.
--   * A lead_submitted event records which CTA converted and for which
--     vehicle, never the submitter's name, phone or email. Those live only in
--     public.leads, behind RLS.
-- Keeping those properties is what lets this site run analytics without a
-- consent banner. Adding a durable id or an IP column changes that, and is a
-- privacy-policy decision rather than a schema tweak.
--
-- Same RLS posture as public.leads: enabled with no policies, so anon and
-- authenticated are denied outright and only the server's secret key writes.

create table if not exists public.analytics_events (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  -- Client-supplied, sanity-checked for clock skew server-side. Kept separate
  -- from created_at so batched events retain their real order rather than all
  -- sharing the moment their batch was flushed.
  occurred_at  timestamptz not null,

  session_id   text not null,
  name         text not null check (name in (
                 'search', 'vehicle_view', 'compare_view', 'lead_submitted', 'error'
               )),
  path         text,
  -- Event-specific detail. Allow-listed and length-capped before it gets here
  -- (src/lib/analytics/validation.ts); jsonb so new event shapes don't need a
  -- migration, and so props can be queried directly.
  props        jsonb not null default '{}'::jsonb
);

alter table public.analytics_events enable row level security;

create index if not exists analytics_events_occurred_at_idx
  on public.analytics_events (occurred_at desc);
create index if not exists analytics_events_name_occurred_at_idx
  on public.analytics_events (name, occurred_at desc);
-- Supports the zero-result-search query below without scanning the table.
create index if not exists analytics_events_props_idx
  on public.analytics_events using gin (props);

comment on table public.analytics_events is
  'First-party, cookie-less product analytics. Contains no personal data and no IP addresses; session_id is tab-scoped and non-durable. RLS denies all client access.';

-- ---------------------------------------------------------------------------
-- Queries worth having on hand. These are the reason the table exists.
-- ---------------------------------------------------------------------------
--
-- What are people searching for that we don't stock? This is a ranked,
-- user-written list of the catalog's gaps — better input for deciding which
-- vehicles to research next than guessing.
--
--   select props->>'query' as query, count(*) as searches
--   from public.analytics_events
--   where name = 'search' and (props->>'resultCount')::int = 0
--     and occurred_at > now() - interval '30 days'
--   group by 1 order by 2 desc limit 50;
--
-- Which vehicles actually get viewed (as opposed to the derived "popular"
-- rankings, which are computed from static data, not behaviour):
--
--   select props->>'slug' as vehicle, count(*) as views
--   from public.analytics_events
--   where name = 'vehicle_view' and occurred_at > now() - interval '30 days'
--   group by 1 order by 2 desc limit 25;
--
-- Which comparisons people run — candidates for the pre-rendered set in
-- src/lib/compare/popular-pairs.ts, which currently guesses via price
-- proximity rather than knowing:
--
--   select props->>'slug' as comparison, count(*) as views
--   from public.analytics_events
--   where name = 'compare_view' and occurred_at > now() - interval '30 days'
--   group by 1 order by 2 desc limit 25;
--
-- Lead conversion by CTA:
--
--   select props->>'kind' as cta, count(*) as leads
--   from public.analytics_events
--   where name = 'lead_submitted' and occurred_at > now() - interval '30 days'
--   group by 1 order by 2 desc;
--
-- Recent errors, most frequent first:
--
--   select props->>'message' as message, props->>'digest' as digest, count(*)
--   from public.analytics_events
--   where name = 'error' and occurred_at > now() - interval '7 days'
--   group by 1, 2 order by 3 desc limit 50;
