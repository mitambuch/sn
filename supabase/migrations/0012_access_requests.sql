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
