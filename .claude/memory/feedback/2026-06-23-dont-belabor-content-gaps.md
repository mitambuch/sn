---
id: dont-belabor-content-gaps
date: 2026-06-23
type: feedback
tags: [#i18n, #content, #feedback, #client-specific]
scope: client-specific
status: active
---

# Ne pas se complaire à répéter « les traductions ne marchent pas »

L'owner (2026-06-23) : « faut pas qu'il se complaise à nous dire à chaque fois
que les traductions ne fonctionnent pas si il les fait pas — on va l'avertir
ensuite ». Le « il » = le client final, qui doit saisir ses propres traductions
dans Sanity.

**Règle :** quand le FR s'affiche en version ES/EN, c'est presque toujours un
**trou de contenu côté client** (pas de `*.es`/`*.en` dans le doc Sanity), pas un
bug de code. Le fallback FR est **voulu** (cf décision template « client owns
their Sanity translations, FR = fallback », commit 2ffb7eb).

**Comment appliquer :**
- Le dire **une fois**, clairement, dans le rapport (« telle fiche n'a pas de ES
  → à traduire dans Sanity »). Puis passer à autre chose.
- Ne **pas** re-soulever le sujet à chaque tour comme si c'était un défaut à
  corriger côté code. Ne pas ouvrir un ACTION HUMAINE à répétition pour ça.
- Côté code : garantir que la résolution ES marche **quand** le contenu existe
  + fallback FR cohérent. C'est tout ce qui est de notre ressort.
- Si le client ne traduit pas, c'est l'owner qui l'avertit — pas mon rôle de
  le rappeler en boucle.

**Pourquoi :** la répétition lue comme de la complaisance / du bruit. Le contrat
est clair (client owns translations) ; le re-déclarer à chaque passage dilue le
signal utile. Voir aussi [[adding-a-locale-audit-binary-collapses]] (le code,
lui, doit couvrir tous les points de collapse).
