-- ═══════════════════════════════════════════════════════════════
-- 0024_access_requests_delete — let admins delete handled requests.
--
-- WHY: client request 2026-06-03 — Salva wants to clear access-request
-- cards once handled, to keep a clean global view of the board. 0012
-- deliberately granted no DELETE ("nobody needs delete"); this opens it
-- for admins only.
--
-- WHAT: an admin-only DELETE policy + the matching grant. Anonymous insert
-- and admin select/update (0012) are untouched.
-- ═══════════════════════════════════════════════════════════════

drop policy if exists "access_requests: admin delete" on public.access_requests;
create policy "access_requests: admin delete"
  on public.access_requests for delete to authenticated
  using (public.is_admin(auth.uid()));

grant delete on public.access_requests to authenticated;

notify pgrst, 'reload schema';

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
-- -- As an admin, deleting a request in /admin/access-requests succeeds and
-- -- the card disappears. As a non-admin, delete is denied by RLS.
-- select has_table_privilege('authenticated','public.access_requests','delete'); -- true
