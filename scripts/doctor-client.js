#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   DOCTOR-CLIENT — preflight gate for client delivery work

   Audits the 6 prerequisites that must be green before you can
   meaningfully run /wire-content, /translate, /sync-content or cut
   a pre-prod release for a client :

     1. .env.local exists
     2. VITE_SANITY_PROJECT_ID is set
     3. SANITY_WRITE_TOKEN is set (required to push content)
     4. VITE_SANITY_DATASET is set (defaults to staging)
     5. .claude/client.md has at least a Name filled (no placeholder)
     6. The Sanity project URL returns HTTP 2xx (network reachable)

   Modes :
     pnpm doctor:client           → audit + report, exit 0 on warn
     pnpm doctor:client --strict  → exit 1 on any failure (CI gate)
     pnpm doctor:client --fix     → interactive prompt to fill blanks

   Called automatically by /wire-content step 0. Refuses to proceed
   if strict audit fails — no more silent dry-runs with missing token.
   ═══════════════════════════════════════════════════════════════ */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { join } from 'node:path';

import { PATHS } from './utils/paths.js';

const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;
const STRICT = process.argv.includes('--strict');
const FIX = process.argv.includes('--fix');

const ENV_LOCAL = join(ROOT, '.env.local');
const CLIENT_MD = join(ROOT, '.claude/client.md');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function parseEnvFile(content) {
  const env = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return env;
}

function readEnv() {
  if (!existsSync(ENV_LOCAL)) return {};
  return parseEnvFile(readFileSync(ENV_LOCAL, 'utf-8'));
}

function clientNameFromMd() {
  if (!existsSync(CLIENT_MD)) return null;
  const content = readFileSync(CLIENT_MD, 'utf-8');
  const m = content.match(/\*\*Nom\*\*[ \t]*:[ \t]*(.*)$/im);
  if (!m) return null;
  const raw = m[1].trim();
  if (!raw || raw.startsWith('(')) return null;
  return raw;
}

async function promptFor(label, current, isSecret = false) {
  const rl = createInterface({ input: stdin, output: stdout });
  const hint = current ? ` ${DIM}(current: ${isSecret ? '***' : current}, press enter to keep)${RESET}` : '';
  const answer = (await rl.question(`  ${label}${hint}: `)).trim();
  rl.close();
  return answer || current || '';
}

function upsertEnvVar(content, key, value) {
  const line = `${key}=${value}`;
  const rx = new RegExp(`^${key}\\s*=.*$`, 'm');
  if (rx.test(content)) return content.replace(rx, line);
  return content.trimEnd() + '\n' + line + '\n';
}

async function runFix(env) {
  console.log(`\n  ${YELLOW}Interactive fix mode${RESET} — fill missing Sanity env vars\n`);
  const next = { ...env };
  next.VITE_SANITY_PROJECT_ID = await promptFor(
    'Sanity project ID',
    env.VITE_SANITY_PROJECT_ID,
  );
  next.SANITY_WRITE_TOKEN = await promptFor(
    'Sanity write token (sk... from manage.sanity.io)',
    env.SANITY_WRITE_TOKEN,
    true,
  );
  next.VITE_SANITY_DATASET = await promptFor(
    'Sanity dataset',
    env.VITE_SANITY_DATASET || 'staging',
  );

  let body = existsSync(ENV_LOCAL) ? readFileSync(ENV_LOCAL, 'utf-8') : '';
  for (const k of ['VITE_SANITY_PROJECT_ID', 'SANITY_WRITE_TOKEN', 'VITE_SANITY_DATASET']) {
    if (next[k]) body = upsertEnvVar(body, k, next[k]);
  }
  writeFileSync(ENV_LOCAL, body, 'utf-8');
  console.log(`\n  ${GREEN}✓${RESET} .env.local updated\n`);
  return next;
}

async function checkSanityReachable(projectId) {
  if (!projectId) return { ok: false, reason: 'no project id' };
  try {
    const res = await fetch(`https://${projectId}.api.sanity.io/v2024-06-01/ping`);
    if (res.ok) return { ok: true };
    return { ok: false, reason: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

function report(label, ok, hint) {
  const mark = ok ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  console.log(`  ${mark} ${label}${hint ? `  ${DIM}${hint}${RESET}` : ''}`);
}

async function main() {
  console.log(`\n  Doctor-client — preflight audit (${STRICT ? 'strict' : 'warn'} mode)\n`);

  let env = readEnv();

  if (FIX) env = await runFix(env);

  const hasEnv = existsSync(ENV_LOCAL);
  const hasProject = Boolean(env.VITE_SANITY_PROJECT_ID);
  const hasToken = Boolean(env.SANITY_WRITE_TOKEN);
  const dataset = env.VITE_SANITY_DATASET || '';
  const clientName = clientNameFromMd();

  report('.env.local exists', hasEnv, hasEnv ? '' : 'run `pnpm doctor:client --fix`');
  report('VITE_SANITY_PROJECT_ID set', hasProject);
  report('SANITY_WRITE_TOKEN set', hasToken, hasToken ? '' : 'without it /wire-content runs dry');
  report(
    'VITE_SANITY_DATASET set',
    Boolean(dataset),
    dataset || 'defaults to staging on missing',
  );
  report('.claude/client.md Name filled', Boolean(clientName), clientName || 'placeholder detected');

  let network = { ok: false, reason: 'skipped' };
  if (hasProject) {
    network = await checkSanityReachable(env.VITE_SANITY_PROJECT_ID);
    report(
      `Sanity reachable (${env.VITE_SANITY_PROJECT_ID})`,
      network.ok,
      network.ok ? '' : network.reason,
    );
  } else {
    report('Sanity reachable', false, 'no project id, skipping');
  }

  const failures = [
    !hasEnv,
    !hasProject,
    !hasToken,
    !dataset,
    !clientName,
    hasProject && !network.ok,
  ].filter(Boolean).length;

  console.log('');
  if (failures === 0) {
    console.log(`  ${GREEN}All 6 checks passed — you can run /wire-content${RESET}\n`);
    process.exit(0);
  }

  console.log(
    `  ${failures} check(s) failing. Run ${YELLOW}pnpm doctor:client --fix${RESET} to resolve interactively.\n`,
  );

  if (STRICT) process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error(`\n  ${RED}doctor-client failed:${RESET} ${err.message}\n`);
  process.exit(1);
});
