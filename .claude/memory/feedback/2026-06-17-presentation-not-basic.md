---
id: 2026-06-17-presentation-not-basic
date: 2026-06-17
type: feedback
tags: [#design, #feedback, #client-specific, #p0]
scope: client-specific
status: active
---

# « C'est trop basique » — une page doit vivre dans l'univers de la landing

## La correction (owner Mirco, 2026-06-17)

J'ai livré une page de présentation /QR **propre mais plate** : `bg-bg`, des
borders simples, zéro outil visuel du site. Owner : *« faut vraiment que tu
fasses une page jolie et cohérente par rapport au site avec le fond gris le
bruit des effets les grilles et tout… là c'est trop basique »*.

**C'est exactement la récidive de [[2026-05-11-luxury-push-further-bias]]** :
la « sobriété par flemme ». Le minimum-conforme-au-brief sent le template.

## La règle (appliquée cette fois)

Toute page de ce projet doit réutiliser le **langage visuel établi de la
landing**, pas réinventer du générique :

- **Grain** global (déjà là via `body::before`) — laisser respirer, ne pas le
  masquer avec des fonds opaques.
- **Rythme light / ink** : alterner sections `bg-bg` et `bg-ink text-on-ink`
  (Manifesto/Principles sont ink). Une page tout-clair = plate.
- **Marquees ✦** (`<Marquee>`) entre les sections.
- **SectionTag terminal** `↘ NN · Label` avant chaque `<h2>`.
- **Méta-rows terminal** : hairline + `dl` mono `text-[10px] tracking-widest`
  (GPS, type, accès…).
- **mix-blend-difference** sur le mot signature + chrome qui s'auto-inverse.
- **Reveals** `ease-luxe` (`<Reveal>`), hairlines `border-border`/`border-on-ink/15`.

Tout ça existe déjà en composants — `Marquee`, `SectionTag`, `Reveal`,
`useCyclingWord`, `BrandMark`. Une page (pas un atom) peut les importer.

## How to apply

- Avant de coder une page « comme le site » : **lire la landing** (Hero,
  Manifesto, Principles, Marquee, SectionTag) et en extraire le vocabulaire,
  pas partir d'un `bg-bg + border` vierge.
- Pousser 30 % de plus que demandé, montrer en screenshot, l'owner trime.
  Trimmer < pusher.
- Le grain + le rythme ink + les marquees sont le **minimum** pour que ça
  « sente Sawnext », pas un bonus.

## Cross-refs

- [[2026-05-11-luxury-push-further-bias]] (la règle mère, violée puis re-violée)
- `creative-ambition.md`, `vision-first.md`
- `src/pages/Presentation.tsx` (la version corrigée), `src/features/landing/*`
