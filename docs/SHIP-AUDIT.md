# Ship audit — Sawnext production readiness

Last refreshed **2026-05-27 14:21 Europe/Zurich** — after the
Phase 1 security audit + v0.2.0 release + team personas rework
+ Sanity team wiring.

This document is the **honest** state of the platform : what works
today, what's been written but not yet applied, what's deferred.
Pair it with [`DEMO-CHECKLIST.md`](DEMO-CHECKLIST.md) which is the
paste-ready action list for the owner.

---

## Verdict snapshot

| Axis | State | Blocking client demo ? |
|---|---|---|
| Landing + UX publique | ✅ Live (5-persona Interlocutor S09) | no |
| Public identity locked down (no Salvatore exposure) | ✅ Live | no |
| Supabase auth (login / magic-link / invitation code) | ✅ Live (with migrations applied) | **YES until 0008+0009+0010 push** |
| Single-use invitation code (atomic redemption) | ✅ RPC live | needs 0008 push |
| Admin invitations / inquiries / users / dashboard | ✅ Live | needs Supabase env |
| Onboarding validates code + writes profile | ✅ Live | needs 0008+0009 push |
| AccountDashboard + Inquiries read from DB | ✅ Live | needs Supabase env |
| AccountSaved (wishlist) | ⚠️ localStorage only | deferred — Phase C in flight |
| Sanity Studio + landing copy mirror | ✅ Code-side, needs creds | optional (i18n fallback works) |
| Sanity teamMember docs → Interlocutor section | ✅ Wired with i18n fallback | optional |
| Resend transactional email on inquiry insert | ⚠️ Trigger present, needs Vault `RESEND_API_KEY` | no — flow works, just no email |
| OPERATOR_EMAIL secret | ⚠️ Fallback to mitamburini@gmail.com hardcoded | optional |
| Security hardening (0010) | ✅ Written | **YES — anti-enum + anti-escalation gates** |
| Sentry observability | ✅ Opt-in via env | optional |
| E2E coverage (auth + admin) | ✅ 5 specs | no |
| Migrations 0008 + 0009 + 0010 to apply | ⛔ Not pushed | **YES for prod** |

---

## What ships TODAY locally without further action

Boot `pnpm dev` with no `.env.local` and the following work in **fully
mocked / fallback** mode :

- Public landing S00-S09 (Sanity falls back to i18n strings)
- All 6 catalogue modules (Events/Properties/Timepieces/Artworks/
  Journeys/Concierge) with localStorage-backed CRUD via adminStore
- Login screen (UI), Onboarding flow (UI), AccessRequestModal wizard
- /share/:code OTP-protected preview
- /exemple landing
- Account dashboard / inquiries / saved (localStorage)
- Admin dashboard / invitations / inquiries / users / catalogue
- Full design system playground at /playground
- Full lab sandbox at /lab

What requires real Supabase env to be functional :
- Actual auth (login, magic-link, code redemption)
- Actual DB-backed inquiry + admin tables (today reads mocks)
- Actual email notification to operator

---

## What requires OWNER ACTION before going live

See [`DEMO-CHECKLIST.md`](DEMO-CHECKLIST.md) for the paste-ready
commands. Summary :

### 1. Apply 3 migrations to Supabase (5 min — owner runs SQL)

```
0008_redeem_invitation_rpc.sql   atomic single-use redemption
0009_profile_phone.sql           add profiles.phone column
0010_security_hardening.sql      anti-enum + anti-escalation + escape_html
                                  (closes P0/P1 findings from AUDIT-SECURITY.md)
```

### 2. Configure Sanity (15 min — owner + Claude seeder)

- Owner : create Sanity project at sanity.io/manage → grab
  `projectId`, generate Editor write token
- Set `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET=staging`,
  `SANITY_WRITE_TOKEN` in `.env.local`
- Run `pnpm sanity:seed:sawnext:dry` → preview
- Run `pnpm sanity:seed:sawnext` → push 5-team + singletons + fixtures
- Run `pnpm sanity:promote` once content is curated

Without this : landing falls back cleanly to i18n strings. Works
visually, but the client can't edit team names/copy/sections.

### 3. Resend Vault secret (5 min — owner)

In Supabase Dashboard → Vault → add :
- `RESEND_API_KEY` (required for emails to actually send)
- `OPERATOR_EMAIL` (optional — falls back to hardcoded value)

### 4. Hosting (Vercel or Netlify)

Both `vercel.json` and `netlify.toml` exist with matching CSP + redirects.
Pick one. Set the `VITE_*` env vars in the deploy dashboard (mirror
of `.env.local`).

### 5. First admin + first invitation code

In Supabase Dashboard → SQL Editor :
```sql
update profiles set role = 'admin' where email = '<your-admin-email>';
```
Then sign in as admin → `/admin/invitations` → generate the first code.

---

## What's DELIBERATELY deferred (documented, not hidden)

### AccountSaved → Supabase saved_items

**Phase C in this branch.** Today : localStorage per device. The
migration script + new hook + consumer refactor lands in commit 3/N
of `feat/demo-readiness`.

### E2E for AccessRequestModal wizard + LoginModal mode rows

Tried in 2026-05-14 Phase 7 — flaky because the cinematic Loader is
hard to drive deterministically. Right fix : `VITE_SKIP_LOADER` test
mode + dedicated specs against test fixture. ~2 h estimated. Not
shipped — auth-flows.spec.ts is the reliable layer.

### Sentry session replay

Disabled (`replaysSessionSampleRate: 0`). Add when the team wants
actual user sessions on errors. Cost : Sentry plan quota.

### Manifesto + Hero typewriter copy in Sanity

Structural content (typewriter mix-blend-mode highlight, per-phrase
Manifesto indentation). Stays in i18n by design — see
`decisions/2026-05-14-sanity-landing-singleton.md`.

### Supabase content gate in CI

`pnpm validate:sanity-content:required` enforces zero empty locale
fields, but only runs when credentials are present. Wire post-seed.

---

## Migration audit — supabase/migrations/

```
0001_initial_schema.sql              profiles, invitation_codes, inquiries + RLS
0002_fix_rls_recursion.sql           drop recursive admin policies
0003_grant_table_access.sql          fix GRANT after "expose new tables" off
0004_resend_inquiry_notification.sql pg_net trigger → Resend on new inquiry
0005_share_codes.sql                 share_codes table for /share/:code
0006_share_codes_6chars.sql          code length tweak
0007_dashboard_stats.sql             materialized views for admin counters
0008_redeem_invitation_rpc.sql       atomic single-use redemption RPC
0009_profile_phone.sql               add profiles.phone column
0010_security_hardening.sql          anti-enum + role pin + HTML escape + Vault op email
                                       ↑ APPLY BEFORE CLIENT DEMO ↑
```

If `saved_items` Supabase migration (Phase C) lands this session :

```
0011_saved_items.sql                 wishlist cross-device persistence
```

---

## Final pre-demo checklist (tick before flipping the demo switch)

- [ ] Apply migrations 0008 + 0009 + 0010 (and 0011 if shipped)
- [ ] `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in deploy env
- [ ] `VITE_SANITY_PROJECT_ID` + `VITE_SANITY_DATASET` in deploy env
- [ ] `pnpm sanity:seed:sawnext` ran against the production dataset
- [ ] `RESEND_API_KEY` in Supabase Vault
- [ ] (optional) `OPERATOR_EMAIL` in Supabase Vault
- [ ] (optional) `VITE_SENTRY_DSN` in deploy env
- [ ] Promote first admin profile via SQL UPDATE
- [ ] Generate first invitation code via `/admin/invitations`
- [ ] Smoke test from incognito :
  - [ ] Public landing renders 5 personas at #s09
  - [ ] "Demander un accès" wizard submits + toast success
  - [ ] "Espace privé" → code redemption → magic link → onboarding → /account
  - [ ] `/admin/invitations` shows code with status='redeemed', redeemed_at populated
  - [ ] Re-entering the same code on the landing → "Code introuvable ou déjà utilisé"
- [ ] `pnpm test` passes (currently 457/457)
- [ ] `pnpm validate:gates` passes (~20s)
- [ ] No "Salvatore" mentions found by `grep -rn "Salvatore" src/ studio/`

---

## Cross-refs

- [`DEMO-CHECKLIST.md`](DEMO-CHECKLIST.md) — paste-ready owner actions
- [`AUDIT-SECURITY.md`](AUDIT-SECURITY.md) — Phase 1 findings + remediation
- [`SANITY-HANDOFF.md`](SANITY-HANDOFF.md) — Sanity onboarding steps
- `.claude/memory/decisions/2026-05-14-atomic-redemption-rpc.md` — 0008 design
- `.claude/memory/sessions/2026-05-27-1230.md` — security audit + v0.2.0 release
- `supabase/migrations/0010_security_hardening.sql` — owner action SQL
