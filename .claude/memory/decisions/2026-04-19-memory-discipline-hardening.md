---
id: decision-2026-04-19-memory-discipline-hardening
date: 2026-04-19
type: decision
tags: [#memory, #workflow, #decision, #template, #p1, #active]
scope: template
status: active
---

# Memory discipline hardening — feedback/patterns/frictions triggers

## Context

Audit Phase B (2026-04-19) : `.claude/memory/feedback/` et
`.claude/memory/patterns/` à **0 entrées** après 30 jours d'activité ;
`.claude/memory/frictions/` à **1**. La règle prescrit leur usage depuis
le début mais la discipline ne tient pas.

Root cause : les triggers étaient formulés en termes abstraits ("owner
gives feedback" / "pattern validated as reusable") sans phrases concrètes
ni checklist explicite. Sous context fatigue, Claude oublie d'écrire.

## Decision

Durcir la protocol-memory sur 3 axes :

1. **Sections "Trigger phrases"** ajoutées à `memory-protocol.md` :
   - `feedback/` : liste de tournures owner qui déclenchent
     obligatoirement une entrée ("non fais plutôt", "je t'ai déjà dit",
     etc.)
   - `patterns/` : critères concrets (re-utilisable 2+ fois, demandé
     explicitement, refactor structurel)
   - `frictions/` : seuil "+5 min perdues sur un obstacle"
2. **Session-wrap audit** : 3 questions Q/A obligatoires **avant** le
   journal de session. Réponse OUI → entrée écrite avant journal.
3. **Stop hook enhancement** (`scripts/hooks/stop.js`) : nudge
   systématique avec les 3 questions d'audit + counts actuels des
   folders. Non-bloquant (`systemMessage`).

## Alternatives rejetées

| Alt | Pourquoi rejetée |
|---|---|
| Collapse `feedback/` + `patterns/` dans `decisions/` avec tags | Perd la segregation sémantique ; les index/catalogues deviendraient ambigus. |
| Garder les folders, ne rien toucher | "Plus de discipline" = ce qu'on a déjà, ne marche pas. |
| Hook bloquant qui refuse le commit sans entrée | Overhead inacceptable (fausse positifs sur les sessions triviales). |
| Templates .md dans chaque folder | Collisions potentielles avec le walker `memory-index.js` (frontmatter requis). Déplacé dans le prose de la règle à la place. |

## Trigger

Immédiat. Cette décision inclut sa propre démonstration : l'entrée
`feedback/2026-04-19-stop-complaisance.md` a été écrite lors de la même
session (preuve que la règle fonctionne).

## Vérification empirique

Pendant 3-4 sessions :
- Vérifier que les counts de `feedback/` + `patterns/` + `frictions/`
  augmentent de façon réaliste (pas artificielle).
- Si counts restent à 0 malgré activity, durcir encore (ex : blocking
  hook sur `Stop` quand session > 10 turns sans entrée feedback).
- Si faux-positifs (entrées vides / triviales), relaxer les triggers.

## Cross-refs

- Règle hardened : `.claude/rules/memory-protocol.md`
- Hook : `scripts/hooks/stop.js`
- Preuve de concept : `feedback/2026-04-19-stop-complaisance.md`
- Audit source : décisions Phase B (2026-04-19)
