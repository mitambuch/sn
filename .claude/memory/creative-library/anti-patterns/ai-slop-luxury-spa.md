---
id: anti-pattern-ai-slop-luxury-spa
date: 2026-04-23
type: anti-pattern
tags: [#anti-pattern, #design, #template, #active]
scope: template
status: active
---

# AI Slop — Luxury / Spa palette

## Le pattern

Hero plein écran. Fond `#FAF7F5` (warm white). Heading en **Cormorant
Garamond** italic, 72px, couleur `#1C1917`. Body en **Montserrat** 16px
`#78716C`. CTA button `background: #D4AF37` (or, bien sûr), border-radius
8px. Palette complète : Soft Pink `#E8B4B8` · Sage Green `#A8D5BA` · Gold
`#D4AF37` · Warm White `#FFF8F3`. Sidebar ou accent `#C9A96E`. Peut-être
des feuilles SVG en décoration, ou une vague SVG douce en footer divider.

Ce pattern est si précis que son README existe sur GitHub :
[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
le livre dans sa CSV — "Spa & Wellness", "Luxury/Premium Brand" → mêmes
hex, mêmes fontes, mêmes proportions.

## Pourquoi c'est l'AI slop 2020-2024

Quand on demande "luxury spa website" à n'importe quel modèle génératif,
il active un cluster de tokens statistiquement dominant dans son corpus :
Pinterest spa aesthetics + Squarespace templates wellness + Behance case
studies branding beauté. Cormorant Garamond = "élégance" dans le corpus.
Or = "luxe" dans le corpus. Rose poudré = "féminin doux" dans le corpus.
Résultat : chaque modèle fait la même inférence et sort le même output.

C'est né utile : en 2018-2020, cette direction était fraîche. En 2024,
c'est la wallpaper par défaut de 40 000 spas sur Squarespace.

**Cas réel** : saw-next (2026-04-23). Le client voulait "luxe". Claude a
dû résister à l'inférence spa-pink et sortir glass cards + pastels
non-conventionnels + noir cassé — parce que "luxe" n'est pas une palette,
c'est un rapport au détail et à la rareté.

## Signaux de détection

- Je suis en train de taper `font-family: 'Cormorant Garamond'`
- Mon CTA est `background-color: #D4AF37` ou variante proche
- Le fond est `#FFF8F3` ou `#FAF7F5`
- J'ai un accent "sage green" quelque part
- La palette a à la fois du rose poudré ET du vert sauge ET de l'or
- Je pense "c'est élégant" mais je n'ai aucun brief qui dit "rose poudré"

## Alternatives ambitieuses

1. **Luxe éditorial** : noir cassé `#201A17` + vermillon `#C0392B` + blanc
   cassé crème. Fontes : PP Editorial New ou Playfair Display en ultra-light
   italic + mono pour les labels. Zéro or, zéro rose.
2. **Glass luxury** (saw-next pattern) : fond sombre ou neutre profond +
   glass cards avec `backdrop-filter: blur(20px)` + pastels désaturés non-cliché
   (lilas `#B8A9C9`, sage froid `#8FA89A`) + typo sans-serif condensed.
   Voir `mechanics/masked-reveal.md` pour l'entrée des cards.
3. **Blanc + matière** : fond blanc pur, typographie massive editorial,
   une seule couleur d'accent atypique (cyan électrique, vert forêt profond,
   terracotta). Layout asymétrique. Voir `references/uipro/styles-catalog.md`
   Tier 1 → "Exaggerated Minimalism".

## Quand c'est quand même acceptable

- Brief explicit "we want the classic spa look, our clients are 55+,
  aucune surprise" → livrable safe pour une audience conservatrice.
- Gouvernance interne : le client a déjà cette direction chez un concurrent
  et veut un me-too délibéré (acquisition par ressemblance).
- Budget très limité + timeline serrée : le pattern est au moins WCAG AA
  et UX correct. C'est safe, pas ambitieux.

## Cross-refs

- `references/uipro/palettes-industry.md` — Beauty/Spa/Wellness ⚠ slop alert
- `references/uipro/styles-catalog.md` — Tier 3 styles à éviter
- `mechanics/masked-reveal.md` — entrée glass cards alternative
- `mechanics/generative-canvas-bg.md` — alternative au fond uni
