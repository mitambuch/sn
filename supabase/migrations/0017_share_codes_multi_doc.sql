-- ═══════════════════════════════════════════════════════════════
-- 0017_share_codes_multi_doc — one share code can link to MANY fiches.
--
-- WHY: client request 2026-06-02 — share a curated SELECTION of fiches
-- behind a single link (1 code → N fiches), not just one doc.
--
-- WHAT:
--   - New column `sanity_docs jsonb` : array of {type, id} objects. The
--     legacy sanity_doc_type/sanity_doc_id stay (NOT NULL) and hold the
--     FIRST doc for back-compat — old single-doc codes keep working.
--   - consume_share_code() recreated to also return sanity_docs so the
--     /share page can render the whole collection. (Return signature
--     changes → drop + recreate; the table grant from 0016 still covers
--     the new column.)
-- ═══════════════════════════════════════════════════════════════

alter table public.share_codes
  add column if not exists sanity_docs jsonb not null default '[]'::jsonb;

drop function if exists public.consume_share_code(text);

create function public.consume_share_code(p_code text)
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
    update public.share_codes
      -- qualified with v_record to avoid the "view_count is ambiguous"
      -- (42702) clash with the RETURNS TABLE out-column of the same name,
      -- which made consume_share_code() throw on every valid code.
      set view_count = v_record.view_count + 1
      where id = v_record.id;
    v_record.view_count := v_record.view_count + 1;
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

grant execute on function public.consume_share_code(text) to anon, authenticated;
