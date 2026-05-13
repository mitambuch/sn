#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   SEED-SAWNEXT — push Sawnext-specific demo fixture to Sanity

   Variant of seed-demo.js pointing at studio/fixtures/sawnext-seed.json
   instead of the steaksoap template fixture. Use this when you spin up
   the Sanity project for the first time to give Salva a non-empty
   Studio (siteConfig + 3 pages + 8 fiches HNW + 3 team members).

   Usage :
     pnpm sanity:seed:sawnext             → dataset production by default
     pnpm sanity:seed:sawnext --staging   → dataset staging
     pnpm sanity:seed:sawnext --dry-run   → preview only

   Requires :
     SANITY_STUDIO_PROJECT_ID (or VITE_SANITY_PROJECT_ID)
     SANITY_WRITE_TOKEN (Editor scope) — generate at sanity.io/manage
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

const PROJECT_ID =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const DATASET = USE_STAGING
  ? 'staging'
  : process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';

if (!PROJECT_ID && !DRY_RUN) {
  console.error('  ✗ SANITY_STUDIO_PROJECT_ID missing — set it in studio/.env.');
  process.exit(1);
}
if (!TOKEN && !DRY_RUN) {
  console.error(
    '  ✗ SANITY_WRITE_TOKEN missing — generate one at sanity.io/manage → API → Tokens (Editor scope), then put it in .env.local.',
  );
  process.exit(1);
}

const fixturePath = resolve(__dirname, '..', 'fixtures', 'sawnext-seed.json');
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
  `\n  Seed Sawnext — target ${target}  (${docs.length} documents)${DRY_RUN ? '  [DRY-RUN]' : ''}\n`,
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
