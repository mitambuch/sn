// ═══════════════════════════════════════════════════
// Share-code domain types (mirrors public.share_codes table)
//
// Codes are single-Sanity-doc access tokens. Display format
// "SAW-XXXX-XXXX" (8 useful chars split for readability). Canonical
// storage = 8 chars without dashes or prefix. Alphabet excludes
// O / 0 / I / 1 / L (mirrors invitation_codes for consistency).
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

/** Display format the recipient receives, e.g. "SAW-AB23-C7DE". */
export const SHARE_CODE_DISPLAY_PATTERN = /^SAW-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/i;
/** Canonical format stored in DB after normalisation. */
export const SHARE_CODE_CANONICAL_PATTERN = /^[A-HJ-NP-Z2-9]{8}$/i;
/** 30 unambiguous chars — excludes O / 0 / I / 1 / L. */
export const SHARE_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Strip "SAW-" prefix and any dashes / whitespace, uppercase the rest.
 * Used at form submission to compare against the canonical code in DB.
 *
 * normalizeShareCode('saw-ab23-c7de') → 'AB23C7DE'
 */
export const normalizeShareCode = (raw: string): string =>
  raw.trim().toUpperCase().replace(/^SAW-/i, '').replace(/[\s-]/g, '');

/** Format a canonical 8-char code for display as "SAW-XXXX-XXXX". */
export const formatShareCode = (canonical: string): string =>
  `SAW-${canonical.slice(0, 4)}-${canonical.slice(4, 8)}`;

/**
 * Generate a fresh 8-char canonical code using the unambiguous alphabet.
 * Uses crypto.getRandomValues for entropy ; safe against duplicate within
 * realistic operator usage (DB unique constraint catches the rare clash).
 */
export const generateShareCode = (): string => {
  const out = new Array<string>(8);
  const buf = new Uint32Array(8);
  crypto.getRandomValues(buf);
  for (let i = 0; i < 8; i++) {
    const idx = (buf[i] ?? 0) % SHARE_CODE_ALPHABET.length;
    out[i] = SHARE_CODE_ALPHABET.charAt(idx);
  }
  return out.join('');
};
