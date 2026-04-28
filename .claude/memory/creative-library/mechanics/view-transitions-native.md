---
id: mechanic-view-transitions-native
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #scroll, #animation, #css, #template, #active]
scope: template
status: active
---

# View Transitions Native — transitions de page et d'état via l'API native du navigateur

## Quoi

L'API View Transitions (niveau 1 et 2) permet des transitions fluides entre
deux états du DOM — changement de page SPA, ouverture de modal, swap de
contenu — sans JavaScript d'animation. Le navigateur capture un snapshot,
anime la transition via CSS, révèle le nouvel état. Niveau 2 ajoute le
`scroll-driven animations` CSS natif et `@starting-style` pour les entrées.
Zéro dépendance, zéro librairie.

## Quand l'utiliser

- Navigation SPA entre pages (React Router + `document.startViewTransition`)
- Transition de liste → detail (click sur une card → page détail avec `view-transition-name`)
- Changement de thème (light/dark) animé sans flash
- Ouverture de modal ou drawer avec transition de l'élément déclencheur
- Scroll-driven reveal CSS natif (remplace GSAP ScrollTrigger pour les cas simples)

## Quand éviter

- Safari < 18 sans polyfill — vérifier caniuse avant de shipper en prod
- Animations complexes multi-éléments synchronisées — GSAP reste plus expressif
- Transitions 3D — l'API native est limitée au plan 2D
- Si le projet doit supporter IE11 ou navigateurs très anciens (gouvernement, B2B legacy)

## Implémentation minimale (React Router + CSS View Transitions)

```css
/* src/styles/view-transitions.css */

/* 1. Transition de page globale */
@keyframes slide-in {
  from { opacity: 0; translate: 0 12px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes slide-out {
  from { opacity: 1; translate: 0 0; }
  to { opacity: 0; translate: 0 -12px; }
}

::view-transition-old(root) {
  animation: slide-out 0.25s ease-in both;
}
::view-transition-new(root) {
  animation: slide-in 0.25s ease-out both;
}

/* 2. Element-level transition (card → page detail) */
.card-hero {
  view-transition-name: card-hero; /* unique par élément */
}

/* 3. @starting-style — état initial pour les éléments nouvellement insérés */
.modal {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.3s ease, translate 0.3s ease;
}
@starting-style {
  .modal {
    opacity: 0;
    translate: 0 20px;
  }
}

/* 4. Scroll-driven natif (Chrome 115+, Firefox 2025+) */
.reveal-on-scroll {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}
@keyframes fade-up {
  from { opacity: 0; translate: 0 30px; }
  to { opacity: 1; translate: 0 0; }
}

/* 5. prefers-reduced-motion — override systématique */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
  .reveal-on-scroll { animation: none; }
  .modal { transition: none; }
}
```

```tsx
// src/app/router.tsx — wiring minimal avec React Router
// pseudo : adapter à la version de React Router utilisée
import { useNavigate } from 'react-router-dom';

export function useViewTransitionNavigate() {
  const navigate = useNavigate();
  return (to: string) => {
    if (!document.startViewTransition) { navigate(to); return; }
    document.startViewTransition(() => { navigate(to); });
  };
}
```

## Variantes

- **Shared element** : un même élément (image, titre) transite entre deux pages avec `view-transition-name` identique — effet "zoom depuis la card"
- **Morph shape** : la card se transforme en page entière (border-radius, taille, position)
- **Staggered list** : items d'une liste avec `view-transition-name: item-${id}` — entrée/sortie indépendante
- **Theme toggle** : `document.startViewTransition(() => { document.documentElement.classList.toggle('dark') })` avec clip-path circular reveal

## Performance / budget

- Zéro KB de librairie — API native, incluse dans le navigateur
- `view-transition-name` unique obligatoire par page — les doublons cassent l'animation silencieusement
- Ne pas abuser de `view-transition-name` sur trop d'éléments simultanés — le navigateur capture N snapshots
- `animation-timeline: scroll()` / `view()` : GPU-accelerated, 0 JS, très performant
- Polyfill `@oddbird/css-anchor-positioning` ou librairie si Safari < 18 requis

## a11y

- `prefers-reduced-motion: reduce` → `animation: none` sur toutes les `::view-transition-*` règles
- L'API ne bloque jamais le DOM — le contenu est immédiatement accessible pendant la transition
- `@starting-style` remplace `opacity: 0` au mount — screen readers voient le contenu dès l'insertion

## Refs

- MDN View Transitions API — https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
- MDN animation-timeline — https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- MDN @starting-style — https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style

## Cross-refs

- `mechanics/masked-reveal.md` — alternative JS pour les cas plus complexes
- `mechanics/cinematic-scroll-hero.md` — scroll-driven natif pour les reveals dans le hero
- `libs/gsap-scrolltrigger.md` (Phase 2) — quand l'API native ne suffit pas
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
