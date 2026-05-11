---
id: 2026-05-11-supabase-expose-new-tables-toggle
date: 2026-05-11
type: friction
tags: [#auth, #security, #friction, #active]
scope: template
status: active
---

# Friction — Supabase "Automatically expose new tables" toggle au setup projet

## Le piège

Au moment de créer un nouveau projet Supabase (panneau "Security"
dans le wizard New Project), trois toggles existent :

1. ✓ Enable Data API
2. ✓ Automatically expose new tables  ← **piège**
3. ☐ Enable automatic RLS

Mon réflexe initial (sécurité-par-défaut) m'a fait recommander à
l'owner de **décocher** le toggle #2 + **cocher** le toggle #3. La
réalité Supabase 2026 : le toggle #2 ne contrôle PAS seulement
l'exposition via PostgREST ; il contrôle aussi les `GRANT` SQL
qui donnent aux rôles `anon` et `authenticated` le privilège de
base pour interroger les tables.

Si on décoche #2, **aucune nouvelle table créée n'a de grant**, et
toute requête API renvoie `42501 insufficient_privilege` (403)
même quand la RLS aurait laissé passer la row.

## Comment je l'ai découvert

Soir du 2026-05-11, lot A.5 Supabase live test :
1. Login signInWithPassword OK → user fd73e7fa créé dans auth.users
2. Trigger on_auth_user_created OK → row profile insérée
3. AuthContext fetchProfile → GET /rest/v1/profiles?id=eq.fd73e7fa
4. 403 PostgREST error 42501 → "Hé mais la RLS est correcte ?"
5. Drop la récursion RLS (migration 0002) → toujours 403
6. Inspection Table Editor → la row EXISTE et l'auth.uid() match
7. Réalisation : c'est un GRANT manquant, pas RLS

## Le fix

Migration `supabase/migrations/0003_grant_table_access.sql` :

```sql
grant select, update on public.profiles to authenticated;
grant select on public.invitation_codes to anon;
grant select, insert, update on public.invitation_codes to authenticated;
grant select, insert, update on public.inquiries to authenticated;
```

RLS reste le gate row-level. Les grants ne donnent pas un accès
général — ils débloquent juste le check de privilege table-level
qui précède l'évaluation RLS.

## Reco pour les futurs setups

**Laisser "Automatically expose new tables" coché** au moment du
New Project Supabase. La couche RLS suffit pour la sécurité
row-level. Si on veut cacher une table entière, faire un `revoke`
explicite après création.

Pour `Enable automatic RLS` : OK à cocher — ça force juste la
discipline d'écrire les policies dès la création, ce qui est sain.

## Pourquoi cette friction restera utile

Au prochain projet Supabase je risque de re-faire la même
recommandation par réflexe sécu. Cette entrée est mon filet :
au moment de répondre "voilà comment configurer ton nouveau
projet Supabase" je dois grep `#supabase #setup` et relire.

## Cross-refs

- Migration source du fix : `supabase/migrations/0003_grant_table_access.sql`
- Décision Supabase live (lot A.5) : session 2026-05-11
- Doc Supabase pertinente : Project Settings → API → Exposed Schemas
