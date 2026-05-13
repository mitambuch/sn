-- ═══════════════════════════════════════════════════
-- 0007_dashboard_stats — Aggregate counts for the Studio Dashboard
--
-- WHY: The Sanity Studio Dashboard needs a "demandes en cours" badge
--      + a few headline counts (active share codes, total clients) so
--      Salva sees the state of the platform from the moment he opens
--      Studio. The Studio bundle has no Supabase session (no admin
--      auth), so we expose the counts via a security-definer RPC that
--      anyone (anon) can call but that returns ONLY aggregates — no
--      row data leaks.
--
-- DESIGN: security-definer + grant execute to anon. Pure SQL, no
--         row-level disclosure. Safe.
-- WHEN: Run ONCE in Supabase SQL Editor after 0006.
-- IDEMPOTENT: create or replace function.
-- ═══════════════════════════════════════════════════

create or replace function public.studio_dashboard_stats()
returns table(
  pending_inquiries  bigint,
  active_share_codes bigint,
  total_clients      bigint
)
language sql
security definer
set search_path = public
as $$
  select
    (select count(*) from public.inquiries   where status = 'new'),
    (select count(*) from public.share_codes where status = 'active'),
    (select count(*) from public.profiles)
$$;

grant execute on function public.studio_dashboard_stats() to anon, authenticated;

comment on function public.studio_dashboard_stats() is
  'Read-only aggregate counts for the Sanity Studio Dashboard. No row-level disclosure. Callable by anon via the publishable Supabase key.';

-- Verify :
-- select * from public.studio_dashboard_stats();
