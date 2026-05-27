# Security Audit — Phase 1

**Date** : 2026-05-27
**Scope** : Sawnext Studio @ main `d1535ee` (post Lot A.5/A.6, Supabase live)
**Auditor** : Claude Opus 4.7 (1M context) acting as security reviewer
**Method** : migration-by-migration RLS read · grep of XSS/eval surface ·
deploy headers diff · `pnpm audit` · client call-site mapping ·
memory consultation (#security #rls #supabase #auth)

> Goal of this audit : surface findings that would matter on a **HNW
> private platform** before next batch of features. Findings are graded
> P0 (critical, ship-blocker) / P1 (must fix this milestone) / P2
> (track, fix opportunistically).

---

## Summary

| Severity | Finding | Status |
|---|---|---|
| 🔴 P0 | Invitation code enumeration via anon SELECT | Fix in `0010_security_hardening.sql` |
| 🔴 P0 | Role self-escalation via profile UPDATE | Fix in `0010_security_hardening.sql` |
| 🟡 P1 | XSS-in-email via unescaped HTML in `notify_new_inquiry` | Fix in `0010_security_hardening.sql` |
| 🟡 P1 | 11 dependency vulnerabilities (transitive, dev tooling) | Backlog (Phase 5) |
| 🟡 P2 | Operator email hardcoded in DB function | Fix in `0010_security_hardening.sql` |
| 🟡 P2 | netlify.toml CSP drift vs vercel.json | Aligned in this branch |
| ✓ | No `dangerouslySetInnerHTML` / `innerHTML` / `eval` in `src/` or `studio/` | Confirmed |
| ✓ | `SUPABASE_SERVICE_ROLE_KEY` never imported in client code | Confirmed |
| ✓ | `share_codes` RLS + RPC pattern is exemplary | Use as reference |
| ✓ | Headers strong : DENY + HSTS preload + Permissions-Policy locked + CSP strict | Confirmed |
| ✓ | Env separation VITE_* (public) vs backend rigorous | Confirmed |
| ✓ | Atomic invitation redemption RPC with `FOR UPDATE` lock | Confirmed |

---

## P0-1 — Invitation code enumeration

### Finding

Migration `0001_initial_schema.sql` declares :

```sql
create policy "invitation_codes: read unused for redemption"
  on public.invitation_codes for select
  using (status = 'unused');
```

Migration `0003_grant_table_access.sql` adds :

```sql
grant select on public.invitation_codes to anon;
```

Combined, **any anonymous visitor** can list the entire pool of valid
unused codes via the public Supabase REST API :

```http
GET /rest/v1/invitation_codes?status=eq.unused&select=*
apikey: <publishable anon key>
```

→ Returns every unused `SAW-XXXX-XXXX` ready to be redeemed. An attacker
can harvest all of them in one request, then `signInWithOtp` with a
chosen email + `data: { invitation_code: <harvested> }`. Sawnext's
cooptation model is broken.

The intent (per `0001` comment) was to allow probing existence of a
specific code at landing-modal time. RLS cannot enforce "must filter by
`code`" — it filters rows, not query shape.

### Risk

**Critical for a HNW co-opted platform.** Defeats the entire access-control
premise (members are vetted, codes are scarce, single-use). Loss of brand
integrity + potential GDPR exposure if harvested codes are mass-used.

### Fix (in `0010_security_hardening.sql`)

1. `revoke select on public.invitation_codes from anon;`
2. Add a `verify_invitation_code(p_code text) returns boolean` SECURITY
   DEFINER RPC. Returns `true` iff the code is unused, `false` otherwise.
   No row data leaked. Grantable to anon.
3. Update `src/context/AuthContext.tsx` `requestAccessByCode` to call
   the RPC instead of `.from('invitation_codes').select()`.

The atomic redemption RPC (`redeem_invitation_code`, migration `0008`)
remains the source of truth for state-mutating operations.

---

## P0-2 — Role self-escalation via profile UPDATE

### Finding

Migration `0001_initial_schema.sql` declares :

```sql
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id);
```

Migration `0003_grant_table_access.sql` adds :

```sql
grant select, update on public.profiles to authenticated;
```

Combined : an authenticated client can update **any column** of their
own profile row — including `role`. There is no column-level GRANT
and no `with check` predicate in the policy that pins `role`.

Reproduction (manual) :

```js
await supabase
  .from('profiles')
  .update({ role: 'admin' })
  .eq('id', user.id);
```

→ The user is now admin. Combined with the admin policies
(`is_admin(auth.uid())`), they can read every profile, manage
invitations, change other users' roles, read every inquiry.

### Risk

**Critical.** Trivial privilege escalation from `client` to `admin`.
A single non-malicious member could trigger this by accident through
a browser console copy-paste of a buggy snippet. A motivated attacker
can do it in one request.

### Fix (in `0010_security_hardening.sql`)

Column-level GRANT — narrow the updatable surface :

```sql
revoke update on public.profiles from authenticated;
grant update (full_name, phone, locale, contact_preference, avatar_url)
  on public.profiles to authenticated;
```

Plus, harden the policy with a `with check` clause that forbids changing
`role` even if a future column GRANT slips :

```sql
drop policy "profiles: self update" on public.profiles;
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );
```

Defense in depth : column GRANT + policy check. Either alone is enough,
both is robust.

### Side-effect on admin path

Admins update other profiles via `"profiles: admin update all"` policy
which uses the SECURITY DEFINER `is_admin()` helper — that policy still
applies and admins still have a separate column GRANT path if needed.
For now no admin UI writes `role` ; if a "promote to admin" feature
ships, we'll add a SECURITY DEFINER RPC `promote_to_admin(target_id)`
gated on caller `is_admin()`.

---

## P1-3 — XSS-in-email via unescaped HTML in `notify_new_inquiry`

### Finding

Migration `0004_resend_inquiry_notification.sql` builds the email body
with `format()` and string concatenation, interpolating fields that
originate from user input :

```sql
email_html := format(
  '<p>De : %s &lt;%s&gt;</p>'
  || '<p>Catégorie : %s</p>'
  || '<p>Référence interne : %s</p>'
  || '<p>Message :</p><blockquote>%s</blockquote>'
  ...,
  coalesce(client_name, '—'),      -- from profiles.full_name (user-controlled)
  coalesce(client_email, '—'),     -- from profiles.email (user-controlled)
  source_label,                     -- enum, safe
  coalesce(new.target_id, '—'),    -- user-controlled (inquiry.target_id)
  coalesce(replace(new.message, chr(10), '<br>'), '<em>...</em>'),  -- user-controlled
  ...
);
```

`profiles.full_name` is set by the `handle_new_user` trigger from
`raw_user_meta_data->>'full_name'` — fully user-controlled at signup.
`new.message` and `new.target_id` are user-controlled at inquiry creation.

Nothing escapes `<` `>` `"` `'`. A malicious authenticated user can
craft a `full_name` like `<script>fetch(...)</script>` or
`<img src=x onerror=...>` ; the email goes to Salvatore's inbox, which
likely renders HTML in Gmail / Apple Mail. **Stored XSS in operator
inbox.**

### Risk

`P1`, not `P0`, because :
- The attacker must be authenticated (i.e. already past invitation
  redemption — limited pool).
- Modern mail clients sandbox HTML and block `<script>` execution by
  default. `<img onerror>` may still fetch tracking pixels or trigger
  network requests that leak operator IP.
- The blast radius is limited to Salvatore's inbox, not the public
  platform.

Still **must fix** : on a HNW platform, leaking operator metadata to a
malicious member is a confidence killer.

### Fix (in `0010_security_hardening.sql`)

Replace the manual `format()` HTML build with a Postgres function
`escape_html(text)` that HTML-encodes the five canonical chars and a
helper `safe_email_line(label text, value text)`. Use them everywhere
user input enters the HTML body.

```sql
create or replace function public.escape_html(p text)
returns text
language sql immutable as $$
  select replace(replace(replace(replace(replace(
    coalesce(p, ''),
    '&', '&amp;'),
    '<', '&lt;'),
    '>', '&gt;'),
    '"', '&quot;'),
    '''', '&#39;')
$$;
```

Then rebuild the body with `escape_html(client_name)` etc. The
`replace(new.message, chr(10), '<br>')` line wraps `escape_html(...)`.

---

## P1-4 — 11 dependency vulnerabilities (transitive, dev tooling)

### Finding

`pnpm audit --prod` flags 5 (4 moderate + 1 high), `pnpm audit` total 11.
**All transit through `studio>sanity>@sanity/cli>...`** — the Sanity
admin tool used by Salvatore for editing, not the public client bundle.

Headline CVEs :
- `postcss <8.5.10` — XSS via unescaped `</style>` in CSS stringify
- `fast-uri <=3.1.1` — path traversal & host confusion
- `@babel/plugin-transform-modules-systemjs <=7.29.3` — arbitrary code
- `basic-ftp <=5.3.0` — client-side issue from malicious FTP server
- `tmp <0.2.6` — path traversal via unsanitized prefix/postfix
- `ws >=8.0.0 <8.20.1` — uninitialized memory disclosure
- `qs <=6.15.1` — DoS via qs.stringify
- `ip-address <=10.1.0` — XSS in Address6 HTML methods
- `brace-expansion >=5.0.0 <5.0.6` — large range defeats max
- one more

### Risk

`P1`, not `P0` :
- None affect the user-facing client bundle (verified via paths — all
  are dev/build/CLI tooling).
- Studio is used by Salvatore on his admin machine, so the attack
  surface is local-tooling, not internet-facing.
- Still : same memory entry pattern flagged on steaksoap template was
  resolved (2026-04-17) via `pnpm overrides` to force-bump.

### Fix (deferred to Phase 5)

Add `pnpm.overrides` in root `package.json` :

```jsonc
"pnpm": {
  "overrides": {
    "postcss": ">=8.5.10",
    "fast-uri": ">=3.1.2",
    "@babel/plugin-transform-modules-systemjs": ">=7.29.4",
    "tmp": ">=0.2.6",
    "ws": ">=8.20.1",
    "qs": ">=6.15.2",
    "ip-address": ">=10.1.1",
    "brace-expansion": ">=5.0.6"
  }
}
```

Then `pnpm install` + run studio dev + `pnpm validate:full` to ensure
no regression. Deferred to Phase 5 to keep this batch focused on RLS.

---

## P2-5 — Operator email hardcoded in DB function

### Finding

`notify_new_inquiry` in migration `0004` has :

```sql
operator_email constant text := 'mitamburini@gmail.com';  -- MVP: owner's inbox
```

The comment acknowledges this is MVP. Once `sawnext.studio` DNS verifies
in Resend, the recipient changes to `salvatore@sawnext.studio`.

### Risk

`P2`. Functional, not security. Putting the email in Vault eliminates a
deploy-time edit and lets the operator rotate without code change.

### Fix (in `0010_security_hardening.sql`)

```sql
-- In notify_new_inquiry :
declare
  operator_email text;
begin
  select decrypted_secret into operator_email
  from vault.decrypted_secrets
  where name = 'OPERATOR_EMAIL'
  limit 1;
  operator_email := coalesce(operator_email, 'mitamburini@gmail.com');  -- fallback
  ...
end;
```

Owner action : add `OPERATOR_EMAIL` to Supabase Vault, value =
current email. Hardcoded fallback remains until secret lands.

---

## P2-6 — netlify.toml CSP missing Sentry endpoints

### Finding

`vercel.json` `connect-src` includes Sentry ingest endpoints :

```
connect-src 'self' https://*.supabase.co wss://*.supabase.co ...
            https://*.sentry.io https://*.ingest.sentry.io
            https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io
```

`netlify.toml` does **not** :

```
connect-src 'self' https://*.supabase.co wss://*.supabase.co
            https://*.api.sanity.io https://*.apicdn.sanity.io
```

If the site is ever deployed on Netlify (or both fallbacks), Sentry
init in `src/lib/observability.ts` will be CSP-blocked, telemetry
silently lost.

### Risk

`P2`. Drift between two deploy configs, observability gap.

### Fix

Align `netlify.toml` CSP `connect-src` with `vercel.json`. Done in
this branch.

---

## Positive observations (confirmed)

✓ **No `dangerouslySetInnerHTML` / `innerHTML` / `eval` / `Function()`** in
`src/` or `studio/`. React JSX escaping is preserved across the codebase.

✓ **`SUPABASE_SERVICE_ROLE_KEY` never imported in client code.** Only
mentioned in comments in `src/config/env.ts` and `src/context/AuthContext.tsx`
explaining that it's backend-only.

✓ **Headers baseline** (both `netlify.toml` + `vercel.json`) :
- `X-Frame-Options: DENY` — clickjacking blocked
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=() microphone=() geolocation=() interest-cohort=() payment=() usb=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `CSP` with `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`,
  `base-uri 'self'`, narrow `script-src` + sha256 hash for inline,
  `img-src` allowing only Cloudinary + Sanity CDN
- `Cross-Origin-Opener-Policy: same-origin`

✓ **`share_codes` RLS + RPC pattern** (migration `0005`) is the
correct shape : zero anon SELECT, all access via SECURITY DEFINER
`consume_share_code()` that does the row-level check internally and
returns only the doc reference. **`invitation_codes` should mirror
this pattern** — that's exactly what the P0-1 fix does.

✓ **Env separation** :
- `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_URL`, `VITE_APP_URL`,
  `VITE_SENTRY_DSN`, `VITE_RESEND_FROM_EMAIL`, `VITE_CLOUDINARY_CLOUD_NAME`,
  `VITE_SANITY_PROJECT_ID/DATASET/API_VERSION` — all PUBLIC by design,
  safe to bundle.
- `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `SANITY_WRITE_TOKEN` —
  all NO `VITE_` prefix, all backend-only.
- `.env.example` documents the rationale per line. ✓

✓ **Atomic invitation redemption RPC** (`redeem_invitation_code`,
migration `0008`) does the right thing :
- `SECURITY DEFINER` + `set search_path = public`
- `FOR UPDATE` lock on the candidate row before status check
- Normalizes input (strip `SAW-`, dashes, whitespace, upper)
- Validates format with regex
- Returns json envelope with 4 explicit error categories
- `grant execute to authenticated` / `revoke from anon, public`

✓ **`pg_net` Resend trigger** reads API key from Vault (`vault.decrypted_secrets`)
— never in env, never in code. The trigger gracefully degrades if the
secret is missing (raises a warning, returns NEW, doesn't block insert).

---

## Owner action checklist (after this branch lands)

1. **Apply migration `0010_security_hardening.sql`** in Supabase
   Dashboard → SQL Editor → New query → paste → Run.
   - It is idempotent (CREATE OR REPLACE) but does `revoke` + `drop policy` :
     check the output for clean exit before testing the app.
2. **Add Vault secret `OPERATOR_EMAIL`** (optional, P2) :
   Dashboard → Settings → Vault → Add new secret → name = `OPERATOR_EMAIL`,
   value = current `mitamburini@gmail.com` (or future `salvatore@sawnext.studio`).
3. **Test live** :
   - Submit an inquiry as a client → email arrives to OPERATOR_EMAIL
     with all user-controlled fields safely HTML-escaped
     (try setting `full_name` to `<script>alert(1)</script>` via SQL,
     then submit inquiry, then revert).
   - Try `await supabase.from('profiles').update({role:'admin'}).eq('id',user.id)`
     from browser DevTools as a `client` user → must return 403
     `permission denied for table profiles`.
   - Try `GET /rest/v1/invitation_codes?status=eq.unused` with anon key →
     must return 403.
   - Generate a new invitation code via admin UI → redeem it → must
     still work end-to-end.

## What this audit did NOT cover (deferred)

- **E2E test for the security invariants** (phase 2 — add `e2e/security.spec.ts`).
- **`pnpm overrides`** for the 11 transitive vulns (Phase 5).
- **A11y/WCAG contrast** (Phase 3).
- **Performance & bundle audit** (Phase 4).
- **Sanity Studio access control** — Studio runs without Supabase auth,
  relies on Sanity's own auth (`@sanity/cli` login). Trust boundary
  unchanged from upstream Sanity defaults. Owner to enforce 2FA on
  Sanity account.
- **Resend deliverability / SPF / DKIM** — operational, not code.

## Cross-refs

- Memory : `decisions/2026-04-16-external-audit-triage.md` (template
  audit pattern this audit mirrors)
- Memory : `decisions/2026-05-14-atomic-redemption-rpc.md` (the RPC
  that proves the team knows the right pattern — applied here to
  `invitation_codes`)
- Memory : `frictions/2026-05-11-supabase-expose-new-tables-toggle.md`
  (the GRANT-related friction that this audit re-confirms is durable)
- Migration : `supabase/migrations/0010_security_hardening.sql`
