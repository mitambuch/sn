---
id: decision-2026-04-19-intent-routing
date: 2026-04-19
type: decision
tags: [#workflow, #decision, #template, #p0, #active]
scope: template
status: active
---

# Intent routing — natural-language → skill invocation

## Context

Audit Phase B (2026-04-19 matin) : 19 commands / 38 jamais référencées en
sessions, 2 agents / 6 à 0-ref. Hypothèse initiale = dead weight à purger.

Owner a pointé un angle mort majeur : il ne tape jamais `/xxx`, il parle
en langage naturel (*"on ajoute une page"* au lieu de `/new-page`). Après
lecture du contenu des stubs les plus petits (`/fix`, `/test`, `/status`,
`tester.md`, `reviewer.md`), **aucun n'est vraiment vide** — ils
contiennent tous des workflows/checklists load-bearing.

Conclusion renversée : **le problème n'est pas du dead weight, c'est un
trou de routing.** Personne ne déclenche les skills.

## Decision

Créer `.claude/rules/intent-routing.md` (always-loaded) qui mappe les
intentions en langage naturel aux commands et agents du repo. Claude
détecte + invoke via le Skill tool (commands) ou Agent tool (agents)
**sans que l'owner ait à taper de slash**.

Aucune suppression de command ni d'agent. Toute la valeur latente est
réactivée par routage automatique.

## Structure de la règle

1. **Contrat** : 1 tour user → détection intention → annonce 1 ligne →
   invoke skill/agent.
2. **Tableau mapping** (~35 intentions → commands/agents) couvrant :
   création de code, design, content i18n/Sanity, quality/pre-delivery,
   workflow/méta-stack, dispatch Haiku/Sonnet.
3. **Résolution d'ambiguïté** : quand 2 skills matchent, questions
   précises + règles de préférence.
4. **Maintenance** : toute nouvelle command DOIT mettre à jour le
   tableau (futur script `validate-intent-routing.js`).

## Alternatives rejetées

| Alt | Pourquoi rejetée |
|---|---|
| Purge 19 commands dormantes | Après lecture, toutes ont de la valeur — suppression = perte. |
| Forcer l'owner à taper `/xxx` | Contraire à l'objectif "fluide" explicitement posé. |
| Auto-invoquer sans annoncer | Non-transparent, l'owner doit pouvoir me stopper. D'où l'annonce 1 ligne. |
| Hook `prompt-submit` qui injecte un "intent hint" | Surcouche technique inutile, une règle always-loaded suffit. |

## Effet attendu

- Les 19 commands "dormantes" deviennent live sans action owner.
- Les 2 agents (`tester`, `reviewer`) retrouvent un trigger naturel.
- Zéro friction ajoutée, zéro syntaxe à apprendre côté owner.
- Intent routing + anti-complaisance = machine de guerre : l'owner parle,
  je traduis en action, je conteste si la demande est bancale.

## Trigger

Auto via `paths: ["**"]` dans la frontmatter. Immédiat dès prochain tour.
Surveillance empirique sur 3-4 sessions : si je mal-route
(faux-positifs) ou sous-route (intentions ratées), itérer sur le tableau.

## Cross-refs

- Règle : `.claude/rules/intent-routing.md`
- Commands : `.claude/commands/*.md` (38 skills)
- Agents : `.claude/agents/*.md` (6 agents)
- Règle de protection : `.claude/rules/anti-complaisance.md` (si
  l'intention détectée est bancale, CHALLENGE avant invoke)
- Décision objectif repo : `decisions/2026-04-19-repo-objective.md`
