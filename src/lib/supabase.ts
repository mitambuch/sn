// ═══════════════════════════════════════════════════
// Supabase — live client + presence guard
//
// WHAT: createClient() once at module load. `hasSupabase` lets UI gate
//       on env presence (login/inquiry CTAs disable when env missing).
// WHEN: Imported by AuthContext + every feature that writes to DB.
// RULE: ANON key is PUBLIC by design (gated by Postgres RLS policies).
//       SERVICE_ROLE key never lives in client code — backend-only.
//       See .claude/rules/security.md.
// ═══════════════════════════════════════════════════

import { env } from '@config/env';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type { SupabaseClient };

/** True iff both URL and ANON key are present in env. */
export const hasSupabase: boolean = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
