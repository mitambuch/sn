---
id: decision-2026-04-19-anti-complaisance
date: 2026-04-19
type: decision
tags: [#workflow, #decision, #template, #p0, #active]
scope: template
status: active
---

# Anti-complaisance rule — franchise before flattery

## Context

Owner observation (2026-04-19 matin) : Claude défaulte vers la validation
des propositions même quand la prémisse est faible. Problème : l'owner n'a
pas toujours la compétence technique pour détecter quand ses idées créent
de la dette. Sans pushback soutenu, dette invisible → mauvaises décisions
cumulées → repo dégradé sur le long terme.

L'owner a initialement proposé un "jury system" à critères multiples.
Contesté comme sur-ingéniéré : les 7 règles always-loaded existantes
disent déjà *"surface tradeoffs, don't pick silently"* (principles §1) —
le problème n'est pas un manque de système, c'est le non-respect des
règles existantes.

## Decision

Ajouter une règle **anti-complaisance** minimale plutôt qu'un système de
jury complexe. Matérialisation :

1. Nouveau fichier `.claude/rules/anti-complaisance.md` (always-loaded).
   Contient : contrat, phrases interdites, phrases attendues, bloc
   CHALLENGE, calibration par cas limite.
2. `critical.md` §10 = pointeur court vers la règle (phrases
   interdites/attendues, always-loaded pour zéro excuse).
3. `critical.md` §11 = format du bloc `CHALLENGE` à émettre avant toute
   action R2 (3 lignes : hypothèse / alternative / verdict).
4. `CLAUDE.md` et `scripts/hooks/session-start.js` : registre
   always-loaded rules mis à jour (+anti-complaisance, +dispatch,
   +time-awareness — ces 2 derniers étaient déjà always-loaded via
   frontmatter `paths: ["**"]` mais absents du registre CLAUDE.md).

## Alternatives rejetées

| Alt | Pourquoi rejetée |
|---|---|
| Jury system à 5 critères | Sur-ingéniéré ; devient théâtre après 3 sessions ; redondant avec règles existantes. |
| Hook bloquant qui force un CHALLENGE sur chaque message | Overhead énorme sur R0/trivial ; on perd la calibration par risque. |
| Simple instruction dans CLAUDE.md sans règle dédiée | Sycophantie = baseline d'entraînement, besoin d'une règle always-loaded séparée pour qu'elle tienne sous context fatigue. |
| Ne rien faire | La dette invisible se cumule ; owner l'a explicitement demandé. |

## Trigger

S'applique à **toutes** les sessions futures via chargement automatique.
Test empirique : 3-4 sessions. Si Claude redevient complaisant, durcir
(ex : rendre le CHALLENGE obligatoire aussi sur R1). Pas avant.

## Cross-refs

- Règle : `.claude/rules/anti-complaisance.md`
- Hooks : `critical.md` §10 + §11
- Principe sous-jacent : `principles.md` §1
- Taxonomie de risque : `dispatch.md`
