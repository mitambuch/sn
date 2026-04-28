---
id: decision-2026-04-19-llm-cross-audit-pattern
date: 2026-04-19
type: decision
tags: [#workflow, #memory, #decision, #template, #p0, #active]
scope: template
status: active
---

# Pattern — LLM cross-audit avant release de features process

## Décision

Pour toute feature qui touche au **workflow lui-même** (rules, commands,
memory protocol, dispatch, bootstrap), on **cross-audite via un LLM externe**
(ChatGPT / Gemini / autre Claude) **avant** release.

Pas pour les features product normales (composant UI, page, bug fix, refactor).
Uniquement pour les méta-features qui modifient comment Claude travaille.

## Pourquoi

Le 2026-04-19 à 15:53, session v6.5 (Bootstrap Bible + `/context`) :

1. Claude a produit un audit auto-déclaré optimiste (scores 4/5 sur la
   plupart des axes).
2. L'owner a demandé un prompt pour ChatGPT audit parallèle.
3. ChatGPT a trouvé **5 bugs factuels** dans le code shipped par Claude
   dans la même session :
   - Token count hardcodé à 2 600 (réel : ~10 266 — 4× off)
   - Taille `/context` annoncée ≤ 8 KB (réelle : ~13 KB)
   - MEMORY.md "Recent sessions" triées par date sans HHMM → mauvais top 3
   - Bootstrap "<30 min" irréaliste sans prérequis Sanity
   - `/dispatch` oublié dans cheatsheet `/context`

Les 5 bugs sont objectifs, vérifiables, et auraient été shipped en v6.5.0
si la release avait suivi l'audit Claude seul.

**Leçon** : Claude sur-estime la qualité de son propre travail process.
Anti-complaisance en règle ne suffit pas quand le juge est Claude
lui-même. Un œil externe (LLM différent ou humain) casse ce biais.

## Quand appliquer

**OUI** (cross-audit obligatoire) :
- Nouvelle rule always-loaded ou modification d'une rule existante
- Nouveau protocole memory (tag vocab, frontmatter schema, scripts memory:*)
- Nouveau mécanisme de dispatch / routing
- Changement de bootstrap ou flow client
- Script qui produit un artefact "source of truth" (ex : `/context`)
- Toute feature qui ajoute du contexte always-loaded

**NON** (pas de cross-audit) :
- Composant UI nouveau
- Page nouvelle
- Bug fix avec repro clair
- Refactor local sans impact workflow
- Data-only change (locales, sanity content)

## Comment appliquer

1. Finir la feature et son merge sur main.
2. **AVANT** `pnpm release` : générer un prompt d'audit adversarial
   (voir template dans session journal `2026-04-19-1537.md`).
3. Coller dans ChatGPT / Gemini / autre LLM avec les fichiers joints.
4. Lire l'audit externe **sans défense**. Si bugs factuels → fix
   immédiatement sur branche `fix/<feature>-audit-corrections`.
5. Merge le fix. **Puis** release.

## Anti-patterns

- Auditer soi-même et conclure que tout est bon. Sycophantie structurelle.
- Accepter en bloc les critiques LLM externes sans vérifier (ChatGPT peut
  aussi inventer). Distinguer les **bugs factuels** (vérifiables) des
  **opinions structurelles** (à débattre).
- Faire le cross-audit trop tôt (avant que la feature soit codée) —
  produit de la spéculation, pas de la vérification.
- Skipper le cross-audit parce que "la feature est petite" — c'est
  justement sur les petits oublis (token count, filename sort) que
  Claude drift.

## Cross-refs

- Session qui a révélé le pattern : `sessions/2026-04-19-1537.md`
- Anti-complaisance : `.claude/rules/anti-complaisance.md`
- Feature v6.5 source : merge `579e05a` + fix `7ecee31`
