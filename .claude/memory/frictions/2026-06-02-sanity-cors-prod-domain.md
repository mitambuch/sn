---
id: friction-2026-06-02-sanity-cors-prod-domain
date: 2026-06-02
type: friction
tags: [#sanity, #friction, #client-specific, #p1]
scope: client-specific
status: resolved
---

# Admin catalogue — "Request error while attempting to reach" (Sanity CORS)

## Symptôme

`/admin/catalogue` en prod affichait l'erreur `@sanity/client` :
« Request error while attempting to reach is https://k2xrvftw.apicdn.sanity.io/… ».
Les pages publiques ne le montraient pas (elles ont un fallback mock qui
masque l'échec ; l'admin, lui, affiche l'erreur brute).

## Cause

Le domaine de prod `https://sawnext.ch` n'était pas dans les **CORS
Origins** du projet Sanity. Une requête navigateur vers l'API/CDN Sanity
exige que l'origine soit autorisée (le Studio + localhost sont auto-ajoutés,
pas les domaines web de prod). `useCdn: true` + dataset public, sans token.

## Résolution

manage.sanity.io → projet `k2xrvftw` → **API → CORS Origins → Add** :
`https://sawnext.ch` (+ www, + saw-next.ch, + netlify si utilisés),
**« Allow credentials » DÉCOCHÉ** (lecture publique, aucun token navigateur).
Recharge → catalogue OK.

## Pour que ça ne se reproduise pas

Checklist déploiement client : ajouter le domaine de prod aux CORS Sanity
fait partie du go-live (au même titre que les env vars Netlify). À intégrer
dans `docs/NETLIFY-DEPLOY.md` comme étape explicite.

## Note sécurité (non bloquant)

Dataset public en lecture = toutes les fiches (y compris visibility
"private") lisibles via l'API par quiconque connaît le projet id. Design
actuel assumé (la sécurité repose sur le rôle Studio pour l'édition). Si
verrouillage lecture voulu un jour : lecture via fonction serveur + token.
