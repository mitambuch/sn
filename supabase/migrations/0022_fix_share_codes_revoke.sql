-- ═══════════════════════════════════════════════════════════════
-- 0022_fix_share_codes_revoke — make revoking a share code reliable.
--
-- WHY (audit 2026-06-03): revoking a share code (UPDATE status='revoked')
-- errors in production while SELECT (listing) and INSERT (generating) work.
-- That signature points at one of three things re-checked on UPDATE but not
-- on the working paths:
--   A. the format CHECK constraint re-validating an EXISTING row whose code
--      doesn't match the current 6-char regex (a legacy/leftover row from the
--      8→6 char change in 0006). ADD CONSTRAINT can't even re-assert cleanly
--      while such a row exists.
--   B. a missing/again-missing UPDATE grant (the 403 family, cf 0016).
--   C. the RLS admin policies: share_codes (0005) still uses the inline
--      profiles-subselect pattern that 0002 replaced everywhere else with the
--      SECURITY DEFINER public.is_admin() — the recursion-safe form.
--
-- This migration fixes all three defensively + idempotently, so revoke works
-- regardless of which one bit. No data loss beyond codes that are already
-- unusable (a code outside the unambiguous 6-char alphabet can't be typed).
-- ═══════════════════════════════════════════════════════════════

-- ── A. Remove rows whose code can't satisfy the 6-char format, then
--       re-assert the constraint as VALID so every remaining row is clean.
do $$
declare
  v_bad int;
begin
  select count(*) into v_bad
  from public.share_codes
  where code !~ '^[A-HJ-NP-Z2-9]{6}$';
  if v_bad > 0 then
    raise notice '0022: deleting % share_codes row(s) with a non-conforming code', v_bad;
    delete from public.share_codes where code !~ '^[A-HJ-NP-Z2-9]{6}$';
  end if;
end $$;

alter table public.share_codes drop constraint if exists share_codes_format;
alter table public.share_codes
  add constraint share_codes_format check (code ~ '^[A-HJ-NP-Z2-9]{6}$');

-- ── B. Ensure the table grants are present (idempotent).
grant select, insert, update, delete on public.share_codes to authenticated;

-- ── C. Rebuild the admin policies with the recursion-safe is_admin() helper
--       (created in 0002). Same effect, but aligned with every other table
--       and free of the inline subselect that lagged behind.
drop policy if exists "share_codes: admin select" on public.share_codes;
drop policy if exists "share_codes: admin insert" on public.share_codes;
drop policy if exists "share_codes: admin update" on public.share_codes;
drop policy if exists "share_codes: admin delete" on public.share_codes;

create policy "share_codes: admin select"
  on public.share_codes for select to authenticated
  using (public.is_admin(auth.uid()));

create policy "share_codes: admin insert"
  on public.share_codes for insert to authenticated
  with check (public.is_admin(auth.uid()));

create policy "share_codes: admin update"
  on public.share_codes for update to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "share_codes: admin delete"
  on public.share_codes for delete to authenticated
  using (public.is_admin(auth.uid()));

-- Refresh PostgREST so the policy/constraint changes are live immediately.
notify pgrst, 'reload schema';

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
-- -- No row violates the format anymore :
-- select count(*) from public.share_codes where code !~ '^[A-HJ-NP-Z2-9]{6}$'; -- 0
-- -- Revoke a real code in /admin/share-codes → status flips to "revoked",
-- -- no error toast.
