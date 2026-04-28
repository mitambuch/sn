---
id: mechanic-generative-canvas-bg
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #canvas, #generative, #animation, #template, #active]
scope: template
status: active
---

# Generative Canvas Background — fond animé procédural sur `<canvas>`

## Quoi

Un fond de page ou de section généré algorithmiquement sur un élément
`<canvas>` 2D — particules, noise de Perlin, flow fields, métaballs —
animé en boucle ou réactif au curseur. Remplace les gradients statiques
et les vidéos background lourdes par quelque chose de vivant et léger.

## Quand l'utiliser

- Hero sombre avec fond "ambiant" vivant (agence tech, studio créatif)
- Section "about" ou "manifeste" avec fond texture organique
- Page d'erreur 404 avec fond interactif (curiosité plutôt que frustration)
- Overlay de chargement (loading screen génératif)
- Brief contenant "digital", "data", "vivant", "ambiance"

## Quand éviter

- Above-the-fold sur mobile low-end — canvas 2D consomme CPU, pas GPU
- Site e-commerce dense — le fond génératif vole l'attention aux produits
- Fond avec texte de lisibilité critique — assurer contraste suffisant
- `prefers-reduced-motion: reduce` → image statique ou gradient simple

## Implémentation minimale (Perlin noise particles, vanilla canvas)

```tsx
// src/workbench/playground/generative-bg/GenerativeBgDemo.tsx
import { useEffect, useRef } from 'react';

// pseudo : Perlin noise simplifié — remplacer par simplex-noise en prod
function noise(x: number, y: number, t: number) {
  return Math.sin(x * 0.3 + t) * Math.cos(y * 0.3 + t) * 0.5 + 0.5;
}

export function GenerativeBgDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    let t = 0;
    const COLS = 20, ROWS = 20;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cw = canvas.width / COLS, ch = canvas.height / ROWS;
      for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
          const n = noise(x, y, t);
          ctx.fillStyle = `hsla(${200 + n * 60}, 70%, 50%, ${n * 0.4})`;
          ctx.beginPath();
          ctx.arc(x * cw + cw / 2, y * ch + ch / 2, n * cw * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      t += 0.008;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
```

## Variantes

- **Flow field** : particules qui suivent des vecteurs noise (effet "vent" ou "eau")
- **Métaballs** : blobs qui se fusionnent et se séparent (organique, biotech)
- **Constellation** : points connectés par lignes si proches (effet réseau, tech)
- **WebGL shader** : noise GLSL directement dans le GPU via r3f `<ShaderMaterial>` — 10x plus performant pour > 10k points

## Performance / budget

- Canvas 2D : idéal jusqu'à ~2000 particules à 60 FPS sur desktop
- Au-delà : WebGL (`<ShaderMaterial>` r3f) ou `OffscreenCanvas` + Worker
- `requestAnimationFrame` : toujours cleanup sur unmount (ref ticker)
- `canvas.width = canvas.offsetWidth` au resize : gérer avec ResizeObserver, pas `window.resize`
- simplex-noise npm : ~6 KB gzip — à importer si noise Perlin réel nécessaire

## a11y

- `aria-hidden="true"` sur le canvas — entièrement décoratif
- `prefers-reduced-motion: reduce` → `cancelAnimationFrame`, canvas figé ou remplacé par gradient statique
- Contraste texte sur fond génératif : toujours vérifier avec un overlay semi-opaque si nécessaire

## Refs

- simplex-noise npm — https://www.npmjs.com/package/simplex-noise
- MDN Canvas API — https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- MDN requestAnimationFrame — https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

## Cross-refs

- `mechanics/word-particle-field.md` — variante typographique du canvas génératif
- `mechanics/scroll-driven-3d.md` — alternative 3D GPU pour les effets ambitieux
- `libs/react-three-fiber.md` (Phase 2) — si WebGL upgrade nécessaire
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
