#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CODEX-DELEGATE — dispatch a bounded task to Codex (GPT-5.x), confined.

   The "framed-complex" rung of the intelligence ladder
   (memory/decisions/2026-06-10-intelligence-ladder-doctrine.md): Opus
   orchestrates + controls, Codex is "puissant SI il est contrôlé". This is
   the control wiring — it feeds Codex the SAME thin worker context a
   haiku/sonnet worker gets (P14) + the spec contract, runs it headless and
   SANDBOXED to the workspace, and leaves the tree changed for the
   orchestrator to gate with `dispatch-verify` (which confines to
   allowed_paths + runs acceptance). Codex never self-accepts; the proof is
   the verifier's output, not Codex's word.

   Usage:
     node scripts/codex-delegate.js --spec <id>          run it
     node scripts/codex-delegate.js --spec <id> --dry    print the prompt only
   Then ALWAYS: node scripts/dispatch-verify.js <id>     (the §4 proof)

   Prereq: the `codex` CLI (`@openai/codex`) on PATH, authed via ~/.codex.
   ═══════════════════════════════════════════════════════════════ */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { buildWorkerContext } from './build-worker-context.js';
import { PATHS } from './utils/paths.js';

const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

export function buildPrompt(spec) {
  const { body } = buildWorkerContext(spec);
  // The worker context already carries the contract + the return-control rule.
  // Append the imperative so Codex acts rather than just reads.
  return (
    `${body}\n\n--- DO THE TASK ---\n` +
    `Execute the GOAL above, editing ONLY the files in allowed_paths. Run the ` +
    `acceptance commands and make them pass. If you need a path outside ` +
    `allowed_paths, STOP and say so — never widen the scope yourself. Do not ` +
    `commit; the orchestrator verifies and commits.`
  );
}

// The codex invocation: headless (`exec`), sandboxed to the workspace (it may
// write files in the repo but nothing system-wide), rooted at the repo. Model
// comes from ~/.codex/config.toml (gpt-5.x). Confinement to allowed_paths is
// NOT trusted to the sandbox — dispatch-verify enforces it after.
export function codexArgs(root = ROOT) {
  return ['exec', '--sandbox', 'workspace-write', '-C', root, '-'];
}

function main() {
  const id = arg('--spec');
  if (!id) {
    console.error('  ✗ codex-delegate: missing --spec <id>');
    process.exit(2);
  }
  let spec;
  try {
    spec = JSON.parse(readFileSync(join(ROOT, '.claude/dispatch/specs', `${id}.json`), 'utf-8'));
  } catch {
    console.error(`  ✗ codex-delegate: no spec at .claude/dispatch/specs/${id}.json`);
    process.exit(2);
  }

  const prompt = buildPrompt(spec);

  if (process.argv.includes('--dry')) {
    process.stdout.write(prompt + '\n');
    return;
  }

  console.log(`\n  → delegating ${id} to Codex (sandbox: workspace-write, model: config default)\n`);
  const r = spawnSync('codex', codexArgs(), { input: prompt, stdio: ['pipe', 'inherit', 'inherit'], cwd: ROOT });
  if (r.error) {
    console.error(`\n  ✗ codex not runnable (${r.error.code}). Is @openai/codex on PATH + authed?`);
    process.exit(2);
  }
  console.log(
    `\n  Codex finished (exit ${r.status}). Tree is changed but NOT accepted.\n` +
      `  Now gate it:  node scripts/dispatch-verify.js ${id}\n`,
  );
  process.exit(r.status ?? 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
