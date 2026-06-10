import { execSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildReport } from '../dispatch-report.js';

/* ═══════════════════════════════════════════════════════════════
   dispatch-report.js tests — pure aggregation via buildReport(rows),
   plus a spawned run proving a corrupt ledger line is skipped (not a
   crash on history) and the empty case is handled.
   ═══════════════════════════════════════════════════════════════ */

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = resolve(__dirname, '../dispatch-report.js');

const ROWS = [
  { id: 't1', class: 'R0', model: 'haiku', attempt: 1, verified: true, checks: { cheat_warn: false } },
  { id: 't2', class: 'R1', model: 'haiku', attempt: 1, verified: false, fail: 'acceptance', escalated_to: 'sonnet' },
  { id: 't2', class: 'R1', model: 'sonnet', attempt: 2, verified: true, checks: { cheat_warn: true } },
  { id: 't3', class: 'R0', model: 'haiku', attempt: 1, verified: true, checks: { cheat_warn: false } },
  { id: 't4', class: 'R1', model: 'haiku', attempt: 1, verified: false, escalated_to: 'sonnet' },
  { id: 't4', class: 'R1', model: 'sonnet', attempt: 2, verified: true },
];

describe('dispatch-report — aggregation', () => {
  const r = buildReport(ROWS);

  it('counts attempts, first-try passes, and escalations per model', () => {
    expect(r.models.get('haiku')).toMatchObject({ attempts: 4, first: 4, pass1: 2, escal: 0 });
    expect(r.models.get('sonnet').escal).toBe(2); // received both escalations
    expect(r.models.get('sonnet').first).toBe(0); // sonnet only ran as attempt 2
  });

  it('counts distinct tasks and finished-at-intended-model per class', () => {
    expect(r.taskCount).toBe(4);
    expect(r.classes.get('R0').ids.size).toBe(2);
    expect(r.classes.get('R0').finished.size).toBe(2); // both R0 done by haiku
    expect(r.classes.get('R1').finished.size).toBe(2); // both R1 finished at sonnet (intended)
  });

  it('collects cheat_warn ids', () => {
    expect(r.cheats).toContain('t2');
    expect(r.cheats).toHaveLength(1);
  });
});

describe('dispatch-report — ledger resilience (spawned)', () => {
  let root;
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'steaksoap-report-'));
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  function run() {
    const env = { ...process.env, STEAKSOAP_TEST_ROOT: root };
    return execSync(`node ${JSON.stringify(scriptPath)}`, { cwd: root, env, encoding: 'utf-8' });
  }

  it('skips a corrupt line with a warning instead of crashing', () => {
    mkdirSync(join(root, '.claude/ledger'), { recursive: true });
    writeFileSync(
      join(root, '.claude/ledger/dispatch.jsonl'),
      [
        JSON.stringify({ id: 'a', class: 'R0', model: 'haiku', attempt: 1, verified: true }),
        '{ this is not json',
        JSON.stringify({ id: 'b', class: 'R0', model: 'haiku', attempt: 1, verified: true }),
      ].join('\n') + '\n',
    );
    const out = run();
    expect(out).toMatch(/DISPATCH REPORT — 2 attempt/);
    expect(out).toMatch(/1 unparseable ledger line/);
  });

  it('handles an absent ledger gracefully', () => {
    expect(run()).toMatch(/ledger empty/);
  });
});
