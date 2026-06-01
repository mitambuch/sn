#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   VALIDATE-SANITY-SCHEMA — detect editable fields that should be locale*

   Rule (i18n-sanity.md lesson #9): every editable text field inside a
   document-type schema (studio/schemas/documents/*.ts) MUST use
   localeString / localeText / localeRichText. Raw `type: 'string'` or
   `type: 'text'` is only valid for known technical fields (slug,
   copyright, URLs, tokens, internal identifiers).

   This is a regex-based heuristic, not a full TS AST parser. It covers
   the common pattern (`defineField({ name: '...', type: 'string' ...})`)
   and skips object-scope objects/ and singletons/ for now.

   Usage:
     node scripts/validate-sanity-schema.js
   ═══════════════════════════════════════════════════════════════ */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');
const docsDir = join(root, 'studio', 'schemas', 'documents');

// Known technical field names that are ALLOWED to stay raw string/text.
const ALLOWED_RAW = new Set([
  'slug',
  'title', // internal Studio-only label on page docs (not user-facing)
  'name',
  'copyright',
  'href',
  'ctaHref', // destination URL, not locale content
  'url',
  'hostname',
  'path',
  'contactEmail',
  'contactPhone',
  'email',
  'phone',
  'id',
  '_id',
  '_type',
  'token',
  'hash',
  'color',
  'hex',
  'locale',
  'language',
  'heroDate',
  'order',
  // ─── Catalogue technical fields ───────────────────────────
  // These are values from radio lists / proper nouns / ISO codes that
  // do not translate per locale — keeping them as raw strings is the
  // right call.
  'category',       // radio-list value (event, conciergeService, article)
  'dateMode',       // radio-list value (event: exact | allYear | free)
  'kind',           // property kind value
  'transactionType',// property transaction value
  'venue',          // proper noun (Palais des Nations stays Palais des Nations)
  'city',           // proper noun
  'region',         // proper noun
  'countryCode',    // ISO 2-letter
  'dressCode',      // radio-list value
  'duration',       // free text (e.g. "12 jours")
  'partySize',      // free text (e.g. "4 à 8 voyageurs")
  'brand',          // proper noun (Patek Philippe, Rolex…)
  'reference',      // alphanumeric (5711/1A-018)
  'caseMaterial',   // technical term that's idiomatic FR
  'movement',       // technical term
  'condition',      // radio-list value
  'papers',         // radio-list value
  'artistName',     // proper noun
  'medium',         // technical term (huile sur toile)
  'dimensions',     // numeric+unit string
  'edition',        // alphanumeric
  'catalogueRaisonne', // catalogue reference
  'firstName',      // proper noun
  'lastName',       // proper noun
  'role',           // radio-list value
  'key',            // technical key used to map landing domainTiles to catalogue type slugs
]);

function* walkDocs() {
  try {
    const entries = readdirSync(docsDir);
    for (const entry of entries) {
      const full = join(docsDir, entry);
      if (statSync(full).isFile() && /\.ts$/.test(entry)) {
        yield full;
      }
    }
  } catch {
    // Folder may not exist yet on a fresh clone — that's fine.
  }
}

function scanFile(file) {
  const rel = relative(root, file);
  const src = readFileSync(file, 'utf-8');
  const violations = [];

  // Split the file into `defineField({...})` blocks. Regex is tolerant
  // of whitespace and nested object literals (simple depth counter).
  const blocks = [];
  const re = /defineField\(\s*\{/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index + m[0].length - 1; // position of the `{`
    let depth = 1;
    let i = start + 1;
    while (i < src.length && depth > 0) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
      i++;
    }
    blocks.push({ start, end: i, content: src.slice(start, i) });
  }

  for (const b of blocks) {
    const nameMatch = /name\s*:\s*['"]([^'"]+)['"]/.exec(b.content);
    const typeMatch = /type\s*:\s*['"]([^'"]+)['"]/.exec(b.content);
    if (!nameMatch || !typeMatch) continue;

    const name = nameMatch[1];
    const type = typeMatch[1];

    if ((type === 'string' || type === 'text') && !ALLOWED_RAW.has(name)) {
      // Compute line number
      const linesBefore = src.slice(0, b.start).split('\n').length;
      violations.push({ file: rel, line: linesBefore, name, type });
    }
  }

  return violations;
}

const allViolations = [];
for (const file of walkDocs()) {
  allViolations.push(...scanFile(file));
}

if (allViolations.length === 0) {
  console.log('  ✓ Every editable text field in studio/schemas/documents/ is locale*');
  process.exit(0);
}

console.error(`  ✗ ${allViolations.length} raw string/text field(s) that should be locale*:`);
console.error('');
for (const v of allViolations) {
  console.error(`    ${v.file}:${v.line}  name="${v.name}"  type="${v.type}"`);
}
console.error('');
console.error('  Use `type: "localeString"` / "localeText" / "localeRichText" instead.');
console.error('  If the field is genuinely technical (slug, URL, token), add its name');
console.error('  to the ALLOWED_RAW set in scripts/validate-sanity-schema.js.');
console.error('  See .claude/rules/i18n-sanity.md lesson #9.');
process.exit(1);
