# PATCH — Token economy (cheap routing + terse output)

**Portable, drop-in, model-agnostic.** Copy this into any repo to cut Claude token
burn without losing quality. No hook machinery required — the rules below work as
pure prose. Born in `steaksoap` (where it's wired natively into the hooks); this is
the light version for other repos.

> **Why:** an owner on the Max plan nearly hit the weekly cap doing cheap,
> mechanical work on the expensive main model at high effort, with verbose output
> every turn. Two levers fix ~all of it: route cheap work to cheap models, and stop
> being verbose.

---

## The two rules (paste these into the repo's always-loaded rules or CLAUDE.md)

### 1. Cheap routing by default

Classify each task by risk, then route to the cheapest capable model — **don't do
it yourself on the expensive main loop just because you can**.

- **R0 — mechanical / deterministic** (rename, version bump, locale key, file move,
  lint autofix, regen an index, doc/memory op): → delegate to a **Haiku** worker.
- **R1 — new code following an existing pattern** with real volume (a component with
  its test, a new route, a new schema field, a bug fix with a clear repro): →
  delegate to a **Sonnet** worker.
- **R2 — architecture / design direction / cross-cutting refactor / debug without a
  repro / security review**: → stays on the **main (top) model**. Never delegate R2.

Delegation mechanic (Claude Code / Agent SDK): spawn a subagent with the `model`
override —
`Agent({ subagent_type: "general-purpose", model: "haiku" | "sonnet", description, prompt })`.
The `model` param overrides the parent model for that one call. Run independent
tasks in parallel by emitting multiple Agent calls in one message.

**Escape hatches (stay main-thread, state the reason in ≤1 line):**
- A **micro-edit** (≈1 line) — the delegation round-trip costs more than the edit.
- A **high-blast / correctness-sensitive** task — a commit/pre-commit hook, a
  permission rule, anything whose exact syntax gates everything else.

**Hard guard-rails that never bend:** never delegate R2; never run two tasks that
touch the **same file** in parallel (working-tree merge hell).

### 2. Terse output by default

- **Result first.** No preamble ("Sure, I'd be happy to…", "Let me analyze…"), no
  postamble ("Let me know if…").
- **No narration** of what you're about to do — just do it and report.
- Refs as `file:line`. Let code and diffs speak; don't re-explain each line.
- **Reasoning proportional to risk** — don't burn deep thinking on trivial/
  mechanical tasks.
- **EXCEPTION — never skip:** give full detail whenever the work touches
  **architecture**, is **irreversible**, or needs the **owner's decision**. Saving
  tokens must never cost the owner an important piece of information.

---

## How to apply (pick the depth that fits the repo)

**Minimal (any repo, 1 min):** paste the two rules above into the repo's `CLAUDE.md`
under a `## Token economy` heading. Done — they're in context every session.

**Better (repo with a `.claude/rules/` system):** save this as
`.claude/rules/token-economy.md` and add it to the repo's always-loaded set (wherever
that list lives — often `CLAUDE.md`). Keep it terse: every always-loaded line costs
input tokens each turn, and that's the opposite of the goal.

**Best (repo with a `UserPromptSubmit` hook):** also inject the cheap-routing nudge
per-turn so it has recency salience. Mirror `steaksoap`'s
`scripts/hooks/prompt-submit.js` + `scripts/classify-task.js` (a regex classifier →
a `[dispatch hint]` line). This is the native wiring; not required for the rules to
work.

---

## What this is NOT

- **Not a Stop-hook police.** Don't add a hook that accuses you of "not dispatching"
  — a hook can't tell whether a delegation actually happened, so it false-positives
  on every legit main-thread turn. The lever is the per-turn nudge + the rule, not an
  after-the-fact accusation.
- **Not "always delegate".** Micro-edits and high-blast tasks belong on the main
  thread. Over-delegating a one-liner costs more than it saves.
- **Not "be cryptic".** Terse ≠ withholding. The architecture/irreversible/decision
  carve-out is the whole point.

## Reversibility

Pure prose + an optional hint string. Revert by deleting the rule / reverting the
hook edit. No schema, no migration, no lock-in.
