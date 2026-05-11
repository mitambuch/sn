-- ═══════════════════════════════════════════════════════════════
-- Fix RLS recursion on profiles
--
-- The "admin read/update all" policies in 0001 ran a sub-select on
-- public.profiles to check role='admin'. That sub-select re-triggers
-- RLS evaluation on profiles, which re-checks the same policy —
-- infinite recursion. Postgres rejects with HTTP 500.
--
-- Fix: a SECURITY DEFINER function bypasses RLS during the check.
-- The check itself is trivial (one PK lookup) so it's both correct
-- and fast.
--
-- To apply: paste into Supabase SQL Editor → Run.
-- ═══════════════════════════════════════════════════════════════

-- Drop the recursive policies.
drop policy if exists "profiles: admin read all"   on public.profiles;
drop policy if exists "profiles: admin update all" on public.profiles;
drop policy if exists "invitation_codes: admin read all" on public.invitation_codes;
drop policy if exists "invitation_codes: admin insert"   on public.invitation_codes;
drop policy if exists "invitation_codes: admin update"   on public.invitation_codes;
drop policy if exists "inquiries: admin read all" on public.inquiries;
drop policy if exists "inquiries: admin update"   on public.inquiries;

-- Helper: is the given user an admin? SECURITY DEFINER bypasses RLS
-- during the sub-select, breaking the recursion. The function is
-- STABLE (same answer within one statement) so the planner caches it.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = 'admin'
  );
$$;

-- Recreate the admin policies using the helper.

-- profiles
create policy "profiles: admin read all"
  on public.profiles for select
  using (public.is_admin(auth.uid()));

create policy "profiles: admin update all"
  on public.profiles for update
  using (public.is_admin(auth.uid()));

-- invitation_codes
create policy "invitation_codes: admin read all"
  on public.invitation_codes for select
  using (public.is_admin(auth.uid()));

create policy "invitation_codes: admin insert"
  on public.invitation_codes for insert
  with check (public.is_admin(auth.uid()));

create policy "invitation_codes: admin update"
  on public.invitation_codes for update
  using (public.is_admin(auth.uid()));

-- inquiries
create policy "inquiries: admin read all"
  on public.inquiries for select
  using (public.is_admin(auth.uid()));

create policy "inquiries: admin update"
  on public.inquiries for update
  using (public.is_admin(auth.uid()));
