---
id: groq-larr-array-select-invalid
date: 2026-06-25
type: friction
tags: [#sanity, #i18n, #frontend, #client-specific]
scope: client-specific
status: active
---

# `LARR` générait du GROQ invalide (`array[]select()`) → fiches publiques en 500

## Symptôme

Sur l'accueil en prod (saw-next.ch), cliquer une vignette du teaser catalogue
ouvrait la popup avec « Ce code n'existe pas / Aucune fiche n'est associée à ce
code » — alors que le doc **était** bien `visibility: public` et publié (il
s'affichait dans le teaser). Trompeur : le message vient de `PublicFichePanel`
quand la fiche revient `null`, et le texte est emprunté à `/share` (parle de
« code » sans qu'aucun code soit en jeu).

## Cause racine

Le helper `LARR` ([[sanityQueries.ts]]) produisait `field[]select(...)`. **GROQ
n'a pas de forme `array[]<expression>`** : Sanity renvoie
`queryParseError: "expected '}' following object body"` et toute la requête
plante (HTTP 400 côté Sanity → la Netlify function `catalogue` attrape en 500 →
le client `gatePublicFiche` traduit en `null`). Touchait 5 requêtes :
`GROQ_PUBLIC_FICHE` (capabilities), `GROQ_JOURNEYS_LIST` + `GROQ_JOURNEY_DETAIL`
(destinations/transport/accommodation), `GROQ_CONCIERGE_LIST` +
`GROQ_CONCIERGE_DETAIL` (capabilities). Journeys/concierge **membre** étaient
aussi cassés mais non remarqués (catalogue membre pas live).

Une string GROQ n'est pas typée → invisible à lint/typecheck/build. C'est passé
à travers un `pnpm validate` vert (livré le 2026-06-23, commit f392143).

## Résolution

Forme valide : `field[]{ "v": select(...) }.v` (map chaque élément vers un objet
à une clé, puis pluck → tableau de scalaires). Fix dans le helper unique →
répare les 5 requêtes. Commit `36c85e3` (branche `fix/groq-larr-array-projection`).

Prévention : `src/lib/__tests__/sanityQueries.test.ts` rejette le motif
`array[]select(` sur **toutes** les requêtes exportées. (groq-js absent du repo
→ pas de vrai parse-test sans ajouter une dépendance ; le check string couvre
exactement cette classe de bug.)

## Technique de diagnostic réutilisable

1. Le dataset Sanity répond en **public** (`k2xrvftw`, dataset `production`) →
   on peut rejouer une requête GROQ directement :
   `GET https://k2xrvftw.api.sanity.io/v2024-06-01/data/query/production?query=<urlencoded>&$locale="fr"`
   → Sanity renvoie le **message de parse exact** (type + position).
2. Les actions `publicCatalogue` / `publicFiche` de la Netlify function sont
   **non authentifiées** → `curl -X POST https://saw-next.ch/.netlify/functions/catalogue`
   permet de reproduire le 500 en prod sans navigateur. Un id bidon qui renvoie
   500 (au lieu de 200 `{data:null}`) prouve que la **requête** plante, pas la
   donnée.

## Pour que ça ne se reproduise pas

- Idéal (futur, demande accord owner pour la dep) : test de parsing réel via
  `groq-js parse()` sur chaque requête exportée, intégré à `validate:gates`.
- En attendant : le test string + ce réflexe de diagnostic (replay GROQ contre
  l'API publique pour l'erreur exacte).
