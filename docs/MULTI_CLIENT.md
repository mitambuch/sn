# Multi-client portfolio — running 2+ projects at once

**TL;DR** : each client lives in its own git worktree under the parent
folder. Open a separate VS Code window on each. Each has its own
`.claude/client.md`, its own Claude Code session, its own memory
context. Zero cross-pollution.

## Why worktrees (and not branches, not stashes, not separate clones)

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| `git stash` + branch switch | zero setup | context pollution, Claude Code sees the wrong client.md, stashes pile up | ❌ |
| Separate full clones | total isolation | duplicate `node_modules` (1+ GB each), duplicate history on disk | ❌ |
| **Git worktrees** | shared `.git/`, fast switch, each has its own working tree + VS Code window + Claude session | slightly higher mental model | ✅ |

## Commands

### Create a new client portfolio entry

```bash
pnpm client:new hdva                  # default model = sonnet
pnpm client:new etoiles --model opus  # custom default
```

Creates `../<client-name>/` as a worktree on branch `client/<client-name>`.
Copies `.claude/client.md` template, pre-fills the `Nom` and `Model`
fields. Prints the next-step snippet (open in VS Code + launch Claude
Code with the right model).

### List the portfolio

```bash
pnpm client:list
```

Shows every active client worktree with its branch, last commit, default
model. No network calls, no worker dispatch — just a compact git query.

### Cleanup

```bash
pnpm client:remove hdva            # removes worktree + deletes branch
pnpm client:remove hdva --keep-branch   # removes worktree only, branch survives
pnpm client:remove hdva --force         # skip the confirmation prompt
```

### Morning status scan

```
/morning-brief
```

Slash command that dispatches a Haiku worker per worktree (in parallel)
to gather status (last commit, dirty count, recent sessions, configured
model). Main thread assembles a single table + flags anything that
needs attention.

## Daily workflow example

```
Morning :
  [main window]  /morning-brief
    → 3 clients, 2 dirty, client B dormant 9 days
  [decide which to work on first]

Mid-morning (client A) :
  [window 1]     code ../hdva && claude
    → work on hdva for 90 min, commit, push

Lunch brief :
  [main window]  /morning-brief
    → status refresh, confirm nothing stale

Afternoon (client B + C in parallel) :
  [window 2]     code ../autoconcept-garage && claude --model sonnet
  [window 3]     code ../etoiles && claude --model haiku
    → two clients simultaneously, different models, isolated contexts

End of day :
  [each window]  commit, push, end session
  [main window]  pnpm client:list
    → confirm clean state
```

## Conventions

- **Branch naming** : `client/<kebab-case-name>`. Enforced by `client:new`.
- **Directory** : `../<name>` as sibling of the main checkout.
- **Client profile** : always at `.claude/client.md` inside the worktree.
  The template at the main repo is copied on create; thereafter it's
  client-owned (protected by `base-patch.js`).
- **Default model** : set in `.claude/client.md` `Model` field. Read by
  `pnpm client:list` and `/morning-brief`. You can still pass
  `claude --model <override>` when launching for that session.

## Dispatcher pattern in the multi-client context

Per `.claude/rules/dispatch.md`, the Conductor (main Opus session in
each window) classifies tasks R0/R1/R2 and dispatches to workers. Across
clients, this means :

- Each window has **its own Conductor** — they don't share state.
- Each window's Conductor **can dispatch its own workers** in parallel
  via the Agent tool.
- `/morning-brief` is the **only** cross-window orchestrator today —
  it reads git state of sibling worktrees from the one window you run
  it in, no inter-session communication needed.

## Troubleshooting

### "fatal: '<path>' already exists" on `client:new`

A worktree or a plain directory at that path already exists. Either :
- Use `pnpm client:list` to see if it's a tracked worktree
- Remove the directory manually if it's orphaned
- Pick a different name

### `pnpm install` inside a worktree

Don't. The workspace root is the main checkout. Each worktree shares
that root's `node_modules/`. Running `pnpm install` from a worktree
points at the worktree's `package.json`, which is the same as the main
— idempotent, but wasteful.

If a client needs a client-specific dep (rare), add it to the main
`package.json` and it's available everywhere.

### Confusing which window is which

Title your VS Code window : `File → Save Workspace As...` and pick a
name per client, or use the **peacock** extension to colour-code window
chrome per project.

## When NOT to use worktrees

- You have only 1 active client → just work on main, no point.
- The clients are fundamentally different stacks (different framework
  entirely) → use separate clones.
- You're doing pure read-only review across all clients at once → a
  single consolidated read script (like `/morning-brief`) is faster.

## See also

- `.claude/rules/dispatch.md` — R0/R1/R2 taxonomy and worker dispatch
- `.claude/client.md` — per-client brand voice profile
- `/morning-brief` — the daily orchestrator
- `pnpm client:*` — lifecycle scripts
