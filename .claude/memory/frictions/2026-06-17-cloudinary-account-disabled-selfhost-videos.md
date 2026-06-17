---
id: cloudinary-account-disabled-selfhost-videos
date: 2026-06-17
type: friction
tags: [#perf, #friction, #client-specific, #p2]
scope: client-specific
status: active
---

# Compte Cloudinary désactivé → vidéos hero 401, self-host sous public/

## Ce qui bloquait

Owner : « les vidéos ne se chargent pas ». Les 6 clips hero (accueil +
/presentation) étaient hébergés sur Cloudinary `df5khdkxl`. Toutes les URLs
renvoyaient **HTTP 401** avec le header révélateur :

```
x-cld-error: cloud_name df5khdkxl is disabled
```

Compte désactivé (quota free dépassé / facturation / « ils ont changé de
méthode » dixit owner). Rien de cassé côté code — symptôme externe pur. Déjà
présent avant (la vidéo ne « peignait » pas en local le 17/06), surfacé en prod.

## Diagnostic (réutilisable)

`curl -sI <url-asset>` sur l'asset externe. Cloudinary expose la cause exacte
dans `x-cld-error`. Pour un endpoint applicatif public (action gate non-auth),
`curl -X POST` direct la fonction Netlify — pas besoin d'attendre le navigateur.
À distinguer d'une CSP : ici `media-src` autorisait bien cloudinary, c'était
l'origine qui répondait 401.

## Résolution

Owner a déposé les clips dans `public/video/{1,2}.mp4` (~4,4 Mo chacun).
`HERO_VIDEOS` (`src/config/heroVideos.ts`) pointe désormais sur `/video/1.mp4`
+ `/video/2.mp4` (même origine → couvert par CSP `media-src 'self'`, zéro conf).
Vite copie `public/` vers `dist/` au build. Les 6 URLs Cloudinary mortes
supprimées. Images du site **non concernées** (elles viennent de Sanity
`cdn.sanity.io`, pas Cloudinary).

## Pour que ça ne se reproduise pas

- Un asset critique (hero) sur un CDN tiers gratuit = point de défaillance
  silencieux. Self-host sous `public/` pour les assets de marque essentiels,
  ou un CDN payant fiable.
- ⚠ Coût : +8,7 Mo de binaire dans le repo Git. OK pour 2 clips ; si la footage
  grossit, repasser sur un vrai CDN vidéo (Cloudinary réactivé, Mux, bunny…)
  plutôt que gonfler l'historique Git.
