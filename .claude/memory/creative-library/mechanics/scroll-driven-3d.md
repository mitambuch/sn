---
id: mechanic-scroll-driven-3d
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #3d, #scroll, #template, #active]
scope: template
status: active
---

# Scroll-driven 3D — scène 3D qui s'anime au scroll

## Quoi

Une scène `<Canvas>` r3f (Three.js) dont la caméra, les objets, les
matériaux ou les lights sont **pilotés par le scroll progress** —
pas par du time-based déroulé. L'user contrôle le tempo.

Utilisé dans les portfolios de top studios (Lusion, ActiveTheory,
Bruno Simon, Resn). Référence 2026 pour un hero "putain de ouff".

## Quand l'utiliser

- Hero de site agence / portfolio / case study premium
- Page produit avec 3D model rotation piloté scroll
- Section "notre processus" transformée en déplacement 3D cinéma
- Annual report long-form avec 3D metaphor (data → shapes)
- Intro/cover de site brand qui ne veut **pas** de hero carousel

## Quand éviter

- SaaS productif dashboard — distrait de la tâche
- Mobile low-end — `<Canvas>` coûte 40-80 MB GPU memory minimum
- Site SEO-first content-heavy — JS-required, donc indexation
  partielle si bot non-JS
- Brief demande explicit "minimal" / "fast loading"
- Budget perf strict : Canvas + Three.js = 180-300 KB gzip minimum

Fallback obligatoire : `prefers-reduced-motion` → scène statique
première frame, ou image rendered pre-computed fallback.

## Implémentation minimale (r3f + GSAP ScrollTrigger)

```tsx
// src/workbench/playground/scroll-driven/ScrollDriven3DDemo.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function RotatingMesh() {
  const ref = useRef<THREE.Mesh>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current.rotation, {
      y: Math.PI * 2,
      scrollTrigger: {
        trigger: '#scene-scroll-wrap',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // smooth tie to scroll velocity
      },
    });
  }, []);
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export function ScrollDriven3DDemo() {
  return (
    <div id="scene-scroll-wrap" style={{ height: '300vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RotatingMesh />
        </Canvas>
      </div>
    </div>
  );
}
```

Pattern structural :
1. Wrapper `height: 300vh` pour donner du scroll space
2. Child `sticky top: 0, height: 100vh` pour que le canvas reste
3. `scrub: 1` tie animation progress à scroll velocity
4. Alternative CSS-only : `animation-timeline: scroll()` (v. `mechanics/view-transitions-native.md`)

## Variantes

- **Camera dolly** : camera avance dans la scène au scroll (pas l'objet qui tourne)
- **Morph target** : mesh change de forme au scroll (clay → crystal → glass)
- **Layered depth** : plusieurs objets à z-indexes 3D décalés se révèlent progressive
- **Shader-driven** : uniform shader piloté scroll (waves, noise, distortion)

## Performance / budget

- `<Canvas>` default 60 FPS → throttle en `dpr={[1, 2]}` pour retina
- `<Perf />` depuis `r3f-perf` en dev pour monitorer
- Lazy-load le composant : `const ScrollDriven3DDemo = lazy(() => import(...))`
- Bundle : r3f + drei + three = ~180 KB gzip → lazy-only
- `<Suspense fallback>` pendant chargement

## a11y

- `prefers-reduced-motion` → render first frame static
- Aria : le canvas est décoratif, `<div role="img" aria-label="...">` wrap
- Keyboard : s'assurer que le scroll fonctionne via clavier (arrow keys)

## Refs

- Bruno Simon portfolio — https://bruno-simon.com/
- r3f docs — https://docs.pmnd.rs/react-three-fiber
- GSAP ScrollTrigger — https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- `libs/react-three-fiber.md` (Phase 2)
- `libs/gsap-scrolltrigger.md` (Phase 2)

## Cross-refs

- `mechanics/rotating-3d-words.md` — variante texto de scroll-driven-3d
- `mechanics/cinematic-scroll-hero.md` — version 100vh storytelling
- `references/bruno-simon.md` (Phase 2) — étude de cas
- `anti-patterns/safe-centered-hero.md` — ce qu'on remplace
