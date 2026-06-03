---
id: audience-server-gate
date: 2026-06-03
type: decision
tags: [#security, #sanity, #auth, #decision, #client-specific]
scope: client-specific
status: active
---

# Audience par segment — gate serveur Netlify + dataset Sanity privé

## Contexte

Client veut que Salva tague les membres (ex: clients adressés par une banque
« piguet-galland ») et restreigne chaque fiche à des segments + exclure des
personnes précises. Exigence owner : **vraie sécurité serveur**, promouvable.

## Décision

Sécurité réelle = **dataset Sanity privé** + **toute** lecture Sanity routée
par une **fonction Netlify** (`netlify/functions/catalogue.mts`) qui détient le
read-token et filtre les fiches par segment côté serveur.

Pourquoi pas autrement :
- Sanity n'a **pas** d'ACL par document — un dataset est public OU privé. Donc
  cacher des fiches impose dataset privé → toutes les lectures (catalogue
  membre, accueil/footer/équipe marketing, admin, partage) passent serveur.
- Edge Function Supabase rejetée : le projet déploie via Netlify (auto), pas de
  CLI Supabase configuré ; pg_net est async (inutilisable pour un proxy
  synchrone). Netlify Function = colle au déploiement + secrets déjà gérés.

## Architecture

- Fonction = actions sémantiques (jamais de GROQ client arbitraire) :
  `landing`/`siteConfig`/`team` (public), `list`/`item` (membre, filtré),
  `adminList` (admin), `shared` (par code via RPC `peek_share_code` non-mutant).
- Client derrière flag `VITE_CATALOGUE_GATE` (+ fallback Sanity direct) → merge
  non-bloquant, basculement atomique et réversible.
- GROQ centralisé dans `sanityQueries.ts` (source unique hooks ↔ fonction).
- Décision client `memberCanSeeFiche` = aperçu admin uniquement, **jamais** la
  barrière. Seul le serveur fait foi.

## Données (migrations)

`0018` segments + profiles.segments + fiche_audience · `0019` peek_share_code ·
`0020` grant + pin segments (voir friction [[profiles-column-grant-trap]]).

## Reste (owner)

Cutover : appliquer 0019+0020, créer read-token Sanity, env Netlify, dataset
privé, flag=true. Runbook : `docs/AUDIENCE-CUTOVER.md`. Revue sécu complète :
`docs/AUDIENCE-SECURITY-REVIEW.md`.
