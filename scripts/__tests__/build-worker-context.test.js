import { execSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

/* ═══════════════════════════════════════════════════════════════
   build-worker-context.js tests — rule selection by allowed_paths,
   always-loaded exclusion, the 9k ceiling, contract-last ordering.
   Spawned against fixture repos (STEAKSOAP_TEST_ROOT) so the path
   frontmatter → allowed_paths matching runs for real.
   ═══════════════════════════════════════════════════════════════ */

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = resolve(__dirname, '../build-worker-context.js');

let root;

function rule(name, paths, body) {
  mkdirSync(join(root, '.claude/rules'), { recursive: true });
  writeFileSync(join(root, '.claude/rules', name), `---\npaths: ${JSON.stringify(paths)}\n---\n\n${body}\n`);
}

function spec(obj) {
  mkdirSync(join(root, '.claude/dispatch/specs'), { recursive: true });
  writeFileSync(join(root, '.claude/dispatch/specs', `${obj.id}.json`), JSON.stringify(obj));
}

function run(id) {
  const env = { ...process.env, STEAKSOAP_TEST_ROOT: root };
  try {
    return { status: 0, out: execSync(`node ${JSON.stringify(scriptPath)} --spec ${id}`, { cwd: root, env, encoding: 'utf-8' }) };
  } catch (e) {
    return { status: e.status ?? 1, out: String(e.stdout || '') + String(e.stderr || '') };
  }
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'steaksoap-worker-'));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('build-worker-context — rule selection', () => {
  it('includes a rule whose glob matches allowed_paths, excludes one that does not', () => {
    rule('components.md', ['src/components/**', 'src/features/**'], 'COMPONENTS_RULE_MARKER');
    rule('api.md', ['src/lib/**', 'src/hooks/**'], 'API_RULE_MARKER');
    spec({ id: 'r1-button', class: 'R1', model: 'sonnet', goal: 'add a Badge variant', allowed_paths: ['src/components/ui/Badge.tsx'], acceptance: ['pnpm validate:fast'], forbidden: ['package.json'] });
    const r = run('r1-button');
    expect(r.status).toBe(0);
    expect(r.out).toMatch(/COMPONENTS_RULE_MARKER/);
    expect(r.out).not.toMatch(/API_RULE_MARKER/);
  });

  it('honours an explicit spec.rules override (orchestrator precision) over auto-match', () => {
    rule('components.md', ['src/components/**'], 'COMPONENTS_RULE_MARKER');
    rule('styling.md', ['src/**/*.tsx'], 'STYLING_RULE_MARKER');
    rule('testing.md', ['src/**/*.test.*'], 'TESTING_RULE_MARKER');
    // auto-match would pull components+styling; the override pins exactly one.
    spec({ id: 'r1-pin', class: 'R1', model: 'sonnet', goal: 'pin', allowed_paths: ['src/components/ui/Z.tsx'], rules: ['components.md'], acceptance: ['pnpm validate:fast'], forbidden: [] });
    const r = run('r1-pin');
    expect(r.out).toMatch(/COMPONENTS_RULE_MARKER/);
    expect(r.out).not.toMatch(/STYLING_RULE_MARKER/);
  });

  it('excludes always-loaded rules (paths ["**"]) — the digest replaces the bible', () => {
    rule('critical.md', ['**'], 'ALWAYS_LOADED_MARKER');
    rule('components.md', ['src/components/**'], 'COMPONENTS_RULE_MARKER');
    spec({ id: 'r0-x', class: 'R0', model: 'haiku', goal: 'rename', allowed_paths: ['src/components/ui/Card.tsx'], acceptance: ['pnpm validate:fast'], forbidden: [] });
    const r = run('r0-x');
    expect(r.out).not.toMatch(/ALWAYS_LOADED_MARKER/);
    expect(r.out).toMatch(/COMPONENTS_RULE_MARKER/);
  });
});

describe('build-worker-context — structure + ceiling', () => {
  it('puts the contract + return-control reminder last, and the conventions digest first', () => {
    rule('components.md', ['src/components/**'], 'COMPONENTS_RULE_MARKER');
    spec({ id: 'r1-y', class: 'R1', model: 'sonnet', goal: 'GOAL_MARKER_xyz', allowed_paths: ['src/components/ui/Tabs.tsx'], acceptance: ['pnpm validate:fast'], forbidden: [] });
    const r = run('r1-y');
    expect(r.out).toMatch(/GOAL_MARKER_xyz/);
    const digestAt = r.out.indexOf('Worker conventions');
    const goalAt = r.out.indexOf('GOAL_MARKER_xyz');
    const reminderAt = r.out.indexOf('return control with the reason');
    expect(digestAt).toBeGreaterThanOrEqual(0);
    expect(digestAt).toBeLessThan(goalAt); // stable digest before the per-task contract
    expect(reminderAt).toBeGreaterThan(goalAt); // return-control reminder last
  });

  it('fails over the context ceiling with a per-section breakdown', () => {
    rule('components.md', ['src/components/**'], 'BLOAT '.repeat(3000)); // ~18k rule > 16k ceiling
    spec({ id: 'r1-big', class: 'R1', model: 'sonnet', goal: 'big', allowed_paths: ['src/components/ui/Big.tsx'], acceptance: ['pnpm validate:fast'], forbidden: [] });
    const r = run('r1-big');
    expect(r.status).toBe(1);
    expect(r.out).toMatch(/ceiling/);
    expect(r.out).toMatch(/rule:components\.md/);
  });

  it('contains no NORTH-STAR / OWNER / memory leakage', () => {
    rule('components.md', ['src/components/**'], 'COMPONENTS_RULE_MARKER');
    spec({ id: 'r0-clean', class: 'R0', model: 'haiku', goal: 'x', allowed_paths: ['src/components/ui/A.tsx'], acceptance: ['pnpm validate:fast'], forbidden: [] });
    const r = run('r0-clean');
    expect(r.out).not.toMatch(/NORTH-STAR|OWNER\.md|Memory snapshot/);
  });
});
