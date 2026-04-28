# /morning-brief

Scan every active client worktree and produce a single consolidated
status table. Intended as the first thing you run in the morning when
juggling 2+ client projects — gives a one-screen picture of where
everything is.

## Arguments

None. The command walks all git worktrees under the current repo's
parent folder that have a branch matching `client/*`.

## Procedure

### 1. Discover worktrees

Run `git worktree list --porcelain` and parse the output. Filter to
branches starting with `client/`. The main worktree (`main` or
`master` branch) is excluded — this command is about the portfolio,
not the template itself.

### 2. Per-worktree snapshot

For each client worktree, collect **in parallel via dispatched Haiku
workers** (one Agent call per worktree, all in the same assistant
message) :

- `git status --porcelain` → number of uncommitted files
- `git log -1 --format=%h\ %s\ (%cr)` → last commit short + subject + relative date
- `git rev-list --count HEAD ^main` if remote main known → commits ahead of main
- Read `.claude/client.md` → extract `**Model** :` value and `**Nom** :` value
- Count `.claude/memory/sessions/*.md` modified in last 7 days → activity level

Each worker returns a compact JSON-ish block so the main thread can
assemble without re-parsing. Example worker prompt template :

```
You are worker-haiku. Read the client worktree at <path>. Report :

{
  "name": "<client.md Nom>",
  "branch": "<current branch>",
  "model": "<client.md Model or 'sonnet' default>",
  "lastCommit": "<sha>  <subject>  (<relative>)",
  "dirty": <N files uncommitted>,
  "recentSessions": <N journals mtime < 7 days>,
  "ahead": <commits ahead of main>
}
```

### 3. Consolidated table

Main thread assembles the reports into :

```
📋 Morning brief — <timestamp>

  Client                Branch              Model    Last commit                            Dirty  Active (7d)
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  Hôtel de la Vue...    client/hdva         sonnet   a1b2c3d feat(home): hero (2h ago)       3      ✓ 4 sessions
  Garage Autoconcept    client/autoconce…   haiku    de4f5g6 fix(nav): mobile menu (1d)      0      · 1 session
  Étoiles aux Atomes    client/etoiles      sonnet   7890abc chore: memory wrap (3d)         0      — dormant

  Summary : 3 active clients, 3 dirty files across portfolio, 2 clients
  worked on in the last week.
```

### 4. Flag attention items

After the table, highlight anything that needs action :

- Any worktree with > 5 dirty files → "⚠ {name} has N uncommitted"
- Any worktree dormant > 14 days → "⏸ {name} last touched X days ago"
- Any worktree ahead of its `origin/client/<name>` by 3+ commits → "⬆ {name} has N unpushed commits"

### 5. Optional follow-up

Ask the user : `Want to jump into one of these? Reply with the name
and I'll give you the open-in-VS-Code snippet.`

## Flags

- `--json` → output machine-parseable JSON instead of the pretty table
- `--dirty-only` → only show worktrees with uncommitted work

## Validation

- [ ] Every client worktree discovered (compare against `git worktree list`)
- [ ] Workers dispatched in parallel (single assistant message)
- [ ] Table is readable at a glance — no horizontal scroll at 120 col terminal
- [ ] Attention items surfaced in plain language
- [ ] Runtime ≤ 30 seconds for up to 6 worktrees

## See also

- Worktree lifecycle : `pnpm client:new`, `pnpm client:list`, `pnpm client:remove`
- Multi-client guide : `docs/MULTI_CLIENT.md`
- Dispatcher taxonomy : `.claude/rules/dispatch.md`
