---
id: sanity-landing-singleton
date: 2026-05-14
type: decision
tags: [#sanity, #i18n, #content, #decision, #client-specific, #active]
scope: client-specific
status: active
---

# Landing copy mirrored to a Sanity singleton with i18n fallback

## Decision

Add a `landing` document type as a singleton (`landing-singleton`) in the
Studio. It holds every visible piece of editable marketing copy on the
public landing : terminal status, hero meta block + GPS, presentation,
principles list, domain tiles, access copy, interlocutor labels, footer.

Each landing section calls `useLandingContext()` and resolves each visible
string through `resolveFieldOrFallback(landing?.field, locale, t('i18n.key'))` —
so the site stays fully usable when Sanity is unconfigured (the i18n
fallback fires) and becomes fully client-editable the moment the seed
runs.

## What was deliberately NOT migrated

- Hero typewriter phrases (`landing.hero.cyclePhrases.*`) — the
  before / highlight / after split drives `mix-blend-mode: difference`
  and would have to be a new schema type with array-of-objects per
  phrase, far bigger than the value gain.
- Manifesto phrases + per-phrase indentation (PHRASE_LAYOUTS) — same
  reason : the indent scheme is mechanic, not editorial.
- Principles 3-pillar prefix / keyword / body triplets — structurally
  bound to the blur-reveal animation.
- Domains 10-item ordered list — 10 stable verticales, not editorial.
- Marquee strings, IndexOverlay section nav, footer column link labels —
  navigation / repeating UI labels, not editorial copy.

These remain in `src/locales/{fr,en}.json` with a comment in the schema
file noting why.

## Why a single singleton vs many

Considered : separate `landingHero`, `landingPresentation`, … singletons.
Rejected because :
- One GROQ fetch + one React context = one round-trip instead of N.
- Editor UX is simpler — one entry in the Studio sidebar, grouped via
  fieldset (`groups: [...]`) inside the doc.
- TypeScript surface is one type vs many.

The downside (the singleton schema is ~80 fields long) is mitigated by
the field-groups (8 collapsible groups in the Studio UI).

## Implementation

- `studio/schemas/documents/landing.ts` — schema with 8 groups.
- `studio/structure/deskStructure.ts` — pinned at the top, just after
  ⚙️ Configuration globale.
- `studio/sanity.config.ts` — added to SINGLETON_TYPES (already filters
  create/delete/duplicate actions) and to the languageFilter doc-types
  list (so the FR/EN tabs render).
- `src/types/landing.ts` + `src/hooks/useLandingContent.ts` +
  `src/context/LandingContentContext.tsx` — typed mirror, hook,
  provider.
- `Home.tsx` mounts the provider just outside `LoginModalProvider`. All
  landing sections subscribe via `useLandingContext()`.

## Cross-refs

- `docs/SANITY-HANDOFF.md` — 3-step go-live for the owner.
- `.claude/rules/i18n-sanity.md` lessons #4 (fallback chain), #6
  (loading-before-redirect), #13 (zero empty locale).
- Pattern parent : `[[siteconfig-singleton-pattern]]` (existing
  decision).

## Status

Active. The wiring is in main once `feat/sanity-content-mirror` is
merged. Owner has the credential checklist in `docs/SANITY-HANDOFF.md`.
