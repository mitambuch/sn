-- ═══════════════════════════════════════════════════════════════
-- 0023_grant_role_update — let admins promote/demote (finding F9).
--
-- WHY (audit 2026-06-03): migration 0010's column-level UPDATE grant on
-- public.profiles whitelists full_name/phone/locale/contact_preference/
-- avatar_url (and 0020 added segments) — but NOT `role`. So the admin
-- promote/demote action (useUsersAdmin.updateRole → update profiles.role)
-- is denied at the GRANT layer for everyone. The "admin update all" RLS
-- policy is in place; only the column grant was missing.
--
-- SAFETY: a member still cannot self-promote. The "profiles: self update"
-- policy (0010, hardened in 0020) PINS role in its with-check
-- (role = current role), so self-update can never change it. Admins change
-- role through the separate "profiles: admin update all" policy (is_admin),
-- which has no such pin. Adding the column grant therefore only enables the
-- admin path that RLS already authorises.
-- ═══════════════════════════════════════════════════════════════

grant update (role) on public.profiles to authenticated;

notify pgrst, 'reload schema';

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
-- -- As a NON-admin, this must still FAIL (role pinned by self-update):
-- --   update public.profiles set role='admin' where id = auth.uid();
-- -- As an admin, promoting a member in /admin/users must now SUCCEED.
-- select has_column_privilege('authenticated','public.profiles','role','update');  -- true
