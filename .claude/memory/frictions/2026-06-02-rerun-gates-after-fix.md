---
id: friction-2026-06-02-rerun-gates-after-fix
date: 2026-06-02
type: friction
tags: [#workflow, #friction, #client-specific]
scope: client-specific
status: resolved
---

# Re-run gates after fixing a gate failure, before committing

## Ce qui s'est passé

Lot A "pro forms" : `pnpm validate:gates` a échoué sur `docs:sync:check`.
J'ai régénéré les docs, MAIS sans **re-lancer gates** — j'ai commit + push
direct (le build esbuild passait). Résultat : une erreur **typecheck**
dans `PhoneField.tsx` (`exactOptionalPropertyTypes` : `value={value ||
undefined}`) était présente AUSSI et a été poussée sur `main`. Le pré-commit
hook ne lance que lint-staged (eslint+prettier), pas `tsc` → rien ne l'a
bloquée. Découverte au commit suivant. Corrigée (`value={value}`).

## Règle

Quand `validate:gates` échoue et que je corrige UNE cause, **re-lancer
gates en entier** avant de committer. Une seule sortie verte = feu vert.
Ne pas se fier au build (esbuild ne typecheck pas) ni au pré-commit
(lint seulement). `pnpm typecheck` ≠ `pnpm build`.

## Pour que ça ne se reproduise pas

- Réflexe : `gate rouge → fix → gate vert → commit`. Jamais `fix → commit`.
- Option future : ajouter `tsc --noEmit` au pre-commit hook (coût ~quelques
  secondes) pour attraper les erreurs de type avant le push.
