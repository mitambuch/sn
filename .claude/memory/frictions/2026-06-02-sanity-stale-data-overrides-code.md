---
id: sanity-stale-data-overrides-code
date: 2026-06-02
type: friction
tags: [#sanity, #content, #client-specific]
scope: client-specific
status: active
---

# Friction — données Sanity prod périmées écrasent le bon fallback code

## Ce qui bloque

L'owner signale "l'équipe est écrasée par Sanity" : le site affichait
Salvatore Tamburini / Bokar Guissé / Harry Novillo au lieu des 5 bons
membres (Valmont focal + Harvy / Lucian / Tavio / Sergio).

Diagnostic : le repo était **correct partout** — fallback hardcodé dans
`Interlocutor.tsx`, i18n `fr.json`, et la fixture `sawnext-seed.json`
avaient déjà les 5 bons membres avec les bonnes bios. Mais
`useTeamMembers` privilégie Sanity dès qu'il y a des docs
(`useSanity = !sanityFallback && sanityMembers.length > 0`). La base
production contenait 3 vieux docs (`team-salvatore/bokar/harry`) d'un
seed antérieur → ils gagnaient sur le fallback.

**Leçon clé** : quand un composant a un fallback hardcodé MAIS préfère
Sanity, corriger le code ne sert à rien si la donnée prod est périmée.
Toujours vérifier l'état réel de la base avant de toucher au code :
`curl https://<projectId>.api.sanity.io/v<ver>/data/query/production?query=...`
(lecture publique, pas de token).

## Résolution trouvée

Script chirurgical `studio/scripts/fix-team.js` (+ `pnpm sanity:fix-team`)
qui supprime UNIQUEMENT les `teamMember` et recrée les 5 depuis la
fixture. Zéro changement de code applicatif.

**Piège évité** : `seed-sawnext --wipe` aurait corrigé l'équipe mais
efface aussi tout le catalogue (event/property/…) et réinjecte des
fiches démo → aurait détruit le vrai contenu client. Ne jamais utiliser
`--wipe` sur une prod qui a du vrai contenu.

## Pour que ça ne se reproduise pas

- Quand l'owner dit "X est écrasé par Sanity", réflexe = lire la prod
  d'abord (curl read-only), pas grep le code.
- Tout futur fix de donnée prod doit être chirurgical par `_type`,
  jamais un wipe global.
- Token d'écriture : passe par `.env.local` (gitignored), pas par le
  chat. Scope **Editor** requis pour delete/createOrReplace (un token
  Viewer échoue avec `permission "update" required`).
