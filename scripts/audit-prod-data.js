#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   AUDIT-PROD-DATA — list operator-facing rows in prod Supabase

   Read-only audit of the tables that surface in the /admin panel
   so we can decide what is real vs demo before any cleanup pass.

   Usage :
     node scripts/audit-prod-data.js

   Requires :
     VITE_SUPABASE_URL
     SUPABASE_SERVICE_ROLE_KEY
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(__dirname, '..');

for (const envFile of ['.env.local', '.env']) {
  const path = resolve(repoRoot, envFile);
  if (existsSync(path)) process.loadEnvFile(path);
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('  ✗ VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function dump(label, table, cols) {
  const { data, error } = await admin.from(table).select(cols);
  console.log(`\n  ── ${label} (${table}) ──`);
  if (error) {
    console.log(`    ✗ ${error.message}`);
    return;
  }
  if (!data || data.length === 0) {
    console.log('    (empty)');
    return;
  }
  console.log(`    ${data.length} row(s)`);
  for (const row of data) console.log(`      ${JSON.stringify(row)}`);
}

async function main() {
  console.log(`\n  Audit prod data — target ${SUPABASE_URL}\n`);
  await dump('Profiles', 'profiles', 'id, email, full_name, role, locale, created_at');
  await dump('Invitation codes', 'invitation_codes', 'code, status, created_at, redeemed_at, redeemed_by, expires_at');
  await dump('Share codes', 'share_codes', 'code, status, target_type, target_id, created_at, expires_at');
  await dump('Inquiries', 'inquiries', 'id, source, status, profile_id, target_id, created_at');
  await dump('Access requests', 'access_requests', 'id, email, full_name, status, created_at');
  console.log('');
}

main().catch(err => {
  console.error(`  ✗ unexpected — ${err.message}`);
  process.exit(1);
});
