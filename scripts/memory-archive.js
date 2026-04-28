#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   MEMORY-ARCHIVE — relocate old session journal entries

   Scans .claude/memory/sessions/*.md, parses YAML frontmatter
   date, and moves files older than --days threshold (default 30)
   into sessions/archive/. Preserves filenames and full content.

   Usage:
     pnpm memory:archive               → archive sessions > 30 days
     pnpm memory:archive --days 60     → custom threshold
     pnpm memory:archive --dry-run     → preview only, no moves
     node scripts/memory-archive.js
   ═══════════════════════════════════════════════════════════════ */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

import { PATHS } from './utils/paths.js';

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const DRY_RUN = args.includes('--dry-run');

const daysIdx = args.indexOf('--days');
const THRESHOLD_DAYS = daysIdx !== -1 && args[daysIdx + 1] ? Number(args[daysIdx + 1]) : 30;

if (isNaN(THRESHOLD_DAYS) || THRESHOLD_DAYS <= 0) {
  console.error('  ✗ --days must be a positive integer');
  process.exit(1);
}

// ── Paths ─────────────────────────────────────────────────────────────────────

// WHY: STEAKSOAP_TEST_ROOT env var lets smoke tests point the script at a
// temp-dir fixture instead of the real repo root.
const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;
const SESSIONS_DIR = join(ROOT, '.claude/memory/sessions');
const ARCHIVE_DIR = join(SESSIONS_DIR, 'archive');

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse the `date:` field from YAML frontmatter. Returns null if absent. */
function parseFrontmatterDate(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^date:\s*(.+)$/);
    if (kv) return kv[1].trim();
  }
  return null;
}

/** Age in whole days between dateStr (YYYY-MM-DD) and today. */
function ageInDays(dateStr, now) {
  const parsed = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(parsed.getTime())) return null;
  const diffMs = now.getTime() - parsed.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const now = new Date();

  // Gather .md files directly in sessions/ (skip archive/ subdir)
  let files;
  try {
    files = readdirSync(SESSIONS_DIR, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith('.md'))
      .map((e) => e.name);
  } catch {
    console.error(`  ✗ Cannot read ${SESSIONS_DIR}`);
    process.exit(1);
  }

  const eligible = [];
  let skipped = 0;

  for (const name of files) {
    const fullPath = join(SESSIONS_DIR, name);
    const content = readFileSync(fullPath, 'utf-8');
    const dateStr = parseFrontmatterDate(content);

    if (!dateStr) {
      console.warn(`  ⚠ Skipped ${fullPath} — missing frontmatter date`);
      skipped++;
      continue;
    }

    const age = ageInDays(dateStr, now);
    if (age === null) {
      console.warn(`  ⚠ Skipped ${fullPath} — unparseable date: ${dateStr}`);
      skipped++;
      continue;
    }

    if (age > THRESHOLD_DAYS) {
      eligible.push({ name, fullPath, age });
    }
  }

  if (DRY_RUN) {
    console.log(`\n  DRY-RUN — no files will be moved\n`);
    if (eligible.length === 0) {
      console.log(`  No sessions older than ${THRESHOLD_DAYS} days found.`);
    } else {
      console.log(`  Eligible for archival (${eligible.length} file${eligible.length === 1 ? '' : 's'}):\n`);
      for (const { name, age } of eligible) {
        console.log(`    ${name}  (${age} days old)`);
      }
    }
    printSummary(THRESHOLD_DAYS, files.length + skipped, 0, DRY_RUN);
    return;
  }

  // Ensure archive dir exists
  if (eligible.length > 0 && !existsSync(ARCHIVE_DIR)) {
    mkdirSync(ARCHIVE_DIR, { recursive: true });
  }

  let archived = 0;
  for (const { name, fullPath } of eligible) {
    const dest = join(ARCHIVE_DIR, name);

    // WHY: fail loudly on collision — never silently overwrite archived content
    if (existsSync(dest)) {
      console.error(`  ✗ Collision: ${dest} already exists. Aborting — resolve manually.`);
      process.exit(1);
    }

    renameSync(fullPath, dest);
    console.log(`  ✓ Archived ${name} → archive/${name}`);
    archived++;
  }

  printSummary(THRESHOLD_DAYS, files.length + skipped, archived, DRY_RUN);
}

function printSummary(threshold, scanned, archived, dryRun) {
  console.log('');
  console.log('MEMORY-ARCHIVE');
  console.log(`  Threshold : ${threshold} days`);
  console.log(`  Scanned   : ${scanned} files`);
  if (dryRun) {
    console.log(`  Archived  : (dry-run — 0 moved)`);
  } else {
    console.log(`  Archived  : ${archived} file${archived === 1 ? '' : 's'} → .claude/memory/sessions/archive/`);
  }
  console.log('  Next      : run `pnpm memory:index` to regenerate INDEX.md');
  console.log('');
}

main();
