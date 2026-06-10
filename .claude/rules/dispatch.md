---
paths:
  - ".claude/agents/**"
  - ".claude/commands/dispatch.md"
  - ".claude/rules/dispatch.md"
  - ".claude/rules/intent-routing.md"
---

# Dispatch Protocol — Conductor & Workers (path-triggered)

Main Claude (the Conductor, typically Opus 4.8) classifies each task
by **risk** and **parallelizability**, then delegates to the right worker
via the `Agent` tool. Haiku for R0, Sonnet for R1, main Opus for R2.
**Parallel dispatch** = multiple `Agent` tool calls in a single message.

**Chargement** : path-triggered quand on touche les fichiers d'agent,
la command `/dispatch`, ou cette règle elle-même. Politique (depuis
2026-06-09, `critical.md` §9 Token economy) : **cheap par défaut** — le
mécanique confiant (R0→haiku, R1→sonnet) part vers un worker, pas vers la
boucle Opus. Main-thread = micro-edit (≈1 ligne) ou high-blast, raison en
≤1 ligne. Ça remplace l'ancien cadrage « optionnel, jamais une violation »
(2026-05-16), qui faisait que la boucle Opus encaissait tout le R0/R1.

## The intelligence ladder — orchestrate at the top, delegate down (P15)

Doctrine (owner, 2026-06-10): the **best model (Opus 4.8) is the permanent
orchestrator + controller — never delegated away.** It routes work DOWN a
cost-ordered ladder to the cheapest rung that holds the task:

| Rung | Model | Invocation | For |
|---|---|---|---|
| orchestrate | **Opus 4.8** | the main loop | classify · frame · control · R2 |
| framed-complex | **GPT-5.x (Codex)** | `pnpm dispatch:codex --spec <id>` → `dispatch-verify` (worker-codex.md) | bounded-but-hard, *toujours cadré* |
| pattern@volume | **Sonnet** | `Agent({model:'sonnet'})` | R1 |
| mechanical | **Haiku** | `Agent({model:'haiku'})` | R0 |
| local/offline | **steakcode** (Qwen 14B) | MCP tools | bounded R0, free/offline |

Codex (GPT-5.x) is "**puissant SI il est contrôlé**" — a strong ally for the
complex-but-bounded, **never a replacement for the orchestrator**. The
precondition that makes delegating to ANY rung safe is mechanical control:
**every delegation is verified (`dispatch-verify`, P11), attributed (`Model:`
trailer, P12) and logged (ledger, P13)** — the proof is the script's output,
not the worker's word. The worker runs on a thin context (P14), not the bible.
Decision: `memory/decisions/2026-06-10-intelligence-ladder-doctrine.md`.

## The three risk levels

### R0 — zero risk → dispatch to `worker-haiku`

Characteristics :
- **Signature unchanged** (variable rename, file move, version bump)
- **Shape already known** (add a JSON locale key, add a list entry)
- **Deterministic transformation** (lint autofix, import sort)
- **Pure memory/doc operation** (regen INDEX, session wrap, CHANGELOG entry)

Examples in steaksoap context :
- `pnpm memory:index` + wrap session journal
- Bump a version string in `src/data/pages.ts`
- Add `common.someKey` to `src/locales/{fr,de,en}.json`
- Rename a component file (import path update is mechanical)
- Delete a confirmed-dead import
- Update the README badge or rules-count reference
- Move an entry from active to archive in memory

### R1 — medium risk → dispatch to `worker-sonnet`

Characteristics :
- **New code following an existing pattern**
- **Tests required** alongside the new code
- **Judgment calls local to the file** (naming, composition)
- **Bug fix with clear repro** (steps documented)

Examples in steaksoap context :
- New UI atom in `src/components/ui/` with its test
- New page with route + SeoHead + test
- New schema field on `siteConfig` or `page`
- New validator script following `scripts/validate-*.js` pattern
- New slash command in `.claude/commands/`
- New hook following `src/hooks/useX.ts` shape
- Fix a bug with a reproducible failing test

### R2 — high risk → stay in main Opus

Characteristics :
- **Architectural decision** (new layer, new integration surface)
- **Cross-cutting refactor** (changes 3+ layers)
- **Design / UX direction** (tone, palette, interaction philosophy)
- **Bug without repro** — needs exploration to find the trigger
- **Security review** or audit
- **Plan / strategy** (v6.0 itself was R2)

Examples :
- The content stack 5-phase plan
- The dispatcher pattern (this rule file)
- Migrating a URL routing strategy
- Designing a new Studio schema type with relationships
- Root-cause analysis on a heisenbug

**The Conductor does not dispatch R2 to Sonnet** — the extra 15% of
Opus intelligence matters for architecture. Sonnet is for execution
of a plan Opus produced.

## Tier local optionnel — `steakcode` (offline, gratuit)

Un **4e tier facultatif** existe : `steakcode`, le modèle de code LOCAL de
Mirco (Qwen2.5-Coder 14B via Ollama), atteint par **3 outils MCP** déjà
enregistrés au scope user — `steakcode_rag_search`, `steakcode_delegate`,
`steakcode_delegate_fix`. But : offloader du R0/R1-mécanique pour **économiser
le quota Claude** et rester offline. Persona/contrat complet :
[`.claude/agents/worker-steakcode.md`](../agents/worker-steakcode.md).

**Mécanisme** : ce tier ne s'invoque PAS par `Agent({model})` (qui n'accepte
que haiku/sonnet/opus) — on **appelle les outils MCP directement**.

**Quand le router (frontière mesurée, pas optimiste)** :

- `steakcode_rag_search` → **proactivement**, avant de créer un composant/hook
  (reuse-first). Instantané et fiable — c'est le gain net du jour. Aucun risque.
- `steakcode_delegate` → seulement un **sous-ensemble de R0** **borné ∧
  vérifiable ∧ NON-URGENT** : messages de commit, conversions de format, mock
  data, types/JSON simples, stubs présentationnels. Le 14B mesure ~3/10 au
  testgen et ~38-104 s/fichier → au-delà du très-borné, le ROI s'inverse
  (relecture d'une sortie 3/10 > tokens économisés).
- `steakcode_delegate_fix` → avec parcimonie (bloque le serveur 1-3 min/appel).

**Garde-fous** : jamais d'urgence (latence) ; jamais d'archi/design/schéma
(escalade Conductor) ; le Conductor **relit + `pnpm validate`** toute sortie
locale avant « c'est fait » (`critical.md` §4). En cas de doute entre Haiku et
steakcode-local : **Haiku** (rapide, fiable) — steakcode-local se justifie quand
on veut explicitement l'offload gratuit/offline sur du borné non-pressé.

## Parallelization rules

Multiple tasks in one user turn → classify first, then :

| Overlap type | Pattern | Strategy |
|---|---|---|
| **Same file touched** | Task A edits `Home.tsx`, Task B edits `Home.tsx` | Sequential dispatch |
| **Disjoint files** | Task A in `Home.tsx`, Task B in `About.tsx` | Parallel dispatch |
| **Same folder, different files** | Task A = new component, Task B = new hook | Parallel |
| **Memory + code** | Task A = regen INDEX, Task B = new component | Parallel |
| **Depends on output** | Task B uses something Task A produces | Sequential |

**Parallel dispatch mechanic** : emit 2+ `Agent` tool calls in **one
assistant message**. The harness runs them concurrently. Wall-time
becomes `max(Ta, Tb, Tc)` instead of `Ta + Tb + Tc`.

### Worker invocation (the mechanic that works today)

Custom subagents in `.claude/agents/` (worker-haiku, worker-sonnet)
declare the **persona** but are not yet auto-registered as
`subagent_type` values in the Agent tool at runtime (may require
Claude Code restart, or simply aren't wired that way today). The
reliable invocation that works every time :

```
Agent({
  subagent_type: "general-purpose",
  model: "haiku",                         // or "sonnet" or "opus"
  description: "<5-word summary>",
  prompt: "You are acting as worker-haiku (persona defined in
           .claude/agents/worker-haiku.md). <task details...>"
})
```

The `model` param **overrides the parent model** for that one
invocation — this is the actual lever for Haiku/Sonnet delegation.
The persona file content is referenced in the prompt so the worker
behaves according to the contract. When Claude Code starts registering
custom agents as first-class `subagent_type` values, `subagent_type:
"worker-haiku"` will work too — both paths coexist.

## Conductor mindset — announce before dispatching

Before any dispatch, state the plan in one message :

```
Received 3 tasks. Classification :
  1. Rename useToast → useNotification (R0, no signature break) → worker-haiku
  2. Add /dispatch-help command              (R1, follows commands pattern) → worker-sonnet
  3. Redesign locale routing strategy        (R2, architecture) → main thread

Dispatching 1 + 2 in parallel, doing 3 myself after.
```

Never dispatch silently. The user learns the taxonomy by reading your
rationale over a few sessions — that's how they gain confidence to
defer more R0/R1 to workers.

## Proactive parallel dispatch — propose it, don't just permit it

Dispatch stays *optional* on a single task or micro-edit (the overhead
isn't worth it). But the owner wants real parallelism, and "optional"
made the Conductor default to never dispatching. So on the obvious case
it becomes **proactive**:

> When a turn's plan contains **2+ independent R0/R1 tasks that do NOT
> touch the same files**, the Conductor **proposes** the parallel
> dispatch plan before executing — it doesn't silently do it all
> main-thread. Announce the routing ("Task 1 → worker-haiku, Task 2 →
> worker-sonnet in parallel; Task 3 → main thread, it's R2"), then act.

Stay main-thread only when: a single task is in play, the tasks share
files (working-tree merge hell), or a task is **high-blast** even though
it's R0/R1 — e.g. a commit-msg/pre-commit hook that gates *every*
commit, or a permission-rule edit whose syntax must be exact. Pulling a
correctness-sensitive task back to main-thread is good judgment, not a
failure to dispatch. The two hard guard-rails never bend: **never
dispatch R2** (architecture/design — Opus judgment matters) and **never
run two same-file tasks in parallel**.

## Cost report — one line, not a table

The owner doesn't read token tables (they cost tokens too). After a *multi-task*
dispatch turn, at most ONE line: `dispatched: 2×haiku + 1×sonnet · ~3× cheaper than
all-Opus`. Skip it entirely on a single-task turn — no ceremony.

## Mechanical acceptance — `dispatch-verify` (the §4 lever)

No dispatched work is accepted on trust. The proof is the output of
`node scripts/dispatch-verify.js <id>`, not the worker's word nor the
orchestrator's. This is the precondition that makes delegating to a
powerful external model (Codex) safe — "puissant **si il est contrôlé**".
Doctrine: `memory/decisions/2026-06-10-intelligence-ladder-doctrine.md`.

**The spec = the contract.** Before dispatching, the Conductor writes
`.claude/dispatch/specs/<id>.json` (gitignored — ephemeral session state):

```json
{ "id": "20260610-1432-r0-button-focus", "class": "R0", "model": "haiku",
  "attempt": 1, "branch": "fix/button-focus", "base": "main", "goal": "…",
  "allowed_paths": ["src/components/ui/Button.tsx", "…/__tests__/Button.test.tsx"],
  "acceptance": ["pnpm vitest run …/Button.test.tsx", "pnpm validate:fast"],
  "forbidden": ["package.json", ".claude/**", "docs/**"] }
```

`allowed_paths` is exhaustive + closed; `acceptance` carries ≥1 task-specific
command (not just `validate:fast`, or an empty task passes green); `forbidden`
is a belt beyond `allowed_paths`. Optional `rules: [...]` names exactly the
rule files the worker needs (precision override; see worker context below).

**Thin worker context (P14, the cost lever).**
`node scripts/build-worker-context.js --spec <id>` (`pnpm dispatch:context`)
assembles what a worker actually needs — a conventions digest + the
path-triggered rules touching its `allowed_paths` + the contract (last) — and
nothing else (no NORTH-STAR/OWNER/memory: the doctrine lives with the
orchestrator that controls). ~13k vs the orchestrator's ~50k. Auto-match by
`allowed_paths` is the default; when it over-pulls (several rules over-claim
`src/**/*.tsx`), the spec's `rules: [...]` pins the exact set. Hard ceiling
14k — over it, the task is probably too broad for R0/R1 (raise the class).

**Four checks** (cheapest first): ① diff confinement (every changed file ∈
allowed_paths ∧ ∉ forbidden) ② protected paths intact ③ acceptance commands
all exit 0 ④ cheat markers (added `.only`/`.skip`/`eslint-disable`/threshold
drops → WARN, the orchestrator eyeballs). On PASS it writes
`.claude/dispatch/.verified-<id>` (consumed by the P12 commit trailer) + a
ledger line (P13).

**Three hard rules:**
1. No dispatch without a written spec first.
2. No acceptance of dispatched work without a `dispatch-verify` PASS pasted.
3. A worker that hits the edge of `allowed_paths` **returns control with the
   reason — it never widens its own spec.** The orchestrator widens it.

## Failure handling

If a worker returns `Verified : FAIL` :

1. Read the error. If it's trivial (missing import, typo), fix in main
   thread yourself.
2. If non-trivial, re-dispatch to `worker-sonnet` with extra context
   (the original task + the error + what was tried).
3. If still failing, escalate : take over in main thread as R2.

## Anti-patterns (don't do these)

- Dispatching R2 to Sonnet because "it might be faster" → losses on
  quality, Opus reasoning actually matters at the architecture layer.
- Dispatching R0 without a worker when you could delegate to Haiku →
  burns Opus tokens on a rename.
- Silent dispatch → the user can't learn the system.
- Skipping the cost report → no feedback loop, no trust-building.
- Dispatching tasks that touch the same file in parallel → merge
  conflicts in the working tree.

## Cross-refs

- Worker agents : [`.claude/agents/worker-haiku.md`](../agents/worker-haiku.md),
  [`.claude/agents/worker-sonnet.md`](../agents/worker-sonnet.md),
  [`.claude/agents/worker-steakcode.md`](../agents/worker-steakcode.md) (tier local optionnel)
- Slash command : [`/dispatch`](../commands/dispatch.md)
- Rule closure : `critical.md` §9 Token economy (cheap routing + terse output)
- Plan : `memory/decisions/2026-04-19-v6.0-plan.md`
