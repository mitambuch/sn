---
paths: ["**"]
---

# Intent Routing — natural-language → skill invocation (always-loaded)

L'owner parle en langage naturel, jamais en `/xxx`. Sans cette règle, les
39 commandes + 6 agents du repo sont dormants : ils contiennent des
recettes éprouvées que personne ne déclenche. **Cette règle est le
routeur** — je détecte l'intention et j'invoque le Skill moi-même.

## Contrat

Pour **chaque** tour utilisateur :

1. Je lis l'intention réelle (pas les mots exacts).
2. Si l'intention match une entrée du tableau ci-dessous, je l'annonce en
   **une ligne** : *"J'enchaîne via `/xxx`"* ou *"J'invoque l'agent
   `yyy`"*.
3. J'invoque le Skill (pour les commands) ou j'utilise l'Agent tool
   (pour les agents) dans le même tour.
4. Si ambigu entre 2 entrées, je demande **avant** d'exécuter (1 question
   précise, pas une reformulation complète).

L'owner garde le droit de taper `/xxx` explicitement — ça court-circuite
la détection. L'owner garde le droit de dire *"non, fais-le à la main"*
— j'obtempère sans argumenter.

## Mapping intention → skill

### Création de code (features, pages, composants)

| Tu dis (approx.) | Skill invoqué |
|---|---|
| "ajouter/créer une page", "nouvelle page", "on fait la page X" | `/new-page` |
| "nouveau composant", "créer un atom", "composant UI X" | `/new-component` |
| "nouveau hook", "créer un hook useX" | `/new-hook` |
| "nouvelle feature", "feature X" | `/new-feature` |
| "ajouter un endpoint", "nouvelle API", "route /api/X" | `/add-api` |

### Design & UI

| Tu dis | Skill |
|---|---|
| "travailler sur le design", "direction design", "refonte visuelle" | `/design` |
| "explore une piste design", "teste un style", "et si on essayait" | `/design-explore` |
| "convertir cette maquette", "depuis Figma/image/screenshot" | `/design-convert` |
| "thème", "palette de couleurs", "tokens visuels" | `/theme` |
| "brief design", "direction de projet" | `/brief` |
| "check responsive", "teste mobile/tablette" | `/responsive-check` |
| "lighthouse", "perfs page", "score perfs" | `/lighthouse` |

### Content (i18n + Sanity)

| Tu dis | Skill |
|---|---|
| "traduit ça", "ajoute DE/EN", "traductions manquantes" | `/translate` |
| "remplir le contenu de la page X", "wire content", "pousser contenu Sanity" | `/wire-content` |
| "audit contenu", "synchroniser Sanity", "trous dans le CMS" | `/sync-content` |

### Quality & pre-delivery

| Tu dis | Skill / Agent |
|---|---|
| "il y a un bug", "ça plante", "fix X", "pourquoi Y ne marche pas" | `/fix` (invoque agent `debugger`) |
| "review ça", "revois ce qu'on a fait", "audit du code" | `/review` (ou agent `reviewer`) |
| "écris des tests", "couverture manquante", "test X" | `/test` (invoque agent `tester`) |
| "où on en est", "status", "état du repo" | `/status` |
| "health check", "check général" | `/health-check` |
| "on prépare la livraison", "pre-delivery", "livrable prêt ?" | `/pre-delivery` |
| "refactor X", "nettoie ce fichier" | `/refactor` |
| "revue sécu", "audit sécurité" | agent `reviewer` + focus security |

### Workflow & méta-stack

| Tu dis | Skill |
|---|---|
| "release", "on ship", "cut v.X.Y.Z" | `/release` |
| "initialiser un projet", "init client" | `/init` |
| "donne-moi le contexte complet", "master prompt", "bible du projet", "brief pour ChatGPT" | `/context` |
| "comment je démarre un client", "bootstrap client", "par où je commence" | read `.claude/BOOTSTRAP-CLIENT.md` |
| "morning brief", "dashboard du matin", "mes clients" | `/morning-brief` |
| "handoff", "passer la main à une session parallèle" | `/handoff` |
| "delegate à Sonnet", "sous-session" | `/delegate` |
| "intègre l'output handoff/delegate" | `/integrate` |
| "setup extension", "ajouter intégration" | `/install-extension` |
| "connecter à X externe", "setup API Y" | `/connect` |
| "discover librairie", "trouver un package" | `/discover` |
| "spec cette feature", "écrire une spec" | `/spec` |
| "update deps", "màj packages" | `/update-deps` |
| "changelog client", "rapport client" | `/changelog-client` |
| "migrer de X vers Y" | `/migrate` |
| "déployer", "push prod" | `/deploy` |
| "mentions légales", "CGU", "politique de confidentialité" | `/legal` |
| "dispatch à sonnet/haiku", "parallélise ces tâches", "envoie ça à un worker", "sous-traite X" | `/dispatch` |
| "micro-feature signature", "killer feature", "bouton qui change tout", "rendre viral", "quoi manque pour que ce soit fou" | consult `rules/ux-first.md` + `creative-library/interactions/` |

### Dispatch (Conductor & Workers)

Voir `dispatch.md` pour la taxonomie R0/R1/R2 complète. Résumé routing :

| Tu dis / je détecte | Worker |
|---|---|
| Rename, bump, regen, memory op, move file, update doc link | `worker-haiku` via Agent (R0) |
| Nouveau composant/page/hook avec pattern existant, bug fixable | `worker-sonnet` via Agent (R1) |
| Architecture, design direction, refactor cross-cutting | main Opus (R2) — pas de dispatch |

## Règles de résolution d'ambiguïté

**Si 2 skills matchent** :
- `/design` vs `/design-explore` : direction globale → `/design`, piste
  ciblée → `/design-explore`. Demander en cas de doute.
- `/fix` vs agent `debugger` direct : toujours passer par `/fix` (qui
  wrappe l'agent — évite de court-circuiter le workflow commit).
- `/new-component` vs `/new-page` : le scope de l'ask tranche.
- `/translate` vs `/wire-content` : seulement ajouter DE/EN à un doc
  existant → `/translate`. Créer contenu from scratch pour une page →
  `/wire-content`.

**Si la phrase est vague** ("on bosse un peu sur le site") : NE PAS
router. Poser une question claire sur le scope.

## Ce que cette règle NE fait PAS

- Elle ne crée PAS de nouvelle command. Si une intention n'a pas de
  command, je l'exécute à la main (comme avant).
- Elle ne m'autorise PAS à modifier les commands ou agents. Leur contenu
  reste source de vérité.
- Elle ne neutralise PAS la règle anti-complaisance : si l'intention
  détectée est bancale (ex : *"réécris tout le repo en Vue"*), je
  CHALLENGE avant d'invoquer quoi que ce soit.

## Maintenance

Quand une nouvelle command est ajoutée (`/new-xxx`), **une entrée
correspondante doit être ajoutée à ce tableau**. La règle est
auto-cohérente uniquement si le mapping reste synchro. À vérifier lors
de chaque pass `pnpm validate` (futur : script
`validate-intent-routing.js` qui compare le tableau aux fichiers
`commands/*.md`).

## Cross-refs

- Toutes les commands : `.claude/commands/*.md`
- Tous les agents : `.claude/agents/*.md`
- Taxonomie de dispatch : `.claude/rules/dispatch.md`
- Règle anti-complaisance (protection contre auto-routing toxique) :
  `.claude/rules/anti-complaisance.md`

## Pourquoi cette règle existe

Audit Phase B (2026-04-19) : 19/38 commands jamais invoquées (à l'époque, 38
avant /context), 2/6 agents
0-refs. Après lecture du contenu, **aucune** n'était vraiment dead —
elles manquaient juste de trigger. Intent routing = le fix. Zéro
suppression, 100 % de valeur réactivée.
