-- ═══════════════════════════════════════════════════
-- 0006_share_codes_6chars — Shrink share codes from 8 to 6 chars
--
-- WHY: Owner direction — "les codes en 6 caractères c'est suffisant"
--      + "pas besoin que ce soit SAW-DEMO etc." The recipient now types
--      6 OTP-style boxes on /exemple, no prefix, no dashes.
--      Alphabet stays 30 chars [A-HJ-NP-Z2-9] → 30^6 ≈ 729M combinations.
--
-- WHAT:
-- 1. Drop existing rows that don't match the new 6-char regex (anything
--    from the previous schema, including the legacy DEMO2026 if seeded).
-- 2. Drop the old length-8 CHECK constraint, add the length-6 one.
-- 3. Re-insert the canonical demo code APERCU pointing to evt-01.
--
-- WHEN: Run ONCE in the Supabase SQL Editor, AFTER 0005. Idempotent.
-- ═══════════════════════════════════════════════════

-- 1. Purge non-conforming rows
delete from public.share_codes where char_length(code) <> 6;

-- 2. Swap the format constraint
alter table public.share_codes drop constraint if exists share_codes_format;
alter table public.share_codes
  add constraint share_codes_format check (code ~ '^[A-HJ-NP-Z2-9]{6}$');

-- 3. Seed the canonical demo code (idempotent)
insert into public.share_codes (code, sanity_doc_type, sanity_doc_id, status, note)
values ('APERCU', 'event', 'evt-01', 'active', 'Code démo permanent — landing /exemple')
on conflict (code) do update
  set sanity_doc_type = excluded.sanity_doc_type,
      sanity_doc_id   = excluded.sanity_doc_id,
      status          = 'active',
      note            = excluded.note;

-- Verify :
-- select code, sanity_doc_type, sanity_doc_id, status, view_count
-- from public.share_codes
-- where code = 'APERCU';
