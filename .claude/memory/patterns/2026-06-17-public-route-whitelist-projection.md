---
id: public-route-whitelist-projection
date: 2026-06-17
type: pattern
tags: [#security, #sanity, #pattern, #client-specific, #p1]
scope: client-specific
status: active
---

# Une route publique lit une projection WHITELIST, jamais `...`

## Problème résolu

En ajoutant la fiche publique `/c/:type/:id` ([[public-catalogue-fiche-route]]),
j'ai d'abord réutilisé la projection de `/share` (`SHARED_FICHE_PROJECTION`) qui
finit par `...` (spread brut du doc Sanity). La page n'affichait que l'essentiel
(titre, image, résumé…) MAIS le `...` embarquait **tout le doc** dans la réponse
JSON : `price`, `provenanceNote`, `catalogueRaisonne`, specsheets immobilier /
journey, `seo*`, locales brutes. Cacher en UI ≠ contrôle : c'est à un coup d'œil
DevTools Network. Attrapé en revue sécurité adversariale **avant** livraison.

Aggravant : `/share` est code-gated (divulgation contrôlée à 1 destinataire),
mais `/c` est **public + énumérable** (les ids sont déjà dans le payload du
teaser). Le même `...` passe de divulgation ciblée à **diffusion**.

## Le pattern

Pour toute lecture exposée sur une route **publique non authentifiée**, la
projection GROQ est une **whitelist explicite** des seuls champs que la page
rend — **jamais** `...`.

```
// ❌ fuite : ship tout le doc
const X = `*[...]{ "title": ..., "images": ..., ... }`

// ✅ whitelist : exactement ce que la page rend
const PUBLIC_FICHE_PROJECTION = `{
  _type, _id,
  "title": ${L('title')}, "summary": ${L('summary')},
  "description": pt::text(...), "images": ..., "heroImage": ...,
  dateMode, startsAt, "dateLabel": ${L('dateLabel')}, venue, city, countryCode
}`  // pas de price, provenance, seo, locales brutes
```

Whitelist > blocklist pour une frontière d'exposition : un nouveau champ sensible
ajouté au schéma ne fuit pas par défaut.

## Quand l'appliquer

- Toute action serveur / GROQ servant une route publique non authentifiée.
- Dès qu'un doc a des champs « derrière l'accès » (prix, provenance) ET des
  champs publics.

## Anti-patterns

- Réutiliser une projection conçue pour un contexte plus permissif (share/membre)
  sur un contexte public « parce que c'est le même rendu ». Le rendu est le même,
  la **frontière de données** ne l'est pas.
- Compter sur le composant React pour « ne pas afficher » un champ sensible :
  il est quand même dans le payload réseau.

## Cross-refs

- Décision : [[public-catalogue-fiche-route]]
- Garde d'injection GROQ (validation type/id avant interpolation) : action
  `item`/`publicFiche` dans `netlify/functions/catalogue.mts`.
