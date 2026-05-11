---
id: 2026-05-11-supabase-vault-secret-naming
date: 2026-05-11
type: friction
tags: [#security, #auth, #friction, #active]
scope: template
status: active
---

# Friction — Supabase Vault secret naming mismatch

## Le piège

Quand on guide l'owner pour stocker un secret dans Supabase Vault
(ex. RESEND_API_KEY pour un trigger pg_net), l'UI Vault propose
un champ **Name** que l'owner remplit librement. Sans cadrage
explicite, il nommera la convention familière (ex. nom du projet
"sawnext") plutôt que le nom exact attendu par le code SQL/trigger
(`RESEND_API_KEY` en majuscules).

Le trigger fait `select decrypted_secret from vault.decrypted_secrets
where name = 'RESEND_API_KEY' limit 1`. Si le nom diffère, retour
NULL, et le trigger bypass silencieusement l'envoi (la branche
`raise warning` ne sort pas dans les logs visibles à l'œil nu, et
le client voit un toast de succès puisque l'INSERT est OK).

Symptôme : INSERT dans la table OK, AUCUNE row dans
`net._http_response`, AUCUN email reçu. Aucun message d'erreur
côté UI.

## Comment je l'ai découvert

Soir du 2026-05-11, test end-to-end de l'inquiry → Resend flow :
1. L'owner submet une inquiry depuis /fr/properties/[slug]
2. Toast de succès côté UI
3. Row apparaît dans `public.inquiries`
4. Aucun email
5. Diagnostic SQL : `select * from vault.decrypted_secrets` →
   1 ligne, `name = 'sawnext'`, value_chars = 36
6. Cause confirmée : l'owner a nommé le secret "sawnext" (nom du
   projet) au lieu de "RESEND_API_KEY" (nom attendu par le trigger)
7. Fix : `update vault.secrets set name = 'RESEND_API_KEY' where
   name = 'sawnext'`

## Le fix au moment du setup

Quand je guide un futur owner à travers la création d'un secret
Vault Supabase :

1. **Toujours préciser le nom EXACT, en majuscules, dans un bloc
   monospace**, ex. `Name : RESEND_API_KEY` (entre backticks).
2. **Expliquer pourquoi** : "c'est ce nom que le trigger SQL ira
   chercher". Sans le pourquoi, l'owner peut "améliorer" le nom
   pour quelque chose de plus parlant.
3. **Donner un check SQL post-setup** :
   ```sql
   select name from vault.decrypted_secrets where name = 'RESEND_API_KEY';
   ```
   Si 0 row → renaming nécessaire avant d'aller plus loin.

## Pourquoi le silence

Le trigger `notify_new_inquiry` fait :
```sql
if resend_key is null then
  raise warning 'RESEND_API_KEY not in Vault — skipping email notification';
  return new;
end if;
```

`raise warning` est invisible côté client (l'INSERT termine OK).
Les warnings sont visibles dans **Supabase Dashboard → Logs →
Postgres logs**, mais aucun process automatique ne le surface.
Solution future : promouvoir en `raise exception` pendant le dev
(rollback l'INSERT pour signaler la mauvaise config), garder
`raise warning` en prod (envoi mail non-bloquant pour la création
de l'inquiry, mais log d'alerte).

## Cross-refs

- Migration source : `supabase/migrations/0004_resend_inquiry_notification.sql`
- Friction sœur : `2026-05-11-supabase-expose-new-tables-toggle.md`
  (autre piège setup Supabase qu'on a vu ce soir)
- Pattern Supabase Vault : https://supabase.com/docs/guides/database/vault
