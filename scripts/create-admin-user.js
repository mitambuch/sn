#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CREATE-ADMIN-USER — provision an operator account in prod Supabase

   Two modes :

   1. --invite  — sends a Supabase Auth invitation email. The user
                  clicks the magic link, sets their own password.
                  Cleanest RGPD posture, no shared secret.

   2. --password — creates the user with an explicit initial
                  password (email_confirm: true so the user can
                  log in immediately without verifying email).

   Then in both cases : the on_auth_user_created trigger
   auto-creates the public.profiles row with role='client', and
   this script promotes it to role='admin' so the user can use the
   admin panel (invitation codes, share codes, users management,
   access requests, catalogue visibility, etc.).

   Usage :
     node scripts/create-admin-user.js --email <email> --name <full_name> --invite
     node scripts/create-admin-user.js --email <email> --name <full_name> --password <pwd>
     node scripts/create-admin-user.js --email <email> --name <full_name> --invite --dry-run

   Requires :
     VITE_SUPABASE_URL          — public project URL
     SUPABASE_SERVICE_ROLE_KEY  — service_role JWT (NEVER commit, NEVER expose client-side)
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

function getArg(name) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : '';
}

const EMAIL = getArg('email');
const FULL_NAME = getArg('name');
const PASSWORD = getArg('password');
const INVITE = process.argv.includes('--invite');
const DRY_RUN = process.argv.includes('--dry-run');

if (!EMAIL || !FULL_NAME) {
  console.error('  ✗ Missing arguments. Usage :');
  console.error('    node scripts/create-admin-user.js --email <email> --name <full_name> --invite');
  console.error('    node scripts/create-admin-user.js --email <email> --name <full_name> --password <pwd>');
  process.exit(1);
}

if (!INVITE && !PASSWORD) {
  console.error('  ✗ Choose either --invite or --password <pwd>.');
  process.exit(1);
}

if (INVITE && PASSWORD) {
  console.error('  ✗ --invite and --password are mutually exclusive.');
  process.exit(1);
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL && !DRY_RUN) {
  console.error('  ✗ VITE_SUPABASE_URL missing — set it in .env.local.');
  process.exit(1);
}
if (!SERVICE_ROLE_KEY && !DRY_RUN) {
  console.error('  ✗ SUPABASE_SERVICE_ROLE_KEY missing — get it at supabase.com/dashboard/project/_/settings/api (NEVER commit it).');
  process.exit(1);
}

console.log(`\n  Provision admin — ${EMAIL}${DRY_RUN ? '  [DRY-RUN]' : ''}\n`);
console.log(`    full_name : ${FULL_NAME}`);
console.log(`    mode      : ${INVITE ? 'invite (magic link)' : 'password (set explicit)'}`);
console.log(`    target    : ${SUPABASE_URL || '(not configured)'}`);
console.log('');

if (DRY_RUN) {
  console.log('  Nothing written. Re-run without --dry-run.\n');
  process.exit(0);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  let userId;

  if (INVITE) {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(EMAIL, {
      data: { full_name: FULL_NAME },
    });
    if (error) {
      console.error(`  ✗ invite failed — ${error.message}`);
      process.exit(1);
    }
    userId = data.user?.id;
    console.log(`  ✓ invitation email sent to ${EMAIL} (user id ${userId})`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: FULL_NAME },
    });
    if (error) {
      console.error(`  ✗ createUser failed — ${error.message}`);
      process.exit(1);
    }
    userId = data.user?.id;
    console.log(`  ✓ user created — ${EMAIL} (id ${userId}) — email_confirmed`);
  }

  // The on_auth_user_created trigger created the profiles row with
  // role='client'. Promote it.
  const { error: updateErr } = await admin
    .from('profiles')
    .update({ role: 'admin', full_name: FULL_NAME })
    .eq('id', userId);

  if (updateErr) {
    console.error(`  ✗ promote to admin failed — ${updateErr.message}`);
    console.error('    The auth user was created — promote manually via SQL:');
    console.error(`    UPDATE public.profiles SET role = 'admin' WHERE id = '${userId}';`);
    process.exit(1);
  }

  console.log(`  ✓ profile promoted to role='admin'`);
  console.log('');
  console.log(`  Done. ${EMAIL} can now log in and use the admin panel.`);
  if (INVITE) {
    console.log(`  Tell the user to check their inbox for the invitation email.`);
  }
  console.log('');
}

main().catch(err => {
  console.error(`  ✗ unexpected — ${err.message}`);
  process.exit(1);
});
