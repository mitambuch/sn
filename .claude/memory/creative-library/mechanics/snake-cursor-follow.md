---
id: mechanic-snake-cursor-follow
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #cursor, #interaction, #template, #active]
scope: template
status: active
---

# Snake Cursor Follow — traînée de points qui suit le curseur

## Quoi

Une série de points / éléments qui suivent le curseur avec un délai progressif
(chaque nœud suit le précédent), créant un effet serpent ou traînée fluide.
Alternative créative au custom cursor simple — signature interactive immédiate.

## Quand l'utiliser

- Site agence / portfolio où l'interaction est centrale à la proposition de valeur
- Landing page avec hero dark et peu d'éléments — le curseur devient l'animation principale
- Showcase de produit interactif (le snake révèle des infos au passage)
- Lab / playground expérimental
- Toute page où le brief contient "immersif", "luxe", "signature"

## Quand éviter

- Interfaces avec inputs denses (forms, tables) — interfère avec la précision
- Mobile / touch — le curseur n'existe pas ; prévoir fallback complet
- Site avec beaucoup de texte à lire — distraction optique
- Brief "accessible first" ou audience senior — désoriente
- `prefers-reduced-motion: reduce` — couper entièrement

## Implémentation minimale (GSAP + DOM nodes)

```tsx
// src/workbench/playground/snake-cursor/SnakeCursorDemo.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const NODES = 12;
const SIZE = 10; // px

export function SnakeCursorDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = Array.from(containerRef.current?.querySelectorAll('.node') ?? []);
    let mx = 0, my = 0;
    const pos = nodes.map(() => ({ x: 0, y: 0 }));

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const ticker = gsap.ticker.add(() => {
      pos[0].x += (mx - pos[0].x) * 0.35;
      pos[0].y += (my - pos[0].y) * 0.35;
      for (let i = 1; i < NODES; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * 0.35;
        pos[i].y += (pos[i - 1].y - pos[i].y) * 0.35;
      }
      nodes.forEach((n, i) =>
        gsap.set(n, { x: pos[i].x - SIZE / 2, y: pos[i].y - SIZE / 2 })
      );
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {Array.from({ length: NODES }, (_, i) => (
        <div key={i} className="node" style={{
          position: 'fixed', width: SIZE, height: SIZE,
          borderRadius: '50%', background: `hsl(${i * 20}, 80%, 60%)`,
          opacity: 1 - i / NODES,
        }} />
      ))}
    </div>
  );
}
```

## Variantes

- **Elastic single dot** : un seul nœud avec spring lag (GSAP quickSetter + ease)
- **Trail of letters** : les nœuds affichent chacun une lettre d'un mot (ex: marque)
- **Magnetic blend** : la traînée "s'accroche" aux éléments cliquables (`mix-blend-mode: difference`)
- **r3f instanced** : version 3D avec `<InstancedMesh>` pour 100+ nœuds à 60 FPS

## Performance / budget

- DOM version (12 nodes) : < 1 ms par frame via `gsap.set` (direct style mutation)
- Ne jamais utiliser `useState` pour les positions — re-render React = jank garanti
- `pointerEvents: none` obligatoire pour ne pas bloquer les clics
- Sur mobile : détecter `matchMedia('(pointer: coarse)')` et ne pas monter le composant

## a11y

- `prefers-reduced-motion: reduce` → ne pas monter le composant du tout
- Le composant est purement décoratif : `aria-hidden="true"` sur le wrapper
- Ne jamais placer d'information dans les nœuds (invisible aux lecteurs d'écran)

## Refs

- GSAP ticker — https://gsap.com/docs/v3/GSAP/gsap.ticker/
- GSAP quickSetter — https://gsap.com/docs/v3/GSAP/gsap.quickSetter()
- MDN pointer media feature — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer

## Cross-refs

- `mechanics/magnetic-hover.md` — combinaison naturelle avec le snake
- `libs/gsap-core.md` (Phase 2) — ticker pattern
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
- `anti-patterns/default-pointer.md` — ce qu'on remplace
