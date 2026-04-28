---
id: 2026-04-23-reuse-workbench-first
date: 2026-04-23
type: feedback
tags: [#workflow, #feedback, #template, #active, #p0]
scope: template
status: active
---

# Reuse workbench-first — grep avant d'écrire un composant

## Règle

**Avant d'écrire tout composant de card, menu, bouton, carousel ou
layout, je dois grepper `src/workbench/playground/` pour vérifier qu'il
n'existe pas déjà**. Si un pattern similaire existe, je le reprends
(copie + adapte) plutôt que de recréer from scratch.

Commande type au début de toute tâche UI :
```bash
ls src/workbench/playground/{cards,menus,buttons,heros,sections,backgrounds}/
```

## Why

Session 2026-04-23 Sawnext. L'owner a dû me pointer **explicitement** :

> regarde ces box : @workbench/playground/cards/ProductCard
> @workbench/playground/menus/AsymmetricSplit
> @workbench/playground/menus/CommandPillK
> @workbench/playground/menus/SideRail (menu pour dashboard)
> @workbench/playground/cards/ArticleCard
> @workbench/playground/buttons/MagneticWipe
>
> T'AS RIEN RéUTILISé putain ahah.

Ces 6 composants étaient exactement ce qu'il cherchait comme DA. Je les
ai ignorés pendant 3 passes de refonte UI. J'ai recréé :

- Des cards carrées au lieu de `ProductCard` (aspect-square + radial
  gradient + badge + CTA pill)
- Un menu burger fullscreen overlay au lieu d'`AsymmetricSplit` (logo
  gauche + nav inline + CTA droite)
- Un sidebar privé basique au lieu de `SideRail` (w-16 → w-56 on hover)
- Des boutons plats au lieu de `MagneticWipe` (fg wipe-in on hover)

CLAUDE.md §`Reuse-first` l'imposait déjà (« Before creating ANY
component, check existing ones in this order: 1. `src/components/ui/`,
2. `src/components/layout/`, 3. `src/workbench/playground/shared/` »).
**Workbench n'était même pas dans cette liste**. C'est un trou du
workflow : le playground est où vivent les patterns les plus aboutis,
mais la règle les ignore.

## How to apply

### Checklist AVANT la première Edit/Write sur un composant UI

1. `ls src/workbench/playground/` — lister les dossiers.
2. Si je monte une card → `ls src/workbench/playground/cards/`,
   lire tout fichier qui matche (ProductCard, ArticleCard, etc.).
3. Si je monte un menu → `ls src/workbench/playground/menus/`,
   idem.
4. Si je monte un CTA → `ls src/workbench/playground/buttons/`, idem.
5. Si un match existe, je l'annonce : *« je reprends le pattern
   `ProductCard` pour les cards catalogue — adapté aux données `Bien`. »*
6. Si aucun match, je dis pourquoi je crée de zéro.

### Copie vs adaptation

- **Copier la structure JSX** (grid, aspect-ratio, badges, pill CTA).
- **Adapter les tokens** (couleurs, données, labels).
- **Ne pas importer directement** depuis `workbench/` dans la prod
  (ESLint bloque cette boundary) — copier le pattern, pas le fichier.

### Quand créer from scratch est justifié

- Aucun composant workbench ne couvre le besoin (rare).
- Le besoin est trivial (1 div 1 classe — pas un composant).
- Le composant workbench est obsolète (ne suit plus les tokens actuels).

Dans les 3 cas, je dois le dire explicitement, pas l'implicite par
oubli.

## Intéraction avec CLAUDE.md

Proposition de patch à CLAUDE.md `§Reuse-first` :

```
## Reuse-first (mandatory)
Before creating ANY component, check existing ones in this order:
1. `src/workbench/playground/{cards,menus,buttons,heros,sections}/`
   — the most complete patterns live here. MUST be checked first.
2. `src/components/ui/` — 24 atoms (Button, Card, Modal, Select, Tabs…)
3. `src/components/layout/` — Header, Container
4. `src/workbench/playground/shared/` — Copyable, Swatch, Section…
If something exists: use it or extend it. Never recreate.
```

L'ordre est inversé parce que workbench c'est LÀ où on ship les
patterns design-system-complets. Les atoms UI sont les briques de base.

(Le CLAUDE.md de Sawnext ne peut pas être patché via base:update car
client-owned. Le patch doit viser le template racine steaksoap.)

## Cross-refs

- Rule à patcher : `CLAUDE.md §Reuse-first` (dans le repo **template**
  steaksoap, pas ici)
- Incident source : `sessions/2026-04-23-1133-cancelled-meeting-debrief.md`
- Feedback voisin : `feedback/2026-04-23-content-first-before-any-code.md`,
  `feedback/2026-04-23-absolutes-trigger-challenge.md`
