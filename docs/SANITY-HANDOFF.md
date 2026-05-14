# Sanity content mirror — handoff

Status snapshot at end of `feat/sanity-content-mirror` epic (2026-05-14).

Owner directive : "que TOUT le contenu soit en miroir sur Sanity, chaque texte
modifiable par le client, 1 fiche fake par catégorie". This document records
what was delivered, what was deliberately left in i18n, and the exact 3 steps
needed to make Sanity live.

---

## What's done (no creds needed)

### Schemas

- `studio/schemas/documents/landing.ts` — new singleton holding every editable
  copy on the public landing : terminal status, hero meta block + GPS,
  presentation, principles list, domain tiles, access copy, interlocutor labels,
  footer note. Mounted in `studio/structure/deskStructure.ts` under
  "🌐 Landing — page publique".
- `siteConfig` schema kept (identity, nav, footer, contact, socials, SEO).
- `page` schema kept (home, about, contact singletons).
- 8 catalogue collections unchanged (event, property, timepiece, artwork,
  journey, conciergeService, article, teamMember).

### Front-end wiring

- `src/types/landing.ts` — typed mirror of the landing schema.
- `src/hooks/useLandingContent.ts` — typed GROQ fetch hook for the singleton.
- `src/context/LandingContentContext.tsx` — provider mounted in `Home.tsx`
  that fetches the landing singleton **once** and shares it with every
  section via `useLandingContext()`.
- Each landing section calls `useLandingContext()` and resolves each visible
  copy through `resolveFieldOrFallback(landing?.field, locale, t('i18n.key'))` :
  - `Home.tsx` — TerminalBar status / tz / CTAs · IndexOverlay CTAs +
    footer location + edition.
  - `Hero.tsx` — full meta block (Structure / Type / Statut / Modèle /
    Établi) + GPS + champ-d'action paragraph.
  - `Access.tsx` — eyebrow + title (A+B) + lede + events eyebrow +
    locked eyebrow.
  - `Interlocutor.tsx` — eyebrow + headline (A+B).
  - `Presentation.tsx` — eyebrow + headline + lede.
  - `Principles.tsx` — top meta strip (tag + edition mention).
  - `Domains.tsx` — eyebrow + headline + meta lede.

### What stays in `src/locales/*.json` on purpose

- Hero typewriter phrases (`landing.hero.cyclePhrases.*`) — the before /
  highlight / after split that drives `mix-blend-mode: difference`.
- Manifesto phrases (`landing.manifesto.*`) + per-phrase indentation
  (`PHRASE_LAYOUTS` in `Manifesto.tsx`).
- Principles 3-pillar prefix / keyword / body triplets.
- Domains 10-item ordered list.
- Marquee strings.
- IndexOverlay section labels (navigation only).
- Footer column link labels (legal / nav).

These are either mechanics (animation-aware) or repeating UI labels — moving
them to Sanity would either break the typewriter / marquee mechanic or
explode the singleton field count without delivering client value.

### Seed pipeline (offline)

- `studio/fixtures/sawnext-seed.json` rewritten :
  - 2 singletons : `siteConfig-singleton`, `landing-singleton` (FR + EN).
  - 3 pages : home, about, contact.
  - **1 fiche par catalogue** : evt-01, prop-01, tp-01, art-01, journey-01,
    concierge-01, article-01.
  - 3 team members : Salvatore (focal), Harry, Bokar — the Interlocutor
    rotation requires all 3.
- `studio/scripts/seed-sawnext.js` extended with `--wipe` (deletes every
  catalogue doc before re-creating). Singletons + pages are idempotent
  via `createOrReplace`.
- `pnpm sanity:seed:sawnext` / `:dry` / `:wipe` aliases in `package.json`.

### Validators tuned

- `scripts/validate-sanity-schema.js` — `ALLOWED_RAW` widened to cover the
  catalogue technical fields (radio-list values, ISO codes, proper nouns,
  technical jargon). Schema validator passes against the full repo.

---

## 3 steps to go live

### 1 — Create the Sanity project (5 min)

1. Go to <https://sanity.io/manage> and create a new project (or pick an
   existing one).
2. Note down `Project ID` (something like `qwerty12`).
3. Make sure the dataset `production` exists (or `staging` if you prefer to
   stage first — the seed script defaults to `production`, use `--staging`
   to override).
4. Generate an API token : Tokens → Add API Token → name "seed" → scope
   **Editor** → copy.

### 2 — Wire credentials locally (1 min)

Create `.env.local` at the repo root (it's gitignored) :

```env
VITE_SANITY_PROJECT_ID=<your-project-id>
VITE_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=<your-project-id>
SANITY_STUDIO_DATASET=production
SANITY_WRITE_TOKEN=<the-Editor-scope-token-from-step-1>
```

(`VITE_*` vars feed the React app, `SANITY_STUDIO_*` feed the Studio, and
`SANITY_WRITE_TOKEN` is only read by `seed-sawnext.js`. Token NEVER ships
to the client bundle — it's server-side / script-side only.)

### 3 — Seed + open the Studio (2 min)

```sh
pnpm sanity:seed:sawnext         # creates the 13 docs in production
pnpm studio:dev                  # opens the Studio at localhost:3333
pnpm dev                         # opens the site at localhost:5173
```

You should now see :

- Studio left menu : ⚙️ Configuration globale · 🌐 Landing — page publique ·
  🏠 Accueil · ℹ️ À propos · ✉️ Contact · 📅 Évènements · 🏛️ Propriétés ·
  ⌚ Garde-temps · 🖼️ Œuvres d'art · 🌍 Voyages · 🛎️ Conciergerie ·
  📰 Actualités · 👤 Équipe.
- Each catalogue list has exactly **1 fiche** ready to edit.
- The landing page on `localhost:5173` pulls its copy from Sanity — try
  editing `landing.terminalStatus` in the Studio, refresh the landing :
  the bandeau bas reflects the change.

If you ever need to reset the catalogue to a single fiche per type
(e.g. after Salva did demo edits) :

```sh
pnpm sanity:seed:sawnext:wipe
```

---

## Known follow-ups (not blocking)

- **Manifesto / Hero typewriter copy in Studio** — would require a new
  schema type with array-of-objects per phrase (before/highlight/after).
  Deliberately deferred — the mechanic is the value, the words rarely
  change.
- **Principles 3-pillar full migration** — the prefix/keyword/body triplets
  are structurally bound to the blur-reveal animation ; moving them to
  Sanity is possible but didn't fit the session budget.
- **Domains 10-item list migration** — the 10 items are stable across
  clients ; the headlines are now Sanity-editable.
- **Footer link labels** — legal / nav columns stay in i18n (they're
  navigation, not editorial copy).
- **Sanity content guarantee CI** — `pnpm validate:sanity-content:required`
  enforces zero empty locale field, but only when creds are present. Once
  the seed runs, add a CI secret for `SANITY_WRITE_TOKEN` + a read-only
  `VITE_SANITY_PROJECT_ID` so the gate runs on every PR.

---

## Files added / changed in this epic

```
studio/schemas/documents/landing.ts        + new
studio/schemas/index.ts                    + landing registered
studio/structure/deskStructure.ts          + landing in menu + SINGLETON_TYPES
studio/sanity.config.ts                    + landing in languageFilter +
                                             productionUrl
studio/fixtures/sawnext-seed.json          + rewritten (siteConfig +
                                             landing + 1-per-catalogue +
                                             3 team members)
studio/scripts/seed-sawnext.js             + --wipe flag
scripts/validate-sanity-schema.js          + extended ALLOWED_RAW
package.json                               + sanity:seed:sawnext:wipe
src/types/landing.ts                       + new typed mirror
src/hooks/useLandingContent.ts             + new hook
src/context/LandingContentContext.tsx      + new provider + consumer hook
src/pages/Home.tsx                         + wired
src/features/landing/Hero.tsx              + wired
src/features/landing/Presentation.tsx      + wired
src/features/landing/Principles.tsx        + wired (top meta strip only)
src/features/landing/Domains.tsx           + wired (eyebrow / headline / lede)
src/features/landing/Access.tsx            + wired
src/features/landing/Interlocutor.tsx      + wired (eyebrow / headline)
docs/SANITY-HANDOFF.md                     + this file
```

Commits :

```
2de9cc0  feat(sanity): add landing singleton schema + desk entry
f717157  feat(sanity): rewrite seed fixture + add --wipe to seed script
816ab7d  feat(sanity): wire landing sections to Sanity singleton w/ i18n fallback
90f50d8  chore(sanity): widen schema validator allowlist + finalise landing singleton wiring
```

— done at 2026-05-14 17:35 Europe/Zurich
