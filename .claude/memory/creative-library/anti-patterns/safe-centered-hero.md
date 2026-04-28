---
id: anti-pattern-safe-centered-hero
date: 2026-04-23
type: anti-pattern
tags: [#anti-pattern, #design, #template, #active]
scope: template
status: active
---

# Safe Centered Hero — le héro "sans signature"

## Le pattern

Section hero, 100vh, texte centré horizontalement et verticalement.
Hiérarchie en 3 lignes immuables :

1. **Headline** : Inter Bold 56-72px, couleur near-black `#111827`
2. **Subtitle** : Inter Regular 18-20px, `#6B7280`, max-width 520px centré
3. **CTA pair** : bouton primary plein + bouton "Learn more" ghost, gap 16px

Fond : blanc ou `#F9FAFB`. Peut-être une illustration SVG discrète en
background ou un subtle noise texture. Parfois un fade-in entrance
`opacity: 0 → 1, translateY: 20px → 0` sur les 3 éléments, staggeré 0.1s.
Parfois un badge "Trusted by 1000+ companies" au-dessus du headline.

C'est Stripe 2021. C'est Linear. C'est le template Tailwind UI "marketing
hero". C'est propre. C'est juste. C'est invisible.

## Pourquoi c'est l'AI slop 2020-2024

C'est la solution à variance zéro. L'AI génère ce pattern parce qu'il est
sur-représenté dans les datasets de design : les templates Figma gratuits,
les starters Tailwind, les exemples Next.js, les tutos YouTube. Aucun
risque de faire "faux", donc par défaut vers lui.

Le problème : ce n'est pas une direction, c'est l'absence de direction.
Ce hero est brand-indifférent par construction. Le même layout sert un
SaaS de facturation, une agence créative, un outil CLI pour devs. Si le
hero est interchangeable, la marque est absente.

Inter Bold centré = la fonte la plus téléchargée de Google Fonts histoire.
En 2026 elle est omniprésente au point d'être du bruit.

## Signaux de détection

- Mon conteneur hero est `flex items-center justify-center flex-col`
- J'ai une `<h1>` en Inter Bold > 56px centrée
- Il y a un subtitle en `text-gray-500` juste en dessous
- Deux boutons côte à côte, le second est ghost/outline
- L'animation est un `fadeInUp` avec stagger sur les 3 enfants
- Je me dis "c'est clean" mais pas "c'est eux"

## Alternatives ambitieuses

1. **Asymmetric editorial grid** : headline massive en pleine largeur gauche
   (Tier 1 "Editorial Grid" dans `references/uipro/styles-catalog.md`),
   texte support à droite en colonne, CTA en bas-gauche. Ratio asymétrique
   60/40. La mise en page EST la marque.
2. **Kinetic typography** (`mechanics/morphing-typography.md`) : un mot-clé
   central qui mute entre 3-4 valeurs du projet. "We build _fast_ /
   _reliable_ / _yours_". Le hero n'est plus statique — il raconte.
3. **Cinematic scroll hero** (`mechanics/cinematic-scroll-hero.md`) :
   le hero n'est pas une section, c'est une introduction cinématographique.
   Le scroll déroule l'histoire. La headline arrive en dernier, pas en premier.
4. **Scroll-driven 3D** (`mechanics/scroll-driven-3d.md`) : remplace la
   section hero entière par une scène pilotée scroll. Réservé aux sites
   premium qui peuvent justifier le bundle.

## Quand c'est quand même acceptable

- SaaS productif B2B où l'utilisateur veut trouver le pricing en 3 clics,
  pas être impressionné. Clarté > esthétique.
- Accessibilité first : structure prévisible, navigation rapide, focus
  management simple. Le pattern centré est excellent pour ces contextes.
- Brief explicit "simple", "on veut pas d'effets", "nos clients sont
  des ingénieurs" → le safe centered hero est le bon call.
- MVP / prototype : time-to-ship prime l'ambition esthétique.

## Cross-refs

- `mechanics/scroll-driven-3d.md` — remplacement radical du hero
- `mechanics/cinematic-scroll-hero.md` — hero narratif scroll-driven
- `mechanics/morphing-typography.md` — hero avec kinetic word swap
- `references/uipro/styles-catalog.md` — Tier 1 "Asymmetric Grid",
  "Exaggerated Minimalism", "Editorial Layout"
- `anti-patterns/bootstrap-landing-default.md` — le reste de la page
  qui suit ce hero
