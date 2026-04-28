// ═══════════════════════════════════════════════════
// Invitation code domain types
//
// Codes are single-use. Display format = "SAW-XXXX-XXXX" (8 useful
// chars split for readability). Canonical storage = 8 chars without
// dashes or prefix. Alphabet excludes O / 0 / I / 1 / L to avoid
// misreads when the operator dictates a code over the phone.
// ═══════════════════════════════════════════════════

export type InvitationStatus = 'unused' | 'redeemed' | 'expired' | 'revoked';

export interface InvitationCode {
  id: string;
  code: string; // canonical 8-char value (no SAW- prefix, no dashes)
  status: InvitationStatus;
  createdAt: string;
  redeemedAt: string | null;
  redeemedBy: string | null; // user id, null while unused
  expiresAt: string | null;
  createdBy: string; // admin user id
}

export const INVITATION_CODE_PREFIX = 'SAW-';
/** 30 unambiguous chars — excludes O / 0 / I / 1 / L. */
export const INVITATION_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
/** Display format the user types, e.g. "SAW-AB23-C7DE". */
export const INVITATION_CODE_DISPLAY_PATTERN = /^SAW-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/i;
/** Canonical format stored in DB after normalization. */
export const INVITATION_CODE_CANONICAL_PATTERN = /^[A-HJ-NP-Z2-9]{8}$/i;

/**
 * Strip "SAW-" prefix and any dashes/whitespace, uppercase the rest.
 * Used at form submission to compare against the canonical code in DB.
 *
 * normalizeInvitationCode('saw-ab23-c7de') → 'AB23C7DE'
 */
export const normalizeInvitationCode = (raw: string): string =>
  raw.trim().toUpperCase().replace(/^SAW-/i, '').replace(/[\s-]/g, '');
