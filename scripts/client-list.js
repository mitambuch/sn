#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CLIENT-LIST — list active client worktrees with status summary

   Queries `git worktree list --porcelain`, filters branches matching
   `client/*`, and prints a summary table with path, branch, last
   commit, and the default model from .claude/client.md.

   Usage:
     pnpm client:list
     node scripts/client-list.js
   ═══════════════════════════════════════════════════════════════ */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { PATHS } from './utils/paths.js';

// ── Paths ─────────────────────────────────────────────────────────────────────

// WHY: STEAKSOAP_TEST_ROOT env var lets smoke tests point the script at a
// temp-dir fixture instead of the real repo root.
const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;

// ── Parse git worktree list --porcelain ───────────────────────────────────────

const result = spawnSync('git', ['worktree', 'list', '--porcelain'], {
  cwd: ROOT,
  encoding: 'utf-8',
});

if (result.status !== 0) {
  console.error('  ✗ Failed to list git worktrees:');
  console.error('   ', result.stderr.trim());
  process.exit(1);
}

/**
 * Parse --porcelain output into array of { worktreePath, branch } objects.
 * Each stanza is separated by a blank line.
 *
 * Example stanza:
 *   worktree /path/to/tree
 *   HEAD abcdef1234567890
 *   branch refs/heads/client/hdva
 */
function parsePorcelain(output) {
  const stanzas = output.trim().split(/\n\n+/);
  return stanzas
    .map((stanza) => {
      const lines = stanza.split('\n');
      const worktreeeLine = lines.find((l) => l.startsWith('worktree '));
      const branchLine = lines.find((l) => l.startsWith('branch '));
      if (!worktreeeLine) return null;
      const worktreePath = worktreeeLine.slice('worktree '.length).trim();
      const branchRef = branchLine ? branchLine.slice('branch '.length).trim() : '';
      // refs/heads/client/hdva → client/hdva
      const branch = branchRef.replace(/^refs\/heads\//, '');
      return { worktreePath, branch };
    })
    .filter(Boolean);
}

const worktrees = parsePorcelain(result.stdout);

// Keep only client/* branches (skip main, HEAD detached, etc.)
const clients = worktrees.filter((wt) => wt.branch.startsWith('client/'));

if (clients.length === 0) {
  console.log('');
  console.log('  No client worktrees yet. Run `pnpm client:new <name>` to start one.');
  console.log('');
  process.exit(0);
}

// ── Gather per-client metadata ────────────────────────────────────────────────

/**
 * Read the default model from a worktree's .claude/client.md.
 * Looks for a line matching `- **Model** : <value>`.
 * Falls back to "sonnet" if missing or unreadable.
 */
function readModel(worktreePath) {
  const clientMd = join(worktreePath, '.claude', 'client.md');
  if (!existsSync(clientMd)) return 'sonnet';
  try {
    const content = readFileSync(clientMd, 'utf-8');
    const match = content.match(/^\s*-\s*\*\*Model\*\*\s*:\s*(.+)$/m);
    return match ? match[1].trim() : 'sonnet';
  } catch {
    return 'sonnet';
  }
}

/**
 * Get the last commit one-liner from a worktree path.
 * Returns empty string on failure.
 */
function lastCommit(worktreePath) {
  const r = spawnSync('git', ['log', '-1', '--format=%h %s'], {
    cwd: worktreePath,
    encoding: 'utf-8',
  });
  if (r.status !== 0 || !r.stdout.trim()) return '(no commits)';
  return r.stdout.trim();
}

const rows = clients.map((wt) => {
  // Extract the client name from "client/<name>"
  const name = wt.branch.replace(/^client\//, '');
  const commit = lastCommit(wt.worktreePath);
  const model = readModel(wt.worktreePath);
  return { name, branch: wt.branch, commit, model };
});

// ── Print table ───────────────────────────────────────────────────────────────

// Column widths (minimum for headers, auto-grow with content)
const COL_NAME = Math.max(4, ...rows.map((r) => r.name.length));
const COL_BRANCH = Math.max(6, ...rows.map((r) => Math.min(r.branch.length, 20)));
const COL_COMMIT = Math.max(11, ...rows.map((r) => Math.min(r.commit.length, 38)));
const COL_MODEL = Math.max(5, ...rows.map((r) => r.model.length));

function pad(str, len) {
  if (str.length > len) return str.slice(0, len - 1) + '…';
  return str.padEnd(len);
}

const SEP = '─'.repeat(COL_NAME + COL_BRANCH + COL_COMMIT + COL_MODEL + 9);

console.log('');
console.log('  Active client worktrees :');
console.log('');
console.log(
  `  ${pad('Name', COL_NAME)}  ${pad('Branch', COL_BRANCH)}  ${pad('Last commit', COL_COMMIT)}  ${pad('Model', COL_MODEL)}`,
);
console.log(`  ${SEP}`);

for (const row of rows) {
  console.log(
    `  ${pad(row.name, COL_NAME)}  ${pad(row.branch, COL_BRANCH)}  ${pad(row.commit, COL_COMMIT)}  ${pad(row.model, COL_MODEL)}`,
  );
}

console.log('');
