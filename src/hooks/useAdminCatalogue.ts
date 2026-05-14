// ═══════════════════════════════════════════════════
// useAdminCatalogue — flat monitoring list across the 7 modules
//
// WHAT: One GROQ query fetches every catalogue document from Sanity
//       (events + properties + timepieces + artworks + journeys +
//       concierge + articles) ordered by most-recently-edited, with
//       just enough fields to render a monitoring card : title,
//       slug, visibility, thumbnail. The admin/catalogue page filters
//       by active tab client-side — one fetch, snappy tab switches.
// WHEN: Used exclusively by /:locale/admin/catalogue.
// RLS : Sanity has no row-level security. Studio Editor role is the
//       gate — only authenticated Sanity users see the dataset.
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';

import { hasSanity, sanityClient } from '@/lib/sanity';

export type CatalogueModule =
  | 'event'
  | 'property'
  | 'timepiece'
  | 'artwork'
  | 'journey'
  | 'conciergeService'
  | 'article';

export interface CatalogueRow {
  id: string;
  type: CatalogueModule;
  slug: string;
  title: string;
  visibility: string | null;
  thumbnail: string | null;
  updatedAt: string;
}

interface CatalogueRawRow {
  _id: string;
  _type: CatalogueModule;
  _updatedAt: string;
  slug: { current: string } | null;
  title: { fr?: string; en?: string } | string | null;
  visibility: string | null;
  thumb: string | null;
}

const QUERY = `*[_type in ["event", "property", "timepiece", "artwork", "journey", "conciergeService", "article"]] | order(_updatedAt desc){
  _id, _type, _updatedAt,
  slug,
  title,
  visibility,
  "thumb": images[0].asset->url
}`;

function rowFrom(raw: CatalogueRawRow): CatalogueRow {
  let title = 'Sans titre';
  if (typeof raw.title === 'string') title = raw.title;
  else if (raw.title?.fr) title = raw.title.fr;
  else if (raw.title?.en) title = raw.title.en;
  return {
    id: raw._id,
    type: raw._type,
    slug: raw.slug?.current ?? '',
    title,
    visibility: raw.visibility,
    thumbnail: raw.thumb,
    updatedAt: raw._updatedAt,
  };
}

interface UseAdminCatalogueResult {
  rows: readonly CatalogueRow[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
}

export function useAdminCatalogue(): UseAdminCatalogueResult {
  const [rows, setRows] = useState<readonly CatalogueRow[]>([]);
  const [loading, setLoading] = useState<boolean>(hasSanity);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSanity);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!hasSanity || !sanityClient) {
        setUsingFallback(true);
        setLoading(false);
        return;
      }
      try {
        const data = await sanityClient.fetch<CatalogueRawRow[]>(QUERY);
        if (cancelled) return;
        setRows(data.map(rowFrom));
        setUsingFallback(false);
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

  return { rows, loading, error, usingFallback };
}
