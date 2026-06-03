// ═══════════════════════════════════════════════════
// Audience segments — member segmentation + per-fiche targeting
//
// Members belong to SEGMENTS (e.g. clients referred by a bank). Each fiche
// targets segments and can exclude specific members. Mirrors the Supabase
// tables in migration 0018. The real enforcement is the Phase 2 server gate.
// ═══════════════════════════════════════════════════

/** A shared audience segment (slug is the cross-system key). */
export interface Segment {
  id: string;
  /** lowercase-kebab, the contract used in profiles.segments + fiche audience. */
  slug: string;
  label: string;
  description: string | null;
  createdAt: string;
}

/** How a fiche selects its audience. */
export type AudienceMode = 'all' | 'segments';

/** Per-fiche audience rule (Supabase, keyed by the Sanity doc id). */
export interface FicheAudience {
  sanityDocId: string;
  sanityDocType: string;
  mode: AudienceMode;
  /** Segment slugs that may see the fiche (only when mode === 'segments'). */
  segments: string[];
  /** Member ids explicitly denied, whatever the segment match. */
  excludedMemberIds: string[];
  note: string | null;
}

/** Default audience for a fiche with no row yet: visible to everyone. */
export const DEFAULT_FICHE_AUDIENCE: Omit<FicheAudience, 'sanityDocId' | 'sanityDocType'> = {
  mode: 'all',
  segments: [],
  excludedMemberIds: [],
  note: null,
};

/**
 * Pure decision: may a member with these segments see a fiche under this
 * audience rule? Mirrored server-side in the Phase 2 gate — this client
 * copy is for the admin preview + optimistic UI only, never the barrier.
 */
export const memberCanSeeFiche = (
  memberId: string,
  memberSegments: readonly string[],
  audience: Pick<FicheAudience, 'mode' | 'segments' | 'excludedMemberIds'>,
): boolean => {
  if (audience.excludedMemberIds.includes(memberId)) return false;
  if (audience.mode === 'all') return true;
  return audience.segments.some(s => memberSegments.includes(s));
};
