-- ═══════════════════════════════════════════════════════════════
-- 0021_notify_access_accepted — accept an access request → issue a
-- single-use invitation code AND email it to the requester.
--
-- WHY: client request 2026-06-03 — when Salva moves an access request to
-- "accepted" in /admin/access-requests, the person should receive an email
-- confirming acceptance WITH a ready-to-use invitation code so they can
-- create their account. Declines stay silent (operator decision, owner
-- confirmed: no rejection email — discretion for HNW positioning).
--
-- WHAT: a trigger on public.access_requests that fires only on the TRANSITION
-- into 'accepted'. It (1) generates a unique 8-char code matching the
-- invitation_codes format, (2) inserts it (status 'unused', 90-day TTL,
-- owned by the accepting admin), (3) emails the requester via Resend + Vault
-- (same pattern as notify_new_signup, migration 0015). The email POST is
-- guarded so a mail hiccup never rolls back the acceptance; the code still
-- exists and Salva can resend it from the Invitations page.
--
-- ⚠️ PRECONDITION: saw-next.ch verified on Resend (done) + RESEND_API_KEY in
-- Vault. Same as 0014/0015.
-- ═══════════════════════════════════════════════════════════════

create or replace function public.notify_access_accepted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resend_key     text;
  v_creator      uuid;
  v_code         text;
  v_attempt      int := 0;
  -- Unambiguous alphabet (no O/0/I/1/L) — matches invitation_codes_format.
  v_alphabet     text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  email_subject  text;
  email_html     text;
begin
  -- Only on the transition INTO 'accepted' (not every update, not re-saves).
  if new.status <> 'accepted' or old.status = 'accepted' then
    return new;
  end if;

  -- The code must be owned by a profile (created_by NOT NULL). Normally the
  -- admin who clicked accept (auth.uid()); fall back to any admin when the
  -- status is changed outside an authenticated request (e.g. SQL editor).
  v_creator := coalesce(
    auth.uid(),
    (select id from public.profiles where role = 'admin' order by created_at limit 1)
  );
  if v_creator is null then
    raise warning 'notify_access_accepted: no admin profile to own the code — skipping';
    return new;
  end if;

  -- Generate a unique 8-char code, retrying on the (astronomically rare) clash.
  loop
    v_attempt := v_attempt + 1;
    v_code := '';
    for i in 1..8 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    begin
      insert into public.invitation_codes (code, status, expires_at, created_by)
      values (v_code, 'unused', now() + interval '90 days', v_creator);
      exit; -- inserted OK → leave the loop
    exception
      when unique_violation then
        if v_attempt >= 5 then
          raise warning 'notify_access_accepted: could not mint a unique code after 5 tries';
          return new;
        end if;
    end;
  end loop;

  -- Resend API key from Vault. If absent, the code is created but no email.
  select decrypted_secret into resend_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  if resend_key is null then
    raise warning 'RESEND_API_KEY not in Vault — code % created, acceptance email skipped', v_code;
    return new;
  end if;

  email_subject := 'Sawnext — votre accès est confirmé';

  email_html := format(
    '<p>Bonjour %s,</p>'
    || '<p>Votre demande d''accès à Sawnext a été acceptée.</p>'
    || '<p>Voici votre code d''accès personnel, à usage unique :</p>'
    || '<p style="font-family:monospace;font-size:22px;letter-spacing:4px;'
    || 'font-weight:600;margin:16px 0">%s</p>'
    || '<p>Rendez-vous sur <a href="https://sawnext.ch">sawnext.ch</a>, '
    || 'espace privé, et saisissez ce code pour créer votre compte. '
    || 'Le code est valable 90 jours.</p>'
    || '<p style="color:#888;font-size:12px">Si vous n''êtes pas à l''origine '
    || 'de cette demande, ignorez ce message.</p>',
    public.escape_html(coalesce(new.first_name, '')),
    v_code
  );

  -- Never let an email failure roll back the acceptance.
  begin
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || resend_key,
        'Content-Type',  'application/json'
      ),
      body := jsonb_build_object(
        'from',    'Sawnext Studio <noreply@saw-next.ch>',
        'to',      jsonb_build_array(new.email),
        'subject', email_subject,
        'html',    email_html
      )
    );
  exception
    when others then
      raise warning 'notify_access_accepted: email POST failed (%), accept continues', sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists access_request_accepted on public.access_requests;
create trigger access_request_accepted
  after update of status on public.access_requests
  for each row execute function public.notify_access_accepted();

-- ──────────────────────────────────────────────────────────────
-- Verification (run after applying) :
-- ──────────────────────────────────────────────────────────────
-- -- 1) Trigger present :
-- select tgname from pg_trigger where tgrelid = 'public.access_requests'::regclass
--   and tgname = 'access_request_accepted';  -- expect 1 row
--
-- -- 2) Smoke : in /admin/access-requests move a request to "Accepté" →
-- --    a new row appears in invitation_codes (status unused) AND the
-- --    requester receives "Sawnext — votre accès est confirmé" with the code.
