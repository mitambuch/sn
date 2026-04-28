# /dispatch

Dispatch one or more tasks to the right worker (Haiku / Sonnet / main
Opus) with parallel execution when possible. This is the user-invoked
form of the proactive dispatch pattern described in
`.claude/rules/dispatch.md` (the Conductor auto-dispatches for simple
cases without needing this command).

## Arguments

`$ARGUMENTS` — the task list. Free-form natural language is OK. The
Conductor parses and classifies. If a single task : it gets the
regular flow. If multiple : they are grouped by parallelizability.

Examples :

```
/dispatch rename useToast to useNotification, add /foo command, redesign locale routing
/dispatch bump version, regen memory index, write session wrap
/dispatch fix the failing webkit a11y test
```

## Procedure

### 1. Parse tasks

Split the argument on conjunctions (`,`, `and`, `puis`, `&`). Count :

- 1 task  → proceed directly, no table
- 2-5 tasks → classification table
- 6+ tasks → ask : *"That's a lot. Want me to group them into sub-
  releases first, or attack them all ?"*

### 2. Classify

For each task, assign R0 / R1 / R2 using `.claude/rules/dispatch.md`.
Emit the classification as a table :

```
| # | Task (summary) | Risk | Target | Files expected |
|---|---|---|---|---|
| 1 | Rename useToast → useNotification | R0 | worker-haiku | src/hooks/useToast.ts + callers |
| 2 | Add /foo command | R1 | worker-sonnet | .claude/commands/foo.md |
| 3 | Redesign locale routing | R2 | main thread | src/app/routes/*, src/app/LocaleProvider.tsx |
```

### 3. Announce the parallelization plan

Based on file overlap :

```
Dispatching strategy :
  • 1 + 2 in parallel (disjoint files, different workers)
  • 3 after, in main thread (R2 architecture)
```

Ask for GO if any task involves write operations outside the current
branch's scope, or if a task has high-impact side-effects (dataset
writes, git push, prod deploy). Otherwise proceed.

### 4. Dispatch

Emit 1-N `Agent` tool calls **in a single assistant message**. Use
`subagent_type: "general-purpose"` + the `model` override to route to
the right tier (see `dispatch.md` for why) :

```
Agent(
  subagent_type: "general-purpose",
  model: "haiku",
  description: "Rename useToast → useNotification",
  prompt: "You are acting as worker-haiku (persona defined in
          .claude/agents/worker-haiku.md). Task : rename the hook
          `useToast` to `useNotification`. Update all callers. Run
          `pnpm validate:fast` to verify. R0 — signature unchanged.
          Report via the worker-haiku format at the end."
)

Agent(
  subagent_type: "general-purpose",
  model: "sonnet",
  description: "Add /foo slash command",
  prompt: "You are acting as worker-sonnet (persona defined in
          .claude/agents/worker-sonnet.md). Task : create
          .claude/commands/foo.md following the format of existing
          commands (e.g. /new-page). The command does X. Update
          docs/REFERENCE.md + README rule-count. Run
          `pnpm validate:fast` to verify. Report via the worker-sonnet
          format at the end."
)
```

### 5. Consolidate reports

Each worker returns a structured report. Aggregate into :

```
CONSOLIDATED DISPATCH REPORT
  ✓ Task 1 (worker-haiku) : rename done, 3 files touched, validate:fast green
  ✓ Task 2 (worker-sonnet) : /foo command added + docs synced, validate:fast green
  (Task 3 : main thread, ongoing)
```

Followed by the DISPATCH REPORT cost block from `dispatch.md`.

### 6. Ask GO for merge

Once everything is green :

```
Working tree changes :
  • 5 files modified across tasks 1 + 2
  • 0 conflicts

Proceed to commit + merge ? (GO / tweak / abort)
```

Never auto-commit without user GO. Workers don't commit either — the
Conductor owns the commit pen.

### 7. Merge strategy

If GO :
- One atomic commit per task (so the history reads clean and a single
  task can be reverted)
- Commit messages follow the project convention : `feat(scope):` for
  R1, `chore(scope):` for R0, `refactor(scope):` / `fix(scope):`
  depending

If user says "squash" : single commit, body lists the N tasks.

## Flags

- `--dry-run` → classify + announce plan, do NOT dispatch. Useful to
  preview before committing tokens.
- `--parallel-only` → skip R2 tasks (or fail if any detected).
- `--haiku-only` → force R0 classification for everything. Use at
  your own risk; typically only for throwaway bulk operations.

## Validation

- [ ] Every task got a classification rationale before dispatch
- [ ] Parallel tasks don't touch the same file
- [ ] Worker reports collected before user GO
- [ ] Cost block emitted
- [ ] User approval before any commit / merge

## See also

- Rule : `.claude/rules/dispatch.md` (taxonomy R0/R1/R2)
- Workers : `.claude/agents/worker-haiku.md`, `.claude/agents/worker-sonnet.md`
- Proactive mode : `.claude/rules/critical.md` §8
