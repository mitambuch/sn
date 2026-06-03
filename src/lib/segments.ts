// ═══════════════════════════════════════════════════
// segments — Supabase access for audience segments + fiche audience
//
// WHAT: admin-side CRUD for the segment vocabulary, member tagging, and
//       per-fiche audience rules (migration 0018). RLS gates everything to
//       admins; these helpers just shape the calls + map snake_case → camel.
// WHEN: consumed by the admin segments / users / catalogue surfaces.
// ═══════════════════════════════════════════════════

import { supabase } from '@/lib/supabase';
import {
  type AudienceMode,
  DEFAULT_FICHE_AUDIENCE,
  type FicheAudience,
  type Segment,
} from '@/types/segment';

type SegmentRow = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  created_at: string;
};

const mapSegment = (r: SegmentRow): Segment => ({
  id: r.id,
  slug: r.slug,
  label: r.label,
  description: r.description,
  createdAt: r.created_at,
});

/** List the whole segment vocabulary, alphabetical by label. */
export const listSegments = async (): Promise<Segment[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('segments').select('*').order('label');
  if (error) throw new Error(error.message);
  return ((data ?? []) as SegmentRow[]).map(mapSegment);
};

/** Create a segment. slug must be lowercase-kebab (DB-checked). */
export const createSegment = async (
  slug: string,
  label: string,
  description?: string,
): Promise<Segment> => {
  if (!supabase) throw new Error('Supabase non configuré.');
  const { data, error } = await supabase
    .from('segments')
    .insert({ slug, label, ...(description ? { description } : {}) })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapSegment(data as SegmentRow);
};

export const deleteSegment = async (id: string): Promise<void> => {
  if (!supabase) throw new Error('Supabase non configuré.');
  const { error } = await supabase.from('segments').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

/** Replace a member's segment slugs (profiles.segments). */
export const setMemberSegments = async (memberId: string, slugs: string[]): Promise<void> => {
  if (!supabase) throw new Error('Supabase non configuré.');
  const { error } = await supabase.from('profiles').update({ segments: slugs }).eq('id', memberId);
  if (error) throw new Error(error.message);
};

type AudienceRow = {
  sanity_doc_id: string;
  sanity_doc_type: string;
  audience_mode: AudienceMode;
  segments: string[];
  excluded_member_ids: string[];
  note: string | null;
};

const mapAudience = (r: AudienceRow): FicheAudience => ({
  sanityDocId: r.sanity_doc_id,
  sanityDocType: r.sanity_doc_type,
  mode: r.audience_mode,
  segments: r.segments,
  excludedMemberIds: r.excluded_member_ids,
  note: r.note,
});

/** Audience rule for a fiche, or the default (visible to all) when unset. */
export const getFicheAudience = async (
  sanityDocId: string,
  sanityDocType: string,
): Promise<FicheAudience> => {
  if (!supabase) return { sanityDocId, sanityDocType, ...DEFAULT_FICHE_AUDIENCE };
  const { data, error } = await supabase
    .from('fiche_audience')
    .select('*')
    .eq('sanity_doc_id', sanityDocId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return { sanityDocId, sanityDocType, ...DEFAULT_FICHE_AUDIENCE };
  return mapAudience(data as AudienceRow);
};

/** Create or update a fiche's audience rule (upsert on sanity_doc_id). */
export const upsertFicheAudience = async (audience: FicheAudience): Promise<void> => {
  if (!supabase) throw new Error('Supabase non configuré.');
  const { error } = await supabase.from('fiche_audience').upsert(
    {
      sanity_doc_id: audience.sanityDocId,
      sanity_doc_type: audience.sanityDocType,
      audience_mode: audience.mode,
      segments: audience.segments,
      excluded_member_ids: audience.excludedMemberIds,
      note: audience.note,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'sanity_doc_id' },
  );
  if (error) throw new Error(error.message);
};
