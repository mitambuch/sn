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
