---
id: interactions-catalogue-readme
date: 2026-04-23
type: reference
tags: [#design, #workflow, #template, #active, #p1]
scope: template
status: active
---

# Interactions — catalogue de patterns comportementaux

## Why

`mechanics/` catalogue la **motion visuelle** (scroll-driven-3d,
magnetic-hover, rotating-3d-words). Mais un site qui a du mouvement sans
**micro-features signature** reste plat en product value. Le win
hotel-vda.ch (2026-04-23) n'était pas une mécanique 3D — c'était un
bouton `tel:` dans le menu secondaire et un lien WhatsApp pré-rempli.
Ce catalogue existe pour documenter ces **patterns comportementaux**
réutilisables.

Distinction stricte :
- **`mechanics/`** = comment ça bouge (visuel / animation)
- **`interactions/`** = ce que ça fait (comportement / flow)
- **`emerging-inputs/`** *(Phase suivante)* = inputs non-clic (gesture,
  voice, haptic, gaze)

## Structure d'une fiche

```
What : 1 phrase — le pattern en concret
Why it works : 1-2 phrases psychologie / friction retirée
When to use : contextes où le pattern produit de la valeur
When NOT to use : contextes où ça crée du bruit ou casse la confiance
Implementation : snippet minimal qui marche (React + web platform)
Variants : 2-4 variantes réalistes
a11y / mobile / privacy : contraintes plateforme honnêtes
Refs : sources concrètes (pas théorie)
```

## Inventaire (Phase 1 — 2026-04-23)

| Slug | Intent utilisateur | Share hook ? |
|---|---|---|
| `share-whatsapp-prefilled` | Envoyer une info à un pote en 1 tap | ✓ |
| `secondary-menu-deep-link` | Atteindre une page profonde depuis top-level | - |
| `native-web-share` | Partage système natif (Web Share API + fallback) | ✓ |
| `one-tap-call-contextual` | Appeler un numéro avec contexte preserved | - |
| `zero-click-copy` | Copier une adresse/IBAN sans sélection manuelle | - |
| `smart-default-time-aware` | Pré-sélection selon heure locale (lunch/dinner) | - |

## Règle d'usage

Le bloc UX de `rules/ux-first.md` impose **1 slug** de `interactions/`
dans le champ `Micro-feature signature`. Pas 3 — le choix forcé est la
valeur.

Si aucun slug existant ne matche : ajouter d'abord une fiche, ensuite
citer. Pas l'inverse. Signature = battle-tested, pas prospectif.

## Anti-patterns de ce catalogue

- **Entries théoriques** recopiées d'un blog UX. On garde seulement
  les patterns qui ont un win mesurable documenté (owner experience
  ou case study public cité).
- **Catalogue gonflé** : 30 entries dont 10 redondantes = bruit. On
  préfère 8 patterns clairs à 25 patterns moyens.
- **Feature parity** avec d'autres libs : on n'essaie pas de couvrir
  Material Design + HIG + custom. On garde les patterns utiles pour
  le template steaksoap (sites clients agence, B2C/B2B locaux,
  restaurants, hôtels, boutiques).

## Cross-refs

- `.claude/rules/ux-first.md` — règle qui impose la consultation
- `.claude/memory/creative-library/README.md` — structure globale
- `.claude/memory/creative-library/mechanics/` — motion visuelle
- Pattern source : debrief hotel-vda.ch 2026-04-23
