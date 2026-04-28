---
id: creative-library-readme
date: 2026-04-23
type: reference
tags: [#design, #template, #active, #p0]
scope: template
status: active
---

# Creative Library — catalogue d'ambition créative

## Why

Sawnext post-mortem (2026-04-23) : face à 4 mots à mettre en avant,
réflexe basique (`flex` + carousel) au lieu de mise en scène (roulette
3D + scroll-driven + snake-cursor). Racine : pas de vocabulaire
créatif web 2026 (corpus entraînement ~ 2018-2022). Fix : catalogue
explicite que je **dois** consulter avant toute passe UI.

## Structure

```
.claude/memory/creative-library/
├── README.md                    ← tu es ici
├── references/                  ← sites/repos étudiés
│   ├── uipro/                   ← extraits de UI UX Pro Max (Phase 1)
│   │   ├── styles-catalog.md    ← 80+ styles groupés signature/vocab/slop
│   │   ├── palettes-industry.md ← 160 palettes mappées industrie
│   │   ├── font-pairings.md     ← 70+ pairings curated
│   │   └── ux-guidelines.md     ← 99 guidelines top-signal
│   ├── bruno-simon.md           ← portfolio 3D iconique (Phase 2)
│   ├── codrops.md               ← démos tympanus.net (Phase 2)
│   ├── awwwards-top-2026.md     ← inspiration running
│   └── owner-repos/             ← repos propres
├── mechanics/                   ← mécaniques signature visuelles
├── interactions/                ← patterns comportementaux (share, deep-link, ...)
├── libs/                        ← docs libs 2026 (r3f, GSAP, Lenis, …)
└── anti-patterns/               ← AI slop à éviter
```

## Ordre de consultation (non-trivial UI task)

Pour toute passe UI (nouvelle page, section refonte, token rework,
design redirection) :

1. **`mechanics/`** — 2+ mécaniques pertinentes à citer dans VISION
2. **`interactions/`** — 1 pattern comportemental à citer dans UX
   (`Micro-feature signature`)
3. **`references/`** — 1-2 sites/repos benchmarks concrets
4. **`anti-patterns/`** — vérifier qu'on ne retombe pas dedans
5. **`libs/`** — libs appropriées à la mécanique choisie
6. **`src/workbench/playground/`** — pattern existant à réutiliser

Règles :
- `vision-first.md` + `creative-ambition.md` imposent **2+ mechanics**
  citées dans le bloc VISION avant la 1ère Edit.
- `ux-first.md` impose **1 interaction** citée dans le bloc UX avant
  la 1ère Edit (page ou section utilisateur).

## Grow-it discipline

Chaque fois qu'on voit un site/repo remarquable :
- `creative-library/references/<slug>.md` avec breakdown 5-10 min
- Si une mécanique est réutilisable → `mechanics/<slug>.md`
- Si une lib est adoptée → `libs/<slug>.md`

Script (Phase 3) : `pnpm creative:add <slug>` scaffold une fiche vierge.

## Anti-slop filter (règle stricte)

Quand j'extrais depuis une source externe (ex : uipro), je **rejette**
systématiquement :
- Combos luxury-AI-slop : Cormorant Garamond + Gold + Soft Pink pour
  "luxury spa wellness"
- Hero centré + fade-in + gradient violet pastel
- "Safe" par défaut quand l'input ask de l'ambition

Je **garde** le vocabulaire (nom du style, keywords, quand l'utiliser)
parce que c'est l'outil, pas la direction finale.

## Source repos

- UI UX Pro Max (owner-pointed 2026-04-23) :
  https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  → extraction curée dans `references/uipro/` (pas d'install plugin)

## Cross-refs

- `.claude/rules/vision-first.md` — mandate VISION block
- `.claude/rules/creative-ambition.md` (Phase 2) — mandate 2+ mechanics
- `.claude/rules/anti-complaisance.md` — CHALLENGE sur absolus/R2
- `.claude/memory/patterns/2026-04-23-vision-before-code.md` — source
  pattern du VISION flow
