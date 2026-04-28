#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CLIENT-REMOVE — cleanup a client worktree

   Validates the worktree exists, optionally prompts for confirmation,
   removes the worktree via `git worktree remove`, and deletes the
   branch unless --keep-branch is passed.

   Usage:
     pnpm client:remove <client-name>
     pnpm client:remove <client-name> --keep-branch
     pnpm client:remove <client-name> --force
     node scripts/client-remove.js <client-name>
   ═══════════════════════════════════════════════════════════════ */

import { createInterface } from 'node:readline';
import { spawnSync } from 'node:child_process';

import { PATHS } from './utils/paths.js';

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const CLIENT_NAME = args.find((a) => !a.startsWith('--'));
const KEEP_BRANCH = args.includes('--keep-branch');
const FORCE = args.includes('--force');

// ── Paths ─────────────────────────────────────────────────────────────────────

// WHY: STEAKSOAP_TEST_ROOT env var lets smoke tests point the script at a
// temp-dir fixture instead of the real repo root.
const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;

// ── Validation ────────────────────────────────────────────────────────────────

if (!CLIENT_NAME) {
  console.error('  ✗ Missing argument: client name is required.');
  console.error('    Usage: pnpm client:remove <client-name>');
  process.exit(1);
}

const BRANCH_NAME = `client/${CLIENT_NAME}`;

// ── Parse worktree list ───────────────────────────────────────────────────────

const listResult = spawnSync('git', ['worktree', 'list', '--porcelain'], {
  cwd: ROOT,
  encoding: 'utf-8',
});

if (listResult.status !== 0) {
  console.error('  ✗ Failed to query existing worktrees:');
  console.error('   ', listResult.stderr.trim());
  process.exit(1);
}

/**
 * Parse --porcelain output into array of { worktreePath, branch } objects.
 */
function parsePorcelain(output) {
  const stanzas = output.trim().split(/\n\n+/);
  return stanzas
    .map((stanza) => {
      const lines = stanza.split('\n');
      const worktreeLine = lines.find((l) => l.startsWith('worktree '));
      const branchLine = lines.find((l) => l.startsWith('branch '));
      if (!worktreeLine) return null;
      const worktreePath = worktreeLine.slice('worktree '.length).trim();
      const branchRef = branchLine ? branchLine.slice('branch '.length).trim() : '';
      const branch = branchRef.replace(/^refs\/heads\//, '');
      return { worktreePath, branch };
    })
    .filter(Boolean);
}

const worktrees = parsePorcelain(listResult.stdout);
const target = worktrees.find((wt) => wt.branch === BRANCH_NAME);

if (!target) {
  console.error(`  ✗ No worktree found for branch "${BRANCH_NAME}".`);

  const clientWorktrees = worktrees.filter((wt) => wt.branch.startsWith('client/'));
  if (clientWorktrees.length === 0) {
    console.error('    No client worktrees exist at all.');
  } else {
    console.error('    Available client worktrees:');
    for (const wt of clientWorktrees) {
      console.error(`      ${wt.branch.replace(/^client\//, '')}  (${wt.worktreePath})`);
    }
  }
  process.exit(1);
}

// ── Confirmation prompt ───────────────────────────────────────────────────────

async function confirm(message) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

if (!FORCE) {
  const keepNote = KEEP_BRANCH ? ' (branch will be kept)' : ' (branch will also be deleted)';
  console.log('');
  console.log(`  Worktree : ${target.worktreePath}`);
  console.log(`  Branch   : ${BRANCH_NAME}${keepNote}`);
  console.log('');
  const ok = await confirm('  Are you sure? [y/N] ');
  if (!ok) {
    console.log('\n  Aborted — nothing was changed.\n');
    process.exit(0);
  }
}

// ── Remove worktree ───────────────────────────────────────────────────────────

console.log(`\n  Removing worktree at ${target.worktreePath}…`);

// WHY: use --force flag on `git worktree remove` only when the user passed
// --force, to avoid silently discarding uncommitted changes otherwise.
const removeArgs = ['worktree', 'remove'];
if (FORCE) removeArgs.push('--force');
removeArgs.push(target.worktreePath);

const removeResult = spawnSync('git', removeArgs, {
  cwd: ROOT,
  encoding: 'utf-8',
});

if (removeResult.status !== 0) {
  console.error('  ✗ git worktree remove failed:');
  console.error('   ', (removeResult.stderr || '').trim());
  console.error('');
  console.error(
    '    Hint: if the worktree has uncommitted changes, re-run with --force to discard them.',
  );
  process.exit(1);
}

console.log(`  ✓ Worktree removed`);

// ── Delete branch ─────────────────────────────────────────────────────────────

if (!KEEP_BRANCH) {
  console.log(`  Deleting branch "${BRANCH_NAME}"…`);

  const branchResult = spawnSync('git', ['branch', '-D', BRANCH_NAME], {
    cwd: ROOT,
    encoding: 'utf-8',
  });

  if (branchResult.status !== 0) {
    // WHY: non-fatal — worktree is already gone; warn but don't exit 1 so the
    // caller knows the removal itself succeeded.
    console.warn('  ⚠ Could not delete branch (it may already be gone):');
    console.warn('   ', (branchResult.stderr || '').trim());
  } else {
    console.log(`  ✓ Branch "${BRANCH_NAME}" deleted`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('');
console.log('CLIENT-REMOVE');
console.log(`  Client  : ${CLIENT_NAME}`);
console.log(`  Worktree: ${target.worktreePath} — removed`);
if (KEEP_BRANCH) {
  console.log(`  Branch  : ${BRANCH_NAME} — kept`);
} else {
  console.log(`  Branch  : ${BRANCH_NAME} — deleted`);
}
console.log('');
