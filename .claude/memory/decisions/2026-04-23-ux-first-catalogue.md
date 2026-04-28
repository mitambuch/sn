---
id: 2026-04-23-ux-first-catalogue
date: 2026-04-23
type: decision
tags: [#design, #workflow, #decision, #template, #active, #p0]
scope: template
status: active
---

# UX-First rule + catalogue interactions/ (complément à vision-first)

## Contexte

Session 2026-04-23 soir. Owner signale que les wins UX majeurs de ses
projets sortent systématiquement d'un **micro-ajout imaginé au bon
moment**, pas d'une refonte technique. Exemple cité : hotel-vda.ch →
bouton *"Carte des mets"* dans menu secondaire + bouton *"Envoyer à un
pote"* WhatsApp pré-rempli → la page menu est devenue top entrée du
site, devant la homepage.

Avant cette décision, la stack `vision-first.md` + `creative-ambition.md`
+ `mechanics/` couvrait la **motion visuelle** (scroll-driven-3d,
magnetic-hover, etc.) mais laissait un trou sur les **patterns
comportementaux** — comment un humain navigue, quel bouton manque, quel
share hook crée du viral. Réflexe Claude sans cette couche = générer
hero + intro + CTA, plat.

## Décision

Ajout de trois éléments coordonnés :

1. **Règle always-loaded `rules/ux-first.md`** — impose un bloc UX à
   rédiger après VISION et avant CHALLENGE pour toute page/section
   utilisateur non-triviale. Champs : Goal, Friction, Micro-feature
   signature, Share hook, Métrique 7 jours.

2. **Catalogue `creative-library/interactions/`** avec 6 patterns
   battle-tested (Phase 1) — share-whatsapp-prefilled, secondary-menu-
   deep-link, native-web-share, one-tap-call-contextual, zero-click-copy,
   smart-default-time-aware.

3. **Row dans `intent-routing.md`** déclenchant la consultation via
   langage naturel : *"micro-feature signature"*, *"killer feature"*,
   *"bouton qui change tout"*, *"rendre viral"*.

## Alternatives considérées

- **Étendre `mechanics/` avec les interactions** — rejeté. La
  distinction motion-visuelle vs behavior-pattern est claire et
  justifie une taxonomie séparée (clarté du slug, filtrage par la
  règle).
- **Rule `ux-first.md` path-triggered** sur `src/pages/**` au lieu
  d'always-loaded — rejeté. Cohérence avec `vision-first.md` et
  `creative-ambition.md` qui sont always-loaded. +2 KB par prompt
  acceptable vs risque d'oublier le trigger path.
- **Catalogue plus gros dès le départ** (15-20 entries) — rejeté.
  Discipline anti-slop : 6 patterns documentés = 6 patterns dont on
  sait qu'ils marchent. Grow-it quand un nouveau pattern est observé
  dans le wild.

## Ce que cette décision ne fait PAS

- **Ne remplace pas le product thinking owner.** La VISION produit
  (*"quel bouton manque sur hotel-vda ?"*) reste à l'owner. Le skill
  oblige juste la question au bon moment.
- **Ne liste pas les patterns emerging** (gesture, voice, gaze, haptic,
  micro-audio). Ces patterns ont un TRL variable et méritent un
  catalogue séparé `emerging-inputs/` (Phase future) avec tagging
  maturity explicit (research / experimental / production).
- **Pas de validation automatique pour l'instant.** Phase future :
  `scripts/validate-ux-first.js` + hint injection dans
  `classify-task.js`. D'ici là = discipline.

## Impact attendu

- Prochaine passe sur une page utilisateur : Claude émet un bloc UX
  avant de coder. Micro-feature signature citée par slug du catalogue.
  Owner valide ou redirige en 30 sec.
- Sur 10 pages produites, espoir qu'au moins 2-3 aient un share hook
  ou micro-feature qui change mesurablement leur perf d'entrée (CTR,
  entry rate, bounce).
- Coût context : +~2.5 KB always-loaded (rule ux-first). Le catalogue
  interactions/ reste greppé à la demande (pas auto-loaded).

## Cross-refs

- `.claude/rules/ux-first.md` — règle créée
- `.claude/rules/vision-first.md` — règle parent (motion)
- `.claude/rules/creative-ambition.md` — règle sœur (mechanics)
- `.claude/memory/creative-library/interactions/README.md` — catalogue
- Source incident : debrief owner hotel-vda.ch 2026-04-23 soir
- Phase future : `emerging-inputs/` + validator scripts
