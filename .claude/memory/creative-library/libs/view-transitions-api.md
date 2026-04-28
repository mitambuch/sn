---
id: lib-view-transitions-api
date: 2026-04-23
type: lib
tags: [#lib, #design, #animation, #template, #active]
scope: template
status: active
---

# View Transitions API — transitions de page natives navigateur

## Quoi

API **navigateur native** — pas un package npm à installer.
Spec W3C, implémentée nativement dans Chrome 111+, Edge 111+, Safari 18+, Firefox 130+.
Zéro bundle cost. Permet des transitions animées entre états DOM ou entre routes.
Deux modes : **same-document** (SPA-like) et **cross-document** (navigation multi-page).

Support evergreen 2024+ : tous les navigateurs modernes couverts.
Fallback gracieux : sans support, la navigation est instantanée (pas de JS error).

## Quand l'utiliser

- Transitions de route dans un SPA React (avec React Router ou TanStack Router)
- Shared element transitions (image qui "vole" d'une liste vers le détail)
- Transitions cross-document sur des MPAs (avec `@view-transition` CSS)
- Quand le budget bundle est serré — zéro overhead
- Quand `motion` ou GSAP serait du killing with overkill pour une simple transition de page

## Quand éviter

- Animations complexes intra-page (scroll-driven, gestures) → GSAP ou motion
- Si besoin de support IE11 ou vieux Android (hors scope 2026 mais à noter)
- Transitions très custom nécessitant control frame-par-frame → GSAP timeline
- Quand les pseudo-elements `::view-transition-*` ne donnent pas assez de contrôle

## API essentiels

- `document.startViewTransition(callback)` — déclenche une transition DOM
- `view-transition-name: my-name` — CSS, identifie un élément pour shared element
- `::view-transition-old(root)` — pseudo-element ancienne vue
- `::view-transition-new(root)` — pseudo-element nouvelle vue
- `@view-transition { navigation: auto; }` — active cross-document transitions (CSS)
- `navigation` API — hook natif pour intercepter navigations (Chrome 102+)

## Snippet minimal

```tsx
// Transition SPA avec React Router v6
import { useNavigate } from 'react-router-dom';

export function CardLink({ to, children }: { to: string; children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!document.startViewTransition) {
      navigate(to);
      return;
    }
    document.startViewTransition(() => navigate(to));
  };

  return <button onClick={handleClick}>{children}</button>;
}
```

CSS pour shared element (image de liste → détail) :
```css
.card-image { view-transition-name: card-hero; }
.detail-image { view-transition-name: card-hero; }

::view-transition-old(card-hero),
::view-transition-new(card-hero) {
  animation-duration: 0.4s;
  animation-timing-function: ease-in-out;
}
```

## Intégration avec notre stack

- Vite 7 : aucune config — API navigateur pure
- React 19 : wrapper `startViewTransition` autour des navigations router
- Tailwind 4 : les classes CSS coexistent avec `view-transition-name` inline ou via layer
- TS 5.9 : `document.startViewTransition` dans `lib.dom.d.ts` depuis TS 5.4
- `prefers-reduced-motion` : le navigateur respecte automatiquement (réduit l'animation)

## Dépendances / peer deps

- Aucune — API native
- Polyfill optionnel : `@astrojs/view-transitions` (Astro only) ou CSS fallback

## Refs

- MDN — https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
- Chrome for Developers guide — https://developer.chrome.com/docs/web-platform/view-transitions
- CSS `@view-transition` — https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition

## Cross-refs

- `mechanics/view-transitions-native.md` — patterns avancés shared element
- `mechanics/cinematic-scroll-hero.md` — hero avec transition entrée
- `mechanics/masked-reveal.md` — reveal au mount comparable
