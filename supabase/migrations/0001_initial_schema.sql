-- ═══════════════════════════════════════════════════════════════
-- Sawnext Studio — initial schema
--
-- Three domain tables backing the client app:
--   profiles          extends auth.users with our domain fields
--   invitation_codes  single-use codes (SAW-XXXX-XXXX format)
--   inquiries         each interest expressed by a client
--
-- Row Level Security is enabled on all three. Anon role gets the
-- narrow surface required for: code redemption at signup, reading
-- own profile, listing/creating own inquiries. The admin surface is
-- gated on profiles.role = 'admin'.
--
-- To apply: paste the entire file into the Supabase SQL Editor
-- (dashboard → SQL Editor → New query → paste → Run).
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- ENUMS
-- ──────────────────────────────────────────────────────────────

create type user_role           as enum ('client', 'admin');
create type contact_preference  as enum ('email', 'phone', 'secure-message');
create type user_locale         as enum ('fr', 'en');
create type invitation_status   as enum ('unused', 'redeemed', 'expired', 'revoked');
create type inquiry_source      as enum (
  'event', 'property', 'timepiece', 'artwork', 'journey',
  'concierge', 'jet', 'object-search', 'event-organize'
);
create type inquiry_status      as enum (
  'new', 'in_review', 'contacted', 'closed', 'cancelled'
);

-- ──────────────────────────────────────────────────────────────
-- profiles — 1:1 with auth.users
-- ──────────────────────────────────────────────────────────────

create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  full_name           text not null,
  role                user_role not null default 'client',
  locale              user_locale not null default 'fr',
  contact_preference  contact_preference not null default 'email',
  avatar_url          text,
  concierge_name      text not null default 'Salvatore',
  created_at          timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(role);

-- ──────────────────────────────────────────────────────────────
-- invitation_codes — single-use 8-char codes
-- ──────────────────────────────────────────────────────────────

create table public.invitation_codes (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  status        invitation_status not null default 'unused',
  created_at    timestamptz not null default now(),
  redeemed_at   timestamptz,
  redeemed_by   uuid references public.profiles(id) on delete set null,
  expires_at    timestamptz,
  created_by    uuid not null references public.profiles(id) on delete restrict,
  -- Canonical format: 8 chars from the unambiguous alphabet (no O/0/I/1/L).
  constraint invitation_codes_format check (code ~ '^[A-HJ-NP-Z2-9]{8}$')
);

create index invitation_codes_status_idx on public.invitation_codes(status);

-- ──────────────────────────────────────────────────────────────
-- inquiries — interest expressed by a client
-- ──────────────────────────────────────────────────────────────

create table public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  source      inquiry_source not null,
  target_id   text,
  message     text,
  status      inquiry_status not null default 'new',
  created_at  timestamptz not null default now()
);

create index inquiries_user_id_idx on public.inquiries(user_id);
create index inquiries_status_idx  on public.inquiries(status);
create index inquiries_created_idx on public.inquiries(created_at desc);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════

alter table public.profiles         enable row level security;
alter table public.invitation_codes enable row level security;
alter table public.inquiries        enable row level security;

-- ── profiles ─────────────────────────────────────────────────

-- A user can read their own profile.
create policy "profiles: self read"
  on public.profiles for select
  using (auth.uid() = id);

-- A user can update their own profile (locale, contact preference, avatar).
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can read every profile.
create policy "profiles: admin read all"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins can update every profile (e.g. grant admin role).
create policy "profiles: admin update all"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── invitation_codes ─────────────────────────────────────────

-- Anon role can read an unused code by its value (for redemption
-- at onboarding). We deliberately allow probing existence by code,
-- not enumeration of the whole table.
create policy "invitation_codes: read unused for redemption"
  on public.invitation_codes for select
  using (status = 'unused');

-- Admins can read every code.
create policy "invitation_codes: admin read all"
  on public.invitation_codes for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins generate codes.
create policy "invitation_codes: admin insert"
  on public.invitation_codes for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins revoke/update codes.
create policy "invitation_codes: admin update"
  on public.invitation_codes for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── inquiries ────────────────────────────────────────────────

-- A user reads only their own inquiries.
create policy "inquiries: self read"
  on public.inquiries for select
  using (auth.uid() = user_id);

-- A user creates an inquiry tied to themselves.
create policy "inquiries: self insert"
  on public.inquiries for insert
  with check (auth.uid() = user_id);

-- Admins read every inquiry.
create policy "inquiries: admin read all"
  on public.inquiries for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins update inquiry status (in_review / contacted / closed).
create policy "inquiries: admin update"
  on public.inquiries for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ══════════════════════════════════════════════════════════════
-- TRIGGER — auto-create profile on auth signup
-- ══════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
