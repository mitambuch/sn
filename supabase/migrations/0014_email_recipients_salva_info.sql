-- ═══════════════════════════════════════════════════════════════
-- 0014_email_recipients_salva_info — send operator notifications to
-- BOTH salva@saw-next.ch AND info@saw-next.ch.
--
-- WHY: client report 2026-06-01 — Salva ne reçoit pas les demandes
-- d'accès. He named two mailboxes (salva@ and info@) without being
-- sure which one is wired. Sending to both removes the ambiguity and
-- the risk of him watching the wrong inbox. This also drops the
-- dependency on the Vault `OPERATOR_EMAIL` secret for the recipient
-- (one less thing to set / keep in sync), so applying this migration
-- is enough — no Vault flip needed afterwards.
--
-- Supersedes the recipient logic of 0013 (which sent to the single
-- Vault `OPERATOR_EMAIL`). Sender stays `noreply@saw-next.ch` from 0013.
--
-- ⚠️ PRECONDITION (same as 0013) — emails are REJECTED by Resend until
-- this is done :
--   1. Resend Dashboard → Domains → Add domain → saw-next.ch
--   2. Add the SPF / DKIM / bounce-MX records Resend gives you on
--      Infomaniak Manager → DNS for saw-next.ch (ADDITIVE — do not
--      touch the existing MX that routes mail to the Infomaniak inbox).
--   3. Wait for "Verified" on Resend (1-30 min).
--   4. Then paste THIS migration in Supabase SQL Editor → Run.
--   No Vault change required (recipients are hard-set here).
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- 1) notify_new_inquiry — both recipients
-- ──────────────────────────────────────────────────────────────

create or replace function public.notify_new_inquiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resend_key       text;
  client_email     text;
  client_name      text;
  email_subject    text;
  email_html       text;
  source_label     text;
  message_html     text;
begin
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  if resend_key is null then
    raise warning 'RESEND_API_KEY not in Vault — skipping email notification';
    return new;
  end if;

  select email, full_name into client_email, client_name
  from public.profiles
  where id = new.user_id
  limit 1;

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

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type',  'application/json'
    ),
    body := jsonb_build_object(
      'from',    'Sawnext Studio <noreply@saw-next.ch>',
      'to',      jsonb_build_array('salva@saw-next.ch', 'info@saw-next.ch'),
      'reply_to', client_email,
      'subject', email_subject,
      'html',    email_html
    )
  );

  return new;
end;
$$;

-- ──────────────────────────────────────────────────────────────
-- 2) notify_new_access_request — both recipients
-- ──────────────────────────────────────────────────────────────

create or replace function public.notify_new_access_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resend_key      text;
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
      'from',    'Sawnext Studio <noreply@saw-next.ch>',
      'to',      jsonb_build_array('salva@saw-next.ch', 'info@saw-next.ch'),
      'reply_to', new.email,
      'subject', email_subject,
      'html',    email_html
    )
  );

  return new;
end;
$$;

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
--
-- -- 1) Both functions carry the branded sender + both recipients :
-- select pg_get_functiondef(oid)
-- from pg_proc where proname in ('notify_new_inquiry', 'notify_new_access_request');
-- --   output should contain `noreply@saw-next.ch` AND both
-- --   `salva@saw-next.ch` and `info@saw-next.ch`
--
-- -- 2) Smoke test : submit the access form on saw-next.ch
-- --    → Resend Dashboard → Logs → status "Delivered"
-- --    → both salva@ and info@ inboxes receive the notification
