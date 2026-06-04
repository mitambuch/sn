---
id: post-deploy-stale-cache
date: 2026-06-04
type: friction
tags: [#deploy, #friction, #client-specific, #p2]
scope: client-specific
status: active
---

# « Voile noir » après déploiement = cache navigateur, pas un bug

## Symptôme rapporté

Juste après le déploiement du tunnel d'accès, l'owner se connecte et voit un
« voile noir un peu opaque » qui cache le dashboard (« on voit plus vos
demandes, des choses ont sauté »), sur `/fr/admin/catalogue`.

## Ce que c'était

**Cache navigateur** servant un mélange ancienne/nouvelle version pendant que
le déploiement finissait (~4 min après le push). Pas de service worker dans ce
projet → un simple rechargement ne suffisait pas toujours, mais la **navigation
privée** a tout réglé. Zéro bug de code.

## Vérification faite avant de conclure (la bonne démarche)

Avant de « corriger à l'aveugle », repro en navigateur propre (Playwright) de
tous les chemins de login → dashboard rendu nickel, **aucun overlay bloqué**,
`body.overflow=""`, pas de `modal-active`. Pas de service worker. → la cause
était externe au code.

## Pour gagner du temps la prochaine fois

Devant un « bug » visuel signalé **juste après un déploiement** :
1. **D'abord** : tester en **navigation privée** (cache vierge). 90 % des cas.
2. Vérifier que le déploiement est **fini ET vert** (pas « Building »/« Error »).
3. Seulement ensuite, repro en navigateur propre + inspecter les overlays
   (`document.elementFromPoint(centre)` + scan des éléments `position:fixed`
   plein écran) avant de toucher au code.

Ne pas dépenser 30 min à debugger un non-bug. Cf [[password-access-tunnel]].
