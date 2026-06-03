-- ═══════════════════════════════════════════════════════════════
-- 0018_audience_segments — member segmentation + per-fiche audience.
--
-- WHY: client request 2026-06-03 — Salva adds many fiches; not everyone
-- should see all. Members are grouped into SEGMENTS (e.g. clients referred
-- by a bank like "piguet-galland"); each fiche targets segments and can
-- EXCLUDE specific members. Phase 1 = data model + admin tagging. The real
-- server-side enforcement (private Sanity dataset + Edge Function gate)
-- lands in Phase 2 — this migration is the foundation it reads.
--
-- SECURITY NOTE: these tables hold the access policy, not the fiche content
-- (which stays in Sanity). RLS here protects who can EDIT the policy
-- (admins only). The actual fiche gating happens in the Phase 2 Edge
-- Function using the service role.
-- ═══════════════════════════════════════════════════════════════

-- ── admin predicate helper (inlined; avoids a SECURITY DEFINER fn) ──
-- exists(... profiles where id = auth.uid() and role = 'admin')

-- ──────────────────────────────────────────────────────────────
-- 1) segments — shared vocabulary (slug + human label)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.segments (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]{2,40}$'),
  label       text not null,
  description text,
  created_at  timestamptz not null default now()
);

alter table public.segments enable row level security;

-- Any authenticated user may READ the vocabulary (labels for their own
-- segments, filter chips). Only admins may write.
drop policy if exists "segments: authenticated read" on public.segments;
create policy "segments: authenticated read"
  on public.segments for select to authenticated using (true);

drop policy if exists "segments: admin write" on public.segments;
create policy "segments: admin write"
  on public.segments for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

grant select, insert, update, delete on public.segments to authenticated;

-- ──────────────────────────────────────────────────────────────
-- 2) profiles.segments — which segments a member belongs to
-- ──────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists segments text[] not null default '{}';

-- ──────────────────────────────────────────────────────────────
-- 3) fiche_audience — per-fiche targeting (segments + exclusions)
--    Keyed by the Sanity doc id; one row per fiche that has rules.
--    audience_mode='all' → every member; 'segments' → only the listed
--    segments. excluded_member_ids removes specific members either way.
-- ──────────────────────────────────────────────────────────────
create table if not exists public.fiche_audience (
  id                  uuid primary key default gen_random_uuid(),
  sanity_doc_id       text not null unique,
  sanity_doc_type     text not null,
  audience_mode       text not null default 'all'
    check (audience_mode in ('all', 'segments')),
  segments            text[] not null default '{}',
  excluded_member_ids uuid[] not null default '{}',
  note                text,
  updated_at          timestamptz not null default now()
);

alter table public.fiche_audience enable row level security;

-- Admins fully manage audience rules. Members never read this table
-- directly (the Phase 2 gate uses the service role); no member policy.
drop policy if exists "fiche_audience: admin all" on public.fiche_audience;
create policy "fiche_audience: admin all"
  on public.fiche_audience for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

grant select, insert, update, delete on public.fiche_audience to authenticated;

create index if not exists fiche_audience_doc_idx
  on public.fiche_audience(sanity_doc_id);

-- Refresh PostgREST so the new tables/column are exposed immediately.
notify pgrst, 'reload schema';

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
-- select column_name from information_schema.columns
--   where table_name = 'profiles' and column_name = 'segments';   -- 1 row
-- select tablename from pg_tables
--   where tablename in ('segments', 'fiche_audience');             -- 2 rows
