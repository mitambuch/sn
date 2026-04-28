---
id: mechanic-word-particle-field
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #canvas, #typography, #generative, #3d, #template, #active]
scope: template
status: active
---

# Word Particle Field — texte formé par des particules

## Quoi

Des milliers de particules qui se rassemblent pour former un mot ou une lettre,
puis s'éparpillent — ou restent en formation réactive au curseur. Rendu via
canvas 2D ou r3f `<InstancedMesh>`. Signature visuelle maximale pour un hero
ou une transition qui veut frapper fort.

## Quand l'utiliser

- Hero "wow" sur un portfolio d'agence ou site de studio créatif
- Intro animée d'un rapport annuel ou d'un showreel
- Page "à propos" avec le nom de la marque formé par des particules
- Case study cover avec le titre du projet
- Tout brief contenant "impressionnant", "audacieux", "show-stopper"

## Quand éviter

- Site e-commerce avec produits à acheter — distraction maximale du tunnel
- Interfaces fonctionnelles — overhead visuel injustifié
- Mobile sans test de perf — instanced mesh sur GPU mobile peut dégradation
- `prefers-reduced-motion: reduce` → texte statique direct, pas d'animation
- Budget dev < 2 jours — le tuning des paramètres (attraction, friction) prend du temps

## Implémentation minimale (canvas 2D, formation + dispersion)

```tsx
// src/workbench/playground/word-particles/WordParticleField.tsx
// pseudo — architecture conceptuelle, adapter spring values à la cible
import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  tx: number; ty: number; // target position (lettre)
  vx: number; vy: number;
}

export function WordParticleField({ word = 'HELLO' }: { word?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // 1. Écrire le mot off-screen pour extraire les pixels
    const offscreen = document.createElement('canvas');
    offscreen.width = 400; offscreen.height = 120;
    const oc = offscreen.getContext('2d')!;
    oc.fillStyle = '#fff';
    oc.font = 'bold 80px sans-serif';
    oc.fillText(word, 20, 90);
    const data = oc.getImageData(0, 0, 400, 120).data;

    // 2. Créer les particules aux positions des pixels blancs (sample every 4px)
    const particles: Particle[] = [];
    for (let y = 0; y < 120; y += 4) {
      for (let x = 0; x < 400; x += 4) {
        if (data[(y * 400 + x) * 4 + 3] > 128) {
          const p: Particle = { tx: x, ty: y, x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: 0, vy: 0 };
          particles.push(p);
        }
      }
    }

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      particles.forEach(p => {
        // spring attraction vers target
        p.vx += (p.tx - p.x) * 0.05;
        p.vy += (p.ty - p.y) * 0.05;
        p.vx *= 0.85; p.vy *= 0.85; // friction
        p.x += p.vx; p.y += p.vy;
        ctx.fillRect(p.x, p.y, 2, 2);
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [word]);

  return <canvas ref={canvasRef} width={600} height={200} aria-hidden="true" style={{ background: '#000' }} />;
}
```

## Variantes

- **r3f InstancedMesh** : 10k+ particules en 3D avec depth et lighting (voir `scroll-driven-3d.md`)
- **Cursor repulsion** : les particules fuient le curseur, reviennent après (interaction réactive)
- **Morph word→word** : les particules migrent d'une formation de mot A vers mot B
- **Color field** : chaque particule a une couleur issue d'une palette brand qui sature à l'arrivée

## Performance / budget

- Canvas 2D : jusqu'à ~3000 particules confortables sur desktop; au-delà, passer WebGL
- r3f `<InstancedMesh>` : 50k+ particules faisables à 60 FPS avec shaders simples
- Toujours canvas `width/height` en pixels réels (pas CSS) pour éviter blur
- Profiler avec Chrome Perf tab — le goulot est souvent la boucle JS, pas le dessin
- Lazy-load du composant obligatoire : `const WordParticleField = lazy(() => import(...))`

## a11y

- `aria-hidden="true"` sur le canvas
- Texte réel en DOM avec `position: absolute; clip: rect(0,0,0,0)` pour screen readers
- `prefers-reduced-motion: reduce` → afficher le texte statique DOM, ne pas monter le canvas
- Ne jamais remplacer un titre `<h1>` uniquement par des particules

## Refs

- MDN Canvas 2D getImageData — https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
- r3f InstancedMesh — https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance
- MDN requestAnimationFrame — https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

## Cross-refs

- `mechanics/generative-canvas-bg.md` — même substrat canvas, usage fond vs. texte
- `mechanics/rotating-3d-words.md` — même intention, approche 3D mesh
- `mechanics/morphing-typography.md` — morph entre formations de mots
- `libs/react-three-fiber.md` (Phase 2) — upgrade vers instanced WebGL
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
