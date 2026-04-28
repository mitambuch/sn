#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   SEED-DEMO — push the steaksoap demo fixture to your Sanity dataset

   Reads studio/fixtures/demo-seed.json and createOrReplace-s each
   document on the configured Sanity project. Useful the first time
   you hook up the template to a personal Sanity account — fills the
   Studio with realistic trilingual content so you see what the app
   renders against real CMS data.

   Usage :
     pnpm sanity:seed:demo             → dataset staging (default)
     pnpm sanity:seed:demo --production → dataset production
     pnpm sanity:seed:demo --dry-run    → show what would be written

   Requires :
     VITE_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID)
     SANITY_WRITE_TOKEN (scope Editor)
   Loads from .env.local or studio/.env.local automatically.
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from '@sanity/client';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

for (const envFile of ['.env.local', 'studio/.env.local']) {
  const path = resolve(repoRoot, envFile);
  if (existsSync(path)) process.loadEnvFile(path);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const USE_PROD = args.includes('--production');

const PROJECT_ID =
  process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const DATASET = USE_PROD
  ? 'production'
  : process.env.VITE_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET ||
    'staging';

if (!PROJECT_ID && !DRY_RUN) {
  console.error('  ✗ VITE_SANITY_PROJECT_ID missing — run `pnpm doctor:client:fix` first.');
  process.exit(1);
}
if (!TOKEN && !DRY_RUN) {
  console.error('  ✗ SANITY_WRITE_TOKEN missing — run `pnpm doctor:client:fix` first.');
  process.exit(1);
}

const fixturePath = resolve(__dirname, '..', 'fixtures', 'demo-seed.json');
if (!existsSync(fixturePath)) {
  console.error(`  ✗ Fixture not found at ${fixturePath}`);
  process.exit(1);
}

const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'));
const docs = fixture.documents || [];

if (!docs.length) {
  console.error('  ✗ Fixture has no documents to seed.');
  process.exit(1);
}

const target = PROJECT_ID ? `${PROJECT_ID}/${DATASET}` : '(no project configured)';
console.log(
  `\n  Seed demo — target ${target}  (${docs.length} documents)${DRY_RUN ? '  [DRY-RUN]' : ''}\n`,
);

if (DRY_RUN) {
  for (const doc of docs) {
    console.log(`  • ${doc._type}/${doc._id}`);
  }
  console.log('\n  Nothing written. Re-run without --dry-run to push.\n');
  process.exit(0);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-06-01',
  useCdn: false,
});

async function main() {
  let ok = 0;
  let failed = 0;
  for (const doc of docs) {
    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${doc._type}/${doc._id}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${doc._type}/${doc._id} — ${err.message}`);
      failed++;
    }
  }
  console.log(`\n  Done : ${ok} written, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error(`  ✗ Seed failed unexpectedly — ${err.message}`);
  process.exit(1);
});
