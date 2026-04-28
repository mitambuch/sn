---
id: lib-rive-lottie
date: 2026-04-23
type: lib
tags: [#lib, #design, #animation, #template, #active]
scope: template
status: active
---

# Rive + Lottie — animations vectorielles interactives et exportées

## Quoi

Deux librairies pour des animations vectorielles légères — cas d'usage distincts.

**Rive** — animations vectorielles interactives avec state machine.
Maintenu par **Rive Inc**. Package : `@rive-app/react-canvas`.
Bundle : ~40 KB gzip (runtime WASM inclus).

**Lottie** — lecture d'animations exportées depuis **Adobe After Effects**.
Maintenu par **LottieFiles**. Package : `lottie-react` (ou `lottie-web` vanilla).
Bundle : `lottie-react` ~50 KB gzip ; `lottie-web` ~40 KB gzip.

## Différences clés

| | Rive | Lottie |
|---|---|---|
| Source | Éditeur Rive (app dédiée) | After Effects + plugin Bodymovin |
| Interactivité | State machine intégrée (hover, click) | Lecture simple (play/pause/speed) |
| Fichier | `.riv` | `.json` |
| Taille fichier | Compact | JSON souvent verbeux |
| Idéal pour | Boutons animés, mascotte interactive, onboarding | Splash screen, icône animée AE |

**Règle de choix** : animation interactive ou avec états → Rive.
Animation one-shot exportée depuis AE → Lottie.

## Quand utiliser Rive

- Bouton avec état hover/active animé (ex: bouton "play" qui se transforme)
- Mascotte ou personnage interactif réagissant à la souris
- Loader avec états (idle → loading → success → error)
- Onboarding step-by-step avec transitions animées
- Infographie interactive pilotée par inputs utilisateur

## Quand utiliser Lottie

- Splash screen ou animation de chargement depuis un fichier AE livré par le client
- Icône animée simple (check, star, heart)
- Animation de fond décorative non-interactive
- Quand le designer travaille sous After Effects et livre du JSON

## Quand éviter les deux

- Animation CSS faisable — overhead injustifié
- Animations 3D → r3f
- `prefers-reduced-motion` → fournir fallback statique obligatoire

## API essentiels — Rive

- `useRive({ src, autoplay, stateMachines })` — hook principal
- `rive.play()` / `rive.pause()` / `rive.stop()` — contrôle playback
- `useStateMachineInput(rive, 'Machine', 'inputName')` — accès aux inputs
- `input.value = true` — déclenche une transition d'état
- `<RiveComponent>` — composant canvas rendu par le hook

## API essentiels — Lottie

- `<Lottie animationData={json} loop autoplay />` — composant minimal
- `lottieRef.current.play()` / `.stop()` / `.setSpeed(n)` — contrôle
- `onComplete` / `onLoopComplete` — callbacks lifecycle

## Snippets minimaux

**Rive :**
```tsx
import { useRive } from '@rive-app/react-canvas';

export function RiveButton() {
  const { rive, RiveComponent } = useRive({
    src: '/animations/button.riv',
    stateMachines: 'ButtonMachine',
    autoplay: true,
  });
  return (
    <div onMouseEnter={() => rive?.play()} style={{ width: 120, height: 60 }}>
      <RiveComponent />
    </div>
  );
}
```

**Lottie :**
```tsx
import Lottie from 'lottie-react';
import checkAnimation from '@/assets/check.json';

export function SuccessCheck() {
  return <Lottie animationData={checkAnimation} loop={false} style={{ width: 80 }} />;
}
```

## Intégration avec notre stack

- Vite 7 : JSON importable directement ; `.riv` via `import` ou URL publique dans `/public`
- React 19 : hooks et composants compatibles
- TS 5.9 : types inclus dans les deux packages
- Tailwind 4 : wrapper `<div>` avec classes Tailwind autour du composant animé
- `prefers-reduced-motion` : conditionner `autoplay` sur la media query

## Dépendances / peer deps

- Rive : `react` >= 17
- Lottie-react : `react` >= 16

## Refs

- Rive docs — https://rive.app/docs
- Rive runtime React — https://github.com/rive-app/rive-react
- LottieFiles — https://lottiefiles.com/
- lottie-react — https://github.com/LottieFiles/lottie-react

## Cross-refs

- `mechanics/magnetic-hover.md` — hover effect (peut combiner Rive state machine)
- `mechanics/masked-reveal.md` — reveal d'élément au mount (Lottie one-shot)
- `mechanics/morphing-typography.md` — morphing vectoriel comparable
