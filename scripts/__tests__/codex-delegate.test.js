import { execSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { codexArgs } from '../codex-delegate.js';

/* ═══════════════════════════════════════════════════════════════
   codex-delegate.js tests — the headless+sandboxed invocation shape
   and the prompt (worker context + task imperative). The real codex
   call is not exercised here (network + cost); the live end-to-end
   proof is run by hand and pasted into the PR.
   ═══════════════════════════════════════════════════════════════ */

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = resolve(__dirname, '../codex-delegate.js');

describe('codex-delegate — invocation shape', () => {
  it('runs codex headless, sandboxed to the workspace, rooted at the repo, stdin prompt', () => {
    expect(codexArgs('/repo/x')).toEqual(['exec', '--sandbox', 'workspace-write', '-C', '/repo/x', '-']);
  });
});

describe('codex-delegate — prompt (--dry)', () => {
  let root;
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'steaksoap-codex-'));
    mkdirSync(join(root, '.claude/rules'), { recursive: true });
    writeFileSync(join(root, '.claude/rules/components.md'), '---\npaths: ["src/components/**"]\n---\nCOMPONENTS_RULE\n');
    mkdirSync(join(root, '.claude/dispatch/specs'), { recursive: true });
    writeFileSync(
      join(root, '.claude/dispatch/specs/c1.json'),
      JSON.stringify({ id: 'c1', class: 'R1', model: 'codex', goal: 'GOAL_CODEX_xyz', allowed_paths: ['src/components/ui/Z.tsx'], rules: ['components.md'], acceptance: ['pnpm validate:fast'], forbidden: [] }),
    );
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('feeds Codex the worker context + the contract goal + a touch-only-allowed_paths imperative', () => {
    const out = execSync(`node ${JSON.stringify(scriptPath)} --spec c1 --dry`, {
      cwd: root,
      env: { ...process.env, STEAKSOAP_TEST_ROOT: root },
      encoding: 'utf-8',
    });
    expect(out).toMatch(/Worker conventions/); // the P14 thin context
    expect(out).toMatch(/GOAL_CODEX_xyz/); // the contract
    expect(out).toMatch(/DO THE TASK/);
    expect(out).toMatch(/ONLY the files in allowed_paths/);
    expect(out).not.toMatch(/NORTH-STAR/); // no bible leakage
  });
});
