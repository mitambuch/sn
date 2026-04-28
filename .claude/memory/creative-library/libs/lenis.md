---
id: lib-lenis
date: 2026-04-23
type: lib
tags: [#lib, #design, #scroll, #animation, #template, #active]
scope: template
status: active
---

# Lenis — smooth scroll natif-like

## Quoi

Smooth scroll léger maintenu par **darkroom.engineering**.
Package npm : `lenis`. Bundle : ~5 KB gzip.
Intercepte le scroll natif et applique un easing configurable — feeling
proche du scroll macOS / iOS, sans les bugs de `overflow: hidden` classiques.

## Quand l'utiliser

- Tout site premium qui veut un scroll "oncteux" sans friction
- Combiné avec GSAP ScrollTrigger (setup officiel documenté)
- Parallax sections qui doivent suivre le scroll avec inertie
- Landing pages et portfolios d'agence (feeling upmarket)

## Quand éviter

- Apps productives (dashboard, SaaS) — smooth scroll = friction sur UX fonctionnel
- Si `prefers-reduced-motion` est respecté → désactiver Lenis entièrement
- Sites mobiles-first avec scroll natif iOS déjà parfait
- Si GSAP n'est pas dans le stack — overhead disproportionné pour un effet seul

## API essentiels

- `new Lenis({ duration, easing, smoothWheel })` — instancie
- `lenis.raf(time)` — à appeler dans le rAF loop
- `lenis.on('scroll', cb)` — écoute le scroll Lenis (pour ScrollTrigger)
- `lenis.stop()` / `lenis.start()` — pause/reprise (ex: modal ouvert)
- `lenis.scrollTo(target, { offset, duration })` — scroll programmatique
- `lenis.destroy()` — cleanup obligatoire dans useEffect return

## Snippet minimal

```tsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
```

Appeler `useLenis()` dans le layout root — une seule instance par app.

## Intégration avec notre stack

- Vite 7 : import direct, zéro config
- React 19 : hook custom dans `app/` layout, une fois au root
- GSAP ScrollTrigger : `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.lagSmoothing(0)`
- Tailwind 4 : aucun conflit — Lenis travaille sur `window.scroll`
- `prefers-reduced-motion` : wrapper `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)`

## Dépendances / peer deps

- Aucune peer dep
- Fonctionne sans GSAP — mais le combo Lenis + GSAP ST est le pattern canonique

## Refs

- GitHub officiel — https://github.com/darkroomengineering/lenis
- Docs — https://lenis.darkroom.engineering/
- Intégration GSAP — https://gsap.com/community/forums/topic/38065-lenis-gsap-scrolltrigger/

## Cross-refs

- `mechanics/cinematic-scroll-hero.md` — scroll hero avec inertie Lenis
- `mechanics/scroll-driven-3d.md` — Lenis + r3f + GSAP combo
- `mechanics/masked-reveal.md` — reveal au scroll avec easing Lenis
