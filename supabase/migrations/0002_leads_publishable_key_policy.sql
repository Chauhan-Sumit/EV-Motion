-- OPTIONAL — only run this if the app is configured with a PUBLISHABLE key
-- (`sb_publishable_…` / legacy `anon`) instead of a SECRET key
-- (`sb_secret_…` / legacy `service_role`).
--
-- 0001_leads.sql enables RLS with no policies, which denies every request
-- that doesn't bypass RLS. A secret key bypasses it; a publishable key does
-- not. So with a publishable key, inserts fail until this policy exists.
--
-- ---------------------------------------------------------------------------
-- UNDERSTAND THE TRADE-OFF BEFORE RUNNING THIS.
--
-- A publishable key is public by design. Granting it INSERT means anyone
-- holding that key can POST rows directly to
--   https://<project>.supabase.co/rest/v1/leads
-- bypassing the app's validation, honeypot and rate limiting entirely. The
-- CHECK constraints in 0001_leads.sql become the only remaining guard, and
-- they can't stop a flood of well-formed junk.
--
-- The secret key path is strictly safer: RLS stays deny-all, and the app's
-- own /api/leads endpoint is the only way a row can be created. Prefer it
-- unless you have a specific reason not to.
-- ---------------------------------------------------------------------------

-- INSERT only. No SELECT, UPDATE or DELETE policy is created, so the key
-- still cannot read back, alter or remove anyone's contact details — a
-- write-only drop box.
create policy "publishable key may submit leads"
  on public.leads
  for insert
  to anon
  with check (
    -- Re-assert the app's own rules at the database boundary, since a direct
    -- caller skips them. These mirror src/lib/leads/validation.ts.
    kind in ('best-price', 'test-drive', 'notify-launch', 'advertise', 'enquiry')
    and (mobile is not null or email is not null)
    and coalesce(length(name), 0) <= 80
    and coalesce(length(email), 0) <= 160
    and coalesce(length(message), 0) <= 1000
    and coalesce(length(company), 0) <= 120
    -- A direct caller must not be able to pre-set follow-up state.
    and status = 'new'
  );

comment on policy "publishable key may submit leads" on public.leads is
  'Write-only access for the public publishable key. No read policy exists, so submitted contact details cannot be read back through the public API.';
