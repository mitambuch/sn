---
id: lib-ogl
date: 2026-04-23
type: lib
tags: [#lib, #design, #3d, #animation, #template, #active]
scope: template
status: active
---

# OGL — WebGL minimal quand Three.js est overkill

## Quoi

Librairie WebGL légère maintenue par **Nathan Gordon (oframe)**.
Package npm : `ogl`. Bundle : **~12 KB gzip** (vs ~180 KB pour Three.js).
Abstractions minimales au-dessus de WebGL — pas de scene graph complet,
pas de matériaux PBR intégrés. Idéal pour effets custom en shader pur.

## Quand l'utiliser

- Background générative canvas (noise, particules, gradient animé)
- Effet shader custom sur un plein-écran quad (post-processing léger)
- Quand Three.js + r3f serait 15x le poids pour un seul effet visuel
- Projet avec budget bundle strict < 50 KB gzip pour la partie WebGL
- Dev qui veut écrire du GLSL sans abstractions Three.js
- Fluid / ripple / distortion sur image de fond

## Quand éviter

- Scènes 3D complexes avec models GLB/GLTF → Three.js + r3f
- Besoin d'une scene graph, shadows, PBR materials → Three.js
- Équipe peu familière avec WebGL/GLSL — courbe d'apprentissage abrupte
- Intégration React declarative souhaitée → r3f est plus ergonomique

## API essentiels

- `new Renderer({ canvas, alpha, antialias })` — crée le renderer WebGL
- `new Camera(gl, { fov, near, far })` — caméra perspective
- `new Transform()` — noeud de la scene (équivalent Object3D)
- `new Mesh(gl, { geometry, program })` — mesh WebGL
- `new Program(gl, { vertex, fragment, uniforms })` — shader program
- `new Geometry(gl, { position, uv })` — géométrie avec attributs
- `new Plane(gl, { width, height })` — géométrie plane helper
- `renderer.render({ scene, camera })` — render loop
- `uniform.value = x` — update uniforms (pas de `.set()` — direct)

## Snippet minimal

```ts
import { Renderer, Camera, Transform, Mesh, Program, Plane } from 'ogl';

export function initOGLBackground(canvas: HTMLCanvasElement) {
  const renderer = new Renderer({ canvas, alpha: true });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  const camera = new Camera(gl);
  camera.position.z = 1;

  const scene = new Transform();
  const geometry = new Plane(gl);

  const program = new Program(gl, {
    vertex: /* glsl */`
      attribute vec2 uv;
      attribute vec3 position;
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragment: /* glsl */`
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec3 col = 0.5 + 0.5 * cos(uTime + vUv.xyx + vec3(0,2,4));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    uniforms: { uTime: { value: 0 } },
  });

  const mesh = new Mesh(gl, { geometry, program });
  mesh.setParent(scene);

  let raf: number;
  function loop(t: number) {
    raf = requestAnimationFrame(loop);
    program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene, camera });
  }
  raf = requestAnimationFrame(loop);

  return () => cancelAnimationFrame(raf);
}
```

## Intégration avec notre stack

- Vite 7 : import direct, pas de plugin — les `.glsl` en template literal string suffisent
- React 19 : utiliser dans `useEffect` avec le canvas ref ; retourner le cleanup
- TS 5.9 : types inclus dans le package depuis v1.0
- Tailwind 4 : canvas positionné `absolute inset-0` derrière le contenu
- Pas de composant React dédié — toujours vanilla JS dans un hook

## Dépendances / peer deps

- Aucune peer dep — standalone pur

## Refs

- GitHub — https://github.com/oframe/ogl
- Exemples officiels — https://oframe.github.io/ogl/examples/

## Cross-refs

- `mechanics/generative-canvas-bg.md` — background shader OGL
- `mechanics/word-particle-field.md` — particules WebGL
- `libs/react-three-fiber.md` — alternative quand scene graph nécessaire
