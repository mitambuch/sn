---
id: 2026-05-11-logic-before-decoration
date: 2026-05-11
type: feedback
tags: [#design, #workflow, #feedback, #client-specific, #active, #p0]
scope: client-specific
status: active
---

# Pense logique avant de mettre des trucs en page

## La règle (Sawnext, owner Mirco, 2026-05-11 23:25)

Citation directe : *"stp pense d'abord logique avant de mettre des trucs
en page."*

Reformulé : **avant d'ajouter un élément visuel sur une card / page,
je dois pouvoir répondre à "à quoi ça sert pour CE module précis ?"
en une phrase.** Si la réponse est "ça équilibre la mise en page" ou
"c'est joli", c'est une décoration vide → à supprimer.

## Pourquoi cette règle existe

Incident témoin 2026-05-11 23:25 :

1. J'avais mis un `Card.Badge` top-left pour TOUS les modules (Property:
   surface m², Timepiece: year+brand, Artwork: year+medium). Owner :
   *"sur produit ça vampirise l'image"* → drop pour les produits.
2. J'avais mis un `Card.PriceBlock` avec leadTime+Hourglass pill pour
   Concierge. Owner : *"le module de box en bas ne fonctionne pas"* →
   drop pour Concierge.
3. J'avais ajouté un `Card.Stat` "Full set ✓ / —" pour Timepiece.
   Owner : *"c'est pas ouf"* → remplacer par Material (Acier/Or/Platine).

Pattern commun : **j'ai forcé la symétrie visuelle avant d'avoir validé
le SENS module par module**. Chaque ajout doit passer le test :
"qu'est-ce que cette info apporte au client HNW sur CE module
précisément ?"

## How to apply

Avant chaque ajout d'élément visuel (badge, stat, pill, footer block) :

1. **Test du sens** : "qu'est-ce que ce truc dit au client HNW ?" — si
   la réponse est "c'est cohérent avec les autres", c'est insuffisant.
   La cohérence visuelle vient du WRAPPER (Card unified), pas du
   remplissage par symétrie.
2. **Test du domain** : produit (Property/Timepiece/Artwork) ≠ service
   (Concierge) ≠ temporel (Event/Journey/Article). Chaque type a sa
   logique d'info clé. Ne pas plaquer un pattern sur un domain où il
   ne fait pas sens.
3. **Test du "1 coup d'œil"** : si l'élément n'aide pas le client à
   décider en 1 seconde, il est décoratif → drop.
4. **Test du data** : si la valeur sous-jacente est "✓ / —" ou "Var" ou
   "Sur demande" pour 80% des items, le stat n'apporte rien — drop ou
   remplacer par un champ plus discriminant.

## Exemples concrets validés ce soir

- ✅ **Property badge** : DROP (image immobilier respire)
- ✅ **Concierge PriceBlock** : DROP (service ≠ produit catalogué)
- ✅ **Timepiece "Full set" stat** : REPLACE par Material (Acier/Or/...)
- ✅ **Event/Article badge date** : KEEP (date = info clé temporelle)
- ✅ **Journey badge durée** : KEEP (durée = info clé voyage)

## Anti-patterns à ne pas répéter

- Forcer un pattern PARTOUT pour la symétrie visuelle.
- Ajouter un stat parce que "il faut 2 cols dans Card.Stats".
- Mettre une pill avec icône parce que "ça fait premium" sur un module
  où ça n'a pas de sens.
- Ne pas distinguer produit vs service vs temporel dans le design
  system.

## Cross-refs

- Complète `feedback/2026-05-11-luxury-push-further-bias.md` — "pousser
  plus loin sur la direction" reste vrai, MAIS pas en plaquant des
  motifs partout. La direction est UNE direction, l'application varie.
- Anti-pattern `creative-library/anti-patterns/safe-centered-hero.md`
  (le défaut par flemme) reste valable. Le défaut par symétrie forcée
  est une version subtile du même problème.
- Lié à `principles.md` §2 (Simplicity First) et §3 (Surgical Changes)
  — ne pas ajouter ce qui n'est pas demandé par le sens du domain.
