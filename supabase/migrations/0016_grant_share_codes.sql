-- ═══════════════════════════════════════════════════════════════
-- 0016_grant_share_codes — grant table privileges on share_codes.
--
-- WHY: client report 2026-06-02 — /admin/share-codes shows "Lecture
-- share_codes échouée". Root cause: migration 0005 created share_codes
-- with RLS policies but NO table-level GRANT to `authenticated` (unlike
-- invitation_codes / inquiries in 0003 and access_requests in 0012).
-- Without the grant, PostgREST returns 42501 insufficient_privilege (403)
-- even though the admin RLS policy would allow the row. Matches the known
-- "Automatically expose new tables" Supabase pitfall (friction 2026-05-11).
--
-- WHAT: grant the privileges the existing RLS policies already gate.
-- anon is intentionally NOT granted — anonymous access goes through the
-- security-definer consume_share_code() RPC, never a direct table read.
-- ═══════════════════════════════════════════════════════════════

grant select, insert, update, delete on public.share_codes to authenticated;

-- Ask PostgREST to refresh its schema cache so the grant takes effect now.
notify pgrst, 'reload schema';
