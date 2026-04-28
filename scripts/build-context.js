#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   BUILD-CONTEXT — master prompt bible generator

   Composes a single markdown block that captures the full project
   context, consumable by any LLM (ChatGPT, Claude Desktop, Cursor)
   or human collaborator. Idempotent — reads the repo, never mutates.

   Usage:
     pnpm context              → write dist/CONTEXT-<slug>.md + print
     pnpm context --stdout     → print only, no file
     pnpm context --out <path> → custom output path
   ═══════════════════════════════════════════════════════════════ */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { PATHS } from './utils/paths.js';

const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;
const STDOUT_ONLY = process.argv.includes('--stdout');
const OUT_FLAG_IDX = process.argv.indexOf('--out');
const CUSTOM_OUT = OUT_FLAG_IDX !== -1 ? process.argv[OUT_FLAG_IDX + 1] : null;

const CLIENT_MD = join(ROOT, '.claude/client.md');
const CLAUDE_MD = join(ROOT, 'CLAUDE.md');
const MEMORY_MD = join(ROOT, '.claude/memory/MEMORY.md');
const COMMANDS_DIR = join(ROOT, '.claude/commands');
const SESSIONS_DIR = join(ROOT, '.claude/memory/sessions');
const BOOTSTRAP_MD = join(ROOT, '.claude/BOOTSTRAP-CLIENT.md');
const PACKAGE_JSON = join(ROOT, 'package.json');
const RULES_DIR = join(ROOT, '.claude/rules');

// WHY: cross-audit (2026-04-19) flagged a hardcoded "2 600 tokens" budget
// that was 4× lower than reality. Always compute at runtime from the actual
// file sizes. Approximation 4 chars/token matches GPT-4 / Claude tokenizers
// within ±15 % for english/french mixed markdown.
const APPROX_CHARS_PER_TOKEN = 4;
const ALWAYS_LOADED_RULES = [
  'anti-complaisance.md',
  'creative-ambition.md',
  'critical.md',
  'intent-routing.md',
  'memory-protocol.md',
  'principles.md',
  'releases.md',
  'time-awareness.md',
  'vision-first.md',
  'workflow.md',
];

function countTokens(content) {
  return Math.round((content?.length || 0) / APPROX_CHARS_PER_TOKEN);
}

function measureAlwaysLoaded() {
  let chars = 0;
  let lines = 0;
  for (const name of ALWAYS_LOADED_RULES) {
    const p = join(RULES_DIR, name);
    if (!existsSync(p)) continue;
    const c = readFileSync(p, 'utf-8');
    chars += c.length;
    lines += c.split('\n').length;
  }
  return { chars, lines, tokens: Math.round(chars / APPROX_CHARS_PER_TOKEN) };
}

const readOptional = (path) => (existsSync(path) ? readFileSync(path, 'utf-8') : null);

function parseClient(content) {
  if (!content) return { name: 'Unknown', slug: 'unknown', sector: '', tone: '', deadline: '' };
  const pick = (label) => {
    const rx = new RegExp(`\\*\\*${label}\\*\\*[ \\t]*:[ \\t]*(.*)$`, 'im');
    const m = content.match(rx);
    const raw = m ? m[1].trim() : '';
    if (!raw || raw.startsWith('(')) return '';
    return raw;
  };
  const name = pick('Nom') || 'Unknown';
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
  return {
    name,
    slug,
    sector: pick('Secteur'),
    tone: pick('Ton'),
    audience: pick('Cible primaire'),
    deadline: pick('Deadline'),
    locales: pick('Locales actives') || 'fr, de, en',
  };
}

function latestSession() {
  if (!existsSync(SESSIONS_DIR)) return null;
  const files = readdirSync(SESSIONS_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}-\d{4}\.md$/.test(f))
    .sort();
  if (!files.length) return null;
  const file = files[files.length - 1];
  const content = readFileSync(join(SESSIONS_DIR, file), 'utf-8');
  return { file, content };
}

function commandList() {
  if (!existsSync(COMMANDS_DIR)) return [];
  return readdirSync(COMMANDS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const name = f.replace(/\.md$/, '');
      const body = readFileSync(join(COMMANDS_DIR, f), 'utf-8');
      const descMatch =
        body.match(/^description:\s*(.+?)$/im) ||
        body.match(/^#\s+\/?\S+\s*[—-]\s*(.+?)$/m);
      const desc = descMatch ? descMatch[1].trim() : '';
      return { name, desc };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function truncateSection(md, maxLines = 200) {
  const lines = md.split('\n');
  if (lines.length <= maxLines) return md;
  return `${lines.slice(0, maxLines).join('\n')}\n\n<!-- truncated at ${maxLines} lines -->`;
}

function extractArchitectureFromClaude(content) {
  if (!content) return '';
  const match = content.match(/## Architecture\n([\s\S]*?)(?=\n##\s|$)/);
  return match ? match[1].trim() : '';
}

function pkgSummary() {
  if (!existsSync(PACKAGE_JSON)) return { version: '?', name: '?' };
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf-8'));
  return { version: pkg.version, name: pkg.name };
}

function compose() {
  const client = parseClient(readOptional(CLIENT_MD));
  const claude = readOptional(CLAUDE_MD);
  const memory = readOptional(MEMORY_MD) || '';
  const session = latestSession();
  const cmds = commandList();
  const pkg = pkgSummary();
  const bootstrap = readOptional(BOOTSTRAP_MD);
  const rules = measureAlwaysLoaded();
  const claudeTokens = countTokens(claude);
  const memoryTokens = countTokens(memory);

  const now = new Date().toISOString().slice(0, 10);
  const arch = extractArchitectureFromClaude(claude);

  const grouped = {
    creation: ['new-page', 'new-component', 'new-hook', 'new-feature', 'add-api'],
    design: ['design', 'design-explore', 'design-convert', 'theme', 'brief', 'responsive-check', 'lighthouse'],
    content: ['translate', 'wire-content', 'sync-content'],
    quality: ['fix', 'review', 'test', 'status', 'health-check', 'pre-delivery', 'refactor'],
    workflow: ['release', 'init', 'context', 'morning-brief', 'handoff', 'delegate', 'integrate'],
    orchestration: ['dispatch'],
    stack: ['install-extension', 'connect', 'discover', 'spec', 'update-deps', 'migrate', 'deploy', 'legal', 'changelog-client'],
  };
  const cmdMap = new Map(cmds.map((c) => [c.name, c]));
  const cheatsheet = Object.entries(grouped)
    .map(([cat, names]) => {
      const items = names
        .filter((n) => cmdMap.has(n))
        .map((n) => {
          const c = cmdMap.get(n);
          return `  - \`/${c.name}\`${c.desc ? ` — ${c.desc}` : ''}`;
        })
        .join('\n');
      return `### ${cat}\n${items}`;
    })
    .join('\n\n');

  return `# STEAKSOAP CONTEXT — ${client.name} · ${now}

> Master prompt bible. Generated by \`pnpm context\` — reads the repo, never mutates.
> Paste this entire block into a fresh LLM session (ChatGPT, Cursor, Claude Desktop)
> to bootstrap a collaborator without 30 min of manual briefing.

---

## 1. Identity

- **Client** : ${client.name}
- **Slug** : ${client.slug}
- **Sector** : ${client.sector || '(unfilled)'}
- **Audience** : ${client.audience || '(unfilled)'}
- **Tone** : ${client.tone || '(unfilled)'}
- **Locales actives** : ${client.locales}
- **Deadline** : ${client.deadline || '(none)'}
- **Starter version** : ${pkg.name}@${pkg.version}

---

## 2. Architecture (what this repo ships)

Stack : **React 19 · TypeScript 5.9 · Vite 7 · Tailwind CSS 4 · pnpm · Sanity · i18next · Vitest · ESLint 9**

${arch || '(CLAUDE.md ##Architecture section not found)'}

---

## 3. Non-negotiables (always-loaded rules — condensed)

1. **Branch first** — never commit on main/master. \`git checkout -b <type>/<scope>\` before any code.
2. **Anti-complaisance** — contest when the premise is weak. Forbidden openers : "super idée", "tu as raison", "parfait". Before any R2 action : emit a CHALLENGE block.
3. **Memory protocol** — before non-trivial tasks : \`grep -rl "#<domain>" .claude/memory/\`. End of session : write \`sessions/YYYY-MM-DD-HHMM.md\` + \`pnpm memory:index\`.
4. **Intent routing** — natural-language → slash-command mapping. Announce the skill invoked in one line.
5. **Dispatch** — classify every task R0 (→ worker-haiku), R1 (→ worker-sonnet), R2 (→ main Opus). Don't burn Opus tokens on renames.
6. **i18n + Sanity** — 3 locales (FR/DE/EN), 0 empty fields in prod. Never hardcode FR in JSX. Strict taxonomy : inline-in-page / dedicated-menu / siteConfig-singleton.
7. **Release check** — end every session with the RELEASE CHECK block (commits since last release, type distribution, recommendation).
8. **Time awareness** — trust the \`[clock: ...]\` line injected per turn, not the SessionStart date.

Full rules live in \`.claude/rules/\` (anti-complaisance · creative-ambition · critical · intent-routing · memory-protocol · principles · releases · time-awareness · vision-first · workflow).

---

## 4. Active decisions + patterns + frictions (from MEMORY.md digest)

${memory.replace(/^# Memory Digest\n+/, '').trim() || '(MEMORY.md empty)'}

---

## 5. Last session journal

${session ? `**File** : \`.claude/memory/sessions/${session.file}\`\n\n${truncateSection(session.content, 200)}` : '(no session journal yet)'}

---

## 6. Slash commands cheatsheet

${cheatsheet}

---

## 7. Bootstrap sequence (new client)

${bootstrap ? truncateSection(bootstrap, 80) : '(BOOTSTRAP-CLIENT.md not found — create it via `.claude/BOOTSTRAP-CLIENT.md`)'}

---

## 8. Token budget (per turn — measured at generation time)

- Always-loaded rules : **~${rules.tokens.toLocaleString('en-US').replace(/,/g, ' ')} tokens** (${ALWAYS_LOADED_RULES.length} files, ${rules.lines} lines, ${rules.chars.toLocaleString('en-US').replace(/,/g, ' ')} chars, ~4 chars/token approx)
- MEMORY.md digest : ~${memoryTokens.toLocaleString('en-US').replace(/,/g, ' ')} tokens (loaded by SessionStart hook)
- CLAUDE.md : ~${claudeTokens.toLocaleString('en-US').replace(/,/g, ' ')} tokens
- **Baseline total** : ~${(rules.tokens + memoryTokens + claudeTokens).toLocaleString('en-US').replace(/,/g, ' ')} tokens/turn injected
- **Optimization lever** : dispatch R0/R1 to worker-haiku/worker-sonnet → 10× cheaper on mechanical tasks

---

## 9. How to use this context

**In a fresh LLM session** : paste this entire block as the first message. Ask your question after.

**For a human collaborator** : this is the 5-minute read that replaces 30 minutes of onboarding.

**For a sibling Claude Code session** : complements (does not replace) CLAUDE.md — CLAUDE.md is the always-loaded anchor, this is the rich context.

---

*Generated ${now} · ${pkg.name}@${pkg.version}*
`;
}

function main() {
  const output = compose();

  if (!STDOUT_ONLY) {
    const client = parseClient(readOptional(CLIENT_MD));
    const distDir = join(ROOT, 'dist');
    if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
    const timestamp = new Date().toISOString().slice(0, 10);
    const outPath = CUSTOM_OUT
      ? resolve(ROOT, CUSTOM_OUT)
      : join(distDir, `CONTEXT-${client.slug}-${timestamp}.md`);
    writeFileSync(outPath, output, 'utf-8');
    const kb = (output.length / 1024).toFixed(1);
    const tokens = Math.round(output.length / APPROX_CHARS_PER_TOKEN);
    console.error(`✓ Wrote ${outPath} (${kb} KB · ~${tokens.toLocaleString()} tokens)`);
  }

  process.stdout.write(output);
}

main();
