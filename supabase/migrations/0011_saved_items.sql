-- ═══════════════════════════════════════════════════════════════
-- 0011_saved_items — cross-device wishlist persistence
--
-- WHY: AccountSaved (~/account/saved) lived in localStorage so the
--      wishlist was tied to a single device. Cross-device persistence
--      is the demo-impactful win — same client signing in on phone +
--      laptop sees the same list.
--
-- DESIGN:
--   - Composite PK (user_id, module, slug) — natural dedupe, no
--     surrogate id needed.
--   - RLS self-only via a single 'for all' policy.
--   - Grants restricted to select/insert/delete — no update path
--     (a saved item is either present or absent, no mutable fields).
--   - module is checked against the same 6-domain enum the client
--     SavedModule union uses.
--   - Index on user_id alone — every read filters by user, and the
--     PK index already covers (user_id, module, slug) lookups.
--
-- CLIENT INTEGRATION (src/hooks/useSavedItems.ts):
--   - localStorage stays the primary store for snappy UI (no loading
--     state on every heart click).
--   - On hook mount with an authenticated user : pull remote rows +
--     merge into local cache.
--   - On toggle : write local first, then background insert/delete
--     (fire-and-forget, eventually consistent).
--
-- To apply : paste into Supabase SQL Editor → Run. Idempotent.
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.saved_items (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  module   text not null check (
    module in ('property', 'timepiece', 'artwork', 'event', 'journey', 'concierge')
  ),
  slug     text not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, module, slug)
);

create index if not exists saved_items_user_idx on public.saved_items(user_id);

alter table public.saved_items enable row level security;

-- Self-only access — read/insert/delete your own rows.
drop policy if exists "saved_items: self all" on public.saved_items;
create policy "saved_items: self all"
  on public.saved_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Restrict to the verbs the client actually issues. No update path :
-- a saved item is either present or absent, never mutated.
revoke all on public.saved_items from authenticated;
grant select, insert, delete on public.saved_items to authenticated;

comment on table public.saved_items is
  'Per-user wishlist (~/account/saved). One row per (user, module, slug). '
  'Synced from localStorage on hook mount + background-written on toggle.';

-- ──────────────────────────────────────────────────────────────
-- Verification queries (run manually after applying) :
-- ──────────────────────────────────────────────────────────────
--
-- -- 1) Table exists with the right shape :
-- select column_name, data_type, is_nullable
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'saved_items'
-- order by ordinal_position;
--
-- -- 2) RLS is on :
-- select relname, relrowsecurity
-- from pg_class where relname = 'saved_items';  -- expect: t
--
-- -- 3) The policy is registered :
-- select polname from pg_policy
-- where polrelid = 'public.saved_items'::regclass;
-- -- expect: "saved_items: self all"
--
-- -- 4) Self-insert as authenticated works (run inside an authed session) :
-- -- insert into public.saved_items (user_id, module, slug)
-- -- values (auth.uid(), 'property', 'demo-slug');
-- -- expect: 1 row inserted.
--
-- -- 5) Cross-user select returns nothing :
-- -- select * from public.saved_items where user_id != auth.uid();
-- -- expect: empty.
