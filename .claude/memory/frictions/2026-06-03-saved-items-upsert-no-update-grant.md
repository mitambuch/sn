---
id: saved-items-upsert-no-update-grant
date: 2026-06-03
type: friction
tags: [#security, #auth, #friction, #client-specific]
scope: client-specific
status: active
---

# Piège — `.upsert()` client contre un grant volontairement sans UPDATE

## Ce qui bloque

`saved_items` (0011) accorde **délibérément** `select, insert, delete` mais
**pas** `update` (« a saved item is present or absent, never mutated »). Le
client faisait pourtant `.upsert({...})` : par défaut supabase-js émet
`INSERT ... ON CONFLICT DO UPDATE`, qui exige le droit UPDATE → re-sauvegarder
une fiche déjà sauvée (cache local périmé, multi-appareil) renvoyait
« permission denied », pire que le 409 qu'on voulait éviter.

Même classe que [[profiles-column-grant-trap]] : un grant restrictif rend une
opération « évidente » impossible de façon non-évidente.

## Résolution

`.upsert(values, { onConflict: 'user_id,module,slug', ignoreDuplicates: true })`
→ `ON CONFLICT DO NOTHING`, qui n'a besoin que d'INSERT. Idempotent, et
l'intention sécu (pas d'UPDATE) est préservée.

## Pour que ça ne se reproduise pas

Avant d'écrire `.upsert()` côté client, vérifier le grant de la table :
- si `update` n'est pas accordé → **toujours** `ignoreDuplicates: true`
  (DO NOTHING), jamais l'upsert par défaut (DO UPDATE).
- règle générale : croiser chaque écriture client (insert/update/delete/
  upsert/rpc) avec les grants ET les policies de la table. L'audit du
  2026-06-03 a fait ça pour toutes les tables — c'est la check-list à
  rejouer quand on ajoute une écriture.
