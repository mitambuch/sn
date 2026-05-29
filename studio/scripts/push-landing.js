#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   PUSH-LANDING — surgical push of the landing-singleton only

   Targeted variant of seed-sawnext.js that pushes ONLY the
   `landing-singleton` document from the bundled fixture. Use when
   the dataset has live editorial content (catalogue, team) that
   must not be touched, but the landing singleton has never been
   populated or only partially.

   Idempotent via createOrReplace — overwrites any existing
   landing-singleton with the fixture values. Review the fixture
   before running on prod.

   Usage :
     pnpm sanity:push:landing             → dataset production
     pnpm sanity:push:landing --staging   → dataset staging
     pnpm sanity:push:landing --dry-run   → preview only

   Requires :
     SANITY_STUDIO_PROJECT_ID (or VITE_SANITY_PROJECT_ID)
     SANITY_WRITE_TOKEN (Editor scope)
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from '@sanity/client';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

for (const envFile of ['.env.local', 'studio/.env.local', 'studio/.env']) {
  const path = resolve(repoRoot, envFile);
  if (existsSync(path)) process.loadEnvFile(path);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const USE_STAGING = args.includes('--staging');

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const DATASET = USE_STAGING
  ? 'staging'
  : process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';

if (!PROJECT_ID && !DRY_RUN) {
  console.error('  ✗ SANITY_STUDIO_PROJECT_ID missing.');
  process.exit(1);
}
if (!TOKEN && !DRY_RUN) {
  console.error('  ✗ SANITY_WRITE_TOKEN missing.');
  process.exit(1);
}

const fixturePath = resolve(__dirname, '..', 'fixtures', 'sawnext-seed.json');
const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'));
const landingDoc = (fixture.documents || []).find(
  d => d._id === 'landing-singleton' && d._type === 'landing',
);

if (!landingDoc) {
  console.error('  ✗ landing-singleton not found in fixture.');
  process.exit(1);
}

const target = PROJECT_ID ? `${PROJECT_ID}/${DATASET}` : '(no project)';
console.log(`\n  Push landing — target ${target}${DRY_RUN ? '  [DRY-RUN]' : ''}\n`);
console.log(`    _id : ${landingDoc._id}`);
console.log(`    fields populated : ${Object.keys(landingDoc).filter(k => !k.startsWith('_')).length}`);

if (DRY_RUN) {
  console.log('\n  Nothing written.\n');
  process.exit(0);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-06-01',
  useCdn: false,
});

try {
  await client.createOrReplace(landingDoc);
  console.log(`  ✓ landing/${landingDoc._id} written to ${target}\n`);
} catch (err) {
  console.error(`  ✗ push failed — ${err.message}`);
  process.exit(1);
}
