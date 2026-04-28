# Bootstrap Client — séquence officielle

> **Qui lit ça ?** Toi au démarrage d'un nouveau projet client depuis le starter
> steaksoap, ou Claude Code invoqué sur un worktree fraîchement cloné.
>
> Pour un brief LLM externe (ChatGPT, Cursor), utilise `/context` plutôt que ce doc.

---

## Chrono réaliste (mesuré, pas marketé)

| Profil                  | Prérequis prêts                 | Temps estimé jusqu'à Home FR/DE/EN |
| ----------------------- | ------------------------------- | ---------------------------------- |
| Owner expérimenté (toi) | Oui (Sanity/token/env en cache) | **45-75 min**                      |
| Owner nouveau projet    | Sanity à provisionner           | **60-90 min**                      |
| Nouveau dev repreneur   | Rien de pré-config              | **90-180 min**                     |

Le "< 30 min" promis auparavant était optimiste. La vérité : `pnpm setup`
fait un pnpm install complet + validate:fast (~3 min), `/init` + `/brief`
sont 2 interviews (~15 min combinés), `.claude/client.md` bien rempli
(~10 min), `/wire-content Home` exige un token Sanity write + approval
humain (~15-30 min).

## Prérequis avant de démarrer le chrono

**Bloquants** — remplis-les ou le flow pétera au milieu :

- [ ] Node ≥ 22 + pnpm ≥ 9 installés (`pnpm doctor` le vérifie)
- [ ] Compte Sanity créé + projet provisionné (manage.sanity.io)
- [ ] `VITE_SANITY_PROJECT_ID` dans `.env.local`
- [ ] `SANITY_WRITE_TOKEN` dans `.env.local` (sinon `/wire-content` part en dry-run)
- [ ] Dataset staging accessible (`pnpm sanity:push` doit pouvoir écrire)
- [ ] `.env.local` pointe sur `VITE_SANITY_DATASET=staging` pendant le wire,
      puis `production` seulement après `pnpm sanity:promote`
- [ ] Identité client définie : nom, secteur, ton, audience (remplir `.claude/client.md`)

**Optionnels** — ajoutent du temps mais pas bloquants :

- Logo client
- Palette de couleurs hex définies
- Charte graphique externe

---

## Séquence (6 étapes, ordre strict)

### 1. Setup repo

```bash
pnpm setup
```

Wizard `setup-bootstrap.js` :

- Détecte qu'on est dans un clone steaksoap (pas un fork template).
- Crée `.env.local` avec les fallbacks par défaut.
- Vérifie Node ≥ 22 et pnpm ≥ 9.
- Commit initial.

### 2. Direction design (AVANT `/init` — `/init` lit le brief)

```
/brief
```

Capture le type de projet (corporate, portfolio, SaaS, e-commerce, autre),
l'univers visuel (minimal, éditorial, brutalist, warm-organic…), les refs.
Le résultat est consigné dans `CLAUDE.md §Design Direction` — lu ensuite
par `/init`, `/design` et `/design-explore`.

> **Pourquoi dans cet ordre ?** `/init.md` (interview §3) lit la section
> `## Design Direction` de `CLAUDE.md` et **skip** les questions couvertes
> par `/brief`. Si `/init` tourne en premier, il pose ces questions à la
> main, puis `/brief` les écrase. L'ordre inverse est explicitement
> documenté dans `.claude/commands/brief.md` ligne 3.

### 3. Identité visuelle & styling

```
/init
```

Interview guidé — couleurs, fonts, nom du client, manifest PWA, tokens
CSS. Réécrit `CLAUDE.md` (section en-tête), `index.html`,
`public/manifest.json`, `src/index.css`, `src/config/site.ts`.

### 4. Remplir `.claude/client.md` (à la main — 10 min)

Le template est pré-rempli avec des placeholders. Remplis **au minimum** :

- **Nom** du client
- **Secteur**
- **Ton** (formel / décontracté / technique / poétique)
- **Pronom préféré** (tu / vous / nous)
- **Cible primaire**
- **Charte courte** — 3-5 lignes d'histoire et de promesse
- **Deadline** — YYYY-MM-DD ou vide

Fichier `client.md` est **protégé** de `pnpm base:update` via `scripts/base-patch.js`.
`/wire-content` refusera de générer du contenu si les champs critiques sont vides.

### 5. Pousser le contenu de la Home

```
/wire-content Home
```

Flow guidé :

- Arbitre i18n vs Sanity vs siteConfig selon la taxonomie (inline-in-page
  pour contenu unique, menu dédié pour listes répétables, siteConfig pour
  partagé).
- Seed FR depuis `.claude/client.md §Charte`.
- Traduit DE/EN via LLM.
- Push Sanity.
- Valide : `pnpm validate:sanity-content:required` — zéro champ vide, aucun skip silencieux.

### 6. Validation complète

```bash
pnpm validate
```

Chaîne 11 étapes (lint + typecheck + studio:typecheck + 4 validators i18n/sanity

- docs:sync:check + memory:index:check + coverage + build). Zéro erreur
  tolérée.

---

## Checklist i18n + Sanity (à vérifier en sortie)

- [ ] `src/locales/fr.json` = source de vérité (remplie en premier)
- [ ] `src/locales/de.json` + `src/locales/en.json` = traduction complète, même shape
- [ ] Dataset Sanity : 0 champ `localeString/Text/RichText` laissé vide sur DE/EN
- [ ] `siteConfig` singleton poussé (contact, socials, banner)
- [ ] Aucun FR hardcodé en JSX (tout passe par `useTranslation()`)
- [ ] `pnpm validate` vert sur les 4 validators
- [ ] `pnpm validate:sanity-content:required` vert avant livraison client

Référence complète : `.claude/rules/i18n-sanity.md` (13 leçons always-loaded).

---

## Pour une session LLM externe

**ChatGPT / Cursor / Claude Desktop** : génère un master prompt autonome

```bash
pnpm context
```

Écrit `dist/CONTEXT-<client-slug>-<date>.md` (12-15 KB typiques) + print stdout.
Copie-colle ce bloc comme premier message. Il contient : identité, archi,
rules condensées, décisions actives, dernière session, cheatsheet commandes,
bootstrap.

---

## Erreurs fréquentes à éviter

| Symptôme                       | Cause                    | Fix                                         |
| ------------------------------ | ------------------------ | ------------------------------------------- |
| `validate:sanity-content` fail | Champ DE/EN vide en prod | `/translate` puis re-push                   |
| FR visible sur page DE/EN      | Hardcodé en JSX          | Remplacer par `t('key')`                    |
| `/wire-content` refuse         | `client.md` incomplet    | Remplir section Identité + Charte           |
| Husky bloque un commit         | Sur main sans merge      | `git checkout -b <type>/<scope>`            |
| `pnpm validate` lent           | Premier run              | Utiliser `pnpm validate:fast` en inner loop |

---

## Cross-refs

- Protocole i18n/Sanity : `.claude/rules/i18n-sanity.md`
- Client profile template : `.claude/client.md`
- Workflow général : `.claude/rules/workflow.md`
- Master prompt bible : `/context`
