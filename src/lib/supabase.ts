// ═══════════════════════════════════════════════════
// Supabase — lazy client + presence guard
//
// WHAT: Mirrors src/lib/sanity.ts pattern. Exports `hasSupabase` so
//       callers can branch on availability, and `supabase` which is
//       null until the @supabase/supabase-js package is installed and
//       wired in the upcoming "A.5 — Supabase live" pass.
// WHEN: Imported by AuthContext (next chunk) and any feature module
//       that needs DB access.
// RULE: see .claude/rules/security.md — the ANON key is PUBLIC by
//       design (gated by RLS policies). The SERVICE_ROLE key NEVER
//       lives here.
// ═══════════════════════════════════════════════════

import { env } from '@config/env';

// TODO[A.5-supabase-live]: replace this stub with
//   `import type { SupabaseClient } from '@supabase/supabase-js';`
//   once the package is installed. The interface below is a minimal
//   placeholder so consumer code can type against `SupabaseClient | null`
//   today without a hard dependency on the package.
export interface SupabaseClient {
  readonly url: string;
  // intentionally empty — extended at wire-up time
}

/** True iff both URL and ANON key are present. Used to gate auth UI. */
export const hasSupabase = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);

// TODO[A.5-supabase-live]: replace `null` with
//   `hasSupabase ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY) : null;`
//   once @supabase/supabase-js is installed.
export const supabase: SupabaseClient | null = null;
