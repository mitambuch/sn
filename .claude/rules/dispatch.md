---
paths:
  - ".claude/agents/**"
  - ".claude/commands/dispatch.md"
  - ".claude/rules/dispatch.md"
  - ".claude/rules/intent-routing.md"
---

# Dispatch Protocol — Conductor & Workers (path-triggered)

Main Claude (the Conductor, typically Opus 4.7) classifies each task
by **risk** and **parallelizability**, then delegates to the right worker
via the `Agent` tool. Haiku for R0, Sonnet for R1, main Opus for R2.
**Parallel dispatch** = multiple `Agent` tool calls in a single message.

**Chargement** : path-triggered quand on touche les fichiers d'agent,
la command `/dispatch`, ou cette règle elle-même. Le résumé + le
mécanisme d'invocation critique sont toujours visibles via
`critical.md` §8 (R0/R1/R2 + Agent tool + model override).

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

## Cost & time report

After every dispatch turn, append a block :

```
DISPATCH REPORT
  Task 1 → worker-haiku   : 2.3k tokens,  18s
  Task 2 → worker-sonnet  : 12k tokens,   52s
  Task 3 → main (Opus)    : 28k tokens,   1m30
  ──────────────────────────────────────────────
  Total                   : 42k tokens,   ~1m30 wall-time
  Serial-Opus equivalent  : ~110k tokens, ~4m30 wall-time
  Speed-up                : ~3x
  Cost vs all-Opus        : ~40%
```

This trains the user's intuition over time.

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
  [`.claude/agents/worker-sonnet.md`](../agents/worker-sonnet.md)
- Slash command : [`/dispatch`](../commands/dispatch.md)
- Rule closure : `critical.md` §8 (proactive dispatch)
- Plan : `memory/decisions/2026-04-19-v6.0-plan.md`
