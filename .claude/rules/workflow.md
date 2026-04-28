---
paths: ["src/**", "scripts/**", "docs/**", "*.md", "*.json", "*.ts", "*.js"]
---

# Workflow Rules

## Session start (first thing, every session)

Before any work, get oriented:
1. `git log --oneline -10` — what happened recently
2. `git status && git branch` — where are we now
3. Read CLAUDE.md — architecture, conventions, and if present: Design Direction + Composition Rules
4. Read `.claude/decisions.md` — active architectural decisions

This replaces re-explaining context. The code and git history are the source of truth.

## Non-negotiable (every task, every time)

1. **Branch from main**: `git checkout main && git pull && git checkout -b <type>/<scope>`
   Never commit to main. Never work on a leftover branch. Never skip this.
2. **Read before act**: Read CLAUDE.md + relevant .claude/rules/ before touching code
3. **Check state**: `git status && git branch` before starting
4. **Validate before commit** — pick the tier that matches the change (see below). The full pipeline still gates releases; don't skip it there.
5. **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
6. **Protected pages**: Never delete `/playground` or `/lab`. Verify after design token changes.
7. **Reuse Playground components**: Check workbench/ before creating new UI components.

## Validation tiers — pick the smallest that covers the change

Small fixes (copy tweak, README edit) shouldn't pay the ~70s full pipeline.
Matching tier to change type is a first-class Karpathy "surgical changes" call.

| Tier | Script | ~Time | Use for |
|---|---|---|---|
| **Fast** | `pnpm validate:fast` | ~5s | docs/README/comment-only edits, text-content tweaks, anything that doesn't touch runtime logic |
| **Gates** | `pnpm validate:gates` | ~20s | schema/content/memory drift suspicions, pre-commit sanity before a logic push |
| **Standard** | `pnpm validate` | ~70s | any code change that touches `.ts/.tsx/.css/.json` runtime files — **default for commits** |
| **Full** | `pnpm validate:full` | ~3–4min | pre-release, post-refactor of shared primitives, after upgrading deps — **mandatory before `pnpm release`** |

**Rules of thumb**:
- Only changed `*.md`, comments, or content strings in `data/pages.ts` etc.? → `validate:fast` is enough.
- Touched a component, hook, util, or config? → `validate` (the standard).
- Cutting a release, upgrading deps, or broad-surface refactor? → `validate:full`.
- When in doubt, climb one tier. Never climb down to bypass a failure — fix the failure.

## Task checklist — standard (default)

1. `git checkout main && git pull origin main`
2. `git checkout -b <type>/<short-name>`
3. Read relevant .claude/rules/ files
4. Code — explain important decisions
5. Validate at the matching tier (see table above) — zero errors
6. Commit (conventional, atomic)
7. Summarize: what changed, what to test

**Stop here.** Merge, push, and release only on explicit request.

## Merge & push (on request only)

When the user says "merge", "push", or delivery is clearly requested:
1. `git checkout main && git merge --no-ff <branch>`
2. `git push origin main`
3. `git branch -d <branch>`
4. Evaluate if release is warranted (see git.md)

"push" always means: merge to main + push to origin. Not a raw `git push` of a feature branch.

## User profile

The owner is a vibe coder: describes goals, AI executes with rigor.
- Prefers summaries over raw code
- High standards — if it's not clean, it doesn't ship
- AI handles git, terminal, config, commands
- Adapt: if they paste code, be technical. If they describe features, explain everything.

## Communication format

Major action:
```
ACTION: [what]  WHERE: [file(s)]  WHY: [1 sentence]  RISK: [none/low/medium]
```

Bug:
```
ERROR: [name]  CAUSE: [simple explanation]  FIX: [proposal]  WHERE: [file:line]
```

New package:
```
PACKAGE: [name] — [what it does]  STATS: [downloads, last updated]  WHY: [reason]
```

## When the owner says...

| They say | You do |
|---|---|
| "add/fix X" | Branch → code → validate → commit (stop). Merge/push only if asked. |
| "commit" | git add + conventional commit |
| "push" | Merge to main + git push origin main |
| "release" | Immediate release with correct type |
| "status?" | git status + log since last release + summary |

## Bug reports

Fix is NOT enough. Also:
1. Understand root cause
2. Add a rule to prevent recurrence
3. Document in commit message

## NEVER

- Act without explaining what and why
- Install a package without justification
- Use --force, --no-verify, or reset --hard without asking
- Leave dead code or unresolved TODOs
- Assert something is unused without verifying in code first
- Change project direction without owner approval

## ALWAYS

- Check git status and branch before coding
- `pnpm validate` before merge/push
- Separate commits by topic
- Add `// WHY: ...` comments on non-obvious decisions
- Update `docs/DEPENDENCIES.md` when adding/removing packages
- Follow `/new-page`, `/new-component`, `/new-hook`, `/new-feature` patterns automatically
- Check extension registry before recommending any library (`/discover`)
- Preserve `pnpm setup --update` workflow

## Proactive guidance

Never wait for the user to figure things out:
1. Check extension registry first — use `/install-extension` if a curated option exists
2. Recommend approach with reasoning: "For this, I suggest X because Y"
3. Split work: "I'll handle [technical]. You need to [human-only: accounts, API keys]"
4. Handle everything: install, configure, wire up, test, commit

The user should never research libraries, read docs for setup, or touch terminal/git/config.
They only: create accounts, copy API keys, approve payments.

## User mobilization (when help is needed) — "conducteur/navigateur"

**Par défaut** : Claude décide seul les choix techniques et explique
après. L'owner guide la vision, pas le volant. Ne **jamais** lui faire
arbitrer entre options techniques qu'il ne peut pas comparer par
lui-même — c'est risquer qu'il valide une mauvaise option sans s'en
rendre compte.

### Quand mobiliser (réservé)

- **Taste / brand / visuel** — choix de couleur, de tone of voice, de
  composition. Seul l'owner peut juger.
- **Access** — création de compte, API keys, mots de passe, paiements.
- **Business / client** — validation client, contexte externe non
  connu de Claude, deadlines métier.
- **Irréversible** — merge sur main, push, release, suppression de
  fichier non-récupérable.
- **Visuel cross-device** — screenshots, test mobile physique, check
  Safari iOS.
- **Validation tierce** — légal, client, design lead externe.

### Quand NE PAS mobiliser

- Choix techniques avec une réponse clairement meilleure (always-loaded
  vs path-trigger, quel hook utiliser, structure de commit)
- Entre deux options où ma recommandation est univoque — je décide.
- Demander à l'owner de chercher une librairie → check le registre
  d'extensions, propose avec raison.
- Recherche info que Claude peut faire (lecture fichiers, grep, web fetch).

### Format (simplifié, zéro jargon)

```
🧑 ACTION HUMAINE REQUISE
CE QUE JE VEUX FAIRE : [1 phrase simple, zéro jargon]
POURQUOI JE NE DÉCIDE PAS SEUL : [taste / access / irréversible / ...]
MA RECOMMANDATION : [ce que je te conseille de répondre]
SI TU DIS OUI : [conséquence concrète en mots simples]
SI TU DIS NON : [alternative concrète]
TU RÉPONDS : "ok" · "non" · "fais plutôt X"
DEADLINE : [optional — only if blocking]
```

Contraintes :
- Zéro nom de fichier ou commit hash sauf vraie nécessité
- Phrases courtes, langage non-technique
- **Toujours une recommandation claire** — jamais "à toi de choisir
  entre A et B" sans préférence
- Si je n'ai pas de recommandation claire, c'est que je n'ai pas assez
  réfléchi — je réfléchis mieux avant d'ouvrir le bloc.

## Delegation to a parallel Sonnet session

For heavy research, independent implementations, or work that would burn this
session's context, generate a self-contained handoff with `/delegate <task>`.
The owner pastes the output into a sibling session, runs it, then pastes the
result back here for `/integrate`.

## Execution modes

### Batch mode (default)

Execute plans without asking confirmation at each step.
- Follow ALL rules, conventions, quality standards
- `pnpm validate` after each commit — fix failures before continuing
- At the end, provide a single summary:
  ```
  DONE:
  1. [action] → [result]
  2. [action] → [result]
  All commits passed pnpm validate.
  ```

### STOP even in batch mode

- `pnpm validate` fails and fix isn't obvious
- Decision could break existing functionality
- Deleting files not in the plan
- Installing unplanned packages
- Anything irreversible not explicitly requested

### Checkpoint mode

When the user says "checkpoint", "stop and ask", "attends":
- Ask confirmation before each major action
- Use for sensitive or learning contexts

### Switching

- "batch" / "trust" / "go" / "fonce" / "fais tout" → batch mode
- "checkpoint" / "attends" / "stop and ask" → checkpoint mode
