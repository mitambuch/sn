---
id: cms-i18n-complaint-real-cause-missing-field
date: 2026-06-16
type: friction
tags: [#sanity, #content, #i18n, #friction, #client-specific]
scope: client-specific
status: active
---

# Un retour client « le programme n'est pas traduisible » = champ manquant, pas un bug i18n

## Ce qui bloque

Le client signale que le « programme des expériences » ne se traduit pas en
EN/ES. Réflexe tentant : chercher un bug dans la chaîne i18n (localeString,
GROQ, fallback). Faux. Au niveau schéma, `event.programme[]` et
`journey.itinerary[]` étaient **déjà trilingues**. Le vrai problème : les
expériences concernées sont des `conciergeService`, un type qui n'avait
**aucun champ programme**. Le client ne pouvait pas traduire ce qui n'existait
pas comme champ structuré.

Prolonge la friction [[catalogue-triple-model-divergence]] : un retour
« simple » cache une divergence de modèle entre types de documents.

## Deux pièges de diagnostic

1. **Les noms ne matchent pas les types.** « Private Retreats » =
   `journey` ; « Sécurité & sérénité » + « Déplacements / Private Travel &
   Protocol » = `conciergeService`. Une même liste d'« expériences » côté
   client = plusieurs types Sanity côté schéma.
2. **La requête GROQ de diagnostic excluait les brouillons**
   (`!(_id in path("drafts.**"))`). Or le client édite surtout des
   **drafts** non publiés → ils étaient invisibles au premier audit, ce qui
   donnait l'impression que les docs n'existaient pas. Toujours inclure les
   drafts quand on diagnostique « je ne trouve pas / ça ne marche pas dans le
   Studio ».

## Résolu (commit adc21ca)

Nouvel objet `serviceStep` (titre + description localisés, sans heure) +
champ `programme[]` sur `conciergeService`, projeté GROQ + rendu Timeline sur
ConciergeDetail. Les 3 surfaces de la divergence vérifiées (schéma, type
domaine + GROQ, page) conformément à la leçon de
[[catalogue-triple-model-divergence]].

## Pour que ça ne se reproduise pas

Devant un retour CMS « champ X pas traduisible / introuvable » :
1. Identifier le **type de document réel** (pas le nom affiché).
2. Interroger le dataset **drafts inclus** avant de conclure.
3. Vérifier si le champ **existe** sur ce type avant de chercher un bug i18n.
