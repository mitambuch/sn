---
id: friction-2026-04-19-husky-blocks-merge-commits
date: 2026-04-19
type: friction
tags: [#git, #friction, #template, #p1, #deprecated]
scope: template
status: deprecated
---

# Husky pre-commit bloque les merge commits `--no-ff` sur main

## ✓ Résolu 2026-04-19 (session 1510)

Patch appliqué dans `.husky/pre-commit` (lignes 19-25) : détection de
`.git/MERGE_HEAD` avant le check de branche. Validé empiriquement par
le merge `--no-ff feat/playground-buttons` de la bible v6.4.

Entrée conservée pour historique. Status `deprecated` — ne plus agir.

## Ce qui bloque

`.husky/pre-commit` refuse tout commit quand `git rev-parse --abbrev-ref HEAD == "main"`.
Cela bloque aussi les **merge commits** (`git merge --no-ff <branch>`),
alors que ces merges sont le protocole officiel documenté dans
`.claude/rules/workflow.md` (§Merge & push).

**Reproduction** (2026-04-19 après-midi) :
```bash
git checkout main
git merge --no-ff feat/anti-complaisance -m "merge(...)"
# Le merge staged tout, puis au commit :
#   ✗ refuse: commit on main is not allowed.
#   → run: git checkout -b <type>/<scope>
# husky - pre-commit script failed (code 1)
```

## Résolution employée

Abort + fast-forward merge (perte du commit de merge explicite mais
histoire des 8 commits préservée linéairement) :

```bash
git merge --abort
git merge --ff-only feat/anti-complaisance
git branch -d feat/anti-complaisance
```

## Ce qu'il faut pour que ça ne se reproduise pas

Fixer `.husky/pre-commit` en détectant les merge commits avant le check
de branche. Patch suggéré :

```bash
# Allow merge commits on main (audit trail via --no-ff)
if [ -f .git/MERGE_HEAD ]; then
  pnpm lint-staged
  exit 0
fi

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  ...
fi
```

Cette check `-f .git/MERGE_HEAD` ne détecte que quand un merge est
**en cours** (fichier créé par git merge et supprimé par le commit final).
Sécurité préservée : un commit normal sur main reste bloqué.

## Pourquoi c'est p1 et pas p2

- Bloquant à chaque merge --no-ff, qui est le protocole documenté.
- Contourner par --ff-only dégrade l'audit trail (le log ne montre plus
  "Merge branch X" mais juste les commits linéaires).
- Force des contournements ad-hoc à répétition — de la dette.

## Prochain pas

Branche dédiée `fix/husky-allow-merge-commits` à créer lors d'un
prochain tour — ~5 min de taf, fix + test sur un merge --no-ff dummy.

## Cross-refs

- Fichier concerné : `.husky/pre-commit`
- Règle protocole : `.claude/rules/workflow.md` §Merge & push
- Rencontré lors de : session `sessions/2026-04-19-1415.md`
  (merge feat/anti-complaisance vers main)
