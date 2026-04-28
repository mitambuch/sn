#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   UPSTREAM-FRICTION-REPORT — package frictions for upstream template

   Scans .claude/memory/frictions/ for entries tagged #template (the
   only scope that should propagate upstream from client worktrees)
   and groups them into a single markdown report that can be pasted
   into a GitHub issue on the steaksoap template repo, or used as a
   PR body via `gh issue create --body-file`.

   Filters :
     - Only `status: active` entries
     - Only `scope: template` entries (not `client-specific`)
     - Respects `--since <YYYY-MM-DD>` to limit window
     - `--auto-detected` → only machine-logged frictions (tag
       #auto-detected from stop.js)

   Output :
     - Writes dist/friction-report-<date>.md
     - Prints markdown to stdout for piping to `gh issue create`
     - With `--open`, opens a GitHub issue on the template repo
       automatically (requires gh CLI + GITHUB_TOKEN)

   Usage :
     pnpm friction:report                       → full active report
     pnpm friction:report --since 2026-04-01    → since date
     pnpm friction:report --auto-detected       → only auto-logged
     pnpm friction:report --open                → + open GH issue
   ═══════════════════════════════════════════════════════════════ */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { PATHS } from './utils/paths.js';

const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;
const FRICTIONS = join(ROOT, '.claude/memory/frictions');
const DIST = join(ROOT, 'dist');

const args = process.argv.slice(2);
const SINCE_IDX = args.indexOf('--since');
const SINCE = SINCE_IDX !== -1 ? args[SINCE_IDX + 1] : null;
const AUTO_ONLY = args.includes('--auto-detected');
const OPEN = args.includes('--open');

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    if (raw.startsWith('[')) {
      fm[key] = raw.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    } else {
      fm[key] = raw.trim();
    }
  }
  return fm;
}

function titleFromMd(md) {
  const m = md.slice(md.indexOf('---', 3) + 3).match(/^\s*#\s+(.+)$/m);
  return m ? m[1].trim() : '(untitled)';
}

function bodyFromMd(md) {
  const end = md.indexOf('---', 3) + 3;
  return md.slice(end).trim();
}

function loadFrictions() {
  if (!existsSync(FRICTIONS)) return [];
  const files = readdirSync(FRICTIONS).filter(f => f.endsWith('.md'));
  const out = [];
  for (const name of files) {
    const path = join(FRICTIONS, name);
    const raw = readFileSync(path, 'utf-8');
    const fm = parseFrontmatter(raw);
    if (!fm) continue;
    out.push({
      name,
      path,
      fm,
      title: titleFromMd(raw),
      body: bodyFromMd(raw),
    });
  }
  return out;
}

function matches(entry) {
  if (entry.fm.status !== 'active') return false;
  if (entry.fm.scope !== 'template') return false;
  if (SINCE && (entry.fm.date || '') < SINCE) return false;
  if (AUTO_ONLY && !(entry.fm.tags || []).includes('#auto-detected')) return false;
  return true;
}

function report(entries) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push(`# Friction report — steaksoap template (${today})`);
  lines.push('');
  lines.push(`Scope : ${AUTO_ONLY ? 'auto-detected only' : 'all active'}`);
  if (SINCE) lines.push(`Since : ${SINCE}`);
  lines.push('');
  lines.push(`Total active frictions worth upstreaming : ${entries.length}`);
  lines.push('');
  if (!entries.length) {
    lines.push('No active template-scope frictions matching filters — repo is clean.');
    return lines.join('\n');
  }

  for (const e of entries) {
    lines.push('---');
    lines.push('');
    lines.push(`## ${e.title}`);
    lines.push('');
    lines.push(`- **id** : \`${e.fm.id || e.name.replace(/\.md$/, '')}\``);
    lines.push(`- **date** : ${e.fm.date || '(no date)'}`);
    lines.push(`- **tags** : ${(e.fm.tags || []).join(' ')}`);
    lines.push(`- **source** : \`.claude/memory/frictions/${e.name}\``);
    lines.push('');
    // Trim long bodies to keep report scannable
    const bodyLines = e.body.split('\n');
    if (bodyLines.length > 40) {
      lines.push(bodyLines.slice(0, 40).join('\n'));
      lines.push('');
      lines.push(`<!-- body truncated at 40 lines — see source file -->`);
    } else {
      lines.push(e.body);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## How to action this');
  lines.push('');
  lines.push('1. Owner of the steaksoap template reviews each friction.');
  lines.push('2. Real ones → patch the template, land upstream.');
  lines.push('3. False positives → deprecate the entry (status: deprecated) in the source repo.');
  lines.push('4. Client-specific frictions stay in the client worktree (not reported here).');
  return lines.join('\n');
}

function openIssue(markdown) {
  try {
    const title = `Friction report ${new Date().toISOString().slice(0, 10)}`;
    // Use stdin pipe via shell
    execSync(`gh issue create --title ${JSON.stringify(title)} --body-file -`, {
      cwd: ROOT,
      input: markdown,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
  } catch (err) {
    console.error(`\n  gh issue create failed: ${err.message}`);
    process.exit(1);
  }
}

function main() {
  const all = loadFrictions();
  const filtered = all.filter(matches);
  const md = report(filtered);

  if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const outPath = join(DIST, `friction-report-${today}.md`);
  writeFileSync(outPath, md, 'utf-8');
  console.error(`✓ Wrote ${outPath} (${filtered.length} active frictions)`);

  process.stdout.write(md);

  if (OPEN && filtered.length > 0) openIssue(md);
}

main();
