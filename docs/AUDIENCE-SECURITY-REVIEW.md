# Revue de sécurité — système d'audience (Phase 4)

> Revue adversariale du système de segmentation d'audience (Phases 1-3).
> Date : 2026-06-03. Périmètre : migrations 0018-0020, la fonction serveur
> `netlify/functions/catalogue.mts`, le client (`sanityGate`, hooks), le
> modèle de menace et le basculement. Deux failles **critiques** trouvées et
> corrigées dans cette même passe.

## Modèle de menace

Acteurs : (a) visiteur anonyme, (b) membre connecté avec ses segments, (c)
membre connecté SANS le bon segment / exclu, (d) opérateur (admin), (e)
porteur d'un code de partage. Bien protégé = (c) ne peut **pas** lire une
fiche qui ne lui est pas destinée, par aucun chemin.

Hypothèse fondatrice : **dataset Sanity privé**. Tant qu'il est public,
aucune sécurité réelle n'est possible (n'importe qui lit tout via l'API
publique). Tout le reste suppose le basculement fait (voir
`AUDIENCE-CUTOVER.md`).

## Findings

### 🔴 F1 — Injection GROQ via `slug` (CRITIQUE) — CORRIGÉ

`action: 'item'` passait `body.slug` (client) brut dans le builder GROQ
(`slug.current == "${slug}"`) côté serveur, avec le **token privilégié**. Un
slug forgé (`x" || _type=="event" && "`) pouvait casser la requête
filtrée par audience et lire n'importe quelle fiche.

**Fix** : `SLUG_RE = /^[a-z0-9-]{1,128}$/` — tout slug non conforme est
rejeté en 404 (pas 400, pour ne pas distinguer « slug invalide » de
« absent ») avant d'atteindre GROQ. Idem défense sur `shared` (type validé
contre la liste des modules, id contre `DOC_ID_RE`).

### 🔴 F2 — `profiles.segments` écrivable par le membre lui-même (CRITIQUE) — CORRIGÉ (migration 0020)

La migration 0010 a remplacé le GRANT UPDATE large sur `profiles` par une
liste blanche de colonnes qui **n'inclut pas `segments`**. Deux problèmes :

1. Le tagging admin (`setMemberSegments`) était **bloqué** par le GRANT —
   la feature ne pouvait pas réellement taguer.
2. Ajouter `segments` au GRANT sans plus aurait laissé un **membre
   s'auto-assigner** un segment via la policy « self update » (dont le
   with-check pin `role` mais pas `segments`) → bypass total.

**Fix (0020)** : `grant update (segments)` **+** pin de `segments` dans le
with-check de « self update ». Résultat : un membre peut éditer son
nom/téléphone mais **jamais** ses segments ; un admin le peut via la policy
« admin update all » (permissive, sans pin). C'est la barrière qui fait du
segment une vraie clé d'accès.

### 🟢 F3 — Pas de fuite d'existence sur fiche interdite — OK

`item` interdit renvoie **404** (pas 403) : un membre ne peut pas déduire
qu'une fiche cachée existe. `list` filtre silencieusement.

### 🟢 F4 — Segments non falsifiables — OK

Le serveur lit les segments du membre depuis `profiles` (service role), **pas
depuis le JWT**. Un membre ne peut donc pas forger ses segments dans le
token. La décision client (`memberCanSeeFiche`) est un aperçu admin, **jamais
la barrière**.

### 🟢 F5 — RLS `fiche_audience` admin-only — OK

Aucune policy de lecture pour les non-admins → un membre ne peut pas énumérer
les règles d'audience côté client. Le gate y accède en service role.

### 🟢 F6 — Secrets backend-only — OK

`SANITY_READ_TOKEN` + `SUPABASE_SERVICE_ROLE_KEY` sont des env Netlify **sans
préfixe `VITE_`** → jamais bundlés (cf `security.md`). La fonction tourne
côté serveur.

### 🟢 F7 — Partage = possession du code — OK (par conception)

L'action `shared` valide le code via `peek_share_code` (non-mutant, ne fuit
rien pour un code inconnu). Le partage est un bypass **volontaire** de
l'audience (qui a le lien voit la fiche), distinct du modèle membre.

### 🟡 F8 — Pas de rate-limiting sur le gate — INFO

Un membre authentifié pourrait marteler `item`/`list`. Acceptable pour la
volumétrie HNW. Si besoin plus tard : limiter au niveau Netlify (Edge rate
limit) ou un compteur Supabase.

### 🟡 F9 — `updateRole` probablement bloqué par le GRANT 0010 — PRÉ-EXISTANT (hors périmètre)

`role` n'est pas non plus dans la liste blanche de colonnes de 0010, donc le
changement de rôle direct (`useUsersAdmin.updateRole`) est vraisemblablement
**déjà** refusé. C'est antérieur à cette feature (le commentaire de 0010
mentionne « admin role changes go through a separate RPC (TBD) »). À traiter
séparément si la promotion d'opérateurs doit fonctionner. **Non lié à
l'audience.**

## Verdict

Après F1 + F2 corrigés : le système atteint son objectif — un membre sans le
bon segment (ou exclu) **ne peut lire la fiche par aucun chemin** (liste,
détail, énumération d'audience, falsification de segment, injection). La
sécurité repose sur trois invariants :

1. Dataset Sanity **privé** (sans quoi rien ne tient).
2. Toute lecture de fiche passe par le **gate serveur** (token privilégié,
   filtrage serveur).
3. `profiles.segments` **modifiable par les admins uniquement** (0020).

## Reste à faire par l'owner

- Appliquer **migration 0020** (en plus de 0019) — voir `AUDIENCE-CUTOVER.md`.
- Faire le basculement (dataset privé + flag + secrets).
- Smoke test « attaque » du runbook (fiche restreinte non lisible sans droit).

## Recommandations de durcissement (futur, non bloquant)

- Paramétrer les builders GROQ détail avec `$slug` (au lieu d'interpolation)
  pour une défense en profondeur côté client aussi — le pattern
  d'interpolation est présent ailleurs dans le code.
- Rate-limit sur la fonction si l'usage grandit.
- Reprendre `updateRole` via une RPC admin (F9), indépendamment.
