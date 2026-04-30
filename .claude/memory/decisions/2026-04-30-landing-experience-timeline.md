---
id: 2026-04-30-landing-experience-timeline
date: 2026-04-30
type: decision
tags: [#design, #workflow, #decision, #client-specific, #p0]
scope: client-specific
status: active
supersedes: 2026-04-30-landing-mvp-sprints-1-2
---

# Landing → expérience cinématique 6-actes (supersedes le sprint 1+2 du matin)

## Décision

Le 2026-04-30 vers 10h25, après une première livraison "premium éditorial"
(HeroImmersive + EspritSaw + DomainsTicker + CinematicManifesto +
ConversationFooter, 4 commits sur `feat/landing-mvp`), l'owner cadre :

> "Pyotable" + "ne doit PAS ressembler à une landing classique" +
> "univers immersif, cinématique, presque silencieux" + "tension /
> curiosité / contrôle partiel" + "pas de scroll = contenu" +
> "fragmenté, progressif, parfois incomplet volontairement" +
> "équipe + partenaires discrets, pas corporate".

→ **Reset complet de la composition de la home**. On garde uniquement
les atomes brand (Wordmark, Logomark, SnArrow, BrandArrow) et on jette
les 5 sections.

## La timeline retenue (6 actes)

| Acte | Nom | Intention | Texte exact |
|---|---|---|---|
| 0 | **Threshold** | refuser l'entrée passive, faire mériter | aucun texte, hold click sur point pulsant |
| 1 | **Apparition** | faire émerger la marque par effort | Wordmark scroll-stroke draw + sous-marque "Bespoke Client Services Platform" + 3 mots-piliers : "Suisse. / Indépendant. / Bespoke." (option a tranchée par owner) |
| 2 | **Murmurs** | remplacer la liste des expertises par un champ stellaire | 8 fragments (Off-market / Caliber / Salons / Itinéraires / Atelier / Quotidien / Carrière / Cercles) en parallax 3D, hover sustained = phrase courte révélée en typewriter glitch |
| 3 | **Stillness** | imposer un silence | amorce typewriter "Dans un monde où tout peut s'acheter, la différence se joue ailleurs." → 3 mots monolithiques (un par freeze 1.2s) : "L'ACCÈS." / "LA RELATION." / "L'EXÉCUTION." |
| 4 | **Reversal** | matérialiser la bascule public→intime | clip-circle expand + filter invert + chromatic split RGB 3px + grain warm. Mot d'amorce après bascule : "Une demande." |
| 5 | **Doorway** | une porte, pas un footer | "Continuer la conversation." (text-morph hover → +41 78 749 81 70). Pied opacité 30% : 3 lignes vision en italique mono. Mention micro 20% : "Suisse · Confidentialité absolue · Réseau de partenaires sélectionnés". |

## Ce qui passe dans le DRAWER (acte 5 click "Continuer")

- Méthode 4 étapes (01 demande / 02 structuration / 03 proposition / 04 exécution)
- 3 fondateurs en mono discret (Salvatore Montemagno / Bokar Guissé / Harry Novillo) — pas de cards, pas de photos, qualif courte au hover seulement
- Partenaires : 1 phrase texte uniquement, jamais de logos
- Confidentialité : 1 ligne mention en pied de drawer
- Champ libre + email + bouton "Envoyer"

**Décision (2) tranchée par owner** : équipe **uniquement dans le drawer**,
rien sur la one-page (radical, pas de bandeau crédibilisant en première
visite).

## Architecture composants

```
src/
├── features/landing/
│   ├── Threshold/       acte 0
│   ├── Apparition/      acte 1
│   ├── Murmurs/         acte 2
│   ├── Stillness/       acte 3
│   ├── Reversal/        acte 4
│   └── Doorway/         acte 5
├── components/
│   ├── orchestration/   SceneDirector, ActStage, CursorField, ScrollEngine
│   └── effects/         PulseDot, StrokeReveal, ParallaxField, GlitchType,
│                        PortalCircle, ChromaticSplit, Vignette, FilmGrain
│                        (renamed from GrainCanvas), TextMorph
```

Aucun composant "Section" générique. Chaque acte = nommé par son
expérience, pas sa position. Pages composent uniquement (`<SceneDirector>
<Threshold/><Apparition/>...</SceneDirector>`).

## Stack additionnel

- `lenis` (~3 KB gzip) — smooth scroll programmable, requis pour scroll
  résistif + freeze API
- `gsap` + `ScrollTrigger` (déjà installés ce matin) — orchestration
  timelines + pin scenes
- `motion` (déjà installé) — utilitaires d'animation React
- `simplex-noise` (déjà installé) — fallback grain organique

## Why

1. La direction premium éditorial sobre du matin = exactement le défaut
   listé par l'owner ("landing 2020", "sections empilées", "scroll =
   contenu"). Ne pas tenter de la sauver — la jeter.
2. La direction radicale 6-actes coche les 7 points listés par owner :
   - cinématique / silencieux / tension / curiosité / contrôle partiel
   - interdits respectés (pas de cards, pas de grid, pas de scroll
     linéaire, pas de boutons standards)
   - scroll non-linéaire / parallax / cursor custom / zones invisibles
   - 3 moments marquants identifiables (acte 0 = entrée forte, acte 2 =
     interaction inattendue, acte 4 = transition mémorable)
3. Architecture feature-based + primitives effects/ rend chaque acte
   delétable / refactorable indépendamment. Pas de couplage transversal
   au-delà du `SceneDirector` (chef d'orchestre).

## How to apply

- **Tout nouveau visuel** sur la home doit être pensé comme un *acte*
  (intention + interaction + émotion), pas une *section* (titre +
  contenu + CTA).
- **Toute primitive d'animation** doit aller dans `components/effects/`
  et exposer une API GPU-only (transform/opacity/clip-path/filter
  exclusivement).
- **Toute logique d'orchestration** (savoir quel acte est actif,
  enchaînement, transitions inter-actes) passe par `SceneDirector` +
  son contexte `useScene()`. Aucun acte ne pilote un autre acte
  directement.

## Cross-refs

- Session journal du matin : `2026-04-29-1334.md` (lot B UI shell —
  contexte d'avant-pivot)
- Décision lot A.5 plan : `2026-04-29-autonomous-5h-run-plan.md`
- Règles always-loaded appliquées : `vision-first.md` (VISION pré-code),
  `creative-ambition.md` (mechanics ≥2 cités), `ux-first.md`
  (micro-feature signature), `anti-complaisance.md` (CHALLENGE +
  contradiction du parti pris du matin)
- Mechanics catalogue utilisés : `cinematic-scroll-hero`,
  `masked-reveal`, `magnetic-hover`, `generative-canvas-bg` (renommé
  FilmGrain)

## Status d'exécution

À l'instant (10:40) : décision figée, code à venir dans la même
journée. Phase A (ménage + orchestration), Phase B (acte 0/1/5),
Phase C (acte 2/3/4), Phase D (compose).
