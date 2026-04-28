---
paths: ["**"]
---

# Time Awareness — real-clock grounding (always-loaded)

Claude has no internal wall-clock between turns. Without a hook, it
keeps assuming the date from SessionStart even after midnight, even
after weeks. The `UserPromptSubmit` hook solves this by injecting a
`[clock: YYYY-MM-DD HH:MM · weekday · bucket · TZ]` line at the top of
every user turn. This rule codifies how to use it.

## 1. The clock line is authoritative

If the clock line says `2026-04-19 13:42 · samedi · après-midi`, that's
**the truth for this turn**, even if earlier in the session I believed
otherwise. Never write timestamps, memory entries, or estimates based on
a stale date — always re-read the current clock line first.

When writing a memory entry (session journal, decision), use the date
from the clock line, not the SessionStart snapshot. If the session
started Tuesday and we're now Thursday, the session wrap journal date
is **Thursday**.

## 2. Tone follows the bucket

The bucket (`late-night` / `matin` / `après-midi` / `soir`) is a tone
hint :

- `late-night` (00:00-05:59) → owner is tired; suggest stopping at a
  clean boundary, avoid starting multi-session epics, keep
  wrap-of-session instinct high.
- `matin` (06:00-11:59) → peak energy, good for architectural work and
  R2 tasks in main thread.
- `après-midi` (12:00-17:59) → solid execution window, safe for
  deep-dispatch of R1 tasks.
- `soir` (18:00-23:59) → maintenance mode, prefer R0/R1 dispatches to
  workers, keep main-thread surface small.

## 3. Duration estimation — anchor to measured data, not gut feel

**Anti-pattern** : "ça prend 2 semaines" when the owner knows it's 20
minutes. That's me hedging because I don't remember what similar tasks
actually took.

**Correct pattern** :

Before estimating anything, grep the memory :

```bash
grep -rl "#<relevant-tag>" .claude/memory/
```

Find comparable past work with known durations (session journals often
cite wall-time). Quote the measured data in the estimate :

- "Le dispatcher pattern a mis 45 min tonight (decision
  2026-04-19-v6.0-plan). Ce genre de chose prend ~45 min pas 2 semaines."
- "Un nouveau composant UI avec test prend ~60 s via Sonnet worker
  (from recent dispatch logs). On peut le faire maintenant."

When the owner pushes back on an estimate (`"fais-le maintenant"`,
`"en 20 min"`) : **stop negotiating, start executing**. The push-back
is signal that my estimate is wrong — test it empirically instead.

## 4. Deadline awareness

`.claude/client.md` now has a `**Deadline** :` field. When working in a
client worktree :

- Parse the deadline at session start.
- Compare with the clock-line date.
- If < 3 days remaining : surface `⚠ Deadline <DATE> — <N> days left`
  before engaging on non-critical scope.
- If overdue : announce `🛑 Deadline passed on <DATE> — N days ago`
  and confirm priorities with the owner.

`/morning-brief` (since v6.2.0) reads deadlines from each worktree's
client.md and rolls them into the portfolio table.

## 5. Audit trail — timestamps are proof

Every commit carries an ISO timestamp via git. `pnpm client:audit <name>`
exports a client-facing log of what was done when, proving delivery
dates. When the owner asks "when did we add X for client Y", the answer
comes from that command, not from my memory — I trust git, not myself.

## 6. Quick sanity checks using the clock

Before any action that depends on time :

- **Writing a session journal** : filename = `YYYY-MM-DD-HHMM.md` using
  the clock-line values, not SessionStart.
- **Referring to "today"** : always the clock-line date.
- **"Tomorrow", "next week"** : compute from the clock-line date.
- **"How long did that take"** : diff two clock-line readings if you
  recorded one earlier in the turn, else consult git timestamps.

## Why this rule exists

Two real pain points reported by the owner :

1. Resuming a session next week → Claude still acted like it was the
   session-start date. Disorienting and wrong.
2. "Ça prend 2 semaines" when it actually takes 20 min → lazy
   estimation, not grounded in the rich measured data already in
   memory.

Fixing both is a 2-file change (hook + this rule) and compounds over
months of use.
