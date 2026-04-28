#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CLIENT-AUDIT — produce a client-facing audit trail from git log

   Given a client name (or --all), outputs a timestamped table of
   commits + summary for delivery / invoicing / proof of work.

   Usage:
     pnpm client:audit hdva                      → last 30 days, markdown to stdout
     pnpm client:audit hdva --since 2026-04-01   → custom start date
     pnpm client:audit hdva --until 2026-04-19   → custom end date (default: now)
     pnpm client:audit hdva --format html        → html output instead of markdown
     pnpm client:audit hdva --out ./audit.md     → write to file instead of stdout
     pnpm client:audit --all                     → every worktree matching client/*
     node scripts/client-audit.js
   ═══════════════════════════════════════════════════════════════ */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { PATHS } from './utils/paths.js';

// ── Paths ─────────────────────────────────────────────────────────────────────

// WHY: STEAKSOAP_TEST_ROOT env var lets smoke tests point the script at a
// temp-dir fixture instead of the real repo root.
const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getFlag(name) {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const ALL_CLIENTS = args.includes('--all');

// First positional arg that doesn't start with '--' is the client name
const clientName = args.find((a) => !a.startsWith('--')) ?? null;

const FORMAT = getFlag('--format') ?? 'markdown';
const OUT_PATH = getFlag('--out') ?? null;

// Date window: default is last 30 days
const now = new Date();
const defaultSince = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

const SINCE = getFlag('--since') ?? defaultSince;
const UNTIL = getFlag('--until') ?? now.toISOString().slice(0, 10);

// ── Validate args ─────────────────────────────────────────────────────────────

if (!ALL_CLIENTS && !clientName) {
  console.error('');
  console.error('  ✗ Usage: pnpm client:audit <name> [options]');
  console.error('           pnpm client:audit --all');
  console.error('');
  console.error('  Options:');
  console.error('    --since <YYYY-MM-DD>    Start date (default: 30 days ago)');
  console.error('    --until <YYYY-MM-DD>    End date   (default: today)');
  console.error('    --format markdown|html  Output format (default: markdown)');
  console.error('    --out <path>            Write to file instead of stdout');
  console.error('');
  console.error('  Run `pnpm client:list` to see available worktrees.');
  console.error('');
  process.exit(1);
}

if (FORMAT !== 'markdown' && FORMAT !== 'html') {
  console.error(`  ✗ --format must be "markdown" or "html", got: ${FORMAT}`);
  process.exit(1);
}

// ── Parse git worktree list --porcelain ───────────────────────────────────────

/**
 * Parse --porcelain output into array of { worktreePath, branch } objects.
 * Each stanza is separated by a blank line.
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
      // refs/heads/client/hdva → client/hdva
      const branch = branchRef.replace(/^refs\/heads\//, '');
      return { worktreePath, branch };
    })
    .filter(Boolean);
}

function getWorktrees() {
  const r = spawnSync('git', ['worktree', 'list', '--porcelain'], {
    cwd: ROOT,
    encoding: 'utf-8',
  });
  if (r.status !== 0) {
    console.error('  ✗ Failed to list git worktrees:');
    console.error('   ', r.stderr.trim());
    process.exit(1);
  }
  return parsePorcelain(r.stdout);
}

// ── Resolve target worktrees ──────────────────────────────────────────────────

function resolveTargets() {
  const worktrees = getWorktrees();
  const clients = worktrees.filter((wt) => wt.branch.startsWith('client/'));

  if (ALL_CLIENTS) {
    return clients;
  }

  // Single named client
  const target = clients.find((wt) => wt.branch === `client/${clientName}`);
  if (!target) {
    console.error('');
    console.error(`  ✗ Worktree "client/${clientName}" not found.`);
    console.error('    Run `pnpm client:list` to see available worktrees.');
    console.error('');
    process.exit(1);
  }
  return [target];
}

// ── Read client display name from .claude/client.md ──────────────────────────

/**
 * Extract `**Nom** :` value from a worktree's .claude/client.md.
 * Fallback to the branch-derived name if not found.
 */
function readClientDisplayName(worktreePath, fallback) {
  const clientMd = join(worktreePath, '.claude', 'client.md');
  if (!existsSync(clientMd)) return fallback;
  try {
    const content = readFileSync(clientMd, 'utf-8');
    for (const line of content.split(/\r?\n/)) {
      const m = /^\s*-?\s*\*\*Nom\*\*\s*:\s*(.*)$/.exec(line);
      if (m) {
        const value = m[1].trim();
        if (value && !value.startsWith('(') && !value.startsWith('<')) {
          return value;
        }
        break;
      }
    }
  } catch {
    // unreadable — use fallback
  }
  return fallback;
}

// ── Query git log ─────────────────────────────────────────────────────────────

/**
 * Parse conventional-commit type and scope from a subject string.
 * e.g. "feat(header): ajout bandeau" → { type: 'feat', scope: 'header' }
 * Falls back to { type: 'other', scope: '' } for non-conventional.
 */
function parseConventional(subject) {
  const m = /^([a-z]+)(?:\(([^)]+)\))?!?:\s*(.*)$/.exec(subject);
  if (!m) return { type: 'other', scope: '', body: subject };
  return { type: m[1], scope: m[2] ?? '', body: m[3] };
}

/**
 * Run git log inside a worktree and return structured commit entries.
 * Filters out merge commits and auto-release commits.
 */
function queryCommits(worktreePath) {
  const r = spawnSync(
    'git',
    [
      'log',
      `--since=${SINCE}`,
      `--until=${UNTIL}T23:59:59`,
      '--pretty=format:%H|%ai|%s',
    ],
    { cwd: worktreePath, encoding: 'utf-8' },
  );

  if (r.status !== 0) {
    // Worktree may have no commits yet — treat as empty, not a fatal error
    return [];
  }

  const lines = r.stdout.trim().split('\n').filter(Boolean);

  return lines
    .map((line) => {
      const parts = line.split('|');
      // sha|date|subject — subject may contain '|' itself, rejoin tail
      const sha = parts[0];
      const iso = parts[1];
      const subject = parts.slice(2).join('|');
      return { sha, iso, subject };
    })
    .filter(({ subject }) => {
      // Drop merge commits
      if (/^Merge /i.test(subject)) return false;
      // Drop auto-release commits
      if (/^chore\(release\):/i.test(subject)) return false;
      return true;
    })
    .map(({ sha, iso, subject }) => {
      // iso = "2026-04-03 14:32:07 +0200"
      const [datePart, timePart] = iso.split(' ');
      const date = datePart ?? '';
      const time = (timePart ?? '').slice(0, 5); // HH:MM
      const shortSha = sha.slice(0, 7);
      const { type, scope, body } = parseConventional(subject);
      return { sha: shortSha, date, time, subject, type, scope, body };
    });
}

// ── Build summary by type ─────────────────────────────────────────────────────

function summariseByType(commits) {
  const counts = {};
  for (const { type } of commits) {
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

// ── Markdown formatter ────────────────────────────────────────────────────────

function padEnd(str, len) {
  return String(str).padEnd(len);
}

function renderMarkdown(displayName, worktreePath, branch, commits) {
  const typeSummary = summariseByType(commits);
  const generatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const lines = [];

  lines.push(`# Audit trail — ${displayName}`);
  lines.push('');
  lines.push(`**Période** : ${SINCE} → ${UNTIL}`);
  lines.push(`**Worktree** : ${worktreePath} (branch ${branch})`);
  lines.push(`**Commits** : ${commits.length} (hors merges + releases auto)`);
  lines.push('');

  if (commits.length === 0) {
    lines.push('_Aucun commit dans cette période._');
    lines.push('');
  } else {
    // Compute column widths for the body column
    const bodyLen = Math.max(
      43,
      ...commits.map((c) => {
        const cell = c.scope ? `(${c.scope}) ${c.body}` : c.body;
        return cell.length;
      }),
    );

    const header = `| ${'Date'.padEnd(10)} | ${'Heure'.padEnd(6)} | ${'Type'.padEnd(9)} | ${'Action'.padEnd(bodyLen)} | ${'Commit'.padEnd(7)} |`;
    const sep = `|${'-'.repeat(12)}|${'-'.repeat(8)}|${'-'.repeat(11)}|${'-'.repeat(bodyLen + 2)}|${'-'.repeat(9)}|`;
    lines.push(header);
    lines.push(sep);

    for (const { sha, date, time, type, scope, body } of commits) {
      const action = scope ? `(${scope}) ${body}` : body;
      lines.push(
        `| ${padEnd(date, 10)} | ${padEnd(time, 6)} | ${padEnd(type, 9)} | ${padEnd(action, bodyLen)} | ${padEnd(sha, 7)} |`,
      );
    }
    lines.push('');
  }

  lines.push('## Résumé par type');
  lines.push('');

  if (typeSummary.length === 0) {
    lines.push('_Aucun commit._');
  } else {
    lines.push(`| ${'Type'.padEnd(10)} | ${'Count'.padEnd(5)} | Part   |`);
    lines.push(`|${'-'.repeat(12)}|${'-'.repeat(7)}|${'-'.repeat(8)}|`);
    for (const [type, count] of typeSummary) {
      const pct = commits.length > 0 ? Math.round((count / commits.length) * 100) : 0;
      lines.push(`| ${padEnd(type, 10)} | ${padEnd(count, 5)} | ${pct} %  |`);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`Généré automatiquement par \`pnpm client:audit\` le ${generatedAt}.`);
  lines.push('');

  return lines.join('\n');
}

// ── HTML formatter ────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHtml(sections) {
  // sections: array of { displayName, worktreePath, branch, commits }
  const generatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const sectionHtml = sections
    .map(({ displayName, worktreePath, branch, commits }) => {
      const typeSummary = summariseByType(commits);

      const commitRows =
        commits.length === 0
          ? `<tr><td colspan="5" style="text-align:center;color:#71717a;font-style:italic">Aucun commit dans cette période.</td></tr>`
          : commits
              .map(
                ({ sha, date, time, type, scope, body }) =>
                  `<tr>
              <td>${escHtml(date)}</td>
              <td>${escHtml(time)}</td>
              <td><span class="badge badge-${escHtml(type)}">${escHtml(type)}</span></td>
              <td>${scope ? `<span class="scope">(${escHtml(scope)})</span> ` : ''}${escHtml(body)}</td>
              <td><code>${escHtml(sha)}</code></td>
            </tr>`,
              )
              .join('\n');

      const summaryRows =
        typeSummary.length === 0
          ? `<tr><td colspan="3" style="color:#71717a;font-style:italic">Aucun commit.</td></tr>`
          : typeSummary
              .map(([type, count]) => {
                const pct =
                  commits.length > 0 ? Math.round((count / commits.length) * 100) : 0;
                return `<tr><td><span class="badge badge-${escHtml(type)}">${escHtml(type)}</span></td><td>${count}</td><td>${pct} %</td></tr>`;
              })
              .join('\n');

      return `
    <section>
      <h2>${escHtml(displayName)}</h2>
      <dl class="meta">
        <dt>Période</dt><dd>${escHtml(SINCE)} → ${escHtml(UNTIL)}</dd>
        <dt>Worktree</dt><dd><code>${escHtml(worktreePath)}</code> (branch <code>${escHtml(branch)}</code>)</dd>
        <dt>Commits</dt><dd>${commits.length} (hors merges + releases auto)</dd>
      </dl>

      <h3>Historique</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Type</th>
            <th>Action</th>
            <th>Commit</th>
          </tr>
        </thead>
        <tbody>${commitRows}</tbody>
      </table>

      <h3>Résumé par type</h3>
      <table style="max-width:360px">
        <thead><tr><th>Type</th><th>Count</th><th>Part</th></tr></thead>
        <tbody>${summaryRows}</tbody>
      </table>
    </section>
    <hr>`;
    })
    .join('\n');

  const title =
    sections.length === 1 ? `Audit trail — ${sections[0].displayName}` : 'Audit trail — All clients';

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${escHtml(title)}</title>
<style>
  @page { margin: 20mm; }
  body { font: 14px/1.6 system-ui, sans-serif; color: #18181b; max-width: 900px; margin: 40px auto; padding: 0 24px; }
  h1 { font-size: 26px; margin: 0 0 4px; }
  h2 { font-size: 19px; margin: 32px 0 8px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; }
  h3 { font-size: 15px; margin: 20px 0 6px; color: #3f3f46; }
  code { background: #f5f5f5; padding: 1px 5px; border-radius: 4px; font: 12px ui-monospace, monospace; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0 16px; font-size: 13px; }
  th { background: #f4f4f5; text-align: left; padding: 7px 10px; border: 1px solid #e4e4e7; }
  td { padding: 6px 10px; border: 1px solid #e4e4e7; vertical-align: top; }
  tr:hover td { background: #fafafa; }
  dl.meta { display: grid; grid-template-columns: max-content 1fr; gap: 2px 12px; font-size: 13px; margin: 8px 0 16px; }
  dt { font-weight: 600; color: #71717a; }
  dd { margin: 0; }
  .scope { color: #71717a; font-size: 12px; }
  .badge { display: inline-block; font-size: 11px; padding: 1px 7px; border-radius: 20px; font-weight: 600; letter-spacing: .02em; }
  .badge-feat    { background: #dbeafe; color: #1d4ed8; }
  .badge-fix     { background: #fee2e2; color: #b91c1c; }
  .badge-chore   { background: #f3f4f6; color: #374151; }
  .badge-refactor{ background: #ede9fe; color: #6d28d9; }
  .badge-docs    { background: #ecfdf5; color: #065f46; }
  .badge-test    { background: #fef9c3; color: #854d0e; }
  .badge-style   { background: #fdf4ff; color: #7e22ce; }
  .badge-perf    { background: #fff7ed; color: #c2410c; }
  .badge-other   { background: #f5f5f5; color: #52525b; }
  .footer { margin-top: 40px; color: #a1a1aa; font-size: 12px; }
  hr { border: none; border-top: 1px solid #e5e5e5; margin: 32px 0; }
  section { margin-bottom: 8px; }
  @media print { a { color: inherit; text-decoration: none; } }
</style>
</head>
<body>

<h1>${escHtml(title)}</h1>

${sectionHtml}

<p class="footer">Généré automatiquement par <code>pnpm client:audit</code> le ${escHtml(generatedAt)}.</p>

</body>
</html>
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const targets = resolveTargets();

  if (targets.length === 0) {
    process.stdout.write('No client worktrees yet — run `pnpm client:new <name>` to start one.\n');
    process.exit(0);
  }

  // Gather data for all targets
  const sections = targets.map((wt) => {
    const name = wt.branch.replace(/^client\//, '');
    const displayName = readClientDisplayName(wt.worktreePath, name);
    const commits = queryCommits(wt.worktreePath);
    return { displayName, worktreePath: wt.worktreePath, branch: wt.branch, commits };
  });

  let output;

  if (FORMAT === 'html') {
    output = renderHtml(sections);
  } else {
    // Markdown: one section per client, separated by ---
    const parts = sections.map(({ displayName, worktreePath, branch, commits }) =>
      renderMarkdown(displayName, worktreePath, branch, commits),
    );
    output = parts.join('\n---\n\n');
  }

  if (OUT_PATH) {
    const resolved = resolve(OUT_PATH);
    writeFileSync(resolved, output, 'utf-8');
    process.stdout.write(`  ✓ Audit trail written → ${resolved}\n`);
  } else {
    process.stdout.write(output);
  }
}

main();
