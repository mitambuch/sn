---
id: mechanic-rotating-3d-words
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #3d, #typography, #template, #active]
scope: template
status: active
---

# Rotating 3D Words — texte 3D qui tourne dans l'espace

## Quoi

Des mots ou phrases rendus en 3D via r3f `<Text3D>` ou CSS `transform-style: preserve-3d`,
tournant sur un axe (X, Y ou Z) au scroll, au hover, ou en boucle infinie.
Signature visuelle forte pour les headlines de hero ou les taglines de marque.

## Quand l'utiliser

- Hero headline d'une agence / studio avec identité typographique forte
- Tagline de marque qui veut rompre le plan 2D
- Section "valeurs" ou "services" avec mots-clés qui défilent en 3D
- Transition entre sections (mot qui tourne et révèle le suivant)
- Portfolio : titre de case study en cover page

## Quand éviter

- Body text ou texte informatif — nuit à la lisibilité
- Interfaces fonctionnelles (dashboard, forms) — distraction pure
- Mobile sans test GPU — CSS 3D est ok, r3f `<Text3D>` coûteux
- Brief "sobre / minimaliste" sans volonté typographique affirmée
- Besoin d'indexation SEO fort — `<Text3D>` n'est pas du DOM

## Implémentation minimale (r3f + drei Text3D)

```tsx
// src/workbench/playground/rotating-3d-words/RotatingWordsDemo.tsx
import { Canvas } from '@react-three/fiber';
import { Text3D, Center, useMatcapTexture } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

function Word({ text }: { text: string }) {
  const ref = useRef<Mesh>(null);
  const [matcap] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });

  return (
    <Center ref={ref}>
      <Text3D font="/fonts/helvetiker_regular.typeface.json" size={0.8} height={0.2}>
        {text}
        <meshMatcapMaterial matcap={matcap} />
      </Text3D>
    </Center>
  );
}

export function RotatingWordsDemo() {
  return (
    <div style={{ height: '60vh', background: '#0a0a0a' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Word text="CRÉATIF" />
      </Canvas>
    </div>
  );
}
```

CSS-only variant (preserve-3d, no JS lib needed) :
```css
.word-3d { transform-style: preserve-3d; animation: spin 6s linear infinite; }
@keyframes spin { to { transform: rotateY(360deg); } }
@media (prefers-reduced-motion: reduce) { .word-3d { animation: none; } }
```

## Variantes

- **Flip-word** : mot A tourne 90° → disparaît, mot B entre depuis -90° (headline dynamique)
- **Orbit** : plusieurs mots tournent en ellipse autour d'un point central
- **Scroll-driven** : la rotation est pilotée par le scroll progress (voir `scroll-driven-3d.md`)
- **Shader distortion** : le mesh subit une distorsion noise avant/après la rotation

## Performance / budget

- `<Text3D>` génère un BufferGeometry per mot — ok pour 1-3 mots, lourd pour listes
- Police typeface.json ≈ 60-200 KB selon la fonte — à précharger via `<link rel="preload">`
- CSS `preserve-3d` variant : 0 KB overhead, 60 FPS sur tous devices
- r3f bundle : ~180 KB gzip → lazy-load obligatoire

## a11y

- `prefers-reduced-motion` → stopper la rotation, afficher le mot statique
- Le canvas est décoratif : wrapper `<div role="img" aria-label="[mot]">`
- Ne jamais mettre de texte informatif uniquement dans un `<Text3D>` — doublon DOM invisible requis

## Refs

- drei Text3D — https://drei.pmnd.rs/?path=/docs/abstractions-text3d
- Three.js FontLoader — https://threejs.org/docs/#examples/en/loaders/FontLoader
- CSS 3D transforms — https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style

## Cross-refs

- `mechanics/scroll-driven-3d.md` — piloter la rotation au scroll
- `mechanics/morphing-typography.md` — variante 2D typographique
- `libs/react-three-fiber.md` (Phase 2)
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
- `anti-patterns/safe-centered-hero.md` — ce que ce mechanic remplace
