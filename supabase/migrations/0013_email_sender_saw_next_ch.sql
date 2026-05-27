-- ═══════════════════════════════════════════════════════════════
-- 0013_email_sender_saw_next_ch — switch outbound emails to the
-- branded sender now that saw-next.ch is verified on Resend.
--
-- WHY: Migrations 0010 (inquiries) and 0012 (access_requests) used
-- the Resend sandbox sender `onboarding@resend.dev` to ship fast
-- without DNS work. The sandbox can only send to the Resend account
-- email — fine for testing, broken for production where leads should
-- email `info@saw-next.ch` and the From: should read as Sawnext.
--
-- PRECONDITION before running this migration :
--   1. Add saw-next.ch on Resend Dashboard → Domains → Add domain
--   2. Add the 3 DNS records Resend gives you (SPF TXT, DKIM TXT,
--      and the bounce MX) on Infomaniak Manager → DNS for saw-next.ch
--      ⚠️ ADDITIVE — don't touch the existing MX records that route
--      mail to your Infomaniak inbox at info@saw-next.ch
--   3. Wait for the domain to show "Verified" on Resend Dashboard
--      (typically 1-30 min)
--   4. Then paste this migration → Run
--   5. Then UPDATE the Vault secret :
--      update vault.secrets set secret = 'info@saw-next.ch'
--        where name = 'OPERATOR_EMAIL';
--
-- WHAT this migration does :
--   - Recreates notify_new_inquiry with sender = noreply@saw-next.ch
--   - Recreates notify_new_access_request with the same sender
--   - Both functions stay otherwise identical to 0010 / 0012 — same
--     Vault reads, same escape_html escaping, same Reply-To wiring
--     to the lead's email
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- 1) notify_new_inquiry — branded sender
-- ──────────────────────────────────────────────────────────────

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
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  if resend_key is null then
    raise warning 'RESEND_API_KEY not in Vault — skipping email notification';
    return new;
  end if;

  select decrypted_secret into operator_email
  from vault.decrypted_secrets
  where name = 'OPERATOR_EMAIL'
  limit 1;
  operator_email := coalesce(operator_email, 'info@saw-next.ch');

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
      'to',      jsonb_build_array(operator_email),
      'reply_to', client_email,
      'subject', email_subject,
      'html',    email_html
    )
  );

  return new;
end;
$$;

-- ──────────────────────────────────────────────────────────────
-- 2) notify_new_access_request — branded sender
-- ──────────────────────────────────────────────────────────────

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
  operator_email := coalesce(operator_email, 'info@saw-next.ch');

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
      'to',      jsonb_build_array(operator_email),
      'reply_to', new.email,
      'subject', email_subject,
      'html',    email_html
    )
  );

  return new;
end;
$$;

-- ──────────────────────────────────────────────────────────────
-- Verification (run separately after this migration) :
-- ──────────────────────────────────────────────────────────────
--
-- -- 1) Both functions exist with the new sender :
-- select pg_get_functiondef(oid)
-- from pg_proc where proname in ('notify_new_inquiry', 'notify_new_access_request');
-- -- The output should contain `noreply@saw-next.ch` (not `onboarding@resend.dev`)
--
-- -- 2) Don't forget to flip OPERATOR_EMAIL back to info@saw-next.ch :
-- update vault.secrets
-- set secret = 'info@saw-next.ch'
-- where name = 'OPERATOR_EMAIL';
--
-- -- 3) Smoke test : submit the access form on sawnext.netlify.app
-- --    → check Resend Dashboard → Logs → status should be Delivered
-- --    → check info@saw-next.ch inbox → email should be there
