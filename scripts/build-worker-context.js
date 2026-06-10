#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   BUILD-WORKER-CONTEXT — the thin context for a dispatched worker.
   THE cost lever of the dispatch system.

   WHY: "haiku executes" dies as an economy if haiku gets the orchestrator's
   full context (~30k always-loaded/turn + ~18k session payload). On a task
   with a 15-turn inner loop, the context costs more than the work. A worker
   doesn't need the bible — it needs its CONTRACT (the spec) and the rules
   that touch ITS files. Pack P14. Target 5-8k chars; hard ceiling 9k.

   The selector is pure reuse: the rules already carry `paths:` frontmatter;
   a worker on src/components/** gets components.md + styling.md + testing.md
   (their globs match the spec's allowed_paths) and nothing else — no
   NORTH-STAR, no OWNER, no memory. The doctrine lives with the orchestrator
   that controls; the worker has a contract.

   Order is cache-friendly: the STABLE prefix (conventions digest + matched
   rules) first, the per-task contract last + a one-line return-control
   reminder (prompt tails weigh more on small models). When you overflow to
   the API, that stable prefix is a perfect cacheable block.

   Usage: node scripts/build-worker-context.js --spec <id>
   ═══════════════════════════════════════════════════════════════ */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { PATHS } from './utils/paths.js';

const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;
// Ceiling, mechanized (§0.6 doctrine: a coded cap holds, a prose one drifts).
// Reality check on THIS repo: auto-matching all path-triggered rules for a
// .tsx task is greedy — several rules over-claim `src/**/*.tsx` (i18n-sanity.md
// alone is 10k), so a Badge task auto-pulls ~30k. The lever is the spec's
// optional `rules:` field (the orchestrator names exactly what the worker
// needs); a scoped [components,styling,testing] set is ~13k. The ceiling fires
// when even that is blown — a signal the task is over-broad (misclassified R2),
// not R1. Even ~13k is ~70% off the orchestrator's ~50k. The 5-8k spec target
// needs slimmer rules (a future lever), not a tighter number here.
export const WORKER_CONTEXT_CEILING = 14000;

// Half a page of conventions — the 6 lines that avoid 80% of rework. Static
// (cacheable). This REPLACES the always-loaded bible for the worker: it
// distills it, it doesn't ship it.
const CONVENTIONS_DIGEST = `# Worker conventions (the non-negotiables for your files)

- TypeScript strict: no \`any\`; \`as\`/\`!\` only as named exceptions with a \`// WHY\`.
- Named exports, PascalCase component files, one component per file.
- \`cn()\` (from @utils/cn) for every className; design tokens only — never a
  hardcoded colour/spacing if a token covers it.
- Mobile-first: every UI must hold at 375px before it counts as done.
- Tests live beside source in \`__tests__/\`; test behaviour, not implementation.
- Inner loop: \`pnpm validate:fast\` (lint + typecheck) must be green.
- Path aliases: @components @hooks @pages @utils @config @features @constants
  @context @workbench @lib.`;

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

// glob → RegExp (same minimal dialect as dispatch-verify: **, *, ?).
function globToRe(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        re += '.*';
        i++;
        if (glob[i + 1] === '/') i++;
      } else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if ('.+^${}()|[]\\'.includes(c)) re += `\\${c}`;
    else re += c;
  }
  return new RegExp(`^${re}$`);
}

// Parse a rule's `paths:` frontmatter — both the inline (`paths: ["a","b"]`)
// and the multi-line YAML list form. Returns the glob strings.
function parseRulePaths(content) {
  const fm = content.split('---')[1] || ''; // first frontmatter block
  const inline = fm.match(/^paths:[ \t]*\[(.+)\]/m);
  if (inline) return [...inline[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
  // multi-line: `paths:` then `  - "glob"` lines until the next key/dedent.
  const lines = fm.split('\n');
  const start = lines.findIndex((l) => /^paths:[ \t]*$/.test(l));
  if (start < 0) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^[ \t]*-[ \t]*['"]?([^'"\n]+?)['"]?[ \t]*$/);
    if (!m) break;
    out.push(m[1]);
  }
  return out;
}

// The rules a worker gets. If the spec names `rules:` explicitly, those EXACTLY
// (the orchestrator's precision lever when auto-match is too greedy — it
// controls). Otherwise auto-match: every path-triggered rule whose globs hit an
// allowed_path. Always-loaded rules (paths: ["**"]) are excluded either way —
// the conventions digest replaces the bible.
function selectRules(spec) {
  const rulesDir = join(ROOT, '.claude/rules');
  if (!existsSync(rulesDir)) return [];
  const read = (name) => {
    const p = join(rulesDir, name);
    return existsSync(p) ? { name, content: readFileSync(p, 'utf-8') } : null;
  };

  if (Array.isArray(spec.rules)) {
    return spec.rules.map(read).filter(Boolean);
  }

  const allowedPaths = spec.allowed_paths || [];
  const matched = [];
  for (const name of readdirSync(rulesDir).filter((n) => n.endsWith('.md')).sort()) {
    const content = readFileSync(join(rulesDir, name), 'utf-8');
    const globs = parseRulePaths(content);
    if (globs.length === 1 && globs[0] === '**') continue; // always-loaded → skip
    const hit = globs.some((g) => allowedPaths.some((p) => globToRe(g).test(p)));
    if (hit) matched.push({ name, content });
  }
  return matched;
}

function buildContract(spec) {
  const list = (arr) => (arr && arr.length ? arr.map((x) => `  - ${x}`).join('\n') : '  (none)');
  return `# Your contract (spec ${spec.id})

GOAL: ${spec.goal || '(missing — ask the orchestrator)'}

allowed_paths (you may touch ONLY these):
${list(spec.allowed_paths)}

forbidden (never touch):
${list(spec.forbidden)}

acceptance (must all pass before you return):
${list(spec.acceptance)}`;
}

const REMINDER =
  '\n---\nIf you need a file OUTSIDE allowed_paths, STOP and return control with the reason. ' +
  'You never widen the spec yourself — the orchestrator does. Run the acceptance commands before handing back.';

export function buildWorkerContext(spec) {
  const rules = selectRules(spec);
  const sections = [
    { label: 'conventions', text: CONVENTIONS_DIGEST },
    ...rules.map((r) => ({ label: `rule:${r.name}`, text: r.content.trim() })),
    { label: 'contract', text: buildContract(spec) },
    { label: 'reminder', text: REMINDER.trim() },
  ];
  const body = sections.map((s) => s.text).join('\n\n');
  return { body, sections, rules: rules.map((r) => r.name) };
}

function main() {
  const id = arg('--spec');
  if (!id) {
    console.error('  ✗ build-worker-context: missing --spec <id>');
    process.exit(2);
  }
  let spec;
  try {
    spec = JSON.parse(readFileSync(join(ROOT, '.claude/dispatch/specs', `${id}.json`), 'utf-8'));
  } catch {
    console.error(`  ✗ build-worker-context: no spec at .claude/dispatch/specs/${id}.json`);
    process.exit(2);
  }

  const { body, sections, rules } = buildWorkerContext(spec);

  // Ceiling, mechanized (same doctrine as §0.6): a prose cap drifts, a coded
  // one holds. Over → the task probably isn't R0/R1; raise the class, not the cap.
  if (body.length > WORKER_CONTEXT_CEILING) {
    console.error(`\n  ✗ worker context ${body.length} > ${WORKER_CONTEXT_CEILING} ceiling. By section:`);
    for (const s of sections) console.error(`      ${String(s.text.length).padStart(6)}  ${s.label}`);
    console.error(`    Matched rules: ${rules.join(', ') || '(none)'}.`);
    console.error('    Too much context = not an R0/R1 task. Raise the classification, not the ceiling.\n');
    process.exit(1);
  }

  process.stdout.write(body);
}

// Run only when executed directly — importing (the test) gets pure builders.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
