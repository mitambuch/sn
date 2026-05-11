---
id: 2026-05-12-mobile-restructure-not-truncate
date: 2026-05-12
type: feedback
tags: [#design, #a11y, #feedback, #client-specific, #active, #p0]
scope: client-specific
status: active
---

# Mobile-first = restructurer, pas tronquer

## La règle (Sawnext, owner Mirco, 2026-05-12 00:30)

Citation directe : *"à la place d'avoir en colonne passée en rangée tu
peux repositionner les différents section pour que ça prenne bien la
place t'es pas con ou bien ?"*. Puis : *"garde cette règle en tête
maintenant pour TOUT"*.

Quand un élément ne tient pas sur mobile, la mauvaise réponse est de
**tronquer** (text-ellipsis, line-clamp), **rétrécir** (text-[10px]),
ou **wrapper en 2 lignes**. La bonne réponse est de **restructurer** :

1. **Changer l'axe** : `flex-row [A | B]` → `flex-col [meta+B en row]
   [A full-width dessous]`. L'ancien layout fightait pour la largeur,
   le nouveau respecte chaque élément.
2. **Regrouper différemment** : si deux petits éléments (eyebrow +
   badge) tiennent ensemble, mettre LE GROS contenu dessous full-width.
3. **Penser le contenu prioritaire** d'abord, le layout après. Mobile
   = un user lit verticalement, ne se bat pas pour la place.

## Why

Sur 390px iPhone, un layout `flex justify-between [message col | pill]`
contraint message ET pill à se partager une largeur déjà petite (Card
padding 32 chacun = ~326px). Avec uppercase tracking-widest, la pill
"RÉPONSE ENVOYÉE" ne tient pas sans wrap. Le réflexe `whitespace-nowrap
+ shrink-0 + min-w-0 + line-clamp-2` = pansement, pas guérison. La
guérison : `flex flex-col`, top row [meta+pill], bottom row [message
full-width].

## How to apply

Avant chaque layout :
1. Quels sont les éléments ? Sizes intrinsèques ?
2. Sur 390px, l'axe horizontal a-t-il assez de place pour tout aligner ?
3. Si non, **lesquels peuvent partager une row courte** (eyebrow + badge,
   tags tiny), et **lequel va en full-width ligne suivante** (titre,
   description, image) ?
4. Le layout final doit être **identique mobile et desktop** quand
   possible — pas de breakpoint switch confusant.

## Anti-patterns à ne pas répéter

- `whitespace-nowrap` sur du texte long pour éviter le wrap → tronque
  avec ellipsis = perte d'info.
- `line-clamp-2` sur tout texte qui dépasse → user ne voit pas la fin.
- `flex-wrap` sur des boutons → ils passent sur 2 lignes (BANNI explicite
  par l'owner).
- `flex-1` + content trop large + `whitespace-nowrap` → overflow visible
  (a vampirisé l'ÉCRIRE UN MESSAGE button sur le ConciergeCard pré-fix).
- Réduire le `font-size` sur mobile pour "faire rentrer" du texte →
  cheap, illisible.

## Exemples appliqués ce soir 2026-05-12

- **ConciergeCard buttons** : labels longs en uppercase. Fix précédent
  (flex-1 + nowrap + ellipsis) = pansement. Fix vrai = **icon-only mobile,
  label + icon desktop** via `sr-only md:not-sr-only`. Structure change.
- **RecentInquiries items** : layout `[message | pill]` → restructure
  `[meta+pill row haut] [message row bas]`. Layout identique mobile +
  desktop. Plus de wrap pill, plus de truncate message.

## Cross-refs

- Lien direct : `feedback/2026-05-11-logic-before-decoration.md` (même
  esprit "pense logique avant déco").
- `feedback/2026-05-11-luxury-push-further-bias.md` (push further, mais
  toujours dans le sens du contenu).
- `.claude/rules/responsive.md` — règles responsive de base. Cette
  règle CLIENT-SPECIFIC pousse au-delà : on ne se contente pas de
  "ça tient sur mobile", on RESTRUCTURE pour que ce soit naturel.
- Pattern de référence partagé : top row [meta + badge/pill] +
  bottom row [content full-width]. Appliquer partout où c'est
  pertinent (admin lists, inquiries, news cards, etc).
