-- ═══════════════════════════════════════════════════════════════
-- Notify Salvatore on new inquiry via Resend
--
-- Pattern: trigger after INSERT on public.inquiries fires a Postgres
-- function that uses pg_net (HTTP client extension shipped by
-- Supabase) to POST to api.resend.com/emails.
--
-- The Resend API key is read from Supabase Vault — never appears in
-- client code, never in env vars. Set the secret BEFORE running this
-- migration:
--   Dashboard → Settings → Vault → Add new secret
--     Name  : RESEND_API_KEY
--     Value : re_... (your key)
--
-- The operator email is hardcoded for MVP. When sawnext.studio is
-- bought + DNS verified in Resend, swap to salvatore@sawnext.studio.
--
-- To apply: paste into Supabase SQL Editor → Run.
-- ═══════════════════════════════════════════════════════════════

-- pg_net is preinstalled on Supabase but enable defensively.
create extension if not exists pg_net with schema extensions;

-- Trigger function.
create or replace function public.notify_new_inquiry()
returns trigger
language plpgsql
security definer
as $$
declare
  resend_key       text;
  client_email     text;
  client_name      text;
  operator_email   constant text := 'mitamburini@gmail.com';  -- MVP: owner's inbox
  email_subject    text;
  email_html       text;
  source_label     text;
begin
  -- Read the Resend key from Vault (never leaves the DB).
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  if resend_key is null then
    raise warning 'RESEND_API_KEY not in Vault — skipping email notification';
    return new;
  end if;

  -- Resolve the client info from the joined profile row.
  select email, full_name into client_email, client_name
  from public.profiles
  where id = new.user_id
  limit 1;

  -- Human-readable source label.
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

  email_html := format(
    '<p><strong>Nouvelle demande client</strong></p>'
    || '<p>De : %s &lt;%s&gt;</p>'
    || '<p>Catégorie : %s</p>'
    || '<p>Référence interne : %s</p>'
    || '<p>Message :</p><blockquote>%s</blockquote>'
    || '<p style="color:#888;font-size:12px">Inquiry id : %s · Créée à %s</p>',
    coalesce(client_name, '—'),
    coalesce(client_email, '—'),
    source_label,
    coalesce(new.target_id, '—'),
    coalesce(replace(new.message, chr(10), '<br>'), '<em>(pas de message)</em>'),
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

-- Trigger.
drop trigger if exists inquiry_notify_resend on public.inquiries;
create trigger inquiry_notify_resend
  after insert on public.inquiries
  for each row execute function public.notify_new_inquiry();
