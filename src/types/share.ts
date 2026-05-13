// ═══════════════════════════════════════════════════
// Share-code domain types (mirrors public.share_codes table)
//
// Codes are single-Sanity-doc access tokens. **6-char canonical format**
// using the unambiguous alphabet (excludes O / 0 / I / 1 / L). No SAW-
// prefix : the recipient types the 6 characters as-is into 6 OTP-style
// boxes on /exemple. Alphabet has 30 symbols → 30^6 ≈ 729M combinations,
// way more than Salva will ever issue.
// ═══════════════════════════════════════════════════

export type ShareCodeStatus = 'active' | 'expired' | 'revoked';

/** Sanity document type a share code can point to. */
export type ShareableDocType =
  | 'event'
  | 'property'
  | 'timepiece'
  | 'artwork'
  | 'journey'
  | 'conciergeService'
  | 'article';

export interface ShareCode {
  id: string;
  code: string; // canonical 8 chars
  sanityDocType: ShareableDocType;
  sanityDocId: string;
  status: ShareCodeStatus;
  viewCount: number;
  maxViews: number | null;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string | null;
  note: string | null;
}

/** RPC `consume_share_code(p_code)` return row. */
export interface ConsumedShareCode {
  sanityDocType: ShareableDocType | null;
  sanityDocId: string | null;
  status: ShareCodeStatus | null;
  viewCount: number;
  maxViews: number | null;
  expiresAt: string | null;
  isValid: boolean;
}

/** Canonical format = display format = 6 chars from the alphabet, no prefix. */
export const SHARE_CODE_CANONICAL_PATTERN = /^[A-HJ-NP-Z2-9]{6}$/i;
/** Alias kept for legacy imports — same pattern as canonical now that the prefix is gone. */
export const SHARE_CODE_DISPLAY_PATTERN = SHARE_CODE_CANONICAL_PATTERN;
/** 30 unambiguous chars — excludes O / 0 / I / 1 / L. */
export const SHARE_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
/** Length of every share code (canonical + display). */
export const SHARE_CODE_LENGTH = 6;

/**
 * Strip whitespace + dashes and uppercase. Tolerates the legacy "SAW-"
 * prefix so any old URL still resolves (we just drop it).
 *
 * normalizeShareCode('apercu')   → 'APERCU'
 * normalizeShareCode('AP-ERCU')  → 'APERCU'
 * normalizeShareCode('saw-apercu') → 'APERCU' (legacy tolerance)
 */
export const normalizeShareCode = (raw: string): string =>
  raw.trim().toUpperCase().replace(/^SAW-/i, '').replace(/[\s-]/g, '');

/** Format a canonical code for display. Same as canonical now (no prefix). */
export const formatShareCode = (canonical: string): string => canonical;

/**
 * Generate a fresh 6-char canonical code using the unambiguous alphabet.
 * Uses crypto.getRandomValues for entropy ; safe against duplicates within
 * realistic operator usage (DB unique constraint catches the rare clash).
 */
export const generateShareCode = (): string => {
  const out = new Array<string>(SHARE_CODE_LENGTH);
  const buf = new Uint32Array(SHARE_CODE_LENGTH);
  crypto.getRandomValues(buf);
  for (let i = 0; i < SHARE_CODE_LENGTH; i++) {
    const idx = (buf[i] ?? 0) % SHARE_CODE_ALPHABET.length;
    out[i] = SHARE_CODE_ALPHABET.charAt(idx);
  }
  return out.join('');
};
