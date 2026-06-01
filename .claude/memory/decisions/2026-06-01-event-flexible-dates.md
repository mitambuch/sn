---
id: event-flexible-dates
date: 2026-06-01
type: decision
tags: [#sanity, #i18n, #content, #decision, #client-specific]
scope: client-specific
status: active
---

# Dates d'événement flexibles — mode exact / toute l'année / texte libre

## Contexte

Retour client (2026-06-01) : certains rendez-vous sont disponibles toute
l'année ou n'ont pas de date calendaire fixe. Le schéma `event` forçait
`startsAt` (required) + `endsAt`, impossible à remplir proprement pour
ces cas. Le client demandait soit une case « toute l'année », soit un
champ libre.

## Décision

Un seul sélecteur `dateMode` (radio Sanity) à 3 valeurs couvre les deux
demandes plutôt que deux features séparées :

- `exact` (défaut) — `startsAt` requis (+ `endsAt` optionnel). Comportement
  historique inchangé.
- `allYear` — aucune date saisie, rend un libellé localisé (`events.allYear`).
- `free` — champ `dateLabel` (`localeString`) où l'opérateur écrit ce qu'il
  veut (« Sur demande », « Été 2026 »). Sert aussi de pastille sur la carte.

`startsAt` devient conditionnel (`hidden` + `Rule.custom` requis seulement
en mode exact). `dateMode` absent ⇒ traité comme `exact` côté rendu →
docs/mocks legacy intacts, zéro migration.

## Implémentation

- Rendu centralisé dans `src/features/events/eventDate.ts`
  (`resolveEventDate`) → une source de vérité pour carte / détail / share.
- `dateMode` ajouté à `ALLOWED_RAW` de `validate-sanity-schema.js` (enum
  technique, pas du texte éditorial — comme `category`/`dressCode`).
  `dateLabel` reste `localeString` (leçon #9 respectée).

## Hors scope (assumé)

L'admin in-app (`features/admin/schemas.ts`) n'a pas reçu `dateMode` : le
client crée ses fiches dans Sanity Studio, et ce formulaire ne casse pas
(date par défaut via `timestamp()`). Parité possible plus tard si Salva
crée des events year-round depuis l'admin in-app.

## Cross-refs

- Friction sœur (résolue) : `frictions/2026-05-29-bilingual-detail-gap.md`
- Protocole : `.claude/rules/i18n-sanity.md` (taxonomie + leçon #9)
