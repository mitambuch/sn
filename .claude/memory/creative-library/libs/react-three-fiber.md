---
id: lib-react-three-fiber
date: 2026-04-23
type: lib
tags: [#lib, #design, #3d, #animation, #template, #active]
scope: template
status: active
---

# React Three Fiber — Three.js en composants React

## Quoi

Renderer React pour Three.js maintenu par **Poimandres (pmnd.rs)**.
Package npm : `@react-three/fiber`. Bundle : ~180 KB gzip (Three.js inclus).
Companion packages utiles : `@react-three/drei` (helpers), `@react-three/postprocessing`.

## Quand l'utiliser

- Hero 3D interactif (scroll-driven, hover, drag)
- Product viewer 3D (GLB/GLTF model)
- Particules, shaders, effets visuels générateurs
- Canvas décoratif animé en fond de section
- Quand le projet nécessite du WebGL sans écrire Three.js impératif

## Quand éviter

- Site SEO-first content-heavy (canvas non-indexé)
- Mobile low-end (GPU memory > 40 MB minimum)
- Brief "minimal / fast loading" — 180 KB gzip de bundle
- Simple animation 2D — prefer `motion` ou CSS
- `prefers-reduced-motion` fort → image statique fallback obligatoire

## API essentiels

- `<Canvas>` — racine du contexte Three.js + WebGL renderer
- `useFrame(cb)` — hook rAF, appelé chaque frame, reçoit `state` + `delta`
- `useThree()` — accès à `camera`, `scene`, `gl`, `size`
- `useLoader(TextureLoader, url)` — charge assets avec Suspense
- `<mesh>` / `<group>` — mappent 1:1 sur objets Three.js
- `<boxGeometry args={[w,h,d]}` — géométrie déclarative
- `<meshStandardMaterial color="…">` — matériau PBR
- `extend({ CustomClass })` — enregistre classes Three.js custom
- `dpr={[1, 2]}` prop sur Canvas — limite pixel ratio retina
- `frameloop="demand"` — render on demand (économie batterie)

## Snippet minimal

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

function SpinningBox() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e91e63" />
    </mesh>
  );
}

export function R3FDemo() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <SpinningBox />
    </Canvas>
  );
}
```

## Intégration avec notre stack

- Vite 7 : fonctionne out-of-the-box, pas de plugin requis
- React 19 : compatible — utilise `createRoot` en interne
- TS 5.9 : types via `@types/three` (peer dep à installer)
- Tailwind 4 : le `<Canvas>` doit avoir `width/height` explicite ou parent `h-screen`
- Lazy-load obligatoire via `React.lazy` — jamais dans le bundle principal

## Dépendances / peer deps

- `three` >= 0.155 (peer dep obligatoire)
- `@types/three` (devDependency)
- `@react-three/drei` recommandé (helpers : `OrbitControls`, `Environment`, `Html`)

## Refs

- Docs officielles — https://docs.pmnd.rs/react-three-fiber/getting-started/introduction
- Exemples pmnd.rs — https://docs.pmnd.rs/react-three-fiber/getting-started/examples
- Three.js docs — https://threejs.org/docs/

## Cross-refs

- `mechanics/scroll-driven-3d.md` — usage scroll + r3f
- `mechanics/rotating-3d-words.md` — texte 3D animé
- `mechanics/word-particle-field.md` — particules WebGL
