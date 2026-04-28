---
id: anti-pattern-purple-gradient-everywhere
date: 2026-04-23
type: anti-pattern
tags: [#anti-pattern, #design, #template, #active]
scope: template
status: active
---

# Purple Gradient Everywhere — le fond de génération AI

## Le pattern

`background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)`.
Utilisé partout, en même temps :

- Hero background (pleine section, 100vh)
- Badge labels "New" / "Beta" / "Pro"
- Button hover state
- CTA section en bas de page
- Parfois : card border, icône remplie, `text-gradient` sur le headline

Variantes observées : `#7C3AED → #DB2777` · `#6366F1 → #8B5CF6` ·
`#A855F7 → #EC4899`. Le dégradé est toujours à 135 degrés. Toujours
violet-vers-rose. Parfois avec un troisième stop orange `#F97316`.
Parfois appliqué en `background-clip: text` sur le heading — le signe
ultime.

Ce combo occupe la même position dans le design AI-généré que Comic Sans
dans Word 1999 : omniprésent, reconnaissable, impossible à désassocier de
l'amateurisme à ce stade.

## Pourquoi c'est l'AI slop 2020-2024

En 2021-2022, la vague SaaS "indie hacker" a massivement adopté ce gradient
comme signal de modernité tech. Stripe, Linear, Vercel l'utilisaient avec
parcimonie et précision. Les 10 000 clones Tailwind qui ont suivi l'ont
copié sans la parcimonie ni la précision.

Les modèles génératifs ont été entraînés sur ce corpus dominant. Résultat :
"modern SaaS" → purple-pink gradient, automatiquement, sans réflexion.
Maintenant c'est l'AI qui le produit, et l'AI est entraînée sur ses propres
outputs — la boucle se referme et le pattern se fossilise.

Il est aussi dans les palettes par défaut de Figma (purple preset), dans
shadcn/ui (violet accent), dans Tailwind (`violet-500` est la couleur
d'accent des examples). Le défaut technique DEVIENT le défaut esthétique.

## Signaux de détection

- Mon `--color-primary` est dans la famille `#8B5CF6` / `#7C3AED`
- J'ai un gradient hero `linear-gradient(135deg, purple, pink)`
- Les badges "New" ont ce gradient
- Le CTA section a ce gradient en fond
- J'utilise `background-clip: text` sur un heading violet-rose
- Je pense "c'est moderne" sans savoir pourquoi

## Alternatives ambitieuses

1. **Aurora mesh custom** (`mechanics/generative-canvas-bg.md`) :
   remplacer le gradient statique par un mesh gradient animé — mais avec
   des couleurs **signature du projet**, pas le default violet-rose. Un
   mesh en `#2DD4BF` (teal) + `#F59E0B` (amber) sur fond noir est autant
   "tech" et infiniment plus distinctif.
2. **Monochrome + accent unique** : fond blanc ou noir cassé, un seul
   accent chromatique fort et atypique — vermillon `#C0392B`, vert
   électrique `#16A34A`, cyan `#0891B2`. Utilisé sur les CTA uniquement.
   La rareté de la couleur crée l'impact que le gradient cherche à produire
   en saturant tout.
3. **Gradient signature sur couleurs projet** : si un gradient est vraiment
   requis, le construire à partir de la palette propre au projet.
   `linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))`.
   Jamais violet-rose par défaut — seulement si la palette du projet EST
   violet et rose (rare, et dans ce cas on justifie).

Voir `references/uipro/palettes-industry.md` — la palette AI/Chatbot et
la palette Gaming sont les seuls contextes où `#7C3AED` est un point de
départ lisible (avec remix obligatoire).

## Quand c'est quand même acceptable

- Gaming / NFT / Web3 : le violet-tech est un code culturel du secteur.
  Le public attendu le reconnaît et s'y identifie. Reste à le remanier
  pour ne pas être un clone générique.
- Dark mode tech dashboard où les couleurs néon sur fond sombre ont une
  vraie logique UX (visibilité, hiérarchie dans une UI dense).
- Moodboard / prototype rapide pour valider une direction avec un client
  avant l'itération palette — acceptable comme scaffold, jamais comme
  livrable.

## Cross-refs

- `mechanics/generative-canvas-bg.md` — background vivant, non-statique
- `references/uipro/palettes-industry.md` — palettes AI/Chatbot + Gaming
  (les 2 cas où violet est un point de départ défendable)
- `references/uipro/styles-catalog.md` — Tier 3 slop-warn (cliché violet pastel)
- `anti-patterns/ai-slop-luxury-spa.md` — autre pattern AI par
  sur-usage couleur signature
