// ═══════════════════════════════════════════════════
// inquiry — unified submission helper for every request drawer
//
// WHAT: Every "express interest / charter a jet / bespoke request /
//       schedule a call / free-form inquiry" drawer flows through
//       this single helper. It :
//         1) Decides if a real Supabase write is possible (env present
//            + authenticated session + non-dev user id)
//         2) Inserts a row in `public.inquiries` (the Postgres trigger
//            fires the Resend email)
//         3) Falls back to a simulator (~600 ms artificial delay) when
//            no real backend — preserves the demo UX on a starter
//            machine without `.env.local`
//
//       Drawer-specific fields (jet : from/to/date/pax — bespoke :
//       domain/budget/urgency — schedule : day/slot) are flattened
//       into the `message` text by the caller before calling here.
//       The DB schema keeps `inquiries` lean (one `message` text +
//       one `target_id` text + the enum `source`). Richer typed columns
//       can be added later via a focused migration if the operator
//       needs structured filtering.
// WHEN: Use from every inquiry/request drawer. Do NOT use for the
//       access flow (AccessRequestModal) — that goes through a
//       different path (invitation code or magic link, not inquiries).
// RULE: Operational guarantees come from migration 0010 (notification
//       email goes through Vault-backed Resend with HTML-escaped fields).
// ═══════════════════════════════════════════════════

import { hasSupabase, supabase } from '@/lib/supabase';
import type { InquirySource } from '@/types/inquiry';

export interface SubmitInquiryArgs {
  /** The InquirySource enum value (matches the Postgres enum). */
  source: InquirySource;
  /** Optional free-form text body. Drawer-specific structured fields
   *  should be pre-flattened into this string by the caller. */
  message: string | null;
  /** Optional catalogue slug or other reference. Used by the operator
   *  inbox to deeplink back to the source item. */
  targetId?: string | null | undefined;
  /** Authenticated Supabase user id. Pass `null` for dev/anon sessions
   *  — the helper will fall back to the simulator. */
  userId: string | null | undefined;
  /** Simulator delay in ms. Defaults to 600. Pass 0 for tests. */
  simulatorDelayMs?: number;
}

export interface SubmitInquiryResult {
  /** True when the row was inserted OR the simulator completed without
   *  visible failure. False when the real backend rejected the write. */
  ok: boolean;
  /** Present only on `ok: false`. Human-readable error from PostgREST. */
  error?: string;
  /** True when the simulator was used (no real persistence happened).
   *  Useful for tests + observability. */
  simulated: boolean;
}

/** Decide if a real Supabase write is possible from the runtime context. */
function canPersist(userId: string | null | undefined): boolean {
  return (
    hasSupabase &&
    supabase !== null &&
    typeof userId === 'string' &&
    userId.length > 0 &&
    // Dev sessions have ids prefixed with `dev-` (see AuthContext
    // __setDevSession). Never try to persist them — the user_id FK
    // points at `auth.users` which won't have the dev id.
    !userId.startsWith('dev-')
  );
}

/** Submit an inquiry — real Supabase insert when possible, simulator
 *  otherwise. The drawer is responsible for the success/error toast
 *  based on the result. */
export async function submitInquiry(args: SubmitInquiryArgs): Promise<SubmitInquiryResult> {
  const { source, message, targetId, userId, simulatorDelayMs = 600 } = args;

  if (!canPersist(userId) || !supabase) {
    if (simulatorDelayMs > 0) {
      await new Promise<void>(resolve => {
        setTimeout(resolve, simulatorDelayMs);
      });
    }
    return { ok: true, simulated: true };
  }

  const payload: {
    user_id: string;
    source: InquirySource;
    message: string | null;
    target_id?: string;
  } = {
    user_id: userId as string,
    source,
    message: message?.trim() || null,
  };
  if (targetId) payload.target_id = targetId;

  const { error } = await supabase.from('inquiries').insert(payload);
  if (error) {
    return { ok: false, error: error.message, simulated: false };
  }
  return { ok: true, simulated: false };
}
