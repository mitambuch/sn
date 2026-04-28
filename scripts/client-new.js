#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CLIENT-NEW — bootstrap a new client portfolio entry as a git worktree

   Validates the client name (kebab-case, 2-40 chars), ensures no
   conflict with existing worktrees or directories, runs
   `git worktree add -b client/<name>`, then copies the .claude/client.md
   template with the client name and default model pre-filled.

   Usage:
     pnpm client:new <client-name>
     pnpm client:new <client-name> --model haiku
     node scripts/client-new.js <client-name>
   ═══════════════════════════════════════════════════════════════ */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { PATHS } from './utils/paths.js';

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const CLIENT_NAME = args.find((a) => !a.startsWith('--'));

const modelIdx = args.indexOf('--model');
const MODEL = modelIdx !== -1 && args[modelIdx + 1] ? args[modelIdx + 1] : 'sonnet';

// ── Paths ─────────────────────────────────────────────────────────────────────

// WHY: STEAKSOAP_TEST_ROOT env var lets smoke tests point the script at a
// temp-dir fixture instead of the real repo root.
const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;

// ── Validation ────────────────────────────────────────────────────────────────

if (!CLIENT_NAME) {
  console.error('  ✗ Missing argument: client name is required.');
  console.error('    Usage: pnpm client:new <client-name>');
  process.exit(1);
}

// kebab-case: lowercase letters, digits, hyphens; no leading/trailing hyphen;
// length 2-40 chars.
const KEBAB_RE = /^[a-z0-9][a-z0-9-]{0,38}[a-z0-9]$|^[a-z0-9]{2}$/;

if (!KEBAB_RE.test(CLIENT_NAME)) {
  console.error(`  ✗ Invalid client name: "${CLIENT_NAME}"`);
  console.error('    Must be kebab-case (lowercase letters, digits, hyphens),');
  console.error('    2-40 characters, no leading/trailing hyphen, no spaces.');
  console.error('    Examples: hdva, autoconcept-garage, le-bon-coin-2');
  process.exit(1);
}

// ── Conflict checks ───────────────────────────────────────────────────────────

const TARGET_DIR = resolve(ROOT, '..', CLIENT_NAME);

if (existsSync(TARGET_DIR)) {
  console.error(`  ✗ Directory already exists: ${TARGET_DIR}`);
  console.error('    Remove or rename it before creating a new worktree there.');
  process.exit(1);
}

// Check for existing worktree or branch with the same name
const worktreeResult = spawnSync('git', ['worktree', 'list', '--porcelain'], {
  cwd: ROOT,
  encoding: 'utf-8',
});

if (worktreeResult.status !== 0) {
  console.error('  ✗ Failed to query existing worktrees:');
  console.error('   ', worktreeResult.stderr.trim());
  process.exit(1);
}

const BRANCH_NAME = `client/${CLIENT_NAME}`;
if (worktreeResult.stdout.includes(`branch refs/heads/${BRANCH_NAME}`)) {
  console.error(`  ✗ Worktree for branch "${BRANCH_NAME}" already exists.`);
  console.error('    Run `pnpm client:list` to see active client worktrees.');
  process.exit(1);
}

// Also check if the branch exists at all (even without a worktree checked out)
const branchResult = spawnSync('git', ['branch', '--list', BRANCH_NAME], {
  cwd: ROOT,
  encoding: 'utf-8',
});

if (branchResult.stdout.trim().length > 0) {
  console.error(`  ✗ Branch "${BRANCH_NAME}" already exists.`);
  console.error(
    '    Delete it first (`git branch -D ' + BRANCH_NAME + '`) or choose a different name.',
  );
  process.exit(1);
}

// ── Create worktree ───────────────────────────────────────────────────────────

console.log(`\n  Creating worktree for client "${CLIENT_NAME}"…`);

const addResult = spawnSync('git', ['worktree', 'add', '-b', BRANCH_NAME, TARGET_DIR], {
  cwd: ROOT,
  encoding: 'utf-8',
  // WHY: stdio inherit lets git print its own progress messages (e.g. "Preparing worktree")
  stdio: ['inherit', 'pipe', 'pipe'],
});

if (addResult.status !== 0) {
  console.error('  ✗ git worktree add failed:');
  console.error('   ', (addResult.stderr || '').trim());
  process.exit(1);
}

// ── Copy and patch .claude/client.md template ─────────────────────────────────

const TEMPLATE_PATH = join(ROOT, '.claude', 'client.md');
const DEST_CLAUDE_DIR = join(TARGET_DIR, '.claude');
const DEST_PATH = join(DEST_CLAUDE_DIR, 'client.md');

let templateContent;
try {
  templateContent = readFileSync(TEMPLATE_PATH, 'utf-8');
} catch {
  // WHY: non-fatal — the worktree was already created; just warn and skip the patch
  console.warn('  ⚠ Could not read .claude/client.md template — skipping client.md setup.');
  printNextSteps(CLIENT_NAME, MODEL, TARGET_DIR);
  process.exit(0);
}

// Replace the empty "**Nom** :" placeholder with the actual client name
let patched = templateContent.replace(/^(\*\*Nom\*\* :)\s*$/m, `$1 ${CLIENT_NAME}`);

// Inject "## Default model" section right after "# Client Profile" heading
patched = patched.replace(
  /^(# Client Profile\n)/m,
  `$1\n## Default model\n\n- **Model** : ${MODEL}\n`,
);

// WHY: .claude/ may not exist yet in the fresh worktree — create it if missing
if (!existsSync(DEST_CLAUDE_DIR)) {
  const { mkdirSync } = await import('node:fs');
  mkdirSync(DEST_CLAUDE_DIR, { recursive: true });
}

try {
  writeFileSync(DEST_PATH, patched, 'utf-8');
} catch (err) {
  console.warn(`  ⚠ Could not write ${DEST_PATH}: ${err.message}`);
}

// ── Done ──────────────────────────────────────────────────────────────────────

printNextSteps(CLIENT_NAME, MODEL, TARGET_DIR);

function printNextSteps(name, model, targetDir) {
  console.log('');
  console.log(`  ✓ Worktree created at ${targetDir}`);
  console.log(`    → Fill \`.claude/client.md\` with brand voice, audience, visual.`);
  console.log(`    → Open in VS Code : code ${targetDir}`);
  console.log(`    → Start Claude Code there : claude --model ${model}`);
  console.log('');
}
