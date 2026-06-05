---
id: catalogue-triple-model-divergence
date: 2026-06-05
type: friction
tags: [#sanity, #content, #friction, #client-specific, #p1]
scope: client-specific
status: active
---

# Catalogue : trois modèles de données parallèles qui divergent

## Ce qui bloque

Un retour client « simple » sur le Studio (matériau pas traduisible, itinéraire
avec heures) a révélé que le catalogue a **trois modèles parallèles** qui ont
dérivé :

1. **Sanity Studio** (`studio/schemas/documents/`) — ce que l'owner édite :
   champs `localeString` libres (caseMaterial, destinations[], itinerary).
2. **Domaine + mocks** (`src/types/`, `src/mocks/`) — ce que les **pages**
   rendent : enums + formes spécifiques (timepiece.material enum i18n,
   journey.legs avec dates, destinations string, inclusions/exclusions,
   origin, guestCapacity).
3. **Admin in-app** (`src/features/admin/schemas.ts`) — un éditeur de fiche
   séparé, calé sur le modèle domaine (origin/guestCapacity/legs requis).

La projection GROQ (`sanityQueries.ts`) tente de mapper Sanity → domaine, mais
seuls les champs éditoriaux (title/summary/description) avaient été pontés
(friction [[friction-bilingual-detail-gap]]). Les champs structurés ne
matchaient pas → le contenu Sanity ne s'affichait pas, et `JourneyDetail`
**crashait** sur une vraie fiche Sanity (`legs`/`inclusions` undefined).

## Résolu cette session (commits 5964341 + 8ddfad9) — PARTIEL

- **Layer 1** : schémas Studio corrigés (caseMaterial localeString, destinations
  array de localeString, nouvel objet `itineraryDay` sans heure).
- **Layer 2** : **timepiece + journey detail** reconnectés au modèle Sanity.
  Approche **additive/pont**, pas réécriture des types partagés : material rendu
  i18n-sinon-brut ; `JourneyDetailData` dédié + `toJourneyDetail()` qui ponte le
  mock ; `destinations` élargi `string | string[]` normalisé chez tous les
  lecteurs. Crash réglé.

## Reste à faire (dette explicite, pas cachée)

- **Mêmes ponts pour les autres modules** : property, artwork, event,
  conciergeService, article (leurs detail pages lisent encore enums/mock).
- **Listes + cards** : encore sur le modèle domaine (ex : JourneyCard montre
  kind/durationDays mock ; OK en résumé mais pas aligné Sanity).
- **Admin in-app** (`features/admin/schemas.ts`) : toujours sur l'ancien modèle
  (origin/guestCapacity/inclusions). À réconcilier ou retirer si Sanity Studio
  devient l'unique surface d'édition.
- **Décision de fond à prendre** : Sanity Studio est-il l'éditeur unique ? Si
  oui, l'admin in-app de fiches fait doublon → candidat à suppression.

## Pour que ça ne se reproduise pas

Quand on ajoute un champ à un schéma Sanity, vérifier **les trois** surfaces :
le rendu page (type + GROQ + page), la card/liste, et l'admin in-app. Un champ
qui n'existe que dans Sanity ne s'affiche pas tant que le type domaine + la page
ne le lisent pas.

## Cross-refs

- [[friction-bilingual-detail-gap]] (le même problème pour title/summary, résolu au niveau GROQ)
- `src/lib/sanityQueries.ts` (helpers L/LPT/LARR/L_LABEL)
- `studio/schemas/documents/{timepiece,journey}.ts` + `objects/itineraryDay.ts`
