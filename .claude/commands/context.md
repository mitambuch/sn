# /context

Generate the **master prompt bible** — a single markdown block capturing the
full project context, consumable by any LLM (ChatGPT, Cursor, Claude Desktop)
or human collaborator.

## When to use

- Starting a fresh session on another LLM (ChatGPT audit, Cursor, Claude Desktop).
- Briefing a human collaborator without 30 min of manual onboarding.
- Handing off to a sibling Claude Code session that needs the rich context.
- Auditing the project's own self-description (sanity check).

## Steps

1. Run the generator :
   ```bash
   pnpm context
   ```
   - Writes `dist/CONTEXT-<client-slug>-<date>.md`
   - Prints the same content on stdout for piping or clipboard grab

2. Variations :
   ```bash
   pnpm context --stdout         # print only, no file
   pnpm context --out foo.md     # custom output path
   ```

3. What the output contains (10 sections) :
   - Identity (from `.claude/client.md`)
   - Architecture (from `CLAUDE.md ##Architecture`)
   - Non-negotiables (condensed always-loaded rules)
   - Active decisions + patterns + open frictions (from `MEMORY.md`)
   - Last session journal (from `sessions/`)
   - Slash commands cheatsheet (grouped)
   - Bootstrap sequence (from `BOOTSTRAP-CLIENT.md`)
   - Token budget per turn
   - How to use this context

4. Size : typically **12-15 KB** (~3 500 tokens). Fits any LLM prompt (GPT-4 128k,
   Claude 200k+, Gemini 1M) with room to spare.

## Properties

- **Idempotent** — only writes to `dist/` (gitignored). Never mutates repo state.
- **LLM-agnostic** — pure markdown, no Claude-specific syntax.
- **Auto-versioned** — filename encodes client slug + ISO date.
- **Single source** — reads the repo live; if a rule moves, next run follows.

## Cross-refs

- Generator : `scripts/build-context.js`
- Bootstrap doc : `.claude/BOOTSTRAP-CLIENT.md`
- Client identity : `.claude/client.md`
- Memory digest : `.claude/memory/MEMORY.md`
