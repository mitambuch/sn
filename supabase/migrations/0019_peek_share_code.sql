-- ═══════════════════════════════════════════════════════════════
-- 0019_peek_share_code — read a share code WITHOUT consuming a view.
--
-- WHY: the audience server gate (netlify/functions/catalogue, Phase 2)
-- moves all Sanity reads server-side once the dataset is private. The
-- public /share/:code page then can no longer fetch fiche content from
-- Sanity in the browser — it asks the gate instead, passing the code.
-- The gate must re-validate the code server-side before returning fiche
-- content (never trust client-passed doc ids), but it must NOT bump the
-- view counter: the existing client consume_share_code() already did that
-- for this visit. peek_share_code() is that non-mutating validator.
--
-- WHAT: same shape + validity logic as consume_share_code (migration
-- 0017) MINUS the update — pure read. Returns the linked doc refs only
-- when the code is active, unexpired and under its view cap.
--
-- SECURITY: security definer + granted to anon/authenticated like consume.
-- It reveals only what a holder of the code could already see; it leaks
-- nothing for an unknown code (returns no rows).
-- ═══════════════════════════════════════════════════════════════

create or replace function public.peek_share_code(p_code text)
returns table (
  sanity_doc_type text,
  sanity_doc_id text,
  sanity_docs jsonb,
  status text,
  view_count integer,
  max_views integer,
  expires_at timestamptz,
  is_valid boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.share_codes%rowtype;
  v_valid boolean := false;
begin
  select * into v_record from public.share_codes where code = p_code;
  if not found then
    return;
  end if;

  if v_record.status = 'active'
     and (v_record.expires_at is null or v_record.expires_at > now())
     and (v_record.max_views is null or v_record.view_count < v_record.max_views) then
    v_valid := true;
  end if;

  return query select
    v_record.sanity_doc_type,
    v_record.sanity_doc_id,
    v_record.sanity_docs,
    v_record.status,
    v_record.view_count,
    v_record.max_views,
    v_record.expires_at,
    v_valid;
end;
$$;

grant execute on function public.peek_share_code(text) to anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
-- select is_valid from public.peek_share_code('APERCU');  -- bool, no bump
-- -- run twice; view_count of any real code must NOT change.
