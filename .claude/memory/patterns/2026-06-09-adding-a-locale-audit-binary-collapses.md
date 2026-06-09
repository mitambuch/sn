---
id: adding-a-locale-audit-binary-collapses
date: 2026-06-09
type: pattern
tags: [#i18n, #sanity, #pattern, #content]
scope: template
status: active
---

# Adding a locale ≠ editing SUPPORTED_LOCALES — audit every binary collapse

Adding a 3rd locale (ES on Sawnext, 2026-06-09) surfaced that the locale
array is the *least* important part. The real work is finding every spot
that **silently collapses a non-default locale to FR/EN**. Miss one and the
new locale renders the wrong language with no error — worse than no support.

## The checklist (run a grep, don't trust the array)

1. **`SUPPORTED_LOCALES`** + i18next `resources` (`src/config/i18n.ts`).
2. **Static strings**: create `src/locales/<lng>.json` with **exact leaf-key
   parity** vs `fr.json` (verify with a recursive key-diff — 0 missing / 0
   extra). Partial files don't fail `validate:i18n` (it only flags hardcoded
   FR), so the gate won't catch gaps — check yourself.
3. **Sanity `locale*` objects** (`localeString/Text/RichText`): add the field
   (warning, never required) + the editor input tabs (`LocaleTabsInput`).
4. **GROQ projection helpers** (`src/lib/sanityQueries.ts`): the killer. Each
   helper was `select($locale == "en" => coalesce(f.en, f.fr), f.fr)` — the
   `else` silently means FR. Every helper needs an `$locale == "<lng>"` branch.
   These are **shared with the Netlify gate**, so fixing them fixes both paths.
5. **Binary `i18n.language === 'en' ? 'en' : 'fr'`** collapses — grep for
   `=== 'en'` / `=== 'fr'` / `as 'fr' | 'en'`. Found in useSanityCollection,
   useSanityItem, SharePage, Home, and the gate (`catalogue.mts`). Each → a
   3-way derivation. **Date-formatting** sites (`toLocaleDateString(i18n.language)`)
   are the exception — they *want* the raw BCP-47 tag, leave them.
6. **Locale type aliases** that aren't the config `Locale`: `sanityGate.ts`,
   `catalogue.mts`, `sharing.ts ShareLocale`, `types/auth.ts UserLocale`.
7. **DB enums**: `profiles.locale` is a Postgres `enum ('fr','en')`. Account
   locale pref needs an **irreversible** `ALTER TYPE user_locale ADD VALUE` —
   owner/migration territory, don't widen the TS type without the migration or
   saves will be rejected at runtime.
8. **SeoHead OG map** (`fr_FR/en_US/...`); hreflang + routing `/:locale` are
   auto if they iterate `SUPPORTED_LOCALES`.

## Sequencing trap

Do **not** add the new locale to `validate-sanity-content.js REQUIRED_LOCALES`
until the dataset actually has content for it — otherwise `pnpm validate` goes
red on every canonical singleton immediately. Schema/resolution ships first;
the "required" gate flips on only once content is authored.

## Why template-scope

Every bilingual client will eventually get a 3rd language. This checklist is
the difference between a clean add and a week of `fix(i18n)` whack-a-mole.
Candidate for `pnpm base:contribute`.
