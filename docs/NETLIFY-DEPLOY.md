# Netlify deploy — vitrine launch checklist

**Goal :** ship the public-facing site (landing + catalogue read-only +
access request form) to `saw-next.ch` via Netlify. Members + admin
remain hidden behind `VITE_LAUNCH_MODE=vitrine`. Operator gets every
"Demander un accès" submission by email at `info@saw-next.ch`.

Estimated total time : **30-45 min** if Supabase + Netlify accounts
already exist. Add 15 min for first-time Sanity setup.

---

## What the visitor sees in vitrine mode

✅ Public landing (S01-S09 with 5-persona team section)
✅ Public catalogue browse (Properties, Timepieces, Artworks, Events, Journeys, Concierge — read-only)
✅ "Demander un accès" CTAs everywhere → access_requests table + Resend email to `info@saw-next.ch`
❌ "Espace privé" CTAs hidden (Hero, IndexOverlay, TerminalBar)
❌ "J'ai un code" button hidden in the Access section
❌ /account/* + /admin/* routes guarded (visitors auto-redirect)

When you're ready to onboard your first invitee, flip
`VITE_LAUNCH_MODE=full` in Netlify env + redeploy → the member CTAs
come back, the "j'ai un code" mode reappears, the invitation flow lights up.

---

## Step 1 — Supabase project (10 min)

Same as `DEMO-CHECKLIST.md` Step 1. Quick summary :

1. Create project on supabase.com (region : **Frankfurt**, EU GDPR)
2. Grab from Project Settings → API :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
3. **Apply migrations IN ORDER** via SQL Editor :
   - `0001_initial_schema.sql`
   - `0002_fix_rls_recursion.sql`
   - `0003_grant_table_access.sql`
   - `0004_resend_inquiry_notification.sql`
   - `0005_share_codes.sql`
   - `0006_share_codes_6chars.sql`
   - `0007_dashboard_stats.sql`
   - `0008_redeem_invitation_rpc.sql`
   - `0009_profile_phone.sql`
   - **`0010_security_hardening.sql`** (anti-enum + anti-escalation + escape_html + Vault operator email)
   - `0011_saved_items.sql`
   - **`0012_access_requests.sql`** (CRITICAL for vitrine — captures the access form leads)

4. Supabase Dashboard → Authentication → URL Configuration :
   - Site URL : `https://saw-next.ch` (or your Netlify URL until DNS cuts over)
   - Redirect URLs : `https://saw-next.ch/**`

---

## Step 2 — Vault secrets (5 min)

In Supabase Dashboard → Vault, add two secrets :

| Name | Value | Why |
|---|---|---|
| `RESEND_API_KEY` | `re_xxx…` from resend.com/api-keys | Lets the Postgres trigger fire the operator email |
| `OPERATOR_EMAIL` | `info@saw-next.ch` | Replaces the hardcoded `mitamburini@gmail.com` fallback in migration 0010 |

Both notify triggers (`notify_new_inquiry` from 0010, `notify_new_access_request` from 0012) read these from Vault.

---

## Step 3 — Resend (5 min)

### Fast path (today, no DNS work)

Sender stays at `Sawnext Studio <onboarding@resend.dev>` (Resend sandbox).
Works immediately, no DKIM. Operator inbox receives at `info@saw-next.ch`,
Reply-To is set to the lead's email so you can answer naturally.

No action required beyond adding `RESEND_API_KEY` to Vault (Step 2).

### Branded path (post-launch polish, ~30 min)

To send from `noreply@saw-next.ch` instead :

1. Go to https://resend.com/domains → Add domain `saw-next.ch`
2. Resend gives you 3 DNS records (1× MX, 2× TXT for DKIM)
3. Open Infomaniak Manager → DNS for `saw-next.ch` → add the records
4. Wait for verification (1-30 min)
5. Edit `supabase/migrations/0010_security_hardening.sql` + `0012_access_requests.sql` — replace `'Sawnext Studio <onboarding@resend.dev>'` with `'Sawnext Studio <noreply@saw-next.ch>'`
6. Re-run the modified `create or replace function` blocks in SQL Editor (don't re-run the table DDL)

**Important :** the Resend records on Infomaniak DNS do NOT conflict with
your existing email setup. Resend signs only the outbound mail it sends.
Your inbound mail to `info@saw-next.ch` continues to flow through Infomaniak's
MX as before. Adding DKIM/SPF records is purely additive.

---

## Step 4 — Sanity (optional — 15 min)

Without Sanity, the landing falls back cleanly to i18n strings — works
visually, but the client can't edit anything. Recommended to set up
before showing the demo if you want client-editable copy.

Same as `DEMO-CHECKLIST.md` Step 2 :

1. Create project at sanity.io/manage
2. Generate Editor write token
3. Add to `.env.local` :
   ```
   VITE_SANITY_PROJECT_ID=xxxxxxxx
   VITE_SANITY_DATASET=staging
   SANITY_WRITE_TOKEN=skxxx…
   ```
4. `pnpm sanity:seed:sawnext:dry` → preview
5. `pnpm sanity:seed:sawnext` → push 5-team + landing singletons + fixtures
6. `pnpm sanity:promote` once curated → flip dataset to `production`

---

## Step 5 — Netlify deploy (10 min)

### 5.1 Connect the repo

1. https://app.netlify.com → Add new site → Import from Git
2. Pick the GitHub repo, branch `main`
3. Build settings (auto-detected from `netlify.toml`) :
   - Build command : `pnpm build`
   - Publish directory : `dist`
   - Node version : 22 (set via `engines.node` in `package.json`)

### 5.2 Set environment variables

Netlify → Site settings → Environment variables → Add :

```
# Identity
VITE_APP_NAME=Sawnext Studio
VITE_APP_URL=https://saw-next.ch
VITE_DEFAULT_LOCALE=fr

# Launch mode — KEY FOR VITRINE
VITE_LAUNCH_MODE=vitrine

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Sanity (optional — fallback to i18n if missing)
VITE_SANITY_PROJECT_ID=xxxxxxxx
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-06-01

# Optional
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_CLOUDINARY_CLOUD_NAME=your_cloud
```

⚠️ **Never** add `SUPABASE_SERVICE_ROLE_KEY`, `SANITY_WRITE_TOKEN`, or
`RESEND_API_KEY` to Netlify env — those are backend-only secrets. The
Postgres trigger reads `RESEND_API_KEY` from Supabase Vault, not from
your frontend env.

### 5.3 Trigger deploy

Click "Deploy site". First build takes ~2 min. Open the Netlify preview URL.

### 5.4 Custom domain — saw-next.ch

1. Netlify → Domain settings → Add custom domain → `saw-next.ch`
2. Netlify gives you DNS targets (typically 4× A records or 1× CNAME)
3. Infomaniak DNS for `saw-next.ch` → add the records Netlify gave you
4. Wait for propagation (5 min – 24 h depending on TTL)
5. Netlify auto-provisions HTTPS via Let's Encrypt once DNS resolves

**Coexistence with Infomaniak mail :** the A/CNAME records you add for
Netlify target the apex/www subdomain, NOT the MX records. Your mail
flow at `info@saw-next.ch` stays untouched.

### 5.5 Auth redirect

Back in Supabase Dashboard → Authentication → URL Configuration :
- Replace the Netlify preview URL with the real `https://saw-next.ch`

---

## Step 6 — Smoke test (5 min)

From an incognito browser pointed at `https://saw-next.ch` :

1. [ ] Landing renders with 5 personas at `#s09`
2. [ ] Hero CTA "Demander un accès" opens the modal — **no** "Espace privé" CTA visible
3. [ ] IndexOverlay (open via the INDEX button top-right) shows ONLY "Demander un accès" — secondary slot hidden
4. [ ] TerminalBar (bottom of landing) shows "Appeler" + "Demander" — **no** "Espace" button
5. [ ] Access section (S08) ends with ONLY the white "Demander un accès" pill — the "j'ai un code" outline button is hidden
6. [ ] Fill the 3-step access request wizard → submit → success toast
7. [ ] Check Supabase Table Editor → `access_requests` → new row with status `new`
8. [ ] Check `info@saw-next.ch` inbox → Resend delivered the lead email (Reply-To = the lead's address)
9. [ ] Try to navigate manually to `/fr/account` or `/fr/admin` → redirects (Hover/RequireAuth guards)
10. [ ] Catalogue browse (`/fr/proprietes`, `/fr/montres`…) works — read-only

---

## Going from vitrine → full launch later

When you're ready to invite your first member :

1. Netlify env → change `VITE_LAUNCH_MODE` from `vitrine` to `full`
2. Trigger a redeploy (Netlify → Deploys → Trigger deploy → Deploy site)
3. The "Espace privé" CTAs + "j'ai un code" mode reappear
4. In `/admin/invitations`, generate a `SAW-XXXX-XXXX` code
5. Email the code to your invitee
6. They enter it on the landing → magic-link arrives → onboarding → `/account`

That's it. No code change required.

---

## Common gotchas

### Build fails with "VITE_APP_URL is required for production builds"
You didn't set `VITE_APP_URL` in Netlify env. Add it (Step 5.2).

### Magic links redirect to localhost
Supabase auth redirect URL still points at preview. Fix in Step 5.5.

### "permission denied for relation access_requests"
You skipped migration 0012. Apply it.

### No email arrives in info@saw-next.ch
Two checks :
1. `RESEND_API_KEY` set in Supabase **Vault** (not Netlify env)?
2. Resend dashboard → Logs → see the send attempt? If "Bounced — domain not verified", you're using the sandbox sender — make sure your operator inbox accepts mail from `onboarding@resend.dev`, OR follow the branded path (Step 3 branded)

### "Function does not exist : verify_invitation_code"
Migration 0010 not applied — apply it.

---

## Cross-refs

- [`SHIP-AUDIT.md`](SHIP-AUDIT.md) — current honest state of the platform
- [`DEMO-CHECKLIST.md`](DEMO-CHECKLIST.md) — full demo path (post-vitrine)
- `supabase/migrations/00**.sql` — owner-applied SQL
- `src/config/env.ts` — env variable schema + `isVitrineMode` helper
