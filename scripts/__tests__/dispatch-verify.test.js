import { execSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

/* ═══════════════════════════════════════════════════════════════
   dispatch-verify.js smoke tests — confinement, acceptance, cheat
   markers, marker+ledger side effects. Each case builds a real tiny
   git repo in a tmpdir (STEAKSOAP_TEST_ROOT) so the script's git diff
   confinement runs against actual history.
   ═══════════════════════════════════════════════════════════════ */

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = resolve(__dirname, '../dispatch-verify.js');

let root;

function g(cmd) {
  execSync(`git ${cmd}`, { cwd: root, stdio: 'ignore' });
}

function seedRepo({ trackedFiles = {}, spec }) {
  g('init -q');
  g('config user.email t@t.dev');
  g('config user.name t');
  g('config commit.gpgsign false');
  for (const [rel, content] of Object.entries(trackedFiles)) {
    mkdirSync(join(root, dirname(rel)), { recursive: true });
    writeFileSync(join(root, rel), content);
  }
  g('add -A');
  g('commit -q -m base --no-verify');
  mkdirSync(join(root, '.claude/dispatch/specs'), { recursive: true });
  writeFileSync(join(root, '.claude/dispatch/specs', `${spec.id}.json`), JSON.stringify(spec));
}

function write(rel, content) {
  mkdirSync(join(root, dirname(rel)), { recursive: true });
  writeFileSync(join(root, rel), content);
}

// Strip ANSI colour codes so assertions match across the tag→label boundary
// (the output is `PASS\x1b[0m  confinement`, the reset code splits the words).
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

// execSync throws on non-zero exit — wrap to capture stdout + status both ways.
function runCapture(id) {
  const env = { ...process.env, STEAKSOAP_TEST_ROOT: root };
  try {
    const stdout = execSync(`node ${JSON.stringify(scriptPath)} ${id}`, { cwd: root, env, encoding: 'utf-8' });
    return { status: 0, stdout: stripAnsi(stdout) };
  } catch (e) {
    return { status: e.status ?? 1, stdout: stripAnsi(String(e.stdout || '')) };
  }
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'steaksoap-dispatch-'));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

const PASS_CMD = `node -e "process.exit(0)"`;
const FAIL_CMD = `node -e "process.exit(1)"`;

describe('dispatch-verify — confined + acceptance green', () => {
  it('PASS: writes the verified marker + a ledger line', () => {
    seedRepo({
      trackedFiles: { 'src/Button.tsx': 'export const Button = () => null;\n' },
      spec: { id: 'r0-pass', class: 'R0', model: 'haiku', attempt: 1, base: 'main', allowed_paths: ['src/Button.tsx'], acceptance: [PASS_CMD], forbidden: [] },
    });
    write('src/Button.tsx', 'export const Button = () => null; // tweaked\n');
    const r = runCapture('r0-pass');
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/PASS\s+confinement/);
    expect(r.stdout).toMatch(/✓ PASS — work accepted/);
    expect(existsSync(join(root, '.claude/dispatch/.verified-r0-pass'))).toBe(true);
    const ledger = readFileSync(join(root, '.claude/ledger/dispatch.jsonl'), 'utf-8').trim();
    expect(JSON.parse(ledger)).toMatchObject({ id: 'r0-pass', model: 'haiku', verified: true });
  });
});

describe('dispatch-verify — confinement', () => {
  it('FAIL: a file outside allowed_paths is named, no marker written', () => {
    seedRepo({
      trackedFiles: { 'src/Button.tsx': 'x\n' },
      spec: { id: 'r0-escape', class: 'R0', model: 'haiku', attempt: 1, base: 'main', allowed_paths: ['src/Button.tsx'], acceptance: [PASS_CMD], forbidden: [] },
    });
    write('src/Button.tsx', 'y\n');
    write('docs/leak.md', 'escaped scope\n'); // untracked, out of scope
    const r = runCapture('r0-escape');
    expect(r.status).toBe(1);
    expect(r.stdout).toMatch(/FAIL\s+confinement/);
    expect(r.stdout).toMatch(/docs\/leak\.md/);
    expect(existsSync(join(root, '.claude/dispatch/.verified-r0-escape'))).toBe(false);
  });

  it('FAIL: a forbidden glob match is flagged even if allowed is broad', () => {
    seedRepo({
      trackedFiles: { 'src/a.ts': 'x\n', 'package.json': '{}\n' },
      spec: { id: 'r1-forbidden', class: 'R1', model: 'sonnet', attempt: 1, base: 'main', allowed_paths: ['**'], acceptance: [PASS_CMD], forbidden: ['package.json'] },
    });
    write('package.json', '{"hacked":true}\n');
    const r = runCapture('r1-forbidden');
    expect(r.status).toBe(1);
    expect(r.stdout).toMatch(/forbidden touched: package\.json/);
  });
});

describe('dispatch-verify — acceptance', () => {
  it('FAIL: a red acceptance command fails the run', () => {
    seedRepo({
      trackedFiles: { 'src/Button.tsx': 'x\n' },
      spec: { id: 'r0-redtest', class: 'R0', model: 'haiku', attempt: 1, base: 'main', allowed_paths: ['src/Button.tsx'], acceptance: [FAIL_CMD], forbidden: [] },
    });
    write('src/Button.tsx', 'y\n');
    const r = runCapture('r0-redtest');
    expect(r.status).toBe(1);
    expect(r.stdout).toMatch(/FAIL\s+acceptance/);
  });

  it('FAIL: an empty acceptance list is rejected (a task-specific test is required)', () => {
    seedRepo({
      trackedFiles: { 'src/Button.tsx': 'x\n' },
      spec: { id: 'r0-noaccept', class: 'R0', model: 'haiku', attempt: 1, base: 'main', allowed_paths: ['src/Button.tsx'], acceptance: [], forbidden: [] },
    });
    write('src/Button.tsx', 'y\n');
    const r = runCapture('r0-noaccept');
    expect(r.status).toBe(1);
    expect(r.stdout).toMatch(/no acceptance command/);
  });
});

describe('dispatch-verify — --clear (stale-marker escape hatch)', () => {
  it('removes verified markers (all, or a targeted id)', () => {
    mkdirSync(join(root, '.claude/dispatch'), { recursive: true });
    writeFileSync(join(root, '.claude/dispatch/.verified-aaa'), 'x');
    writeFileSync(join(root, '.claude/dispatch/.verified-bbb'), 'x');
    expect(runCapture('--clear bbb').status).toBe(0);
    expect(existsSync(join(root, '.claude/dispatch/.verified-aaa'))).toBe(true);
    expect(existsSync(join(root, '.claude/dispatch/.verified-bbb'))).toBe(false);
    runCapture('--clear');
    expect(existsSync(join(root, '.claude/dispatch/.verified-aaa'))).toBe(false);
  });
});

describe('dispatch-verify — cheat markers (WARN, not FAIL)', () => {
  it('WARN: an added it.only is surfaced but the run still PASSes', () => {
    seedRepo({
      trackedFiles: { 'src/__tests__/Button.test.tsx': "it('works', () => {});\n" },
      spec: { id: 'r1-cheat', class: 'R1', model: 'sonnet', attempt: 1, base: 'main', allowed_paths: ['src/__tests__/Button.test.tsx'], acceptance: [PASS_CMD], forbidden: [] },
    });
    write('src/__tests__/Button.test.tsx', "it.only('works', () => {});\n");
    const r = runCapture('r1-cheat');
    expect(r.status).toBe(0); // WARN does not fail
    expect(r.stdout).toMatch(/WARN\s+cheat/);
    expect(r.stdout).toMatch(/test \.only/);
  });
});
