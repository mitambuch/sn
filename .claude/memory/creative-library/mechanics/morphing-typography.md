---
id: mechanic-morphing-typography
date: 2026-04-23
type: mechanic
tags: [#mechanic, #design, #typography, #animation, #template, #active]
scope: template
status: active
---

# Morphing Typography — texte qui se transforme en un autre mot

## Quoi

Un mot ou phrase qui se transforme fluidement en un autre via interpolation
de caractères, SVG path morphing, ou cross-fade filtré. Technique signature
des headlines de marque qui veulent exprimer plusieurs valeurs en une seule
ligne — "Rapide. Fiable. Beau." sans le carousel.

## Quand l'utiliser

- Headline hero multi-valeurs ("On est X. On est Y. On est Z.")
- Section services : chaque service remplace le précédent dans la même zone
- Tagline animée en loop sur une page d'accueil
- Transitions entre pages : le titre de page A se transforme en titre B
- Brief avec identité de marque forte et plusieurs piliers à communiquer

## Quand éviter

- Corps de texte — illisible en mouvement
- Plus de 1-2 mots par morph — complexité visuelle excessive
- Mots de longueur très différente sans ajustement de layout
- `prefers-reduced-motion: reduce` → afficher les mots en liste statique
- SEO-first : le mot non-visible n'est pas indexé sans contenu DOM dupliqué

## Implémentation minimale (Motion cross-fade filtré)

```tsx
// src/workbench/playground/morphing-type/MorphingText.tsx
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const WORDS = ['Créatifs', 'Rapides', 'Fiables'];

export function MorphingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % WORDS.length), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <h1 style={{ position: 'relative', display: 'inline-block', minWidth: '8ch' }}>
      <span style={{ visibility: 'hidden' }}>{WORDS[0]}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(8px)', y: -8 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </h1>
  );
}
```

SVG path morph (plus dramatique, via GSAP MorphSVGPlugin — premium) :
```tsx
// pseudo — requiert GSAP Business/premium
// gsap.to('#word-path', { morphSVG: '#next-word-path', duration: 0.6 });
```

## Variantes

- **Char-by-char scramble** : chaque lettre se randomise avant d'arriver à la cible (effet hacker/matrix)
- **Blur morph** : cross-fade avec `filter: blur()` qui masque la transition (implémenté ci-dessus)
- **SVG morph** : paths SVG des lettres interpolés directement (GSAP MorphSVGPlugin, premium)
- **Split + stagger** : chaque caractère sort/entre avec délai décalé (GSAP SplitText ou split manuel)

## Performance / budget

- Motion `AnimatePresence` : ~30 KB gzip (partagé avec autres composants Motion)
- `filter: blur()` animation : compositing GPU — pas de layout recalc
- Ne jamais animer `width` pour le conteneur — layout thrashing ; utiliser `min-width` fixe ou `position: absolute` sur le mot animé
- `setInterval` : toujours cleanup sur unmount

## a11y

- `prefers-reduced-motion: reduce` → supprimer l'interval, afficher le premier mot statique
- `aria-live="polite"` sur le wrapper pour annoncer les changements aux lecteurs d'écran
- Le span invisible (`visibility: hidden`) garde la hauteur du titre — pas de layout shift
- Ne jamais utiliser `display: none` sur le span de référence — lecteurs d'écran le sautent

## Refs

- Motion AnimatePresence — https://motion.dev/docs/react-animate-presence
- GSAP SplitText — https://gsap.com/docs/v3/Plugins/SplitText/
- MDN filter — https://developer.mozilla.org/en-US/docs/Web/CSS/filter

## Cross-refs

- `mechanics/rotating-3d-words.md` — variante 3D de la même intention
- `mechanics/masked-reveal.md` — souvent combiné : révèle puis morphe
- `libs/motion.md` (Phase 2)
- `.claude/rules/creative-ambition.md` + `.claude/rules/vision-first.md`
