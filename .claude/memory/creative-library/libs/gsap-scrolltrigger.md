---
id: lib-gsap-scrolltrigger
date: 2026-04-23
type: lib
tags: [#lib, #design, #scroll, #animation, #template, #active]
scope: template
status: active
---

# GSAP + ScrollTrigger — animation timeline pilotée au scroll

## Quoi

**GreenSock Animation Platform** maintenu par **GreenSock (Greensock LLC)**.
Package npm : `gsap` (ScrollTrigger inclus depuis v3).
Bundle : ~30 KB gzip pour core, ~10 KB gzip par plugin.
Licence : gratuite pour la plupart des usages ; "Club GreenSock" pour plugins premium.

## Quand l'utiliser

- Animations séquencées complexes (timeline, stagger)
- Scroll-driven animation (parallax, pinning, reveal au scroll)
- Animation d'éléments DOM avec contrôle précis du easing
- Coordination 3D r3f + DOM (scrub commun sur même ScrollTrigger)
- Morphing SVG, counter numbers, text split animations

## Quand éviter

- Animation simple d'UI (hover, fade) — prefer `motion` ou CSS
- Si le projet a déjà `motion` installé et l'usage est overlap
- Bundle très contraint — GSAP core pèse ~30 KB, plugins en sus
- Animations purement CSS-driables (transitions, keyframes)

## API essentiels

- `gsap.to(target, vars)` — anime vers des valeurs cibles
- `gsap.from(target, vars)` — anime depuis des valeurs
- `gsap.timeline()` — séquence chainée avec `.to()` / `.from()`
- `ScrollTrigger.create({ trigger, start, end, scrub })` — attache au scroll
- `scrub: true` / `scrub: 1` — lie progress à scroll (1 = 1s lag)
- `pin: true` — épingle l'élément pendant la durée du scroll
- `markers: true` — debug visuel des start/end points (dev only)
- `gsap.registerPlugin(ScrollTrigger)` — obligatoire avant tout usage ST
- `stagger: 0.1` — décalage entre items dans un batch

## Snippet minimal

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function RevealSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        once: true,
      },
    });
  }, []);

  return <div ref={ref} className="p-8 bg-neutral-900 text-white">Contenu révélé</div>;
}
```

## Intégration avec notre stack

- Vite 7 : import direct, pas de plugin Vite requis
- React 19 : utiliser dans `useEffect` avec cleanup `ScrollTrigger.kill()`
- Cleanup obligatoire : retourner `() => ScrollTrigger.getAll().forEach(t => t.kill())`
- Lenis smooth scroll : appeler `ScrollTrigger.refresh()` après init Lenis
- TS 5.9 : types inclus dans le package `gsap` depuis v3.11

## Dépendances / peer deps

- Aucune peer dep — standalone
- Compatibilité Lenis : `lenis.on('scroll', ScrollTrigger.update)`

## Refs

- Docs GSAP — https://gsap.com/docs/v3/
- ScrollTrigger — https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Getting Started — https://gsap.com/resources/get-started/

## Cross-refs

- `mechanics/scroll-driven-3d.md` — r3f + ScrollTrigger combinés
- `mechanics/cinematic-scroll-hero.md` — pinning + scrub storytelling
- `mechanics/masked-reveal.md` — clip-path reveal au scroll
