---
id: mechanic-masked-reveal
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #scroll, #animation, #typography, #template, #active]
scope: template
status: active
---

# Masked Reveal — texte ou image révélé par un masque qui s'ouvre

## Quoi

Un élément (texte, image, section) caché derrière un masque CSS/SVG qui
s'ouvre progressivement — au scroll, au load, ou au hover. Crée une
révélation dramatique sans JavaScript complexe. Signature visuelle des
sites édito premium et des case studies agence 2025-2026.

## Quand l'utiliser

- Titre hero qui se révèle au chargement de la page (brand moment)
- Image produit qui s'ouvre au scroll (e-commerce haut de gamme)
- Texte de section qui apparaît ligne par ligne (storytelling long-form)
- Cover de case study : image révélée derrière le titre
- Transition entre sections : wipe horizontal ou vertical

## Quand éviter

- Contenu above-the-fold critique — le masquage retarde la perception
- Texte informatif court (FAQs, product descriptions) — friction inutile
- Sites haute accessibilité ou lecture facile — révélation progressive frustre
- `prefers-reduced-motion: reduce` → afficher directement sans animation

## Implémentation minimale (CSS clip-path + Motion)

```tsx
// src/workbench/playground/masked-reveal/MaskedReveal.tsx
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right';
}

export function MaskedReveal({ children, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  const variants = {
    hidden: { clipPath: direction === 'up'
      ? 'inset(100% 0% 0% 0%)'
      : direction === 'left'
      ? 'inset(0% 100% 0% 0%)'
      : 'inset(0% 0% 0% 100%)' },
    visible: { clipPath: 'inset(0% 0% 0% 0%)' },
  };

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

CSS-only variant (scroll-driven, sans JS) :
```css
.masked { animation: reveal linear both; animation-timeline: view(); animation-range: entry 0% entry 40%; }
@keyframes reveal { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0% 0 0 0); } }
@media (prefers-reduced-motion: reduce) { .masked { animation: none; } }
```

## Variantes

- **Line-by-line** : chaque ligne de texte dans son propre wrapper, délai staggeré
- **Circle expand** : masque circulaire qui grandit depuis le centre (`clip-path: circle(0% → 100%)`)
- **SVG mask** : forme organique (blob, splash) comme masque (plus expressif que clip-path)
- **Image wipe** : image derrière un overlay couleur qui s'efface au scroll

## Performance / budget

- `clip-path` est accéléré GPU — pas de layout recalc
- Ne jamais animer `width/height` pour simuler un reveal — déclenche layout thrashing
- Motion (Framer Motion) : ~30 KB gzip — à partager avec d'autres composants Motion
- CSS-only variant : 0 KB overhead, mais support `animation-timeline: view()` à vérifier (2026 : Chrome/Edge ok, Firefox 2025+)

## a11y

- `prefers-reduced-motion: reduce` → `animation: none` ou `transition: none` ; afficher directement
- L'élément masqué est dans le DOM — pas de problème de lecteur d'écran (contrairement à `display: none`)
- `useInView` avec `once: true` — pas de répétition qui désoriente

## Refs

- Motion (Framer Motion) useInView — https://motion.dev/docs/react-use-in-view
- CSS clip-path — https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path
- CSS animation-timeline: view() — https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline

## Cross-refs

- `mechanics/cinematic-scroll-hero.md` — masked reveal intégré dans un hero scroll
- `mechanics/morphing-typography.md` — après la révélation, le texte peut morphe
- `mechanics/view-transitions-native.md` — alternative native pour les transitions de page
- `libs/motion.md` (Phase 2)
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
