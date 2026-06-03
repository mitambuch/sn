-- ═══════════════════════════════════════════════════════════════
-- 0025_user_admin_controls — block (reversible) + delete (permanent).
--
-- WHY: client request 2026-06-03 — from /admin/users, Salva wants to
-- suspend a member's access (reversible) and, separately, delete a member
-- permanently. Both are admin-only; a member can never change these on
-- themselves.
--
-- WHAT:
--   1. profiles.blocked boolean — suspended members are denied at login
--      (AuthContext signs them out). Admin-writable, member-pinned.
--   2. admin_delete_user(uuid) — SECURITY DEFINER RPC that removes the auth
--      user; profiles + inquiries + saved_items cascade via their FKs
--      (profiles.id references auth.users on delete cascade).
-- ═══════════════════════════════════════════════════════════════

-- ── 1. blocked column ──────────────────────────────────────────
alter table public.profiles
  add column if not exists blocked boolean not null default false;

grant update (blocked) on public.profiles to authenticated;

-- Recreate the self-update policy to ALSO pin `blocked` (alongside role +
-- segments from 0010/0020) so a member can never un-suspend themselves.
-- Admin changes go through "profiles: admin update all".
drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role     = (select p.role     from public.profiles p where p.id = auth.uid())
    and segments = (select p.segments from public.profiles p where p.id = auth.uid())
    and blocked  = (select p.blocked  from public.profiles p where p.id = auth.uid())
  );

comment on policy "profiles: self update" on public.profiles is
  'Self-update with role, segments AND blocked pinned. Those three are '
  'admin-only via "profiles: admin update all".';

-- ── 2. permanent delete (admin-only RPC) ───────────────────────
create or replace function public.admin_delete_user(p_user uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;
  if p_user = auth.uid() then
    raise exception 'cannot delete your own account';
  end if;
  -- Cascades to public.profiles (and its children) via the FK.
  delete from auth.users where id = p_user;
end;
$$;

revoke execute on function public.admin_delete_user(uuid) from anon, public;
grant execute on function public.admin_delete_user(uuid) to authenticated;

notify pgrst, 'reload schema';

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
-- select column_name from information_schema.columns
--   where table_name='profiles' and column_name='blocked';            -- 1 row
-- -- As a NON-admin: update profiles set blocked=false where id=auth.uid(); -- denied
-- -- As an admin in /admin/users: suspend + delete a member work.
