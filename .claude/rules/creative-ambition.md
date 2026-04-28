# Creative Ambition — pas de VISION sans mécaniques signature (always-loaded)

Sawnext 2026-04-23 a révélé : même avec `vision-first.md` actif, une
VISION rédigée avec des `Refs` floues et sans mécanique explicite
produit du code **propre mais plat**. Racine : pas de vocabulaire
créatif web 2026 (corpus entraînement ~ 2018-2022). Fix : un catalogue
obligatoire à consulter + 2+ mécaniques à citer dans chaque VISION.

Cette règle complète `vision-first.md` — elle ne la remplace pas.

## Le contrat

**Avant toute passe UI non-triviale**, le bloc VISION doit inclure
un champ `Mechanics:` avec **au minimum 2 mécaniques** citées par
leur slug depuis `.claude/memory/creative-library/mechanics/`.

Une VISION sans `Mechanics:` est invalide. Une VISION avec
`Mechanics: [...]` vide ou générique est invalide. Une VISION avec
seulement 1 mécanique est invalide.

### Template VISION à jour (remplace vision-first.md)

```
VISION
- Intent : [1 phrase — ce que la page/section doit raconter]
- Refs : [2-3 URL ou repo concrets, jamais un adjectif flû]
- Mechanics : [≥ 2 slugs depuis creative-library/mechanics/]
- Keep : [2-3 éléments de l'état actuel qui survivent]
- Drop : [2-3 éléments qui disparaissent]
- Verdict attendu : "go" | "refs missing" | "mechanics shallow" | "repropose"
```

### Exemple bien formé

Brief : *"concept store parisien, 4 valeurs, galerie art"*

```
VISION
- Intent : 4 valeurs comme œuvres en mouvement dans une galerie immersive
- Refs : bruno-simon.com, codrops.com/2025-collection-hero, owner-repos/waiting-page
- Mechanics : rotating-3d-words, scroll-driven-3d, magnetic-hover
- Keep : cohérence brand voice client, a11y baseline
- Drop : carousel classique, centered hero, fade-in générique
- Verdict attendu : go | repropose si le mix saw-next-glass + bruno-3d
  n'est pas cohérent
```

### Exemple mal formé (à éviter)

```
VISION
- Intent : site luxe minimaliste
- Refs : classe, sobre, élégant
- Mechanics : animation, hover
- …
```

`classe/sobre/élégant` = adjectifs floues. `animation/hover` = génériques,
pas des slugs de catalogue. Verdict : **mechanics shallow**, j'arrête.

## Séquence de consultation du catalogue

Avant d'écrire la VISION :

1. `ls .claude/memory/creative-library/mechanics/` — voir ce qui existe
2. `grep -l "<tag>" .claude/memory/creative-library/mechanics/` —
   filtrer par tag (scroll, 3d, cursor, typography, bg, etc.)
3. Lire 3-4 fiches candidates en entier (pas diagonale)
4. Choisir **≥ 2 mécaniques complémentaires** — éviter 2 du même
   registre (ex : "rotating-3d-words + kinetic-typography" = redondant,
   prefer "rotating-3d-words + generative-canvas-bg")
5. Citer dans le VISION avec slugs exacts

## Quand appliquer

- ✅ Nouvelle page / section refonte / token rework / design redirect
- ✅ Introduction d'un benchmark visuel mid-projet
- ✅ Prompts type `/design`, `/design-explore`, `/new-page`, `/spec`
- ✅ Prompts texte : "refais", "rework", "refonte", "propose une
  direction", "fais une home", "design la section X"
- ❌ Bug fix chirurgical, typo, bump deps
- ❌ Copy edit ou traduction
- ❌ Atomic UI component sans direction visuelle (ex: "ajoute un
  Badge component dans components/ui/")

## Anti-patterns de cette règle

### 1. "Mechanics théâtrales" — les citer pour cocher la case

Si je cite `scroll-driven-3d` sans *utiliser* du scroll-driven 3D dans
le code final, c'est sycophantie. Le slug cité = un engagement
technique à tenir dans l'implémentation. Si je réalise en cours que
la mécanique ne marche pas, je retourne à la VISION, la mets à jour,
check-in owner.

### 2. Inventer des slugs qui n'existent pas

Si aucun slug existant ne couvre ce que je propose, j'ajoute d'abord
une nouvelle fiche `mechanics/<new-slug>.md` (via `pnpm creative:add
<slug>` en Phase 3), **ensuite** je cite dans la VISION. Pas l'inverse.

### 3. Empiler des mechanics pour gonfler

2 mechanics pertinentes > 5 mechanics bric-à-brac. L'objectif c'est
l'ambition, pas le nombre. Un brief minimal (ex: refresh d'un atom)
n'a pas besoin de 3 mechanics si 2 suffisent conceptuellement.

### 4. Citer des libs à la place des mécaniques

`Mechanics: [GSAP, r3f]` = FAUX. Les libs sont dans `libs/`, les
mécaniques dans `mechanics/`. Une mécanique est un **comportement
UX** (snake-cursor, scroll-driven-3d) ; une lib est un outil pour
implémenter (GSAP, r3f, Motion).

## Interaction avec `anti-complaisance.md § CHALLENGE`

Séquence de gates pour une passe UI R2 :

```
VISION (avec Mechanics) → owner GO/NO-GO
  → si GO : CHALLENGE (hypothèse / alternative / verdict)
    → si GO : code
```

Le CHALLENGE peut rejeter une VISION GO-validée si l'owner n'a pas
vu qu'une mécanique choisie était architecturalement coûteuse (ex:
`scroll-driven-3d` → implique r3f bundle 180KB → peut casser la
perf budget).

## Interaction avec `dispatch.md`

Une passe UI non-triviale = **toujours R2** en pratique (implique
direction design + Décision architecturale taste). Même un "simple"
nouveau hero est R2 car la direction peut faire bifurquer le reste
du site. → main thread Opus, pas dispatch worker.

## Enforcement

- Phase 5 (session future) : `scripts/validate-creative-ambition.js`
  — scan des commits touchant `*.tsx` hors `components/ui/` atoms
  basiques, warn si message ne contient pas de bloc VISION avec
  `Mechanics:` et ≥ 2 slugs.
- Phase 5 : `scripts/classify-task.js` — hint injection
  `[VISION_REQUIRED, MECHANICS_REQUIRED: 2]` sur prompts matchant
  regex design/refonte/refais/rework/page/section.
- D'ici là : discipline + cette règle always-loaded.

## Grow-it

Quand une nouvelle mécanique est observée dans la wild (site, repo,
demo) et réutilisable :

1. `pnpm creative:add <slug>` (Phase 3) → scaffold fiche vierge
2. Remplir le template (Quoi, Quand, Éviter, Implementation, Refs)
3. Utiliser dans la prochaine VISION qui peut
4. Fiche tagguée `#mechanic` + domaine (`#3d`, `#scroll`, `#cursor`, etc.)

## Cross-refs

- `.claude/rules/vision-first.md` — règle parent VISION block
- `.claude/rules/anti-complaisance.md` §CHALLENGE — filter post-VISION
- `.claude/memory/creative-library/README.md` — catalogue root
- `.claude/memory/creative-library/mechanics/` — source de vérité slugs
- `.claude/memory/patterns/2026-04-23-vision-before-code.md` — pattern
  mère
- Phase 5 (enforcement) — `scripts/validate-creative-ambition.js` +
  `scripts/classify-task.js` hint injection

## Pourquoi cette règle existe (l'incident)

Le 2026-04-23 l'owner a annulé un rendez-vous client après 3 passes
UI sur sawnext. La racine n'était pas que je n'avais pas de workflow
(vision-first.md couvre ça) ; c'est que face à une ambiguïté ou un
prompt type "4 mots à mettre en avant", mon réflexe est **flex +
carousel** alors que l'ambition est **roulette 3D scroll-driven +
snake-cursor + generative bg**. Sans vocabulaire explicite et
obligation mécanique de le consulter, le réflexe basique gagne sous
charge. Cette règle est le correctif.
