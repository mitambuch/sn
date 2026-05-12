#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const url = env.VITE_SUPABASE_URL;
const anon = env.VITE_SUPABASE_ANON_KEY;
const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const EMAIL = process.argv[2] ?? 't@t.com';
const PASSWORD = process.argv[3] ?? '123456';

console.log(`Seeding user → ${EMAIL} / ${PASSWORD}`);

async function viaServiceRole() {
  const admin = createClient(url, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  console.log('✓ created via service_role:', data.user?.id);
}

async function viaSignUp() {
  const client = createClient(url, anon);
  const { data, error } = await client.auth.signUp({ email: EMAIL, password: PASSWORD });
  if (error) throw error;
  if (data.user && !data.session) {
    console.log('⚠ user created but unconfirmed (email confirmation is ON in Supabase Auth).');
    console.log('  Fix: Dashboard → Authentication → Users → click user → "Confirm email"');
    console.log('  OR  : Dashboard → Authentication → Providers → Email → toggle "Confirm email" OFF, re-run.');
    console.log('  user id:', data.user.id);
    return;
  }
  console.log('✓ created + auto-confirmed via signUp:', data.user?.id);
}

try {
  if (serviceRole) await viaServiceRole();
  else await viaSignUp();
} catch (err) {
  if (err?.message?.includes('already')) {
    console.log('ℹ user already exists — try logging in directly with these creds.');
    process.exit(0);
  }
  console.error('✗', err?.message ?? err);
  process.exit(1);
}
