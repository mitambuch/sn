---
id: lib-motion
date: 2026-04-23
type: lib
tags: [#lib, #design, #animation, #template, #active]
scope: template
status: active
---

# Motion — animation React déclarative (ex-Framer Motion)

## Quoi

Librairie d'animation React maintenue par **Matt Perry**.
Anciennement publiée sous `framer-motion` — **renommée `motion` en 2026**
(même équipe, même API, package npm : `motion`).
Bundle : ~25 KB gzip pour le core React (tree-shakeable).
Le package `framer-motion` reste disponible comme alias de compatibilité.

## Quand l'utiliser

- Animations UI déclaratives : fade, slide, scale sur mount/unmount
- Transitions entre routes (layout animations, shared element)
- Gestures : drag, hover, tap avec spring physics
- AnimatePresence pour exit animations propres
- Stagger d'éléments de liste
- Quand GSAP est overkill et qu'on veut rester React-idiomatic

## Quand éviter

- Animations scroll-driven complexes — GSAP ScrollTrigger est plus adapté
- Scènes 3D — r3f
- Si bundle très contraint : 25 KB gzip minimum même tree-shaken
- Animations SVG path complexes — GSAP MorphSVG ou CSS pur selon cas

## API essentiels

- `<motion.div>` — composant animé (fonctionne avec tout élément HTML/SVG)
- `animate`, `initial`, `exit` props — états d'animation déclaratifs
- `variants` — définit des états nommés réutilisables
- `<AnimatePresence>` — permet les exit animations sur unmount
- `useAnimate()` — hook impératif pour contrôle fin
- `useMotionValue(init)` — valeur réactive liée à l'animation
- `useSpring(value, config)` — spring physics sur une MotionValue
- `useScroll()` — scroll progress (alternative légère à GSAP ST)
- `whileHover`, `whileTap`, `whileDrag` — gesture shortcuts
- `layout` prop — anime automatiquement les changements de layout

## Snippet minimal

```tsx
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function FadeCard({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          Contenu de la card
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Intégration avec notre stack

- Import : `from 'motion/react'` (nouveau chemin 2026, anciennement `framer-motion`)
- Vite 7 : fonctionne out-of-the-box, tree-shaking automatique
- React 19 : compatible — utilise les hooks React standard
- Tailwind 4 : `className` coexiste sans conflit avec les props motion
- TS 5.9 : types inclus dans le package

## Dépendances / peer deps

- `react` >= 18 (peer dep)
- Aucune autre dépendance

## Refs

- Docs officielles — https://motion.dev/docs/react-quick-start
- API reference — https://motion.dev/docs/react-motion-component
- Migration framer-motion → motion — https://motion.dev/blog/framer-motion-is-now-independent-motion

## Cross-refs

- `mechanics/magnetic-hover.md` — hover avec spring physics motion
- `mechanics/masked-reveal.md` — reveal animé au mount
- `mechanics/morphing-typography.md` — layout animation sur texte
