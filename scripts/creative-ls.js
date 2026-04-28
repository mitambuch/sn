#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CREATIVE:LS — list creative-library mechanics/libs/anti-patterns

   Usage:
     pnpm creative:ls                  # all categories
     pnpm creative:ls mechanics        # mechanics only
     pnpm creative:ls libs             # libs only
     pnpm creative:ls anti-patterns    # anti-patterns only
     pnpm creative:ls references       # references (uipro + others)

   Prints slug + 1-line pitch per entry, so the main agent can
   pick ≥ 2 mechanics for VISION blocks without reading every file.
   ═══════════════════════════════════════════════════════════════ */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LIBRARY = join(ROOT, '.claude', 'memory', 'creative-library');

const CATEGORIES = ['mechanics', 'libs', 'anti-patterns', 'references'];

function firstTitle(content) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '(no title)';
}

function firstBodyLine(content) {
  const body = content.replace(/^---[\s\S]*?---\s*/, '').trim();
  const lines = body.split(/\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('---')) continue;
    if (t.startsWith('```')) continue;
    return t.slice(0, 110);
  }
  return '(no description)';
}

function listCategory(name) {
  const dir = join(LIBRARY, name);
  if (!existsSync(dir)) {
    console.log(`  (no ${name}/ directory)`);
    return;
  }
  const entries = [];
  const walk = (d, prefix = '') => {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      if (f.isDirectory()) walk(join(d, f.name), prefix ? `${prefix}/${f.name}` : f.name);
      else if (f.name.endsWith('.md') && f.name !== 'README.md') {
        const full = join(d, f.name);
        const content = readFileSync(full, 'utf8');
        entries.push({
          slug: (prefix ? `${prefix}/` : '') + f.name.replace(/\.md$/, ''),
          title: firstTitle(content),
          pitch: firstBodyLine(content),
        });
      }
    }
  };
  walk(dir);
  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  for (const e of entries) {
    console.log(`  ${e.slug.padEnd(32)} ${e.pitch}`);
  }
  console.log(`  (${entries.length} entries)\n`);
}

const filter = process.argv[2];
const cats = filter ? [filter] : CATEGORIES;

if (filter && !CATEGORIES.includes(filter)) {
  console.error(`Unknown category "${filter}". Valid: ${CATEGORIES.join(', ')}`);
  process.exit(1);
}

console.log(`\n📚 Creative library — ${cats.join(', ')}\n`);
for (const c of cats) {
  console.log(`── ${c} ──`);
  listCategory(c);
}

console.log('Full fiches: .claude/memory/creative-library/<category>/<slug>.md');
console.log('Add a new entry: pnpm creative:add <category> <slug>');
