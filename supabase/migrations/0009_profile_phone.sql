-- ═══════════════════════════════════════════════════════════════
-- Add phone column to profiles
--
-- The Onboarding wizard step 2 collects (full_name, phone). The phone
-- value belonged in the schema since day 1 but was deferred. Adding
-- it now so Salva has the contact number on file the moment a new
-- member completes onboarding.
--
-- - phone : text, nullable (some members may decline to share)
-- - No format check at the DB level : phones come in too many formats
--   (E.164, national, with extensions, etc.) and client-side validation
--   already enforces a minimum.
--
-- To apply : paste into Supabase SQL Editor → Run, or `supabase db push`.
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles
  add column if not exists phone text;

comment on column public.profiles.phone is
  'Member phone number, free text format. Set by the Onboarding wizard.';
