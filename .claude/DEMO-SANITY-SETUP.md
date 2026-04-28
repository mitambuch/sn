# Demo Sanity Setup — voir le Studio en action en 5 min

> **Usage** : la première fois que tu hook le template à Sanity (ou quand
> tu veux un environnement de démo pour montrer à un prospect / tester
> une modif), suis cette procédure. Crée **ton** projet Sanity demo
> personnel, pousse le fixture trilingue pré-rempli, lance `pnpm dev` —
> tu vois le front qui lit des données Sanity réelles.

## Projet de référence de l'owner (Mirco)

- **Project ID** : `m7ea02li`
- **Nom** : `steaksoap-demo`
- **Studio** : https://m7ea02li.sanity.studio/ (une fois `pnpm studio:deploy` lancé)
- **Dashboard** : https://www.sanity.io/manage/project/m7ea02li
- **Datasets** : `staging` (par défaut), `production` (promouvoir via
  `pnpm sanity:promote`)
- **Token** : stocké dans `.env.local` côté owner uniquement, jamais
  committé.

> Les clones pour des vrais clients doivent créer **leur propre projet
> Sanity** — cet ID est le demo personnel de Mirco, sans write access
> partagé. Pour un client, suivre `.claude/BOOTSTRAP-CLIENT.md`.

## Pourquoi ce doc existe

Sans contenu dans Sanity, `pnpm dev` affiche des fallbacks vides ou du
contenu i18n hardcodé. Pour **voir** ce que le starter fait vraiment,
il faut remplir au moins `siteConfig` + 1-2 pages. Ce fixture fait ça
d'un coup avec une marque fictive trilingue (Atelier Lumière,
photographe d'architecture) — suffisamment réaliste pour valider
schémas, queries, composants sans coder un vrai client.

## Procédure (5 étapes, ~5 min)

### 1. Créer le projet Sanity (manage.sanity.io)

- Va sur https://manage.sanity.io
- Sign in (Google / GitHub / email)
- **Create new project**
  - Name : `steaksoap-demo` (ou ce que tu veux)
  - Dataset : laisse `production` pour l'instant, on créera `staging` juste après
  - Plan : **Free** suffit largement (free tier = 3 users, 10k docs, 5GB assets)
- Une fois créé, clique le projet → copie le **Project ID** (dans l'URL ou Settings › API)

### 2. Créer un dataset `staging`

Dans l'interface du projet : **Datasets** → **Create dataset**

- Nom : `staging`
- Visibility : `Private`

C'est sur staging qu'on pousse par défaut (safer que prod).

### 3. Créer un write token

**API** → **Tokens** → **Add API token**

- Label : `steaksoap-demo-write`
- Permissions : **Editor**
- Clique **Save**, **copie le token** (affiché une seule fois — garde-le).

### 4. Remplir `.env.local` + pousser le fixture

```bash
pnpm doctor:client:fix
```

Prompte interactivement pour :
- `VITE_SANITY_PROJECT_ID` — colle l'ID de l'étape 1
- `SANITY_WRITE_TOKEN` — colle le token de l'étape 3
- `VITE_SANITY_DATASET` — `staging`

Puis pousse le seed :

```bash
pnpm sanity:seed:demo:dry   # optionnel : voir ce qui sera écrit
pnpm sanity:seed:demo       # push réel sur staging
```

Tu devrais voir :

```
Seed demo — target <project>/staging  (4 documents)
  ✓ siteConfig/siteConfig-singleton
  ✓ page/page-home
  ✓ page/page-about
  ✓ page/page-contact
Done : 4 written, 0 failed.
```

### 5. Lancer le front + le Studio

```bash
# Terminal 1 — le Studio (éditeur Sanity)
pnpm studio:dev
# → http://localhost:3333

# Terminal 2 — le front React
pnpm dev
# → http://localhost:5173
```

Tu vois :
- Sur localhost:3333 : le Studio Sanity avec les 4 documents remplis (Configuration globale, 3 pages)
- Sur localhost:5173 : le front qui lit ces données via les hooks `useSanityDoc`

## Ce que tu peux tester dans ce dataset demo

- **Éditer un champ dans le Studio** → rafraîchir le front → voir le changement
- **Switch locale** (fr/de/en via le LanguageSwitcher du Header) → tout bascule
- **Clic sur un slash command** dans Claude Code :
  - `/sync-content` lit Sanity et audite les trous → dit que tout est plein
  - `/translate page page-home` → propose rien à traduire
  - `/wire-content Home` → détecte que tout est déjà câblé
- **Casser volontairement** une locale : vider le champ `heroHeading.de` dans le
  Studio, lancer `pnpm validate:sanity-content:required` → échec attendu
- **Promouvoir vers prod** : `pnpm sanity:promote` puis
  `pnpm sanity:seed:demo:prod` pour copier le fixture dans le dataset
  production

## Supprimer le demo et repartir à zero

```bash
# Dans le Studio, Desk → sélectionne chaque doc → Delete (ou via CLI) :
pnpm dlx @sanity/cli dataset delete staging
pnpm dlx @sanity/cli dataset create staging
pnpm sanity:seed:demo   # re-pousse le fixture propre
```

## Tenir le fixture à jour (discipline de maintenance)

Le fixture `studio/fixtures/demo-seed.json` doit toujours refléter les
schémas courants. Quand tu touches `studio/schemas/**`, exécute la
checklist :

1. **Ajout d'un champ sur page ou siteConfig** → ajoute la valeur
   trilingue correspondante dans les 4 documents du fixture. Si le
   champ est `localeString/Text/RichText`, les 3 locales (fr/de/en)
   DOIVENT être remplies (règle #13 i18n-sanity).
2. **Nouveau type de document** (`project`, `team`, `testimonial`…)
   → ajoute 2 exemples trilingues au fixture sous `documents[]`.
   Incrémente la sémantique du seed si besoin (group par type dans
   seed-demo.js).
3. **Renommage / suppression d'un champ** → nettoie le fixture du
   vieux champ, sinon Sanity refusera le push (validation schema stricte).
4. **Relance** `pnpm sanity:seed:demo:dry` pour vérifier que le fixture
   parse OK, puis `pnpm sanity:seed:demo` pour écraser le dataset demo
   avec la nouvelle version.
5. **Commit** le fixture modifié en même temps que le schéma — le repo
   garantit que seed + schema sont toujours synchronisés.

**Pas de lint automatique pour l'instant** — c'est manuel. Si on ajoute
3+ types de documents, envisager `scripts/validate-fixture.js` qui
parse les schémas et vérifie le fixture point par point.

## Limites du demo

- Pas d'images dans le fixture (les champs `heroImage`, `logo`, `ogImage`
  restent vides). Tu peux en ajouter à la main dans le Studio pour tester
  le rendu — les hooks `useSanityImage` fonctionnent dès qu'un asset est
  uploadé.
- Pas de collections répétables dans le fixture (le template a
  `siteConfig` + `page` seulement). Quand tu ajouteras `project`, `team`,
  `testimonial` pour un vrai client, il faudra étendre le fixture (ou
  juste les créer depuis le Studio).

## Flow pour un vrai client (rappel)

Ce doc est pour le **demo**. Pour un vrai client :

1. Nouveau projet Sanity (nom = slug du client)
2. `pnpm doctor:client:fix` — renseigne project_id + token client
3. **NE PAS** `pnpm sanity:seed:demo` (ça pollue avec Atelier Lumière)
4. `/wire-content Home` dans Claude Code → génère le contenu du client

Voir `.claude/BOOTSTRAP-CLIENT.md` pour la séquence client complète.

## Cross-refs

- Fixture : `studio/fixtures/demo-seed.json`
- Script : `studio/scripts/seed-demo.js`
- Doctor gate : `scripts/doctor-client.js`
- Protocole content : `.claude/rules/i18n-sanity.md`
