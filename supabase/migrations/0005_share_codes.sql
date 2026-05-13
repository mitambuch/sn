-- ═══════════════════════════════════════════════════
-- 0005_share_codes — Share-code access to a single Sanity doc
--
-- WHY: Salva generates a unique 8-char code (format SAW-XXXX-XXXX) that
--      points to ONE Sanity document (event / property / timepiece /
--      artwork / journey / conciergeService / article). Anyone with the
--      code can open /share/:code and view that single fiche without
--      authenticating. The code can be revoked, time-limited, or
--      capped at N views by Salva.
--
-- DESIGN:
-- - Table `share_codes` holds (code, sanity_doc_type, sanity_doc_id,
--   status, expires_at, max_views, view_count, created_by, note).
-- - RLS blocks anonymous SELECT on the table — codes are NEVER
--   listable. Validation goes through `consume_share_code()` RPC
--   (security definer) which atomically checks validity + bumps the
--   view counter.
-- - Admin can manage codes via the standard authenticated path.
-- ═══════════════════════════════════════════════════

-- ─── Table ────────────────────────────────────────────────────────
create table public.share_codes (
  id uuid primary key default gen_random_uuid(),
  -- 8 canonical chars from the unambiguous alphabet, no SAW- prefix here.
  -- Same alphabet/format as invitation_codes for consistency.
  code text not null unique,
  sanity_doc_type text not null,
  sanity_doc_id text not null,
  status text not null default 'active'
    check (status in ('active', 'expired', 'revoked')),
  view_count integer not null default 0
    check (view_count >= 0),
  max_views integer
    check (max_views is null or max_views > 0),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  note text,
  constraint share_codes_format check (code ~ '^[A-HJ-NP-Z2-9]{8}$')
);

create index share_codes_status_idx on public.share_codes(status);
create index share_codes_doc_idx on public.share_codes(sanity_doc_type, sanity_doc_id);
create index share_codes_created_by_idx on public.share_codes(created_by);

alter table public.share_codes enable row level security;

-- ─── RLS ─────────────────────────────────────────────────────────
-- Anonymous + authenticated NON-admin : cannot SELECT directly. Must
-- go through consume_share_code() RPC. This prevents code enumeration.
-- Admins can full-CRUD via the standard authenticated path.
create policy "share_codes: admin select"
  on public.share_codes for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "share_codes: admin insert"
  on public.share_codes for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "share_codes: admin update"
  on public.share_codes for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "share_codes: admin delete"
  on public.share_codes for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ─── RPC : consume_share_code ─────────────────────────────────────
-- Returns the linked Sanity doc reference if the code is valid, and
-- atomically increments the view counter. Designed for /share/:code
-- public route — callable by anon role.
--
-- Validity = status='active' AND (expires_at is null OR expires_at>now())
--                            AND (max_views is null OR view_count<max_views).
--
-- If invalid : returns one row with is_valid=false and minimal context.
-- If not found : returns zero rows.
create or replace function public.consume_share_code(p_code text)
returns table(
  sanity_doc_type text,
  sanity_doc_id text,
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
      set view_count = view_count + 1
      where id = v_record.id;
    v_record.view_count := v_record.view_count + 1;
  end if;

  return query select
    v_record.sanity_doc_type,
    v_record.sanity_doc_id,
    v_record.status,
    v_record.view_count,
    v_record.max_views,
    v_record.expires_at,
    v_valid;
end;
$$;

grant execute on function public.consume_share_code(text) to anon, authenticated;

-- ─── Comments ─────────────────────────────────────────────────────
comment on table public.share_codes is
  'Single-Sanity-doc access codes. Salva generates a SAW-XXXX-XXXX code → recipient opens /share/:code → sees that one fiche without auth.';
comment on function public.consume_share_code(text) is
  'Public RPC. Validates a share code and returns the linked Sanity doc reference. Atomically bumps view_count. Returns is_valid=false if code is expired/revoked/at-cap.';
