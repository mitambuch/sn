# Basculement « Audience » — passage en vraie sécurité serveur

> Ce document décrit le **cutover** : passer le catalogue Sanity en privé et
> activer le gate serveur qui filtre les fiches par segment. Tant qu'il n'est
> pas fait, la Phase 1 (segments + tags + audience par fiche) fonctionne comme
> **outil d'organisation interne**, mais sans blocage réel côté visiteur.

## Ce qui est déjà en place (code)

- Une fonction serveur `netlify/functions/catalogue.mts` qui lit Sanity avec un
  token et ne renvoie à chaque membre que les fiches autorisées (segments +
  exclusions, migration 0018). Elle sert aussi les lectures publiques (accueil,
  footer, équipe), l'admin, et les liens de partage.
- Les lectures Sanity de l'app passent par cette fonction **quand le flag est
  activé** (`VITE_CATALOGUE_GATE=true`). Flag à `false` = comportement actuel,
  inchangé.
- Migration `0019_peek_share_code.sql` (validation non-mutante d'un code de
  partage par le serveur).

## Le cutover est **atomique et réversible**

Tant que `VITE_CATALOGUE_GATE` est `false`, **rien ne change**. On bascule tout
d'un coup, et si quoi que ce soit cloche, on remet le flag à `false` (et le
dataset en public) — retour immédiat à l'état actuel.

---

## Étapes (à faire par l'owner — ~10 min)

### 1. Appliquer la migration 0019 (Supabase)

Dashboard Supabase → SQL Editor → coller le contenu de
`supabase/migrations/0019_peek_share_code.sql` → Run. (Même geste que pour les
migrations précédentes.)

### 2. Créer un token de lecture Sanity

sanity.io/manage → projet `k2xrvftw` → **API** → **Tokens** → **Add API token**
→ nom « gate-read », **scope Viewer** (lecture seule) → copier le token.

### 3. Renseigner les variables d'environnement Netlify

Netlify → Site `sawnext` → **Site configuration** → **Environment variables**.
Ajouter (toutes **sans** préfixe `VITE_` sauf le flag) :

| Variable | Valeur |
|---|---|
| `SANITY_READ_TOKEN` | le token de l'étape 2 |
| `SANITY_PROJECT_ID` | `k2xrvftw` |
| `SANITY_DATASET` | `production` |
| `SANITY_API_VERSION` | `2024-06-01` |
| `SUPABASE_URL` | l'URL du projet Supabase (`https://kvmkzcwgpjtfclteybse.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` (secret) |
| `VITE_CATALOGUE_GATE` | `true` |

> ⚠️ `SANITY_READ_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY` = **secrets backend**. Ils
> ne sont jamais envoyés au navigateur (la fonction tourne côté serveur). Ne
> jamais les préfixer `VITE_`.

### 4. Passer le dataset Sanity en privé

sanity.io/manage → projet → **Datasets** → `production` → réglage de visibilité
→ **Private**. À partir de là, le navigateur ne peut plus lire Sanity en direct
— tout passe par le gate.

### 5. Redéployer

Netlify → **Trigger deploy** → **Deploy site** (ou un push sur `main`). Le
nouveau build embarque `VITE_CATALOGUE_GATE=true` et la fonction.

---

## Vérifications après cutover (smoke test)

1. **Page d'accueil + footer** s'affichent normalement (lecture publique via le
   gate).
2. **Espace membre** : un membre voit les fiches `Audience = Tous` ; une fiche
   restreinte à un segment qu'il **n'a pas** **n'apparaît plus** dans la liste,
   et son URL directe renvoie « introuvable ».
3. **Exclusion** : un membre exclu d'une fiche ne la voit pas, même s'il a le bon
   segment.
4. **Admin** : `/admin/catalogue` liste toujours toutes les fiches (un opérateur
   voit tout).
5. **Lien de partage** : un code `/share/XXXXXX` affiche toujours sa/ses
   fiche(s).

### Test « attaque » (preuve de sécurité)

Ouvrir les outils dev → onglet Réseau, ou tenter une requête directe à l'API
Sanity publique avec le project id : elle doit être **refusée** (dataset privé).
C'est la preuve qu'une fiche restreinte n'est plus lisible sans passer par le
gate authentifié.

---

## Rollback (si problème)

1. Netlify → `VITE_CATALOGUE_GATE` = `false` → redeploy.
2. (optionnel) Sanity dataset → repasser `production` en **Public**.

État restauré à l'identique de l'avant-cutover, sans perte de données.

---

## Notes techniques

- La décision « ce membre peut-il voir cette fiche » vit **deux fois** : une
  copie pure côté client (`memberCanSeeFiche`, pour l'aperçu admin) et la
  **vraie** dans le gate serveur. Seule celle du serveur fait barrière.
- Filtrage : une fiche sans règle d'audience = visible par tous les membres
  (défaut). `Audience = segments` = visible seulement par les membres tagués
  d'au moins un segment coché. Les exclusions priment toujours.
- Les opérateurs (`role = admin`) voient toutes les fiches, sans filtre.
- Plus de CDN Sanity en mode gate (lectures via la fonction) — léger surcoût de
  latence, acceptable pour le volume HNW.
