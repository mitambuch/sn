// ═══════════════════════════════════════════════════
// shareCode — client helpers around the share_codes table + RPC
//
// WHAT: Two callable surfaces :
//   - consumeShareCode(rawCode) : validates a code and returns the
//     linked Sanity doc reference + a bumped view counter. Calls the
//     security-definer RPC, safe to call from anonymous routes (the
//     /share/:code public page uses this).
//   - generateAndInsertShareCode(docRef, opts) : admin-only. Generates
//     a unique 8-char code, inserts the row, returns the canonical
//     code + display format. Will throw on RLS reject (non-admin).
// ═══════════════════════════════════════════════════

import { supabase } from '@/lib/supabase';
import {
  type ConsumedShareCode,
  generateShareCode,
  normalizeShareCode,
  type ShareableDocType,
  type ShareDocRef,
} from '@/types/share';

type ConsumeRow = {
  sanity_doc_type: string | null;
  sanity_doc_id: string | null;
  sanity_docs: { type?: string; id?: string }[] | null;
  status: string | null;
  view_count: number;
  max_views: number | null;
  expires_at: string | null;
  is_valid: boolean;
};

/** Build the docs[] list from a consume row: prefer the multi-doc JSONB,
 *  fall back to the legacy single (type,id) for old codes. */
function resolveDocs(row: ConsumeRow): ShareDocRef[] {
  const multi = Array.isArray(row.sanity_docs) ? row.sanity_docs : [];
  const fromMulti = multi
    .filter((d): d is { type: string; id: string } => Boolean(d?.type) && Boolean(d?.id))
    .map(d => ({ type: d.type as ShareableDocType, id: d.id }));
  if (fromMulti.length > 0) return fromMulti;
  if (row.sanity_doc_type && row.sanity_doc_id) {
    return [{ type: row.sanity_doc_type as ShareableDocType, id: row.sanity_doc_id }];
  }
  return [];
}

/**
 * Validate a share code (display or canonical) and consume one view.
 * - Returns null if the code is not found (404 path).
 * - Returns { isValid: false, ... } if found but expired / revoked / at cap.
 * - Returns { isValid: true, sanityDocType, sanityDocId } if valid.
 */
/** Demo result reused by both the DEV stub and the unconditional APERCU
 *  short-circuit. Anyone typing APERCU in /exemple gets the seeded
 *  Gala ONU event, regardless of whether Supabase is wired or whether
 *  the migration row exists yet — critical for live demos. */
const DEMO_RESULT: ConsumedShareCode = {
  sanityDocType: 'event',
  sanityDocId: 'evt-01',
  docs: [{ type: 'event', id: 'evt-01' }],
  status: 'active',
  viewCount: 1,
  maxViews: null,
  expiresAt: null,
  isValid: true,
};

export const consumeShareCode = async (rawCode: string): Promise<ConsumedShareCode | null> => {
  const canonical = normalizeShareCode(rawCode);

  // Unconditional short-circuit for the demo code. Works without Supabase
  // (template / local dev) AND with Supabase before migration 0006 lands.
  // Once the DB row exists, this branch still returns first — harmless,
  // it just skips the view-counter bump for the demo code (intentional :
  // demo views shouldn't count against any quota).
  if (canonical === 'APERCU') {
    return DEMO_RESULT;
  }

  if (!supabase) return null;

  const { data, error } = await supabase.rpc('consume_share_code', { p_code: canonical });

  if (error) {
    console.warn('[shareCode] RPC consume_share_code failed:', error.message);
    return null;
  }

  const rows = (data ?? []) as ConsumeRow[];
  const first = rows[0];
  if (!first) return null;

  const docs = resolveDocs(first);
  return {
    sanityDocType: (first.sanity_doc_type as ShareableDocType | null) ?? docs[0]?.type ?? null,
    sanityDocId: first.sanity_doc_id ?? docs[0]?.id ?? null,
    docs,
    status: first.status as ConsumedShareCode['status'],
    viewCount: first.view_count,
    maxViews: first.max_views,
    expiresAt: first.expires_at,
    isValid: first.is_valid,
  };
};

interface GenerateOpts {
  expiresAt?: string;
  maxViews?: number;
  note?: string;
}

/**
 * Generate + insert a new share code for a Sanity doc. Admin-only
 * (RLS blocks non-admins). Returns the canonical 6-char code (display
 * = canonical, no prefix).
 *
 * On unique-constraint clash (extremely rare given the alphabet
 * size — 30^6 ≈ 729M), retries once with a fresh code.
 */
export const generateAndInsertShareCode = async (
  docs: ShareDocRef[],
  opts: GenerateOpts = {},
): Promise<{ canonical: string }> => {
  if (!supabase) {
    throw new Error('Supabase non configuré — impossible de générer un code de partage.');
  }
  const first = docs[0];
  if (!first) {
    throw new Error('Aucune fiche sélectionnée pour le code de partage.');
  }
  const sb = supabase;

  const attempt = async (): Promise<string> => {
    const canonical = generateShareCode();
    const { error } = await sb.from('share_codes').insert({
      code: canonical,
      // Legacy columns hold the first doc (NOT NULL + back-compat);
      // sanity_docs holds the whole selection.
      sanity_doc_type: first.type,
      sanity_doc_id: first.id,
      sanity_docs: docs,
      ...(opts.expiresAt ? { expires_at: opts.expiresAt } : {}),
      ...(typeof opts.maxViews === 'number' ? { max_views: opts.maxViews } : {}),
      ...(opts.note ? { note: opts.note } : {}),
    });
    if (error) throw new Error(error.message);
    return canonical;
  };

  try {
    const canonical = await attempt();
    return { canonical };
  } catch (err) {
    // Retry once on unique constraint violation
    if (err instanceof Error && /duplicate key|unique constraint/i.test(err.message)) {
      const canonical = await attempt();
      return { canonical };
    }
    throw err;
  }
};
