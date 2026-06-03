---
id: profiles-column-grant-trap
date: 2026-06-03
type: friction
tags: [#security, #auth, #friction, #client-specific]
scope: client-specific
status: active
---

# Piège — GRANT colonne sur profiles bloque toute nouvelle colonne writable

## Ce qui bloque

Migration `0010` a durci `profiles` en remplaçant le GRANT UPDATE large par une
**liste blanche de colonnes** :
`grant update (full_name, phone, locale, contact_preference, avatar_url)`.

Conséquence non-évidente : **toute nouvelle colonne** (ici `segments`, ajoutée
en 0018) est **non-writable** par `authenticated` — même par un admin (les
admins partagent le rôle Postgres `authenticated`, leur statut admin est une
valeur dans `profiles.role`, pas un rôle DB). Donc `update profiles set
segments=...` était silencieusement refusé → le tagging admin ne marchait pas.

Pire piège inverse : ajouter naïvement `segments` au GRANT aurait laissé un
**membre s'auto-assigner** un segment via la policy « self update » (with-check
ne pinnait que `role`). Auto-promotion = bypass d'audience total.

## Résolution

Migration `0020` : `grant update (segments)` **+** pin `segments` dans le
with-check de « self update » (à côté du pin `role` existant). Membres ne
changent jamais leurs segments ; admins le peuvent via « admin update all »
(policy permissive sans pin). Le GRANT ouvre la colonne, le with-check est la
vraie barrière.

## Pour que ça ne se reproduise pas

**Toute** colonne ajoutée à `profiles` qui doit être modifiable nécessite :
1. un `grant update (<col>)` explicite (la liste blanche de 0010 ne couvre que
   les colonnes profil-membre), ET
2. une décision RLS : modifiable par le membre lui-même ? → sinon **pin la
   colonne** dans le with-check de « self update ».

Corollaire : `role` non plus n'est pas dans la liste → `updateRole` direct est
probablement déjà cassé (pré-existant, hors audience — cf finding F9 de
`docs/AUDIENCE-SECURITY-REVIEW.md`). Lié à [[audience-server-gate]].
