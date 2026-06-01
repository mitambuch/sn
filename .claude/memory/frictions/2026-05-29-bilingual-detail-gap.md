---
id: friction-bilingual-detail-gap
date: 2026-05-29
type: friction
tags: [#i18n, #sanity, #content, #client-specific]
scope: client-specific
status: resolved
---

# Friction — Pages detail mono-FR malgré audience FR/EN

## ✅ RÉSOLU le 2026-06-01 (commit f773c13)

Approche retenue **différente** du plan proposé ci-dessous : au lieu du
refactor de types (`LocaleField` partout + `resolveFieldOrFallback` dans
~20 spots de pages + migration mocks), la locale est résolue **au niveau
GROQ**. Helpers `L/LPT/LARR` dans `sanityQueries.ts` émettent
`select($locale == "en" => coalesce(field.en, field.fr), field.fr)` ;
`useSanityCollection` + `useSanityItem` lisent la locale depuis i18next
(`hooks/` ne peut pas importer `app/`) et la passent en param `$locale`.

Pourquoi mieux : la shape retournée reste mono-string → **zéro** changement
de types, mocks ou pages. ~5× moins de surface, pas de gros PR risqué.
Hors scope : `useTeamMembers` (query propre) + outil admin → restent FR.
Le plan original est conservé ci-dessous pour mémoire historique.

## Ce qui bloque

L'app annonce supporter FR + EN (route `/en/...`, `LocaleProvider`,
`SUPPORTED_LOCALES = ['fr', 'en']`) mais en pratique tous les titres,
résumés et descriptions des fiches catalogue (event, property,
timepiece, artwork, journey, conciergeService, article) **restent
en français** sur la version anglaise.

Cause précise :

1. **GROQ detail queries** (`src/lib/sanityQueries.ts`) projettent
   seulement `.fr` : `"title": title.fr`, `"summary": summary.fr`,
   `"description": pt::text(description.fr)`.
2. **GROQ list queries** ramènent bien `titleEn: title.en` +
   `summaryEn: summary.en` à côté du FR, mais ces champs ne sont
   consommés **nulle part** dans le code React.
3. **Types TypeScript** (`src/types/event.ts`, etc.) déclarent
   `title: string` mono-string, pas `LocaleField`. Le contrat ne
   prévoit pas le bilingue côté domaine.
4. **Pages detail** (`src/pages/EventDetail.tsx` etc.) rendent
   directement `event.title`, sans passer par `resolveFieldOrFallback`.

Conséquence : un client navigue sur `/en/account/events/<slug>` →
voit toute la fiche en français. Le switch de locale n'a aucun
effet sur le contenu Sanity, seulement sur les labels UI i18n
(`t('events.meta.date')` etc.).

## Pourquoi ça n'a pas été perçu plus tôt

- La démo client du 2026-05-29 12:00 s'est jouée en FR, le défaut
  produit ne s'est pas vu.
- Les list queries ramènent `titleEn` "au cas où", ce qui donne une
  fausse impression de bilingue à l'audit superficiel.
- Le starter `siteConfig` + `landing` sont bien bilingues, donc la
  homepage publique fonctionne en EN — masque le trou catalogue.

## Résolution proposée (non appliquée — décision owner)

Refactor bilingue complet (estimé ~2-3h) :

1. **Schémas Sanity** : déjà OK — tous les champs éditoriaux sont
   `localeString` / `localeText` / `localeRichText`.
2. **GROQ detail + list** : renvoyer `title{fr,en}` au lieu de
   `title.fr`. Idem `summary`, `description`, `programme[].label`,
   `amenities[]`, `technique`, `provenanceNote`, `leadTime`,
   `coverageArea`, `capabilities`, `transport`, `accommodation`,
   `itinerary[].label`, `body` (article).
3. **Types TS** : `title: LocaleField`, `summary: LocaleField`, etc.
   Migration tous les `*.ts` dans `src/types/`.
4. **Transforms** : adapter les mocks (`src/mocks/`) pour matcher la
   nouvelle shape `{ fr, en }`, ou wrapper au layer transform.
5. **Pages** : remplacer `event.title` par
   `resolveFieldOrFallback(event.title, locale, t(...))` partout.
   Audit ~15-20 spots.
6. **Tests** : vitest sur le rendu EN d'au moins 1 fiche par
   domaine.

Risque collatéral : mocks et pages sont actuellement consistants
mono-string ; le passage bilingue casse les tests existants jusqu'à
ce que toute la chaîne soit migrée. À faire en branche dédiée, gros
PR, validate:full obligatoire.

## Workaround temporaire

Si un client anglophone arrive avant le refactor : prévenir l'owner
que le catalogue est livré en FR pour la phase pilote. Ou bien
prefill la version EN identique à la FR dans Sanity (les fiches
seront rendues avec le contenu FR de toute façon — pas de
dégradation utilisateur).

## Action follow-up

- Owner décide quand ce refactor entre dans une release (probablement
  v1.2.x ou plus tard).
- Avant la release : remettre la liste exhaustive des spots
  `event.title` / `property.title` etc. via grep + checklist.
- Le `useSiteConfig` câblé dans le Footer le 2026-05-29 sert d'exemple
  du pattern `resolveFieldOrFallback` côté consumer — appliquer le
  même pattern à toutes les fiches.

## Cross-refs

- Décision contenu : [decisions/2026-04-18-content-stack-integration.md](../decisions/2026-04-18-content-stack-integration.md)
- Règle i18n+Sanity : `.claude/rules/i18n-sanity.md` (leçon #4 — fallback chain)
- Schémas concernés : [studio/schemas/documents/](../../../studio/schemas/documents/) (event, property, timepiece, artwork, journey, conciergeService, article)
- Queries : [src/lib/sanityQueries.ts](../../../src/lib/sanityQueries.ts)
- Helper de résolution : [src/lib/i18nField.ts](../../../src/lib/i18nField.ts)
- Pattern câblé ce jour : [src/components/layout/Footer.tsx](../../../src/components/layout/Footer.tsx)
