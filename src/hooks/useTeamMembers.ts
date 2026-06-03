// ═══════════════════════════════════════════════════
// useTeamMembers — Sanity teamMember docs ordered by display rank
//
// WHAT: One GROQ fetch returns every teamMember document with the fields
//       the Interlocutor landing section needs (name + tag + bio +
//       contact channels + isFocal flag), ordered by the `order` field
//       (Valmont = 1, then network 2-5). Falls back to {usingFallback:
//       true} when Sanity is not configured or the dataset is empty,
//       so the Interlocutor section can substitute its hardcoded i18n
//       MEMBERS array.
// WHEN: Used by features/landing/Interlocutor.tsx exclusively.
// RULE: Phone / email / whatsapp / linkedin live in Sanity for editorial
//       convenience but the Interlocutor falls back to FOCAL_CHANNELS
//       (hardcoded) when missing — operational contact info must never
//       go blank in front of the client.
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';

import { hasSanity, sanityClient } from '@/lib/sanity';
import { gateEnabled, gateList } from '@/lib/sanityGate';
import { GROQ_TEAM } from '@/lib/sanityQueries';

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  isFocal: boolean;
  order: number;
  tag: { fr?: string; en?: string };
  bio: { fr?: string; en?: string };
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  linkedin: string | null;
}

interface TeamMemberRaw {
  _id: string;
  firstName: string;
  lastName: string;
  slug: { current: string } | null;
  isFocal: boolean | null;
  order: number | null;
  tag: { fr?: string; en?: string } | null;
  bio: { fr?: string; en?: string } | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  linkedin: string | null;
}

const QUERY = GROQ_TEAM;

function rowToMember(raw: TeamMemberRaw): TeamMember {
  return {
    id: raw._id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    slug: raw.slug?.current ?? '',
    isFocal: raw.isFocal === true,
    order: raw.order ?? 99,
    tag: raw.tag ?? {},
    bio: raw.bio ?? {},
    phone: raw.phone,
    email: raw.email,
    whatsapp: raw.whatsapp,
    linkedin: raw.linkedin,
  };
}

interface UseTeamMembersResult {
  members: readonly TeamMember[];
  loading: boolean;
  error: string | null;
  /** True when no Sanity data is available — caller should use its fallback. */
  usingFallback: boolean;
}

export function useTeamMembers(): UseTeamMembersResult {
  const [members, setMembers] = useState<readonly TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(hasSanity);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSanity);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const useGate = gateEnabled;
      if (!useGate && (!hasSanity || !sanityClient)) {
        setUsingFallback(true);
        setLoading(false);
        return;
      }
      try {
        const data = useGate
          ? await gateList<TeamMemberRaw>('team')
          : await sanityClient!.fetch<TeamMemberRaw[]>(QUERY);
        if (cancelled) return;
        if (data.length === 0) {
          setUsingFallback(true);
        } else {
          setMembers(data.map(rowToMember));
          setUsingFallback(false);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Sanity error');
        setUsingFallback(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { members, loading, error, usingFallback };
}
