-- ═══════════════════════════════════════════════════════════════
-- BUNDLE — Vitrine launch migrations (0008 + 0010 + 0011 + 0012)
--
-- One-paste copy for the 2026-05-27 soft-launch. Concatenation of the
-- 4 individual migration files needed on top of an already-deployed
-- Sawnext Supabase project (profiles + invitation_codes + inquiries +
-- share_codes + profiles.phone are already present).
--
-- Skipped here :
--   0001-0007 : already applied (verified via the existence query)
--   0009      : already applied (profiles.phone column present)
--
-- All sections are IDEMPOTENT — safe to re-run. The four sections are
-- separated by ═══ markers below so you can scroll-and-find if anything
-- fails ; otherwise you paste this whole file once into the Supabase
-- SQL Editor and click Run.
--
-- After running, verification block at the bottom returns one row per
-- expected object — every `exists` column should be `t`.
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- redeem_invitation_code — atomic single-use redemption RPC
--
-- The bug this fixes : the client used to SELECT the invitation_code,
-- then signInWithOtp(email). Nothing ever marked the code as
-- `redeemed`, so a single SAW-XXXX-XXXX could be reused indefinitely.
-- Critical security flaw for a cooptation-based access model.
--
-- This RPC :
--   - Locks the candidate row with FOR UPDATE so concurrent calls
--     can't both succeed
--   - Verifies status='unused' (also covers `redeemed/expired/revoked`)
--   - UPDATEs atomically : status='redeemed', redeemed_at=now(),
--     redeemed_by=auth.uid()
--   - Returns a json envelope so the JS caller can distinguish error
--     categories (not_found, already_used, not_authenticated)
--   - SECURITY DEFINER + search_path=public so RLS doesn't shadow the
--     update from the caller's authenticated role (the policy already
--     allows it, but SECURITY DEFINER is the right pattern for a
--     state-mutating RPC and lets us tighten policies later without
--     breaking the call site)
--
-- The flow :
--   1. Landing : user enters SAW-XXXX-XXXX + email in the
--      AccessRequestModal (code mode). Client does a permissive SELECT
--      (existing RLS policy "invitation_codes: read unused for
--      redemption") to surface a clean "code introuvable" error early.
--   2. Client calls signInWithOtp(email, { data: { invitation_code }})
--      → magic link sent to the user's inbox.
--   3. User clicks → lands on /:locale/onboarding authenticated.
--   4. Onboarding reads user_metadata.invitation_code (set in step 2)
--      and calls supabase.rpc('redeem_invitation_code', { p_code }).
--      The RPC marks the code redeemed atomically OR returns error.
--   5. If error : surface to the user, leave them logged in but block
--      step transitions until Salva resolves manually.
--
-- To apply : paste this file into Supabase SQL Editor → Run.
-- Or via CLI : supabase db push.
-- ═══════════════════════════════════════════════════════════════

create or replace function public.redeem_invitation_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_code_id uuid;
  v_status invitation_status;
  v_normalized text;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return json_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  -- Canonical normalization mirrors src/types/invitation.ts :
  -- strip SAW- prefix, dashes and whitespace, uppercase the rest.
  v_normalized := upper(regexp_replace(coalesce(p_code, ''), '^saw-|[\s-]', '', 'gi'));

  if v_normalized !~ '^[A-HJ-NP-Z2-9]{8}$' then
    return json_build_object('ok', false, 'error', 'invalid_format');
  end if;

  -- Lock the candidate row so concurrent redemptions of the same code
  -- can't both succeed. The row stays locked until commit.
  select id, status
    into v_code_id, v_status
    from public.invitation_codes
   where code = v_normalized
   for update;

  if v_code_id is null then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;

  if v_status <> 'unused' then
    return json_build_object(
      'ok', false,
      'error', 'already_used',
      'status', v_status
    );
  end if;

  update public.invitation_codes
     set status      = 'redeemed',
         redeemed_at = now(),
         redeemed_by = v_user_id
   where id = v_code_id;

  return json_build_object(
    'ok', true,
    'code_id', v_code_id,
    'redeemed_by', v_user_id
  );
end;
$$;

-- Only authenticated users may redeem. The anon SELECT policy on
-- invitation_codes (existing) covers the landing-side UX preview ;
-- anon cannot call this RPC.
grant execute on function public.redeem_invitation_code(text) to authenticated;
revoke execute on function public.redeem_invitation_code(text) from anon, public;

-- ═══════════════════════════════════════════════════════════════
-- END 0008 — BEGIN 0010 security_hardening
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 0010_security_hardening — close P0/P1/P2 findings from
-- docs/AUDIT-SECURITY.md (Phase 1 audit, 2026-05-27).
--
-- Four issues addressed :
--
-- 1) P0-1 invitation_codes anonymous enumeration
--    Revoke anon SELECT, expose a SECURITY DEFINER
--    `verify_invitation_code(code)` RPC that returns only a boolean.
--    No row data leaks.
--
-- 2) P0-2 role self-escalation via profile UPDATE
--    Column-level GRANT (whitelist allowed columns) + harden
--    "profiles: self update" policy with a `with check` clause that
--    pins `role`. Defense in depth.
--
-- 3) P1-3 XSS in operator-bound email
--    Introduce `escape_html()` helper and rebuild `notify_new_inquiry`
--    body with all user-controlled fields escaped.
--
-- 4) P2-5 hardcoded operator email
--    `notify_new_inquiry` now reads `OPERATOR_EMAIL` from Vault with
--    the current hardcoded value as a fallback so the trigger keeps
--    working until the secret is added.
--
-- To apply : paste into Supabase SQL Editor → Run.
--   Or via CLI : `supabase db push`.
-- Idempotent : safe to re-run.
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- 1) P0-1 — invitation_codes : no anon SELECT, expose verify RPC
-- ──────────────────────────────────────────────────────────────

revoke select on public.invitation_codes from anon;

drop policy if exists "invitation_codes: read unused for redemption"
  on public.invitation_codes;

-- The verify RPC : returns true iff a code is unused. No leak about
-- the rest of the row. Anon can call it ; authenticated too (admins
-- still have a separate broad-SELECT policy for management UI).
create or replace function public.verify_invitation_code(p_code text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.invitation_codes
    where code = upper(regexp_replace(coalesce(p_code, ''), '^saw-|[\s-]', '', 'gi'))
      and status = 'unused'
  );
$$;

grant execute on function public.verify_invitation_code(text)
  to anon, authenticated;

comment on function public.verify_invitation_code(text) is
  'Public RPC. Returns true iff the supplied code is unused. Does not '
  'leak the row. Safe replacement for the previous anon SELECT policy.';

-- ──────────────────────────────────────────────────────────────
-- 2) P0-2 — profiles : column-level GRANT + with-check policy
-- ──────────────────────────────────────────────────────────────

-- Drop the broad UPDATE grant, replace with a column whitelist.
revoke update on public.profiles from authenticated;
grant update (full_name, phone, locale, contact_preference, avatar_url)
  on public.profiles to authenticated;

-- Replace the self-update policy with one that pins `role` defensively.
drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Pin role to the current value : even if a future column GRANT
    -- adds `role` back by mistake, self-update can't change it.
    and role = (
      select p.role from public.profiles p where p.id = auth.uid()
    )
  );

comment on policy "profiles: self update" on public.profiles is
  'Self-update with role pinned. Column GRANT also restricts to '
  'full_name, phone, locale, contact_preference, avatar_url. Admin '
  'role changes go through a separate admin-only path (TBD RPC).';

-- ──────────────────────────────────────────────────────────────
-- 3) P1-3 — HTML escape helper + rebuild notify_new_inquiry
-- ──────────────────────────────────────────────────────────────

create or replace function public.escape_html(p text)
returns text
language sql
immutable
as $$
  select replace(replace(replace(replace(replace(
    coalesce(p, ''),
    '&', '&amp;'),
    '<', '&lt;'),
    '>', '&gt;'),
    '"', '&quot;'),
    '''', '&#39;')
$$;

comment on function public.escape_html(text) is
  'HTML-escape the five canonical chars. Use anywhere user-controlled '
  'text is interpolated into HTML email bodies or admin UI.';

-- Rebuild the trigger function with escaped user input + Vault-backed
-- operator email.
create or replace function public.notify_new_inquiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resend_key       text;
  operator_email   text;
  client_email     text;
  client_name      text;
  email_subject    text;
  email_html       text;
  source_label     text;
  message_html     text;
begin
  -- Resend API key from Vault.
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  if resend_key is null then
    raise warning 'RESEND_API_KEY not in Vault — skipping email notification';
    return new;
  end if;

  -- Operator email from Vault, fallback to the legacy hardcoded value
  -- so the trigger keeps working until the secret is added.
  select decrypted_secret into operator_email
  from vault.decrypted_secrets
  where name = 'OPERATOR_EMAIL'
  limit 1;
  operator_email := coalesce(operator_email, 'mitamburini@gmail.com');

  -- Resolve the client info from the joined profile row.
  select email, full_name into client_email, client_name
  from public.profiles
  where id = new.user_id
  limit 1;

  -- Human-readable source label (enum, no escape needed).
  source_label := case new.source
    when 'property'        then 'Propriété'
    when 'timepiece'       then 'Horlogerie'
    when 'artwork'         then 'Œuvre d''art'
    when 'event'           then 'Événement'
    when 'journey'         then 'Voyage'
    when 'concierge'       then 'Conciergerie'
    when 'jet'             then 'Jet privé'
    when 'object-search'   then 'Recherche d''objet'
    when 'event-organize'  then 'Organisation d''événement'
    else new.source::text
  end;

  email_subject := '[Sawnext] Nouvelle demande — ' || source_label;

  -- Message body : escape first, then convert newlines to <br>.
  if new.message is null then
    message_html := '<em>(pas de message)</em>';
  else
    message_html := replace(public.escape_html(new.message), chr(10), '<br>');
  end if;

  email_html := format(
    '<p><strong>Nouvelle demande client</strong></p>'
    || '<p>De : %s &lt;%s&gt;</p>'
    || '<p>Catégorie : %s</p>'
    || '<p>Référence interne : %s</p>'
    || '<p>Message :</p><blockquote>%s</blockquote>'
    || '<p style="color:#888;font-size:12px">Inquiry id : %s · Créée à %s</p>',
    public.escape_html(coalesce(client_name, '—')),
    public.escape_html(coalesce(client_email, '—')),
    source_label,
    public.escape_html(coalesce(new.target_id, '—')),
    message_html,
    new.id::text,
    new.created_at::text
  );

  -- Fire the Resend POST. Non-blocking — pg_net queues the request.
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type',  'application/json'
    ),
    body := jsonb_build_object(
      'from',    'Sawnext Studio <onboarding@resend.dev>',
      'to',      jsonb_build_array(operator_email),
      'reply_to', client_email,
      'subject', email_subject,
      'html',    email_html
    )
  );

  return new;
end;
$$;

-- Trigger binding unchanged ; the function-replace above is enough.
-- (Idempotent re-bind for safety.)
drop trigger if exists inquiry_notify_resend on public.inquiries;
create trigger inquiry_notify_resend
  after insert on public.inquiries
  for each row execute function public.notify_new_inquiry();

-- ──────────────────────────────────────────────────────────────
-- Verification queries (run manually after applying) :
-- ──────────────────────────────────────────────────────────────
--
-- -- 1) anon SELECT must fail :
-- set role anon;
-- select * from public.invitation_codes;  -- expect: permission denied
-- reset role;
--
-- -- 2) verify RPC works for both anon and authenticated :
-- set role anon;
-- select public.verify_invitation_code('SAW-INEXISTANT');  -- expect: false
-- reset role;
--
-- -- 3) role escalation must fail :
-- -- (as a client user via the SDK)
-- -- await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
-- -- expect: 403 permission denied for column "role" (column GRANT) or
-- --         RLS check failure (with-check predicate)
--
-- -- 4) inquiry XSS test :
-- update public.profiles set full_name = '<img src=x onerror=alert(1)>' where id = '...';
-- insert into public.inquiries (user_id, source, target_id, message)
-- values ('...', 'concierge', '<b>bold</b>', '<script>alert(1)</script>');
-- -- email arriving at OPERATOR_EMAIL must show escaped text, no tags rendered.

-- ═══════════════════════════════════════════════════════════════
-- END 0010 — BEGIN 0011 saved_items
-- ═══════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════
-- END 0011 — BEGIN 0012 access_requests
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 0012_access_requests — anonymous access requests from the landing
--
-- WHY: The landing "Demander un accès" CTA opens a 3-step wizard for
--      non-members. These visitors are NOT yet authenticated (no row
--      in auth.users), so they cannot insert into public.inquiries
--      (which has a NOT NULL FK to public.profiles via auth.users).
--      A dedicated `access_requests` table captures the lead. The
--      operator triages → decides → optionally generates an invitation
--      code for the lead.
--
-- DESIGN:
--   - Generated UUID primary key.
--   - All form fields denormalised on the row (no FK to anything since
--     the requester isn't a user yet).
--   - status enum tracks the operator triage : new / contacted /
--     accepted / declined.
--   - Anon role can ONLY insert (write-only). It cannot read back its
--     own row to avoid leaking other requests via id-guessing.
--   - Admin role has full read + update access via the existing
--     "admin" check pattern.
--   - Postgres trigger fires the Resend operator email (same Vault-
--     backed pattern as inquiry_notify_resend in migration 0010).
--
-- To apply : paste into Supabase SQL Editor → Run. Idempotent.
-- ═══════════════════════════════════════════════════════════════

-- ─── enum ──────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'access_request_status') then
    create type access_request_status as enum ('new', 'contacted', 'accepted', 'declined');
  end if;
end $$;

-- ─── table ─────────────────────────────────────────────────────
create table if not exists public.access_requests (
  id           uuid primary key default gen_random_uuid(),
  first_name   text not null,
  last_name    text not null,
  email        text not null,
  phone        text,
  company      text,
  activity     text,
  message      text,
  status       access_request_status not null default 'new',
  created_at   timestamptz not null default now()
);

create index if not exists access_requests_status_idx on public.access_requests(status);
create index if not exists access_requests_created_idx on public.access_requests(created_at desc);

-- ─── RLS ───────────────────────────────────────────────────────
alter table public.access_requests enable row level security;

-- Anon can INSERT only (write-only — no read-back to prevent
-- enumeration of other leads by id-guessing).
drop policy if exists "access_requests: anon insert" on public.access_requests;
create policy "access_requests: anon insert"
  on public.access_requests for insert
  to anon, authenticated
  with check (true);

-- Admins can read every request.
drop policy if exists "access_requests: admin read all" on public.access_requests;
create policy "access_requests: admin read all"
  on public.access_requests for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins update status (triage flow).
drop policy if exists "access_requests: admin update" on public.access_requests;
create policy "access_requests: admin update"
  on public.access_requests for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Grants : minimal surface. Anon needs insert ; nobody needs delete.
revoke all on public.access_requests from anon, authenticated;
grant insert on public.access_requests to anon, authenticated;
grant select, update on public.access_requests to authenticated;

comment on table public.access_requests is
  'Anonymous access request leads from the landing wizard. Anon write-only ; '
  'admin read/update for triage. Resend operator email fires via trigger.';

-- ─── notification trigger ─────────────────────────────────────
-- Reuses the escape_html() helper + Vault-backed RESEND_API_KEY +
-- OPERATOR_EMAIL pattern from migration 0010 to email the operator
-- when a new lead lands.

create or replace function public.notify_new_access_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resend_key      text;
  operator_email  text;
  email_subject   text;
  email_html      text;
  message_html    text;
begin
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  if resend_key is null then
    raise warning 'RESEND_API_KEY not in Vault — skipping access request email';
    return new;
  end if;

  select decrypted_secret into operator_email
  from vault.decrypted_secrets
  where name = 'OPERATOR_EMAIL'
  limit 1;
  operator_email := coalesce(operator_email, 'mitamburini@gmail.com');

  email_subject := '[Sawnext] Nouvelle demande d''accès — ' ||
    public.escape_html(coalesce(new.first_name, '') || ' ' || coalesce(new.last_name, ''));

  if new.message is null then
    message_html := '<em>(pas de message)</em>';
  else
    message_html := replace(public.escape_html(new.message), chr(10), '<br>');
  end if;

  email_html := format(
    '<p><strong>Nouvelle demande d''accès</strong></p>'
    || '<p>Nom : %s</p>'
    || '<p>Email : <a href="mailto:%s">%s</a></p>'
    || '<p>Téléphone : %s</p>'
    || '<p>Société : %s</p>'
    || '<p>Activité : %s</p>'
    || '<p>Message :</p><blockquote>%s</blockquote>'
    || '<p style="color:#888;font-size:12px">Request id : %s · Créée à %s</p>',
    public.escape_html(coalesce(new.first_name, '—') || ' ' || coalesce(new.last_name, '')),
    public.escape_html(coalesce(new.email, '')),
    public.escape_html(coalesce(new.email, '—')),
    public.escape_html(coalesce(new.phone, '—')),
    public.escape_html(coalesce(new.company, '—')),
    public.escape_html(coalesce(new.activity, '—')),
    message_html,
    new.id::text,
    new.created_at::text
  );

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type',  'application/json'
    ),
    body := jsonb_build_object(
      'from',    'Sawnext Studio <onboarding@resend.dev>',
      'to',      jsonb_build_array(operator_email),
      'reply_to', new.email,
      'subject', email_subject,
      'html',    email_html
    )
  );

  return new;
end;
$$;

drop trigger if exists access_request_notify_resend on public.access_requests;
create trigger access_request_notify_resend
  after insert on public.access_requests
  for each row execute function public.notify_new_access_request();

-- ──────────────────────────────────────────────────────────────
-- Verification queries (run manually after applying) :
-- ──────────────────────────────────────────────────────────────
--
-- -- 1) Table + RLS :
-- select c.relrowsecurity from pg_class c where c.relname = 'access_requests';  -- expect: t
--
-- -- 2) Policies :
-- select polname from pg_policy where polrelid = 'public.access_requests'::regclass;
-- -- expect: 3 policies (anon insert, admin read, admin update)
--
-- -- 3) Anon insert works :
-- set role anon;
-- insert into public.access_requests (first_name, last_name, email)
-- values ('Demo', 'Tester', 'demo@example.com');  -- expect: 1 row
-- reset role;
--
-- -- 4) Anon SELECT fails :
-- set role anon;
-- select * from public.access_requests;  -- expect: empty (no read policy for anon)
-- reset role;


-- ═══════════════════════════════════════════════════════════════
-- VERIFICATION — run this last block separately after the bundle
-- to confirm everything is in place. Every row should show `t`.
-- ═══════════════════════════════════════════════════════════════
--
-- select 'redeem_invitation_code (RPC)' as object,
--        exists(select 1 from pg_proc where proname = 'redeem_invitation_code') as exists
-- union all select 'verify_invitation_code (RPC)',
--        exists(select 1 from pg_proc where proname = 'verify_invitation_code')
-- union all select 'escape_html (helper)',
--        exists(select 1 from pg_proc where proname = 'escape_html')
-- union all select 'saved_items (table)',
--        exists(select 1 from pg_tables where tablename = 'saved_items')
-- union all select 'access_requests (table)',
--        exists(select 1 from pg_tables where tablename = 'access_requests')
-- union all select 'notify_new_inquiry (trigger fn)',
--        exists(select 1 from pg_proc where proname = 'notify_new_inquiry')
-- union all select 'notify_new_access_request (trigger fn)',
--        exists(select 1 from pg_proc where proname = 'notify_new_access_request');
