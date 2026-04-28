---
id: mechanic-cinematic-scroll-hero
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #scroll, #animation, #layout, #template, #active]
scope: template
status: active
---

# Cinematic Scroll Hero — hero 100vh qui se déploie au scroll comme une scène de film

## Quoi

Un hero section de hauteur `300-500vh` où le contenu (texte, images, éléments)
est positionné en `sticky` et se révèle, se déplace ou se transforme au fil
du scroll — créant une narration cinématique "scroll = timeline". L'user
contrôle le tempo de la narration. Standard des grands portfolios et des
landing pages ambitieuses en 2025-2026.

## Quand l'utiliser

- Site agence / studio avec un projet phare à mettre en valeur
- Product launch page avec storytelling en séquence (Apple-style)
- Portfolio de photographe ou réalisateur : images révélées au scroll
- "Notre processus" en 4 actes pilotés par le scroll
- Brief avec "immersif", "storytelling", "séquentiel", "wow"

## Quand éviter

- Site avec contenu principalement textuel (blog, doc) — le scroll cinématique consomme trop d'espace
- Mobile-first où le scroll rapide casse la narration (touch scroll = velocity imprévisible)
- Brief "rapide à charger" ou "SEO-first" — GSAP ScrollTrigger = JS non-trivial
- Sites avec beaucoup de CTAs en fold — l'user ne les voit qu'après 3 scrolls
- `prefers-reduced-motion: reduce` → layout linéaire statique sans animation

## Implémentation minimale (GSAP ScrollTrigger pinned)

```tsx
// src/workbench/playground/cinematic-hero/CinematicHero.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CinematicHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          pin: panelRef.current,
        },
      });

      tl.from(titleRef.current, { y: 60, opacity: 0, duration: 1 })
        .from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
        .to(titleRef.current, { scale: 1.15, opacity: 0, duration: 0.8 }, '+=0.5')
        .to(subtitleRef.current, { y: -30, opacity: 0, duration: 0.6 }, '<');
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} style={{ height: '400vh', background: '#050505' }}>
      <div ref={panelRef} style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <h1 ref={titleRef} style={{ color: '#fff', fontSize: 'clamp(2rem, 6vw, 5rem)', textAlign: 'center' }}>
          Ce que nous créons
        </h1>
        <p ref={subtitleRef} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginTop: '1rem' }}>
          Du numérique qui marque.
        </p>
      </div>
    </div>
  );
}
```

## Variantes

- **Horizontal scroll** : le contenu défile horizontalement dans un wrapper scroll vertical (GSAP `xPercent`)
- **Video scrub** : une vidéo `<video>` dont `currentTime` est piloté par le scroll progress
- **Parallax layers** : plusieurs éléments à vitesses de scroll différentes (profondeur 2.5D)
- **r3f integrated** : scène 3D dans le panel sticky, pilotée par ScrollTrigger (voir `scroll-driven-3d.md`)

## Performance / budget

- GSAP `ctx.revert()` au cleanup — évite les ScrollTrigger orphelins en dev HMR
- `pin: element` au lieu de `pin: true` — meilleur contrôle du compositing
- `scrub: 1.5` — amortissement du scroll, évite les saccades sur trackpad
- Sur mobile : `ScrollTrigger.matchMedia('(min-width: 768px)')` pour désactiver le cinéma
- Bundle GSAP ScrollTrigger : ~45 KB gzip — lazy-load avec le composant

## a11y

- `prefers-reduced-motion: reduce` → désactiver tous les tweens GSAP, afficher contenu statique
- Le contenu textuel reste dans le DOM en tout état — screen readers ne sont pas bloqués par le sticky
- Assurer `Tab` order logique même en position sticky (ne pas réordonner DOM pour l'effet)
- Sous-titres / captions si vidéo scrub avec narration audio

## Refs

- GSAP ScrollTrigger — https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP Context (cleanup) — https://gsap.com/docs/v3/GSAP/gsap.context()
- CSS position sticky — https://developer.mozilla.org/en-US/docs/Web/CSS/position

## Cross-refs

- `mechanics/scroll-driven-3d.md` — intégrer une scène r3f dans le panel sticky
- `mechanics/masked-reveal.md` — révélations dans les actes du hero cinématique
- `mechanics/magnetic-hover.md` — CTA magnétique dans le hero
- `libs/gsap-scrolltrigger.md` (Phase 2)
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
- `anti-patterns/safe-centered-hero.md` — ce qu'on remplace
