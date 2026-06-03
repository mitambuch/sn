-- ═══════════════════════════════════════════════════════════════
-- 0020_segments_update_guard — make profiles.segments admin-writable ONLY.
--
-- WHY (security review, Phase 4): migration 0010 replaced the broad UPDATE
-- grant on public.profiles with a column whitelist:
--   grant update (full_name, phone, locale, contact_preference, avatar_url)
-- `segments` (added in 0018) is NOT in that list, so:
--   1. admin tagging (setMemberSegments → update profiles.segments) is DENIED
--      by the column GRANT — the audience feature can't actually tag members.
--   2. naively adding `segments` to the grant would let a MEMBER self-assign
--      any segment via the "profiles: self update" policy (whose with-check
--      pins `role` but NOT `segments`) → total audience bypass.
--
-- FIX: grant UPDATE on the `segments` column AND pin it in the self-update
-- policy's with-check. Result:
--   • members: "self update" applies, check pins role + segments → they can
--     edit their own name/phone/locale/etc. but NEVER their segments.
--   • admins: "profiles: admin update all" (is_admin) applies and, being a
--     separate permissive policy with no pin, lets them set anyone's segments.
--
-- This is the barrier that makes the segment a trustworthy access key.
-- ═══════════════════════════════════════════════════════════════

-- 1) Allow the segments column to be updated at the GRANT layer (RLS still
--    decides WHO/which rows below).
grant update (segments) on public.profiles to authenticated;

-- 2) Rebuild the self-update policy to ALSO pin segments to the current value
--    so a member can never change their own segment membership.
drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Pin role (from 0010) …
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    -- … and segments: self-update must leave the member's segments untouched.
    -- Admin segment changes go through the separate "admin update all" policy.
    and segments = (select p.segments from public.profiles p where p.id = auth.uid())
  );

comment on policy "profiles: self update" on public.profiles is
  'Self-update with role AND segments pinned. Column GRANT restricts the '
  'editable set to full_name, phone, locale, contact_preference, avatar_url, '
  'segments — but the with-check forbids changing segments here. Segment '
  'tagging is admin-only via "profiles: admin update all".';

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
-- -- As a NON-admin member (anon-key + their JWT), this must FAIL:
-- --   update public.profiles set segments = '{vip}' where id = auth.uid();
-- -- As an admin, this must SUCCEED:
-- --   update public.profiles set segments = '{piguet-galland}' where id = '<member>';
-- select has_column_privilege('authenticated', 'public.profiles', 'segments', 'update');
-- --   → true (grant present; RLS with-check is the real gate)
