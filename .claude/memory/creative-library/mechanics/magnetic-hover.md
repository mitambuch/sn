---
id: mechanic-magnetic-hover
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #cursor, #interaction, #animation, #template, #active]
scope: template
status: active
---

# Magnetic Hover — élément qui s'attire vers le curseur

## Quoi

Un bouton ou élément UI qui se déplace légèrement vers le pointeur lorsque
le curseur entre dans sa zone d'influence — effet magnétique. Produit une
sensation de profondeur physique dans une interface 2D. Populaire sur les
CTAs de portfolios premium et landing pages 2025-2026.

## Quand l'utiliser

- CTA principal sur hero section (bouton "Voir nos projets", "Contactez-nous")
- Navigation items sur un portfolio ou site agence
- Cards produit interactives avec hover state fort
- Tout élément cliquable qui doit "appeler" le curseur vers lui
- Brief contenant "premium", "signature", "agence haut de gamme"

## Quand éviter

- Formulaires — perturbation de la précision de saisie
- Interfaces productives denses (dashboard, admin)
- Mobile / touch devices — pas de curseur, fallback à scale standard
- Éléments de navigation critique (header links sur mobile-first)
- `prefers-reduced-motion: reduce` — couper le translate, garder hover color

## Implémentation minimale (GSAP quickSetter)

```tsx
// src/workbench/playground/magnetic-hover/MagneticButton.tsx
import { useRef, useCallback } from 'react';
import gsap from 'gsap';

interface Props {
  children: React.ReactNode;
  strength?: number; // 0.3 = subtle, 0.6 = strong
}

export function MagneticButton({ children, strength = 0.4 }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  }, [strength]);

  const handleLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </button>
  );
}
```

## Variantes

- **Inner magnetic** : seul le contenu interne (texte, icon) se déplace, le fond reste fixe
- **Repulsion** : l'élément fuit le curseur (effet anti-magnétique — usage rare, artistique)
- **Elastic snap** : l'élément suit lentement puis revient avec un spring `elastic.out`
- **3D tilt** : combine magnetic XY translate avec `rotateX/Y` pour un effet carte 3D

## Performance / budget

- `willChange: 'transform'` : crée un compositing layer — ne pas abuser (max 5-6 éléments)
- `gsap.to()` par event mousemove : batcher via `gsap.quickSetter` si > 10 éléments simultanés
- Pas de re-render React : manipuler le DOM ref directement via GSAP
- Impact GPU : quasi nul (translate GPU-accelerated)

## a11y

- `prefers-reduced-motion: reduce` → supprimer le translate, conserver les states focus/hover CSS
- Focus keyboard doit rester visible (`outline` non supprimé par le composant)
- Le deplacement ne doit jamais masquer les contenus adjacents

## Refs

- GSAP quickSetter — https://gsap.com/docs/v3/GSAP/gsap.quickSetter()
- GSAP elastic ease — https://gsap.com/docs/v3/Eases/
- MDN will-change — https://developer.mozilla.org/en-US/docs/Web/CSS/will-change

## Cross-refs

- `mechanics/snake-cursor-follow.md` — combinaison : snake + magnetic zones
- `mechanics/cinematic-scroll-hero.md` — CTA magnétique dans un hero immersif
- `libs/gsap-core.md` (Phase 2)
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
