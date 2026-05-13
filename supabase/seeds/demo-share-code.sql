-- ═══════════════════════════════════════════════════
-- demo-share-code — Insert the canonical DEMO2026 share code
--
-- WHY: /exemple landing page deeplinks to /share/SAW-DEMO-2026, which
--      must resolve against share_codes table once Supabase is live.
--      This code points to the seeded "Gala ONU Genève" event (evt-01).
--      It never expires and has no view cap — it's the public-facing
--      "trailer" of the Sawnext experience.
--
-- WHEN: Run ONCE after the migration 0005_share_codes.sql has been
--       applied AND after the Sanity seed has pushed the evt-01 doc.
--       Paste in Supabase SQL Editor → Run.
--
-- IDEMPOTENT: ON CONFLICT (code) DO UPDATE — safe to re-run.
-- ═══════════════════════════════════════════════════

INSERT INTO public.share_codes (code, sanity_doc_type, sanity_doc_id, status, note)
VALUES ('DEMO2026', 'event', 'evt-01', 'active', 'Code démo permanent — landing /exemple')
ON CONFLICT (code) DO UPDATE
  SET sanity_doc_type = EXCLUDED.sanity_doc_type,
      sanity_doc_id   = EXCLUDED.sanity_doc_id,
      status          = 'active',
      note            = EXCLUDED.note;

-- Verify :
-- SELECT code, sanity_doc_type, sanity_doc_id, status, view_count
-- FROM public.share_codes
-- WHERE code = 'DEMO2026';
