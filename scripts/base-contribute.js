#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   BASE:CONTRIBUTE — propose template-bound changes upstream

   Mirror of base:update — where base:update pulls from steaksoap
   into the client, base:contribute proposes client changes back to
   steaksoap as a branch + PR.

   Eligible:
   - .claude/rules/**       (always template-owned)
   - .claude/commands/**    (always template-owned)
   - .claude/agents/**      (always template-owned)
   - scripts/**             (template-owned)
   - .claude/memory/{decisions,feedback,patterns,frictions}/*.md
                            IFF tag #template OR frontmatter scope:template

   Never:
   - .claude/memory/sessions/**   (client-specific context)
   - .claude/memory/{INDEX,MEMORY}.md (auto-generated)
   - .claude/client.md            (client brand voice)
   - any file with #client-specific tag / scope:client-specific

   Usage:
     pnpm base:contribute                   # since last base:update
     pnpm base:contribute --since <ref>
     pnpm base:contribute --dry-run
     pnpm base:contribute --no-pr
     pnpm base:contribute --kind rule|memory|command|agent|script|all
     pnpm base:contribute --title "..." --topic <slug>
   ═══════════════════════════════════════════════════════════════ */

import { execSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

import { PATHS } from './utils/paths.js';

const root = PATHS.root;
const BASE_REPO_OWNER = 'Mircooo';
const BASE_REPO_NAME = 'steaksoap';
const BASE_REMOTE = 'base';
const BASE_URL = `https://github.com/${BASE_REPO_OWNER}/${BASE_REPO_NAME}.git`;
const CACHE_DIR = resolve(root, '.upstream-cache', BASE_REPO_NAME);
const HISTORY_PATH = resolve(root, '.upstream-cache', 'history.ndjson');

const TEMPLATE_PATHS = ['.claude/rules/', '.claude/commands/', '.claude/agents/', 'scripts/'];
const CONDITIONAL_MEMORY = [
  '.claude/memory/decisions/',
  '.claude/memory/feedback/',
  '.claude/memory/patterns/',
  '.claude/memory/frictions/',
];
const NEVER_PROPOSE = [
  '.claude/memory/sessions/',
  '.claude/memory/INDEX.md',
  '.claude/memory/MEMORY.md',
  '.claude/client.md',
  '.env',
  '.env.local',
];

const SECRET_PATTERNS = [
  /\b(?:TOKEN|SECRET|API[_-]?KEY|PASSWORD|PRIVATE[_-]?KEY)\b\s*[:=]\s*['"]?[A-Za-z0-9_\-]{16,}/i,
  /\b(?:pk_live|sk_live|rk_live|sk_test_[A-Za-z0-9]{20,})\b/,
  /-----BEGIN\s+(RSA|OPENSSH|EC|PGP|PRIVATE)\s+KEY-----/,
];

// Files whose contents reference the secret patterns themselves (this script,
// security tests, docs). Match by path suffix OR by the presence of the
// `base-contribute:no-scan` marker at the top of the file.
const SCAN_SKIP_PATHS = ['scripts/base-contribute.js'];
const SCAN_SKIP_MARKER = 'base-contribute:no-scan';

const args = parseArgs(process.argv.slice(2));
const run = (cmd, cwd = root) => execSync(cmd, { cwd, encoding: 'utf-8' }).trim();
const runVisible = (cmd, cwd = root) => execSync(cmd, { stdio: 'inherit', cwd });
const log = (msg = '') => process.stdout.write(msg + '\n');

main().catch(e => {
  process.stderr.write(`  ✗ ${e.message}\n`);
  process.exit(1);
});

async function main() {
  log('\n  Base Contribute — propose template changes to steaksoap\n');

  preflight();
  const modified = detectModifiedFiles(args.since);
  const eligible = filterEligible(modified);

  if (!eligible.length) {
    log('  ✓ Nothing eligible to propose.\n');
    process.exit(0);
  }

  validateContents(eligible);
  const { title, body, topic } = composeProposal(eligible);

  if (args.dryRun) {
    log('  ── DRY RUN ──\n');
    log(`  Title: ${title}`);
    log(`  Topic: ${topic}`);
    log(`  Files (${eligible.length}):`);
    eligible.forEach(f => log(`    ${f}`));
    log('\n  ── PR body ──\n');
    log(body);
    log('\n  ── END ──\n');
    process.exit(0);
  }

  ensureCache();
  const branch = stageBranch(eligible, topic, title, body);

  if (args.noPr) {
    log(`\n  ✓ Branch pushed: ${branch} (no PR opened)\n`);
    process.exit(0);
  }

  const prUrl = openPR(branch, title, body);
  appendHistory({ at: new Date().toISOString(), branch, prUrl, files: eligible });
  log(`\n  ✓ Pull request: ${prUrl}\n`);
}

function parseArgs(argv) {
  const out = {
    since: null,
    dryRun: false,
    noPr: false,
    kind: 'all',
    title: null,
    topic: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--no-pr') out.noPr = true;
    else if (a === '--since') out.since = argv[++i];
    else if (a === '--kind') out.kind = argv[++i];
    else if (a === '--title') out.title = argv[++i];
    else if (a === '--topic') out.topic = argv[++i];
  }
  return out;
}

function preflight() {
  const status = run('git status --porcelain');
  if (status) throw new Error('Working tree not clean. Commit or stash first.');
  try {
    execSync('gh auth status', { stdio: 'pipe' });
  } catch {
    throw new Error('gh CLI not authenticated. Run `gh auth login` first.');
  }
  const remotes = run('git remote').split('\n').filter(Boolean);
  if (!remotes.includes(BASE_REMOTE)) {
    log(`  → Adding remote "${BASE_REMOTE}"...`);
    run(`git remote add ${BASE_REMOTE} ${BASE_URL}`);
  }
  log('  → Fetching base/main...');
  runVisible(`git fetch ${BASE_REMOTE} main`);
}

function detectModifiedFiles(sinceArg) {
  let since = sinceArg;
  if (!since) {
    try {
      since = run(`git merge-base HEAD ${BASE_REMOTE}/main`);
    } catch {
      throw new Error(
        'Cannot find merge-base with base/main. Run `pnpm base:update` first or pass --since <ref>.',
      );
    }
  }
  log(`  → Diffing against ${since.slice(0, 10)}...`);
  const diff = run(`git diff ${since}..HEAD --name-only --diff-filter=ACMR`);
  return diff.split('\n').filter(Boolean);
}

function filterEligible(files) {
  const kind = args.kind;
  const out = [];
  for (const f of files) {
    if (NEVER_PROPOSE.some(p => f.startsWith(p))) continue;
    if (kind !== 'all') {
      const match =
        (kind === 'rule' && f.startsWith('.claude/rules/')) ||
        (kind === 'command' && f.startsWith('.claude/commands/')) ||
        (kind === 'agent' && f.startsWith('.claude/agents/')) ||
        (kind === 'script' && f.startsWith('scripts/')) ||
        (kind === 'memory' && CONDITIONAL_MEMORY.some(p => f.startsWith(p)));
      if (!match) continue;
    }

    if (TEMPLATE_PATHS.some(p => f.startsWith(p))) {
      out.push(f);
      continue;
    }
    if (CONDITIONAL_MEMORY.some(p => f.startsWith(p))) {
      if (!f.endsWith('.md')) continue;
      const fm = parseFrontmatter(readFileSync(resolve(root, f), 'utf-8'));
      if (!fm) continue;
      const tags = Array.isArray(fm.tags) ? fm.tags : [];
      if (tags.includes('#client-specific') || fm.scope === 'client-specific') continue;
      if (tags.includes('#template') || fm.scope === 'template') out.push(f);
    }
  }
  return out;
}

function parseFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    if (raw.startsWith('[')) {
      fm[key] = raw
        .slice(1, -1)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    } else {
      fm[key] = raw.trim();
    }
  }
  return fm;
}

function validateContents(files) {
  for (const f of files) {
    const content = readFileSync(resolve(root, f), 'utf-8');
    const skipScan =
      SCAN_SKIP_PATHS.includes(f) || content.slice(0, 500).includes(SCAN_SKIP_MARKER);
    if (!skipScan) {
      for (const pat of SECRET_PATTERNS) {
        if (pat.test(content)) {
          throw new Error(`Secret-looking pattern detected in ${f}. Aborting.`);
        }
      }
    }
    if (f.endsWith('.md') && CONDITIONAL_MEMORY.some(p => f.startsWith(p))) {
      const fm = parseFrontmatter(content);
      if (!fm) throw new Error(`Missing YAML frontmatter in ${f}`);
      for (const k of ['id', 'date', 'type', 'tags', 'scope', 'status']) {
        if (!fm[k]) throw new Error(`Missing required frontmatter field "${k}" in ${f}`);
      }
    }
  }
}

function detectClientSlug() {
  try {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
    return (pkg.name || 'unknown').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
  } catch {
    return 'unknown';
  }
}

function composeProposal(files) {
  const clientSlug = detectClientSlug();
  let topic = args.topic;
  if (!topic) {
    const rule = files.find(f => f.startsWith('.claude/rules/'));
    if (rule) topic = rule.split('/').pop().replace(/\.md$/, '');
    else {
      const fb = files.find(f => f.startsWith('.claude/memory/feedback/'));
      if (fb) {
        topic = fb
          .split('/')
          .pop()
          .replace(/\.md$/, '')
          .replace(/^\d{4}-\d{2}-\d{2}-/, '');
      } else topic = 'memory-batch';
    }
  }
  topic = slugify(topic).slice(0, 40) || 'memory-batch';

  const title =
    args.title ??
    `chore(template): propose ${files.length} artefact(s) from ${clientSlug} — ${topic}`;

  const rules = files.filter(f => f.startsWith('.claude/rules/'));
  const commands = files.filter(f => f.startsWith('.claude/commands/'));
  const agents = files.filter(f => f.startsWith('.claude/agents/'));
  const memory = files.filter(f => f.startsWith('.claude/memory/'));
  const scripts = files.filter(f => f.startsWith('scripts/'));

  let latestSession = '';
  const sessionsPath = resolve(root, '.claude/memory/sessions');
  if (existsSync(sessionsPath)) {
    const sorted = readdirSync(sessionsPath)
      .filter(n => /^\d{4}-\d{2}-\d{2}/.test(n))
      .sort()
      .reverse();
    if (sorted[0]) latestSession = sorted[0];
  }

  const lines = ['## Source', '', `- Project : \`${clientSlug}\``];
  if (latestSession) {
    lines.push(
      `- Latest session on client (not proposed — client-specific) : \`.claude/memory/sessions/${latestSession}\``,
    );
  }
  lines.push('', '## Artefacts', '');

  const section = (name, arr) => {
    if (!arr.length) return;
    lines.push(`### ${name}`);
    arr.forEach(f => lines.push(`- \`${f}\``));
    lines.push('');
  };
  section('Rules', rules);
  section('Commands', commands);
  section('Agents', agents);
  section('Memory entries', memory);
  section('Scripts', scripts);

  lines.push('## Verification on template', '');
  lines.push('- [ ] `pnpm memory:index --check` green');
  lines.push('- [ ] `pnpm validate` green');
  lines.push('- [ ] cross-refs point to valid files (no orphaned links)');
  lines.push('', '## Rollback', '');
  lines.push(
    '`git revert <merge-commit>` on steaksoap main — downstream clients see the removal on next `pnpm base:update`.',
  );
  lines.push('', '---', 'Generated by `pnpm base:contribute` on client repo.');

  return { title, body: lines.join('\n'), topic };
}

function ensureCache() {
  if (!existsSync(CACHE_DIR)) {
    log(`  → Cloning steaksoap into ${relative(root, CACHE_DIR)}...`);
    mkdirSync(dirname(CACHE_DIR), { recursive: true });
    runVisible(`git clone ${BASE_URL} "${CACHE_DIR}"`);
  } else {
    log('  → Refreshing steaksoap cache...');
    run('git fetch origin main', CACHE_DIR);
    run('git checkout main', CACHE_DIR);
    run('git reset --hard origin/main', CACHE_DIR);
  }
}

function stageBranch(files, topic, title, body) {
  const clientSlug = detectClientSlug();
  const date = new Date().toISOString().slice(0, 10);
  const branch = `proposal/${clientSlug}-${date}-${slugify(topic).slice(0, 30)}`;

  log(`  → Creating branch ${branch} on cache...`);
  try {
    run(`git branch -D ${branch}`, CACHE_DIR);
  } catch {
    /* branch didn't exist */
  }
  run(`git checkout -b ${branch}`, CACHE_DIR);

  for (const f of files) {
    const src = resolve(root, f);
    const dest = resolve(CACHE_DIR, f);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
  }
  run('git add -A', CACHE_DIR);

  const changed = run('git diff --cached --name-only', CACHE_DIR);
  if (!changed) {
    throw new Error('No changes vs steaksoap main — files already upstream.');
  }

  const msgPath = resolve(CACHE_DIR, '.COMMIT_MSG.tmp');
  writeFileSync(msgPath, `${title}\n\n${body}\n`);
  try {
    run(`git -c core.hooksPath=/dev/null commit -F "${msgPath}"`, CACHE_DIR);
  } finally {
    try {
      unlinkSync(msgPath);
    } catch {
      /* ignore */
    }
  }

  log('  → Pushing branch to origin...');
  run(`git push -u origin ${branch} --force`, CACHE_DIR);
  return branch;
}

function openPR(branch, title, body) {
  log('  → Opening PR via gh...');
  const bodyPath = resolve(CACHE_DIR, '.PR_BODY.tmp');
  writeFileSync(bodyPath, body);
  try {
    const titleArg = title.replace(/"/g, '\\"');
    const out = run(
      `gh pr create --base main --head ${branch} --title "${titleArg}" --body-file "${bodyPath}"`,
      CACHE_DIR,
    );
    const urlMatch = out.match(/https:\/\/github\.com\/[^\s]+/);
    return urlMatch ? urlMatch[0] : out;
  } finally {
    try {
      unlinkSync(bodyPath);
    } catch {
      /* ignore */
    }
  }
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function appendHistory(entry) {
  mkdirSync(dirname(HISTORY_PATH), { recursive: true });
  const line = JSON.stringify(entry) + '\n';
  const existing = existsSync(HISTORY_PATH) ? readFileSync(HISTORY_PATH, 'utf-8') : '';
  writeFileSync(HISTORY_PATH, existing + line);
}
