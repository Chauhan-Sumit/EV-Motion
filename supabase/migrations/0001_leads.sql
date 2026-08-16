-- EV Motion — lead capture table.
--
-- Run this once against the Supabase project (SQL Editor, or `supabase db
-- push` if you adopt the CLI) before setting SUPABASE_URL /
-- SUPABASE_SERVICE_ROLE_KEY in the app environment.
--
-- This table holds personal data — names, phone numbers, email addresses —
-- so it is locked down by default: RLS is enabled with no policies at all,
-- which denies every anon and authenticated request outright. The app writes
-- with the service-role key, which bypasses RLS and is only ever used
-- server-side (see src/lib/leads/supabaseLeadStore.ts).
--
-- Do NOT add a permissive policy to "make it work" from the browser. If the
-- client ever needs read access, add a policy scoped to an authenticated
-- admin role, never to `anon`.

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Which CTA produced this lead. Mirrors LeadKind in src/lib/leads/types.ts.
  kind          text not null check (kind in (
                  'best-price', 'test-drive', 'notify-launch', 'advertise', 'enquiry'
                )),

  -- Contact details. Individually nullable, but the app requires at least one
  -- reachable channel; the constraint below enforces that at the database
  -- level too, so a future writer can't bypass it.
  name          text,
  mobile        text,
  email         text,
  company       text,
  message       text,

  -- Context captured at submit time.
  vehicle_slug  text,
  city          text,
  source_path   text,

  -- Workflow state for whoever follows these up.
  status        text not null default 'new' check (status in ('new', 'contacted', 'closed', 'spam')),

  constraint leads_has_contact check (mobile is not null or email is not null),
  constraint leads_mobile_format check (mobile is null or mobile ~ '^[6-9][0-9]{9}$'),
  constraint leads_email_format check (email is null or email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
);

-- Deny-by-default. Enabling RLS with zero policies blocks anon and
-- authenticated entirely; the service-role key bypasses it.
alter table public.leads enable row level security;

-- The two queries an operator actually runs: newest first, and filtered by
-- follow-up state.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status) where status = 'new';

-- Cheap duplicate guard: the same person hammering "Get Best Price" on the
-- same vehicle within a minute shouldn't create five rows to call back.
-- Partial + expression index, so it only applies to mobile-bearing leads.
--
-- Note the `at time zone 'utc'`, which is load-bearing, not decoration.
-- Every expression in an index must be IMMUTABLE, and `date_trunc(text,
-- timestamptz)` is only STABLE: its result depends on the session's TimeZone
-- setting, so the same row could index differently for different connections.
-- Writing it as `date_trunc('minute', created_at at time zone 'utc')` pins the
-- zone, which yields a plain `timestamp` and selects the IMMUTABLE
-- `date_trunc(text, timestamp)` overload instead. Without it Postgres rejects
-- the statement outright with:
--     ERROR: 42P17: functions in index expression must be marked IMMUTABLE
--
-- The bucketing is deliberately coarse and boundary-based: two submissions a
-- second apart can straddle a minute boundary and both land. That is fine —
-- this exists to swallow double-clicks, not to guarantee uniqueness, and the
-- app inserts with `Prefer: resolution=ignore-duplicates` so a collision is a
-- silent no-op rather than an error shown to whoever filled the form.
create unique index if not exists leads_dedupe_idx
  on public.leads (mobile, kind, coalesce(vehicle_slug, ''), date_trunc('minute', created_at at time zone 'utc'))
  where mobile is not null;

comment on table public.leads is
  'Enquiries from EV Motion lead-capture CTAs. Contains personal data — RLS denies all client access; writes go through the service-role key server-side only.';
