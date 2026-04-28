---
id: lib-theatre-js
date: 2026-04-23
type: lib
tags: [#lib, #design, #animation, #3d, #template, #active]
scope: template
status: active
---

# Theatre.js — éditeur d'animation visuel pour le web

## Quoi

Système d'animation avec **éditeur studio visuel** maintenu par **Theatre.js org**.
Packages npm : `@theatre/core` + `@theatre/studio` (studio en devDependency).
Bundle : `@theatre/core` ~30 KB gzip ; studio (dev-only) non inclus en prod.
Permet d'animer des propriétés numériques (position, rotation, opacité, uniforms)
avec une timeline type keyframe editor — dans le navigateur, en live.

## Quand l'utiliser

- Scènes r3f avec animations complexes à fine-tuner visuellement (pas en code)
- Séquences cinématiques non-interactives avec timing précis
- Quand le client veut pouvoir éditer les timings sans toucher au code
- Animation de camera path 3D avec keyframes (dolly, orbit, cut)
- Prototypage rapide d'animations compliquées avec retour visuel immédiat

## Quand éviter

- Animations réactives / interactives (hover, scroll-driven) → GSAP ou motion
- Projet budget-serré où le setup overhead n'est pas justifiable
- Animations simples (fade, slide) — overhead de setup disproportionné
- Team non familière avec le concept de timeline keyframe

## API essentiels

- `getProject('nom')` — crée ou récupère un projet Theatre
- `project.ready` — Promise résolue quand le projet est chargé
- `project.sheet('Scène')` — feuille d'animation (contient les objets)
- `sheet.object('Mesh', { props })` — crée un objet animable avec ses props
- `obj.onValuesChange(cb)` — écoute les changements de valeurs (apply à r3f)
- `sheet.sequence.play({ iterationCount, range })` — joue la séquence
- `sheet.sequence.position` — position actuelle (scrub manuel)
- `types.number(default, { range })` — type prop numérique
- `studio.initialize()` — active l'éditeur visuel (dev only)

## Snippet minimal

```tsx
import { getProject, types } from '@theatre/core';
import { useEffect } from 'react';

const project = getProject('Demo');
const sheet = project.sheet('Scene');
const camObj = sheet.object('Camera', {
  x: types.number(0, { range: [-10, 10] }),
  y: types.number(2, { range: [-10, 10] }),
  z: types.number(5, { range: [0, 20] }),
});

export function TheatreCamera() {
  useEffect(() => {
    const unsub = camObj.onValuesChange(({ x, y, z }) => {
      // appliquer à une camera r3f ou un élément DOM
      console.log('camera pos', x, y, z);
    });
    project.ready.then(() => sheet.sequence.play({ iterationCount: 1 }));
    return unsub;
  }, []);

  return null;
}
```

Studio en dev (index.html ou main.tsx) :
```ts
if (import.meta.env.DEV) {
  const { default: studio } = await import('@theatre/studio');
  studio.initialize();
}
```

## Intégration avec notre stack

- Vite 7 : dynamic import conditionnel `import.meta.env.DEV` pour studio
- React 19 : compatible — gestion via hooks et `onValuesChange`
- r3f : combo canonique — `camObj.onValuesChange` → `useThree().camera`
- TS 5.9 : types inclus dans `@theatre/core`
- `@theatre/r3f` package dédié pour intégration directe avec r3f (optionnel)

## Dépendances / peer deps

- `@theatre/studio` en devDependency (éditeur visuel, dev only)
- `@theatre/r3f` optionnel si usage avec React Three Fiber

## Refs

- Docs officielles — https://www.theatrejs.com/docs/latest
- Guide r3f — https://www.theatrejs.com/docs/latest/getting-started/with-react-three-fiber
- GitHub — https://github.com/theatre-js/theatre

## Cross-refs

- `mechanics/scroll-driven-3d.md` — animation 3D avec timeline
- `mechanics/cinematic-scroll-hero.md` — séquence cinématique
- `libs/react-three-fiber.md` — peer lib pour l'usage 3D
