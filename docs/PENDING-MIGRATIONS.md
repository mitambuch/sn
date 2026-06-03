# Migrations Supabase à appliquer

> Liste des migrations écrites sur la branche `feat/audience-segments` et pas
> encore appliquées à la base live. À coller dans **Supabase → SQL Editor →
> Run**, dans l'ordre. Toutes sont **sûres à appliquer maintenant** — elles ne
> changent rien pour les visiteurs (le passage en dataset privé + le flag, lui,
> est une étape séparée : voir `AUDIENCE-CUTOVER.md`).

| Ordre | Fichier | Ce que ça fait | Urgence |
|---|---|---|---|
| 1 | `0019_peek_share_code.sql` | Validation non-mutante d'un code de partage (pour le gate de partage, étape cutover). | Au cutover |
| 2 | `0020_segments_update_guard.sql` | Rend `profiles.segments` modifiable par les **admins uniquement** — **sans elle le tagging des membres ne s'enregistre pas**. | **Maintenant** |
| 3 | `0021_notify_access_accepted.sql` | Quand Salva accepte une demande → génère un code + **email au demandeur**. | Maintenant |
| 4 | `0022_fix_share_codes_revoke.sql` | **Corrige le bug de révocation des share codes** (contrainte de format + grant + policy). | **Maintenant** |
| 5 | `0023_grant_role_update.sql` | Permet à un admin de **promouvoir/rétrograder** un opérateur (bug pré-existant F9). | Maintenant |
| 6 | `0024_access_requests_delete.sql` | Permet à Salva de **supprimer** une demande d'accès traitée (nettoyer le tableau). | Maintenant |
| 7 | `0025_user_admin_controls.sql` | **Suspendre** (réversible) + **supprimer** (définitif) un membre depuis /admin/users. | Maintenant |

## Vérifs rapides après application

- **0020** : dans `/admin/users`, taguer un membre s'enregistre (la puce reste).
- **0021** : passer une demande en « Accepté » → un code apparaît dans
  `invitation_codes` + le demandeur reçoit l'email.
- **0022** : révoquer un share code dans `/admin/share-codes` → statut
  « révoqué », **plus d'erreur**.
- **0023** : promouvoir un membre en opérateur dans `/admin/users` fonctionne.

## Rappel — ce qui n'est PAS une migration

Le **cutover sécurité** (dataset Sanity privé + variables Netlify + flag
`VITE_CATALOGUE_GATE=true`) est une étape distincte, décrite dans
`AUDIENCE-CUTOVER.md`. Les 5 migrations ci-dessus peuvent être appliquées
avant, indépendamment.
