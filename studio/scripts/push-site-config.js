#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   PUSH-SITE-CONFIG — surgical push of the siteConfig-singleton only

   Targeted variant of seed-sawnext.js that pushes ONLY the
   `siteConfig-singleton` document from the bundled fixture. Use
   when the dataset already has live editorial content (landing,
   catalogue, team) that must not be touched, but the global config
   has never been populated.

   Idempotent via createOrReplace — re-running with the same fixture
   is a no-op for the doc shape. If the doc already exists with
   different values, those values are OVERWRITTEN — review the
   fixture before running on prod.

   Usage :
     pnpm sanity:push:site-config             → dataset production
     pnpm sanity:push:site-config --staging   → dataset staging
     pnpm sanity:push:site-config --dry-run   → preview only

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
  console.error('  ✗ SANITY_STUDIO_PROJECT_ID missing — set it in studio/.env.');
  process.exit(1);
}
if (!TOKEN && !DRY_RUN) {
  console.error(
    '  ✗ SANITY_WRITE_TOKEN missing — generate one at sanity.io/manage → API → Tokens (Editor scope), then export it before re-running.',
  );
  process.exit(1);
}

const fixturePath = resolve(__dirname, '..', 'fixtures', 'sawnext-seed.json');
if (!existsSync(fixturePath)) {
  console.error(`  ✗ Fixture not found at ${fixturePath}`);
  process.exit(1);
}

const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'));
const siteConfigDoc = (fixture.documents || []).find(
  d => d._id === 'siteConfig-singleton' && d._type === 'siteConfig',
);

if (!siteConfigDoc) {
  console.error('  ✗ siteConfig-singleton not found in fixture.');
  process.exit(1);
}

const target = PROJECT_ID ? `${PROJECT_ID}/${DATASET}` : '(no project configured)';
console.log(
  `\n  Push siteConfig — target ${target}${DRY_RUN ? '  [DRY-RUN]' : ''}\n`,
);

console.log('  Document to push :');
console.log(`    _id        : ${siteConfigDoc._id}`);
console.log(`    siteName   : ${JSON.stringify(siteConfigDoc.siteName)}`);
console.log(`    copyright  : ${siteConfigDoc.copyright}`);
console.log(`    contactEmail: ${siteConfigDoc.contactEmail}`);
console.log(`    contactPhone: ${siteConfigDoc.contactPhone}`);
console.log(`    footerTagline: ${JSON.stringify(siteConfigDoc.footerTagline)}`);
console.log('');

if (DRY_RUN) {
  console.log('  Nothing written. Re-run without --dry-run to push.\n');
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
  try {
    await client.createOrReplace(siteConfigDoc);
    console.log(`  ✓ siteConfig/${siteConfigDoc._id} written to ${target}\n`);
  } catch (err) {
    console.error(`  ✗ push failed — ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`  ✗ unexpected — ${err.message}`);
  process.exit(1);
});
