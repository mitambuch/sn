#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   DISPATCH-VERIFY — the mechanical acceptance of dispatched work.

   WHY: dispatch used to run on trust — a worker (haiku/sonnet/Codex)
   returned its diff and "looks good" was the only control. That is the
   exact false-positive §4 forbids everywhere else. The owner's condition
   for delegating to a powerful external model is "SI il est contrôlé"
   (intelligence-ladder doctrine, 2026-06-10): the proof of a dispatch is
   the OUTPUT OF THIS SCRIPT, not the word of the worker or the orchestrator.

   Usage: node scripts/dispatch-verify.js <spec-id>
   reads .claude/dispatch/specs/<id>.json (gitignored — ephemeral session
   state; the durable history is the git trailer P12 + the ledger P13).

   Four checks, cheapest first (no point running tests on a diff that
   already escaped its scope):
     1. confinement   — every changed file ∈ allowed_paths ∧ ∉ forbidden
     2. protected     — no base:update-PROTECTED path touched
     3. acceptance    — every spec.acceptance command exits 0
     4. cheat markers — added .only(/.skip(/eslint-disable/threshold drops
                        → WARN (legit uses exist; the orchestrator eyeballs)

   On global PASS: writes .claude/dispatch/.verified-<id> (consumed by the
   P12 commit-msg trailer) and appends one JSONL line to the ledger (P13).
   The block it prints IS the proof — paste it, end of discussion.
   ═══════════════════════════════════════════════════════════════ */

import { execSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { PATHS } from './utils/paths.js';

const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const id = process.argv[2];

// `--clear [id]` removes verified markers. A marker is written on PASS and
// consumed by the next dispatched commit (P12); if a dispatch is abandoned
// after verify, the stale marker would otherwise block an unrelated commit.
// This is the documented escape hatch (the commit-msg refusal points here).
if (id === '--clear') {
  const dir = join(ROOT, '.claude/dispatch');
  const target = process.argv[3];
  let n = 0;
  try {
    for (const f of readdirSync(dir)) {
      if (f.startsWith('.verified-') && (!target || f === `.verified-${target}`)) {
        rmSync(join(dir, f));
        n++;
      }
    }
  } catch {
    /* no dispatch dir — nothing to clear */
  }
  console.log(`  ✓ cleared ${n} dispatch marker(s)${target ? ` for ${target}` : ''}.`);
  process.exit(0);
}

if (!id) {
  console.error('  ✗ dispatch-verify: missing <spec-id>. Usage: dispatch-verify <id> | --clear [id]');
  process.exit(2);
}

const specPath = join(ROOT, '.claude/dispatch/specs', `${id}.json`);
let spec;
try {
  spec = JSON.parse(readFileSync(specPath, 'utf-8'));
} catch {
  console.error(`  ✗ dispatch-verify: no spec at .claude/dispatch/specs/${id}.json`);
  process.exit(2);
}

const base = spec.base || 'main';
const allowed = spec.allowed_paths || [];
const forbidden = spec.forbidden || [];

// ─── glob → RegExp (no dependency; supports **, *, ?) ───────────────
function globToRe(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        re += '.*'; // ** → any depth
        i++;
        if (glob[i + 1] === '/') i++; // swallow the slash after **
      } else {
        re += '[^/]*'; // * → within a segment
      }
    } else if (c === '?') re += '[^/]';
    else if ('.+^${}()|[]\\'.includes(c)) re += `\\${c}`;
    else re += c;
  }
  return new RegExp(`^${re}$`);
}
const matchesAny = (file, globs) => globs.some((g) => globToRe(g).test(file) || file === g);

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

// Changed files = committed-since-base ∪ uncommitted ∪ staged ∪ untracked.
// A worker may or may not have committed; cover both so nothing escapes.
function changedFiles() {
  const set = new Set();
  for (const src of [
    `diff --name-only ${base}...HEAD`,
    'diff --name-only HEAD',
    'diff --cached --name-only',
    'ls-files --others --exclude-standard',
  ]) {
    for (const f of git(src).split('\n')) if (f.trim()) set.add(f.trim());
  }
  // Never count the verifier's OWN plumbing as the worker's diff: specs +
  // markers are ephemeral session state, the ledger is telemetry. In the real
  // repo these are gitignored; this filter makes the script self-protecting
  // regardless of how the consumer's .gitignore is set up.
  return [...set].filter((f) => !f.startsWith('.claude/dispatch/') && !f.startsWith('.claude/ledger/'));
}

// PROTECTED list (base:update client-owned paths) — reuse the same source
// validate-protected-sync reads, so the two never drift.
function protectedPaths() {
  try {
    const src = readFileSync(join(ROOT, 'scripts/base-patch.js'), 'utf-8');
    const m = /(?:const|let)\s+PROTECTED\s*=\s*\[([\s\S]*?)\]/.exec(src);
    if (!m) return [];
    return [...m[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((x) => x[1]);
  } catch {
    return [];
  }
}

const checks = [];
const files = changedFiles();

// ─── 1. Confinement ────────────────────────────────────────────────
const outOfScope = files.filter((f) => !matchesAny(f, allowed));
const hitForbidden = files.filter((f) => matchesAny(f, forbidden));
if (outOfScope.length || hitForbidden.length) {
  checks.push({
    name: 'confinement',
    pass: false,
    detail:
      (outOfScope.length ? `outside allowed_paths: ${outOfScope.join(', ')}` : '') +
      (hitForbidden.length ? ` · forbidden touched: ${hitForbidden.join(', ')}` : ''),
  });
} else {
  checks.push({ name: 'confinement', pass: true, detail: `${files.length} file(s), all in scope` });
}

// ─── 2. Protected paths intact ─────────────────────────────────────
const prot = protectedPaths();
const protTouched = files.filter((f) => prot.some((p) => f === p || f.startsWith(p.replace(/\/$/, '') + '/')));
checks.push(
  protTouched.length
    ? { name: 'protected', pass: false, detail: `base:update-PROTECTED touched: ${protTouched.join(', ')}` }
    : { name: 'protected', pass: true, detail: 'no protected path touched' },
);

// ─── 3. Acceptance ─────────────────────────────────────────────────
// Only run if confinement passed — no point testing escaped work.
const confined = checks[0].pass && checks[1].pass;
if (!confined) {
  checks.push({ name: 'acceptance', pass: false, detail: 'skipped — diff escaped scope, fix that first' });
} else {
  const cmds = spec.acceptance || [];
  if (!cmds.length) {
    checks.push({ name: 'acceptance', pass: false, detail: 'spec has no acceptance command (a task-specific test is required)' });
  } else {
    let allGreen = true;
    const lines = [];
    for (const cmd of cmds) {
      try {
        execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' });
        lines.push(`✓ ${cmd}`);
      } catch (e) {
        allGreen = false;
        const tail = String(e.stdout || e.stderr || '').trim().split('\n').slice(-3).join(' / ');
        lines.push(`✗ ${cmd} — ${tail}`);
      }
    }
    checks.push({ name: 'acceptance', pass: allGreen, detail: lines.join('\n               ') });
  }
}

// ─── 4. Cheat markers (WARN only) ──────────────────────────────────
const diff = git(`diff ${base}...HEAD`) + '\n' + git('diff HEAD');
const cheats = [];
for (const [label, re] of [
  ['test .only', /^\+.*\.only\(/m],
  ['test .skip', /^\+.*\.(skip|todo)\(/m],
  ['eslint-disable added', /^\+.*eslint-disable/m],
  ['coverage threshold lowered', /^\-\s*(statements|branches|functions|lines):\s*\d+/m],
]) {
  if (re.test(diff)) cheats.push(label);
}
const cheatWarn = cheats.length > 0;

// ─── Report ────────────────────────────────────────────────────────
console.log(`\n  dispatch-verify — ${id}  ${dim(`(class ${spec.class || '?'} · model ${spec.model || '?'} · attempt ${spec.attempt || 1})`)}\n`);
for (const c of checks) {
  const tag = c.pass ? green('PASS') : red('FAIL');
  console.log(`    ${tag}  ${c.name.padEnd(11)} ${dim(c.detail)}`);
}
console.log(
  `    ${cheatWarn ? yellow('WARN') : green('PASS')}  ${'cheat'.padEnd(11)} ${dim(cheatWarn ? cheats.join(', ') + ' — orchestrator must eyeball' : 'no skip/only/disable/threshold-drop added')}`,
);

const passed = checks.every((c) => c.pass);

// ─── Ledger line (P13 reads it) + verified marker (P12 consumes it) ──
function writeLedger() {
  const dir = join(ROOT, '.claude/ledger');
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const line = {
      ts: new Date().toISOString(),
      id,
      class: spec.class || null,
      model: spec.model || null,
      attempt: spec.attempt || 1,
      verified: passed,
      checks: {
        confinement: checks[0].pass,
        protected: checks[1].pass,
        acceptance: checks[2].pass,
        cheat_warn: cheatWarn,
      },
      files: files.length,
    };
    if (!passed) line.fail = (checks.find((c) => !c.pass) || {}).name;
    appendFileSync(join(dir, 'dispatch.jsonl'), JSON.stringify(line) + '\n');
  } catch {
    /* ledger is best-effort telemetry — never block the verdict on it */
  }
}

writeLedger();

if (passed) {
  const dispatchDir = join(ROOT, '.claude/dispatch');
  try {
    if (!existsSync(dispatchDir)) mkdirSync(dispatchDir, { recursive: true });
    writeFileSync(join(dispatchDir, `.verified-${id}`), new Date().toISOString());
  } catch {
    /* marker write failed — surface it, the commit trailer gate (P12) will notice */
  }
  console.log(`\n  ${green('✓ PASS')} — work accepted. Marker .claude/dispatch/.verified-${id} written; ledger appended.\n`);
  process.exit(0);
}

console.log(`\n  ${red('✗ FAIL')} — not accepted. Fix the failing check above (or the orchestrator takes over). Ledger appended.\n`);
process.exit(1);
