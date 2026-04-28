## BEFORE YOU DO ANYTHING

Read this file and `.claude/rules/workflow.md` BEFORE writing any code.
You operate inside a structured system: rules (.claude/rules/), commands (.claude/commands/), agents (.claude/agents/).

### THE #1 RULE
**NEVER commit directly to main.** Not even "just a small fix."
Before ANY code change: `git checkout main && git pull && git checkout -b <type>/<scope>`
On main with uncommitted changes? Stash → branch → apply. Zero exceptions.

# Sawnext Studio

Conciergerie privée suisse pour clientèle HNW. Plateforme bilingue FR/EN
(default FR), hébergée UE. Stack : React 19 + TypeScript 5.9 + Vite 7 +
Tailwind CSS 4 + pnpm + Vitest + ESLint 9. Backend : Supabase (Frankfurt)
+ Resend pour les notifications email. Contenu éditorial : Sanity.

## Project Context

This project is a Swiss private concierge platform — curated access to
exclusive goods, experiences and opportunities for HNW clientele. The
aesthetic is strictly **monochrome** (no chromatic accent), the brand voice
is **retenue, factuelle, suisse-bancaire** (no poetry, no emoji, no
exclamation marks). Built for vetted clients onboarded via single-use
invitation codes; each interest expressed by a client triggers an email
notification to the operator (Salva).

**Active modules** (skeleton phase, MVP target end of June 2026) :
Events, Properties, Timepieces, Artworks, Journeys, Concierge (public)
+ Admin (invitations, inquiries, users).

**Composition Rules — project-specific overrides**

- The template's `styling.md` rule "accent identical in dark and light mode"
  applies to the steaksoap brand. **Sawnext overrides** : `--color-accent`
  is monochrome and equals the high-emphasis fg tone in each mode (`#f0f0f0`
  in dark, `#1a1a1a` in light). The brand identity IS the absence of color
  — that consistency is preserved across modes by tying accent to fg.
- Languages : FR + EN only. DE is dropped from i18n config (template ships
  with FR/DE/EN — DE will be removed in a separate pass).
- Status colors (success/warning/danger/info) are kept functional template
  values for now; client may opt for monochrome state colors in phase 2.

## Commands
pnpm dev              — dev server (port 5173)
pnpm build            — production build
pnpm preview          — preview production build
pnpm validate:fast    — lint + typecheck + studio:typecheck in parallel (~5s) — inner loop
pnpm validate:gates   — all 9 read-only validators in parallel (~20s) — pre-logic-push
pnpm validate         — gates + coverage + build (~70s) — standard commit gate
pnpm validate:full    — validate + e2e (~3–4min) — pre-release
pnpm setup            — interactive project setup wizard
pnpm base:update      — pull latest improvements from upstream base
pnpm release          — create versioned release with changelog

## Validation tiers (pick the smallest that covers the change)

| Tier | Script | Time | Use for |
|---|---|---|---|
| Fast | `validate:fast` | ~5s | docs, comments, text content — no runtime logic |
| Gates | `validate:gates` | ~20s | drift suspicion, sanity before a push |
| Standard | `validate` | ~70s | any `.ts/.tsx/.css/.json` runtime change — **commit default** |
| Full | `validate:full` | ~3–4min | releases, broad refactors, dep upgrades — **release mandatory** |

Full rule + decision matrix: `.claude/rules/workflow.md` §Validation tiers.

Pre-commit hook runs `lint-staged` only — commits stay snappy. Tier
selection is Claude's / owner's judgment per change scope.

## Architecture
src/
├── app/            — routes, providers, app layout
├── components/ui/  — reusable atoms (Button, Input, Card, Modal…)
├── components/layout/ — Header, Container
├── config/         — env.ts (with fallbacks), site.ts, cloudinary.ts
├── features/       — feature modules (component + hook + types per feature)
├── components/features/ — app-wide React patterns (ErrorBoundary, SeoHead) — NOT the same as src/features/
├── hooks/          — custom React hooks
├── pages/          — page components (one per route)
├── utils/          — cn() and helpers
├── workbench/      — playground sections, shared components, data

## Source of truth (in case of conflict)
1. The actual code (always wins)
2. `.claude/memory/` (tagged decisions, patterns, feedback, frictions)
3. `.claude/decisions.md` (pointer to memory index — legacy)
4. This file (CLAUDE.md)
5. `.claude/rules/*.md`
6. `docs/*.md` and other markdown

If docs contradict code, the docs are wrong.

## Memory

Project-scoped persistent memory lives in `.claude/memory/`, tracked in Git.
- `.claude/memory/INDEX.md` — auto-generated sommaire (run `pnpm memory:index`)
- `.claude/memory/TAGS.md` — canonical tag vocabulary (closed set)
- `.claude/memory/{decisions,feedback,patterns,frictions,sessions}/` — entries

**Before any non-trivial task**: `grep -rl "#<domain>" .claude/memory/` to surface prior context.
**At end of every session**: write journal entry in `sessions/YYYY-MM-DD-HHMM.md`, run `pnpm memory:index`.
Full protocol: `.claude/rules/memory-protocol.md`.

## Session protocol

**Start of every session** (before any code):
1. `git log --oneline -10` + `git status && git branch`
2. Read `CLAUDE.md` + `.claude/memory/INDEX.md` + most recent `sessions/` entry
3. Grep memory for any tags relevant to the incoming task

**End of every session** (mandatory):
1. Output RELEASE CHECK block (see `.claude/rules/releases.md`)
2. Write `sessions/YYYY-MM-DD-HHMM.md` journal entry
3. Run `pnpm memory:index`
4. Summarize: what changed, what to test

## Release proactivity

At session end, always output:
```
RELEASE CHECK:
- Commits depuis dernière release : X (types)
- Recommandation : [release vX.Y.Z | wait]
- Raison : [explicit]
```
Full rule: `.claude/rules/releases.md`.

## User mobilization — "conducteur/navigateur"

**Par défaut : Claude décide seul les choix techniques et explique
après.** L'owner guide la vision, pas le volant. Ne jamais lui faire
arbitrer entre options techniques qu'il ne peut pas comparer par
lui-même.

Ouvrir le bloc ci-dessous **uniquement** pour : taste/brand/visuel,
access (API keys, comptes), business/client, irréversible (merge/push/
release/delete), ou info externe à l'owner (screenshots).

```
🧑 ACTION HUMAINE REQUISE
CE QUE JE VEUX FAIRE : [1 phrase simple, zéro jargon]
POURQUOI JE NE DÉCIDE PAS SEUL : [taste / access / irréversible / ...]
MA RECOMMANDATION : [ce que je te conseille de répondre]
SI TU DIS OUI : [conséquence concrète]
SI TU DIS NON : [alternative concrète]
TU RÉPONDS : "ok" · "non" · "fais plutôt X"
```
Full rule : `.claude/rules/workflow.md` §User mobilization + `.claude/rules/anti-complaisance.md`.

## Autonomy
Can do without asking: branch, code in scope, local refactor, sync docs, add/fix tests, run validate, update related MD.
Must ask: delete a feature, add a dependency, change deploy config, force push, act outside scope.

## Reuse-first (mandatory)
Before creating ANY component, check existing ones in this order:
1. `src/components/ui/` — 24 atoms (Button, Card, Modal, Select, Tabs…)
2. `src/components/layout/` — Header, Container
3. `src/workbench/playground/shared/` — Copyable, Swatch, Section…
If something exists: use it or extend it. Never recreate.

## Code Rules
Loaded from `.claude/rules/` — summary:
- TypeScript strict — no `any`, no `as`, no `!`
- Named exports, PascalCase files, mobile-first responsive
- `cn()` for className, design tokens only, tests beside source
- Path aliases: @components, @hooks, @pages, @utils, @config, @features, @constants, @context, @workbench, @lib

## Workflow
See `.claude/rules/workflow.md`. Batch mode is default — execute without asking at each step.
**NEVER commit to main. ALWAYS branch first.**

## Communication
- ACTION → WHERE → WHY
- After work: summary + files modified + what to test
- Unsure? One focused question, don't guess

## Protected Pages
`/playground` and `/lab` — NEVER delete, NEVER remove from nav.
Verify after design token changes.

- `/playground` = structured design system showcase (all tokens, all components)
- `/lab` = free-form experimentation sandbox (prototypes, ideas, tests)

## Content architecture (i18n + Sanity)

The starter ships with a baked-in content stack: i18next for static UI strings
and Sanity CMS for editorial content. Taxonomy is strict:

- **Inline in `page`** — unique content per page (hero, intro, CTA contextuel)
- **Dedicated menu with picto** — repeatable entities (team, testimonials, products)
- **`siteConfig` singleton** — shared across pages (banner, contact, socials)

Full protocol: `.claude/rules/i18n-sanity.md` (13 lessons, always-loaded).
Per-project brand voice lives in `.claude/client.md` (client-owned, protected
from `base:update`). Consumed by `/wire-content`, `/translate`, `/sync-content`.

Never hardcode FR in JSX. Never leave a Sanity field with missing DE/EN in
production — `pnpm validate` enforces both.

## Detailed Rules
See `.claude/rules/` — most loaded automatically based on task type.
**Always-loaded** (every task, every file): `anti-complaisance.md`, `creative-ambition.md`, `critical.md`, `intent-routing.md`, `memory-protocol.md`, `principles.md`, `releases.md`, `time-awareness.md`, `vision-first.md`, `workflow.md`.
**Path-triggered** (examples): `i18n-sanity.md` (src/**/*.tsx · src/locales/** · studio/**), `dispatch.md` (.claude/agents/** + dispatch meta-files), `components.md`, `testing.md`, `styling.md`, `responsive.md`, `sizing.md`, `api.md`, `routing.md`, `performance.md`, `security.md`, `git.md`, `extensions.md`, `mcp-awareness.md`.
