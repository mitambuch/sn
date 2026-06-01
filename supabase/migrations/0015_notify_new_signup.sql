-- ═══════════════════════════════════════════════════════════════
-- 0015_notify_new_signup — email Salva when a new member signs up.
--
-- WHY: client request 2026-06-01 — Salva veut être notifié quand
-- quelqu'un s'inscrit (crée son compte avec son code d'invitation), en
-- plus des demandes d'accès (notify_new_access_request, migration 0014).
-- Until now the signup path (handle_new_user → profiles insert, from
-- migration 0001) created the profile silently — no operator email.
--
-- WHAT: a new trigger function notify_new_signup() fires AFTER INSERT on
-- public.profiles (which is populated by handle_new_user right after the
-- auth.users row is created). Same Resend + Vault + escape_html pattern
-- as the other notify_* functions; same branded sender and both
-- recipients (salva@ + info@saw-next.ch) as migration 0014.
--
-- The Resend POST is wrapped in an exception guard: a notification
-- failure must NEVER roll back the signup transaction (a member locked
-- out because an email hiccuped is unacceptable). The other notify_*
-- triggers run on non-critical inserts, so they don't carry this guard.
--
-- ⚠️ PRECONDITION (same as 0014): saw-next.ch must be verified on Resend,
-- otherwise the send is rejected. See 0014 header for the DNS steps.
-- ═══════════════════════════════════════════════════════════════

create or replace function public.notify_new_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resend_key     text;
  email_subject  text;
  email_html     text;
begin
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  if resend_key is null then
    raise warning 'RESEND_API_KEY not in Vault — skipping signup email';
    return new;
  end if;

  email_subject := '[Sawnext] Nouveau membre — ' ||
    public.escape_html(coalesce(new.full_name, new.email));

  email_html := format(
    '<p><strong>Nouveau membre inscrit</strong></p>'
    || '<p>Nom : %s</p>'
    || '<p>Email : <a href="mailto:%s">%s</a></p>'
    || '<p>Rôle : %s · Langue : %s</p>'
    || '<p style="color:#888;font-size:12px">User id : %s · Inscrit à %s</p>',
    public.escape_html(coalesce(new.full_name, '—')),
    public.escape_html(coalesce(new.email, '')),
    public.escape_html(coalesce(new.email, '—')),
    public.escape_html(new.role::text),
    public.escape_html(new.locale::text),
    new.id::text,
    new.created_at::text
  );

  -- Never let an email failure block account creation.
  begin
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || resend_key,
        'Content-Type',  'application/json'
      ),
      body := jsonb_build_object(
        'from',    'Sawnext Studio <noreply@saw-next.ch>',
        'to',      jsonb_build_array('salva@saw-next.ch', 'info@saw-next.ch'),
        'subject', email_subject,
        'html',    email_html
      )
    );
  exception
    when others then
      raise warning 'notify_new_signup: email POST failed (%), signup continues', sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists profile_notify_signup on public.profiles;
create trigger profile_notify_signup
  after insert on public.profiles
  for each row execute function public.notify_new_signup();

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
--
-- -- 1) Trigger present :
-- select tgname from pg_trigger where tgrelid = 'public.profiles'::regclass
--   and tgname = 'profile_notify_signup';  -- expect 1 row
--
-- -- 2) Smoke test : redeem an invitation code → complete onboarding
-- --    → Resend Dashboard → Logs → status "Delivered"
-- --    → salva@ and info@ receive "[Sawnext] Nouveau membre — …"
