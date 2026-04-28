---
id: decision-2026-04-19-coverage-ratchet-reset
date: 2026-04-19
type: decision
tags: [#testing, #decision, #template, #p1, #active]
scope: template
status: active
---

# Coverage ratchet — reset DOWN for v6.4 (owner approved)

## Context

Release v6.4.0 "Playground Bible" a ajouté 166+ specimens tagués (boutons,
menus, heros, cards, gradients, loaders, etc.) sans tests associés. Le
`validate:full` pipeline a échoué parce que la couverture a chuté :

| Métrique | Avant (v5.2.0) | Après (v6.4) | Delta |
|---|---|---|---|
| statements | 90.15% (seuil 88) | 81.9% | −8.25 |
| branches | 81.26% (seuil 80) | 70.35% | −10.91 |
| functions | 90.76% (seuil 89) | 78.89% | −11.87 |
| lines | 92.37% (seuil 91) | 84.78% | −7.59 |

## Règle existante

`testing.md` : *"Thresholds are set in vitest.config.ts — they are a
ratchet (only go UP). Never lower thresholds without explicit owner
approval."*

## Decision

**Owner a explicitement approuvé** (anti-complaisance rule en action :
la dette est loggée, pas cachée). Nouveaux seuils :

| Métrique | Nouveau seuil | Marge vs actuel |
|---|---|---|
| statements | 81 | 0.9 |
| branches | 69 | 1.35 |
| functions | 78 | 0.89 |
| lines | 84 | 0.78 |

Marge ~1pt pour absorber la jitter per-run, comme avant.

## Alternatives rejetées

| Alt | Pourquoi rejetée |
|---|---|
| Écrire tests sur les 166 specimens maintenant | 6-10h de travail, owner voulait cut la release aujourd'hui |
| Exclure `src/workbench/` de la couverture | Cache la dette, pas cohérent avec la règle "dette loggée" |
| Skip coverage (`--no-plugin-v8`) | Triche frontale, interdite |
| Garder anciens seuils + release échoue | Shippe pas, mauvais produit pour l'owner |

## Plan pour regagner les seuils

Cibles à atteindre, priorité haute → basse :

1. **Shared utilities** (3-4h, gros gain rapide) :
   - `shared/SpecimenFrame.tsx` · `shared/MenuFrame.tsx` · `shared/Block.tsx`
   - `shared/TypeRow.tsx` · `shared/ZoneBanner.tsx`
   - `hooks/useBodyScrollLock.ts`
   - `tags.ts` — types only, pas de logic
2. **Atoms ajoutés** (1-2h) :
   - `components/ui/LanguageSwitcher.tsx`
3. **Specimens à haute interaction** (2-3h) :
   - Menus avec state (ScrollAdaptive, CommandPillK, MegaDropdown)
   - Forms specimens (FloatingLabel, PasswordVisibility, FileUpload)
   - Overlays specimens (ConfirmDialog, RightDrawer, BottomSheet)
4. **Ratchet UP au fil de l'eau** : dès qu'un test passe les seuils,
   bumper le threshold correspondant dans vitest.config.ts.

## Cross-refs

- Règle : `.claude/rules/testing.md` §Coverage
- Config : `vitest.config.ts`
- Décision release v6.4 : sera auto-générée par
  `scripts/memory-record-release.js`
- Dette formellement acceptée par l'owner le 2026-04-19 15:20 via option
  A du bloc `ACTION HUMAINE REQUISE` émis par Claude.
