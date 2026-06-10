---
id: memory-index-check-date-drift
date: 2026-06-10
type: friction
tags: [#memory, #workflow, #friction]
scope: template
status: active
---

# `pnpm validate` fails on memory:index:check whenever the calendar day rolls over

## What blocked

Running `pnpm validate` on 2026-06-10 failed the `memory:index:check`
gate ("Memory digest out of date: INDEX.md, MEMORY.md") even with **zero**
memory edits in the working tree. Every other validator (lint, typecheck,
studio, sanity-schema, i18n, build) was green. Looked like the code change
broke something; it didn't.

## Root cause

`INDEX.md` / `MEMORY.md` embed the generation date
(`Auto-generated … on YYYY-MM-DD`). The `--check` mode regenerates and
diffs, so on any day **after** the last `memory:index` commit the only
diff is the date line → the gate fails. It is a calendar-driven flake, not
a content drift.

## Resolution

- Don't panic / don't assume the feature broke validation: confirm the
  diff is only the date line (`git diff .claude/memory/*.md`).
- The legitimate fix is `pnpm memory:index`, which naturally runs as part
  of the end-of-session journal commit — so the date re-syncs there rather
  than polluting a feature commit with a meaningless date bump.

## To stop it recurring

Candidate template fix (not done here): make `memory:index:check` ignore
the `Auto-generated … on <date>` line (compare content only), or stamp the
date from the latest entry/commit instead of "today". Until then, treat a
lone date-line diff as noise.
