# Demo checklist — owner action list

**Goal :** get the platform fully functional end-to-end so you can
show it to your client. Each section is paste-ready : copy the commands
into your terminal / Supabase Dashboard / Vercel UI.

Estimated total time : **45-60 min** if Sanity and Supabase accounts
already exist. **90 min** if accounts need to be created.

---

## Prerequisites

- [ ] Supabase account at https://supabase.com (free tier OK for demo)
- [ ] Sanity account at https://sanity.io/manage (free tier OK)
- [ ] Resend account at https://resend.com (free tier = 100 emails/day)
- [ ] (Optional) Sentry account at https://sentry.io
- [ ] Vercel or Netlify account for hosting
- [ ] Local `.env.local` file (copy from `.env.example`)

---

## Step 1 — Supabase project setup (10 min)

### 1.1 Create the project

1. Open https://supabase.com/dashboard → New project
2. Region : **Frankfurt** (closest to Swiss clients, EU GDPR)
3. Name : `sawnext-prod` (or your convention)
4. Generate a strong DB password — store in 1Password
5. Wait ~2 min for the project to provision

### 1.2 Grab credentials

In Project Settings → API :
- `Project URL` → goes into `VITE_SUPABASE_URL`
- `anon` `public` key → goes into `VITE_SUPABASE_ANON_KEY`
- `service_role` `secret` key → goes into `SUPABASE_SERVICE_ROLE_KEY`
  (backend only — never bundle)

Paste these into `.env.local` :

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 1.3 Apply all 10 migrations

Option A — Supabase Dashboard (recommended for first time) :

1. Open SQL Editor → New query
2. Paste the content of each migration **in order** :
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_fix_rls_recursion.sql`
   - `supabase/migrations/0003_grant_table_access.sql`
   - `supabase/migrations/0004_resend_inquiry_notification.sql`
   - `supabase/migrations/0005_share_codes.sql`
   - `supabase/migrations/0006_share_codes_6chars.sql`
   - `supabase/migrations/0007_dashboard_stats.sql`
   - `supabase/migrations/0008_redeem_invitation_rpc.sql`
   - `supabase/migrations/0009_profile_phone.sql`
   - **`supabase/migrations/0010_security_hardening.sql`** (CRITICAL — closes anti-enum + role escalation + XSS)
   - `supabase/migrations/0011_saved_items.sql` (cross-device wishlist — AccountSaved persistence)
   - `supabase/migrations/0012_access_requests.sql` (anonymous access request leads + operator email)
3. Run each one. They are idempotent — safe to re-run if you got an error mid-way.

Option B — Supabase CLI :

```bash
# Install (one-time)
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Push all migrations
supabase db push
```

### 1.4 Verify security hardening

In SQL Editor, run the verification queries from the bottom of
`0010_security_hardening.sql` :

```sql
-- 1) anon SELECT must fail :
set role anon;
select * from public.invitation_codes;  -- expect: permission denied
reset role;

-- 2) verify RPC works for both anon and authenticated :
set role anon;
select public.verify_invitation_code('SAW-INEXISTANT');  -- expect: false
reset role;
```

If both pass : security gates are live.

### 1.5 Resend Vault secrets

In Supabase Dashboard → Vault :

1. Create a Resend account at https://resend.com if you don't have one
2. Generate an API key in Resend Dashboard → API Keys
3. Verify your sender domain (or use `onboarding@resend.dev` for the demo)
4. Back in Supabase Vault → Add secret :
   - Name : `RESEND_API_KEY`
   - Value : `re_xxxxxxxx`
5. (Optional) Add secret :
   - Name : `OPERATOR_EMAIL`
   - Value : `info@saw-next.ch` (otherwise falls back to `mitamburini@gmail.com` hardcoded in migration)

---

## Step 2 — Sanity CMS setup (10 min)

### 2.1 Create the project

1. Open https://sanity.io/manage → Create new project
2. Name : `sawnext`
3. Dataset : let it create `production` AND `staging` (the seed pushes
   to staging by default, you promote when ready)

### 2.2 Generate write token

In Project Settings → API → Tokens → Add token :
- Name : `seed-and-cli`
- Permissions : `Editor`
- Copy the token immediately (Sanity shows it only once)

### 2.3 Update `.env.local`

```bash
VITE_SANITY_PROJECT_ID=xxxxxxxx
VITE_SANITY_DATASET=staging
VITE_SANITY_API_VERSION=2024-06-01
SANITY_WRITE_TOKEN=skxxxxxxx
```

### 2.4 Push the seed (singletons + pages + 5 team members + catalogue fixtures)

```bash
# Dry-run first to see what will be created
pnpm sanity:seed:sawnext:dry

# Push to staging
pnpm sanity:seed:sawnext

# Open the Studio locally to review
pnpm studio:dev
# → http://localhost:3333
```

You should see :
- 1 `siteConfig` singleton
- 1 `landing` singleton
- 3 pages (home / about / access)
- 1 doc per catalogue type (event/property/timepiece/artwork/journey/conciergeService/article)
- **5 team members** (Valmont focal + Harvy/Lucian/Tavio/Sergio network)

### 2.5 Promote to production

Once the staging dataset is curated to your liking :

```bash
# Promotes staging → production via Sanity's API
pnpm sanity:promote
```

Then update your deploy env to point at `production` :

```bash
VITE_SANITY_DATASET=production
```

---

## Step 3 — First admin + first invitation code (5 min)

### 3.1 Sign yourself up

1. Run `pnpm dev` locally with `.env.local` filled out
2. Open http://localhost:5173 → "Espace privé" → enter any email
3. Click the magic link from the inbox → you land on `/account`
4. You're now a `client` in the `profiles` table

### 3.2 Promote yourself to admin

In Supabase Dashboard → SQL Editor :

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

Sign out and sign back in. You should now see `/admin/*` routes.

### 3.3 Generate the first invitation code

1. Navigate to `/admin/invitations`
2. Click "Générer un code"
3. Copy the `SAW-XXXX-XXXX` code
4. (Optional smoke test) Open an incognito tab → "Espace privé" → "Code d'invitation" → enter the code → check the onboarding flow works end-to-end

---

## Step 4 — Hosting (Vercel) (10 min)

The project has both `vercel.json` and `netlify.toml`. Vercel is the
recommended path (fastest deploy, EU edge, automatic preview deploys).

### 4.1 Connect the GitHub repo

1. Open https://vercel.com/new → Import your repo
2. Framework preset : Vite (auto-detected)
3. Root directory : `./`
4. Build command : `pnpm build` (auto-detected from vercel.json)
5. Output directory : `dist` (auto-detected)

### 4.2 Set environment variables

In Vercel Project Settings → Environment Variables, paste :

```
VITE_APP_NAME=Sawnext Studio
VITE_APP_URL=https://your-domain.com
VITE_DEFAULT_LOCALE=fr

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

VITE_SANITY_PROJECT_ID=xxxxxxxx
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-06-01

VITE_RESEND_FROM_EMAIL=hello@your-domain.com

# Optional
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_CLOUDINARY_CLOUD_NAME=your_cloud
```

⚠️ **Never** add `SUPABASE_SERVICE_ROLE_KEY`, `SANITY_WRITE_TOKEN`, or
`RESEND_API_KEY` to Vercel env — those are backend-only secrets.
The Postgres trigger reads `RESEND_API_KEY` from Supabase Vault, not
from your frontend env.

### 4.3 Deploy

Click "Deploy". Wait ~1 min. Open the live URL.

### 4.4 Add Supabase to the allowed redirect URLs

In Supabase Dashboard → Authentication → URL Configuration :
- Site URL : `https://your-domain.com`
- Redirect URLs : add `https://your-domain.com/**`

Without this, magic links and OAuth callbacks won't return to your prod URL.

---

## Step 5 — Smoke test the full flow (10 min)

From an incognito window pointed at the production URL :

1. [ ] Public landing renders, scroll to `#s09` — see 5 personas, autoplay rotates through Valmont/Harvy/Lucian/Tavio/Sergio every 8s
2. [ ] Click "Demander un accès" → wizard opens → fill name/email/phone/intent → submit → toast success
3. [ ] Check Supabase → Table Editor → `access_requests` → new row appears with status `new`
4. [ ] Check your operator inbox — Resend should have delivered the access request email (Reply-To = lead's email)
5. [ ] Click "Espace privé" → choose "Code d'invitation" → enter the SAW-XXXX-XXXX from Step 3.3 → magic link email arrives → click → onboarding → reach `/account`
6. [ ] On `/account/profile` → "Modifier" → change phone + contact preference → save → `profiles.phone` updates in Supabase
7. [ ] Back in admin (other browser session) : `/admin/invitations` shows the code with status `redeemed`, `redeemed_at` populated
8. [ ] Re-enter the same code on the landing → error "Code introuvable ou déjà utilisé" (atomic single-use working)
9. [ ] Browse a catalogue module (e.g. `/fr/proprietes`) → click a card → "Express interest" CTA opens drawer → submit → inquiry appears in `/admin/inquiries` "new" column
10. [ ] On `/admin/inquiries` → pick the new card's status select → move to "in_review" → card jumps column instantly + row updates in `inquiries.status`
11. [ ] Try every other CTA (jet charter / bespoke / schedule call / concierge wizard) → each writes a typed row to `inquiries` with the right `source` enum value
12. [ ] Click ❤ on a couple of catalogue cards → check `/account/saved` shows them — sign in on another device → ❤ already filled cross-device (Supabase `saved_items` sync)

---

## Common gotchas

### "function does not exist : verify_invitation_code"
You skipped migration 0010. Apply it.

### "permission denied for column role" on profile update
That's the security hardening working as designed — column-level GRANT
restricts what authenticated users can update. Admin role changes go
through the admin UI (which uses service_role via a future RPC).

### Sanity Studio empty / GROQ returns []
Either dataset is wrong (`staging` vs `production`) or the seed didn't
run against the dataset you set in `.env.local`. Re-check
`VITE_SANITY_DATASET` and re-run `pnpm sanity:seed:sawnext`.

### Magic link redirects to `localhost:5173` in production
You forgot Step 4.4 — add the prod URL to Supabase Auth redirect URLs.

### Inquiry submitted but no email received
Two possibilities :
1. `RESEND_API_KEY` not in Supabase Vault — check Vault.
2. Sender domain not verified in Resend — for the demo, use
   `onboarding@resend.dev` (default).

### `pnpm dev` works but `pnpm build` fails
Run `pnpm install` again — root + studio node_modules can drift after
`base:update` or a Node version change.

---

## Post-demo follow-ups

- Promote the staging dataset to production once content is curated
- Configure Sentry DSN for error monitoring (optional)
- Wire the `OPERATOR_EMAIL` Vault secret to your actual operations inbox
- Add the `validate:sanity-content:required` gate to CI (enforces zero
  empty locale fields — see `i18n-sanity.md` lesson #13)
- Replace the `onboarding@resend.dev` sender with your verified domain

---

## Cross-refs

- [`SHIP-AUDIT.md`](SHIP-AUDIT.md) — current state honest snapshot
- [`AUDIT-SECURITY.md`](AUDIT-SECURITY.md) — security findings + remediation
- [`SANITY-HANDOFF.md`](SANITY-HANDOFF.md) — deeper Sanity onboarding notes
- [`SETUP.md`](SETUP.md) — base template setup (less Sawnext-specific)
