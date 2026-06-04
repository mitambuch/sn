---
id: vitest-coverage-testtimeout-flake
date: 2026-06-04
type: friction
tags: [#testing, #friction, #client-specific, #p2]
scope: client-specific
status: active
---

# `pnpm validate` flake — timeout 5s trop court sous coverage v8

## Ce qui bloque

Pendant la refonte du tunnel d'accès, `pnpm validate` échouait de façon
**intermittente** : 1 test sur 519 en « Test timed out in 5000ms », toujours
sur les tests à `userEvent.type()` multi-champs (`AccessRequestModal` wizard,
`AccountCatalogue`). Le même suite passe 519/519 en exécution simple
(`pnpm test`) ou avec `--test-timeout=30000`.

## Cause

`vitest.config.ts` ne fixait pas `testTimeout` → défaut **5000 ms**. L'overhead
de l'instrumentation **v8 coverage** + jsdom + machine chargée (plusieurs
`validate` enchaînés) pousse ces tests au-delà de 5 s. Faux négatif, pas un vrai
bug — les tests concernés sont pré-existants et non modifiés.

## Résolution

`vitest.config.ts` → `test.testTimeout: 15000`. 15 s garde un garde-fou
real-hang tout en absorbant les runs lents sous coverage. Gate redevenu stable.

## Pour que ça ne se reproduise pas

- Si un test `userEvent` flake, suspecter le timeout AVANT de suspecter le code.
- Diagnostic rapide : `pnpm exec vitest run --coverage --test-timeout=30000` —
  si ça passe, c'est du timing, pas de la logique.
- Note : `pnpm build` (donc `pnpm validate`) exige `VITE_APP_URL` en local —
  `VITE_APP_URL=https://saw-next.ch pnpm build` pour reproduire le build CI.
