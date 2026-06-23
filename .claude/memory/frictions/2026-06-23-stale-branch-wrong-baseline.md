---
id: stale-branch-wrong-baseline
date: 2026-06-23
type: friction
tags: [#git, #workflow, #friction, #client-specific]
scope: client-specific
status: resolved
---

# Diagnostiquer la mauvaise surface parce qu'on a démarré sur une branche périmée

## Ce qui a bloqué (~15 min perdues + un workflow d'agents jeté)

Session démarrée sur la branche `feat/event-video-cloudinary` (laissée non
mergée). J'ai lu `SharePage.tsx` + la couche data **sur cette branche**, conclu
que la « fiche expérience publique » du client = `/share/:code`, et lancé un
workflow d'investigation 4-agents câblé sur cette surface.

Puis `git checkout main && git pull` a fast-forward **+76 commits** (la main
locale était périmée). Ces 76 commits avaient introduit la **vraie** surface
publique — `PublicFichePanel` (popup fiche depuis le teaser accueil,
commits 61566f3 + 35b01cf) — qui n'existait pas sur la branche de départ. Tout
le diagnostic initial + le workflow visaient à côté. J'ai dû `TaskStop` le
workflow et re-baseliner intégralement.

## Cause

Violation de la règle #1 de CLAUDE.md (« never work on a leftover branch »).
Lire le code **avant** de partir d'une main à jour = lire un état qui n'est ni
la prod ni le point de branchement réel.

## Résolution

Re-checkout propre depuis `origin/main` à jour, re-lecture des fichiers réels,
`git log a40d778..HEAD -- <surface>` pour mesurer la dérive. Les catégories de
bugs (troncature contenu, CTA, flow contact, i18n es) étaient identiques — seule
la surface changeait (`PublicFichePanel` au lieu de `SharePage`).

## Pour que ça ne se reproduise pas

1. **Avant toute lecture de code de diagnostic** : `git checkout main && git
   pull` D'ABORD, brancher ENSUITE. Ne jamais lire le code depuis une branche
   feature laissée en plan.
2. Si une session reprend sur une branche non-main, `git log --oneline
   origin/main -5` pour vérifier l'écart avant de raisonner sur l'archi.
3. Garde-fou : `git fetch && git rev-list --count HEAD..origin/main` au démarrage
   — si > 0 et qu'on s'apprête à diagnostiquer, re-baseliner.

## Cross-refs

- Règle : `.claude/rules/workflow.md` §Non-negotiable #1 (branch from main).
- Friction voisine (data périmée vs code) : [[sanity-stale-data-overrides-code]].
