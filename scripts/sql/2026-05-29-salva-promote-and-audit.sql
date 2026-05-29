-- ═══════════════════════════════════════════════════════════════
-- Sawnext — Salva promotion + prod data audit + cleanup planning
-- 2026-05-29 — paste in Supabase SQL Editor (postgres role bypasses
-- column grants + RLS), runs as one transaction.
--
-- Project : kvmkzcwgpjtfclteybse
-- Open URL : https://supabase.com/dashboard/project/kvmkzcwgpjtfclteybse/sql/new
-- ═══════════════════════════════════════════════════════════════

begin;

-- ── 1. Promote info@saw-next.ch to admin ─────────────────────
-- The on_auth_user_created trigger already inserted role='client'.
update public.profiles
set role = 'admin',
    full_name = 'Salva'
where id = 'c1b27722-1019-4f46-87b5-b773613f3b92';

-- ── 2. Audit — see what is currently in each operator table ──
-- (results show in the "Results" pane below the editor)

-- Profiles : who exists, what roles, what emails
select 'PROFILES' as table_name, id::text, email, full_name, role::text, created_at::text
from public.profiles
order by created_at desc;

-- Invitation codes : full inventory
select 'INVITATIONS' as table_name, code, status::text, created_at::text, redeemed_at::text, redeemed_by::text, expires_at::text
from public.invitation_codes
order by created_at desc;

-- Share codes : full inventory
select 'SHARE_CODES' as table_name, code, status::text, created_at::text, expires_at::text
from public.share_codes
order by created_at desc;

-- Inquiries : recent activity
select 'INQUIRIES' as table_name, id::text, source::text, status::text, created_at::text
from public.inquiries
order by created_at desc
limit 50;

-- Access requests : recent leads
select 'ACCESS_REQUESTS' as table_name, id::text, email, status::text, created_at::text
from public.access_requests
order by created_at desc
limit 50;

commit;

-- ═══════════════════════════════════════════════════════════════
-- CLEANUP DRAFT — uncomment the lines that match what you want to
-- remove AFTER reviewing the audit results above. Each block runs
-- independently.
-- ═══════════════════════════════════════════════════════════════

-- ── A. Remove the DEMO2026 share code if it ended up in prod ──
-- delete from public.share_codes where code = 'DEMO2026';

-- ── B. Remove any *.demo / *.local / dev+ mock emails ────────
-- These come from src/mocks/users.ts and src/context/AuthContext.tsx
-- patterns — they should never be in prod profiles. Auth users get
-- cleaned by cascade via the FK on auth.users.
-- delete from auth.users where email like '%@sawnext.demo';
-- delete from auth.users where email like '%@sawnext.local';
-- delete from auth.users where email like '%@sawnext.studio';

-- ── C. Remove invitation codes that were never redeemed and are
--       older than 7 days (likely test codes from dev) ────────
-- delete from public.invitation_codes
-- where status = 'unused' and created_at < now() - interval '7 days';

-- ── D. Remove inquiries from demo profiles ───────────────────
-- delete from public.inquiries
-- where profile_id in (
--   select id from public.profiles where email like '%@sawnext.demo'
-- );

-- ── E. Remove access requests with obviously fake emails ─────
-- delete from public.access_requests where email like 'test%' or email like 'demo%';

-- ═══════════════════════════════════════════════════════════════
-- After cleanup : Salva can log in at https://saw-next.ch/login
-- with email info@saw-next.ch + the password we set, and reach
-- /admin with full operator access.
-- ═══════════════════════════════════════════════════════════════
