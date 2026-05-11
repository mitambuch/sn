---
id: 2026-05-11-luxury-push-further-bias
date: 2026-05-11
type: feedback
tags: [#design, #workflow, #feedback, #client-specific, #active, #p0]
scope: client-specific
status: active
---

# Quand l'owner pose une direction design : pousse plus loin, pas moins

## La règle (Sawnext, owner Mirco, 2026-05-11 22:52)

Contrat de collaboration design clarifié explicitement :

1. **Moins de précision owner = meilleur output Claude.** "Plus je te
   donnais de précision sur le style plus tu faisais de la merde."
   → Ne PAS demander une liste de refs URLs avant d'agir. Sur ce projet,
   le VISION block reste obligatoire mais avec refs implicites segment-
   typiques, pas un Q&A préalable.
2. **Quand l'owner pose une direction stylée, je dois POUSSER À FOND.**
   Exemple textuel : *"si je te dis créer une boîte un peu arrondie, tu
   dois pousser le truc à fond que ça soit super design type Apple, que
   tu mettes tous les petits effets, tu dois aller TOUJOURS plus loin
   que ce que je dis."*
3. **Cohérence + luxe = non-négociables.** Inspiration meilleurs sites du
   segment HNW/Apple/horloger/maison de mode — pas du SaaS générique, pas
   du Linear "electric" (scale + glow), pas du Bootstrap luxe-spa AI-slop.
4. **L'owner garde son mot à dire au CHECKPOINT visuel, pas en pré-spec.**
   Screenshot/URL > liste de refs textuelles avant code.

## Why

L'owner est vibe coder : il décrit la destination (mood + segment), pas la
route (tokens + classes). Mon réflexe défensif "minimum viable conforme
au brief" produit du sous-design qui sent le template — la sycophantie a
un cousin en design, c'est la **sobriété par flemme**. Identifiée explicite
par l'owner ce soir → bannie sur ce projet.

## How to apply

- À chaque direction stylée owner, auto-prompt : *"quel est l'état de
  l'art 2026 sur ce segment ?"* (Apple App Store cards, Cartier site,
  Bottega Veneta, Patek Philippe pour le segment HNW/Sawnext). Je vise
  CE niveau, pas le niveau Stripe/Linear.
- Le compromis = **"et si on en faisait 30 % de plus que demandé ?"** —
  j'applique le 30 % en plus, je montre via checkpoint, owner trim si
  c'est trop. Trimmer est moins cher que pusher.
- Pour HNW Swiss banking monochrome : pas de scale > 1.0 en hover (Linear
  electric vibe), pas de glow accent en idle, pas de glassmorphism trop
  visible. Plutôt : radius assumé (16-20px), inner specular highlight
  top edge, lift 1-2px hover, transitions ease-out 400-500ms, focus rings
  fg/30.
- Checkpoint visuel via screenshot/dev URL après chaque phase ; owner
  approuve ou rebrouille avant phase suivante.

## Cadrage ce soir 2026-05-11

- ✅ **Sidebar AppLayout** = "incroyable" → garder strictement intacte
- ✅ **Interface actuelle post-lot B** = "super clean" → ne pas redesign
  le shell, juste unifier les cards domain divergentes (7 styles → 1)
- ✅ **Scope** = squelette admin retravaillé "encore plus clean", cards
  unifiées style Apple-closed
- ❌ **Pas le scope ce soir** : landing publique `/fr/` (était demandée
  initialement mais owner a pivoté vers admin)

## Cross-refs

- Contre-règle `anti-complaisance.md` : rester contestataire sur le FOND
  (demande bancale → CHALLENGE), mais sur la FORME design pousser au-delà
  du brief explicite. Distinction nette.
- `creative-ambition.md` § "Pas de mechanic théâtrale" — l'ambition est
  dans l'implémentation, pas la liste citée. Mécaniques light citées,
  effort lourd dans le détail.
- `vision-first.md` — bloc VISION continué, mais light : refs implicites
  segment-typiques au lieu d'URLs forcées. Verdict attendu reste explicite.
- `ux-first.md` — pas trigger pour ce sprint (refonte design system, pas
  nouvelle page utilisateur).

## Verdict

Cette règle est **client-specific** Sawnext. Elle complète, ne remplace
pas, les always-loaded rules du template. Si pattern se confirme sur
3+ sprints, candidate à promotion en `#template` via `base:contribute`.
