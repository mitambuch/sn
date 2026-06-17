// ═══════════════════════════════════════════════════
// usePublicCatalogue — public catalogue items for the landing teaser
//
// WHAT: Fetches ANY catalogue doc flagged `visibility == "public"` in Sanity
//       (event, journey, property, timepiece, artwork, conciergeService,
//       article) — not just events. Powers the home "08.A Aperçu du
//       catalogue" grid. Gate-aware : reads through the Netlify function's
//       `publicCatalogue` action when the audience gate is on (private
//       dataset), otherwise hits Sanity directly. NO mock fallback in prod —
//       the public home never shows fake fiches.
// WHEN: Consumed once by Access (the 08.A teaser).
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hasSanity, sanityClient } from '@/lib/sanity';
import { gateEnabled, gateList } from '@/lib/sanityGate';
import { GROQ_PUBLIC_CATALOGUE } from '@/lib/sanityQueries';
import { listEvents } from '@/mocks';

export type PublicCatalogueType =
  | 'event'
  | 'journey'
  | 'property'
  | 'timepiece'
  | 'artwork'
  | 'conciergeService'
  | 'article';

export interface PublicCatalogueItem {
  id: string;
  type: PublicCatalogueType;
  title: string;
  image: { src: string; alt: string } | null;
}

interface UsePublicCatalogueResult {
  items: readonly PublicCatalogueItem[];
  loading: boolean;
}

/** DEV-only preview seed : a couple of mock events when running locally with
 *  NO Sanity connection, so the grid is visible while building. Never ships
 *  to prod (`import.meta.env.DEV` is false in every production build). */
const devSeed = (): readonly PublicCatalogueItem[] =>
  import.meta.env.DEV && !gateEnabled && !sanityClient
    ? listEvents()
        .slice(0, 2)
        .map(e => ({
          id: e.id,
          type: 'event' as const,
          title: e.title,
          image: e.images[0] ? { src: e.images[0].src, alt: e.images[0].alt } : null,
        }))
    : [];

export function usePublicCatalogue(): UsePublicCatalogueResult {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';

  const [items, setItems] = useState<readonly PublicCatalogueItem[]>(devSeed);
  const [loading, setLoading] = useState<boolean>(gateEnabled || hasSanity);

  useEffect(() => {
    // No source to read from. Initial state already reflects this.
    if (!gateEnabled && !sanityClient) return;

    let cancelled = false;

    const source = gateEnabled
      ? gateList<PublicCatalogueItem>('publicCatalogue', { locale })
      : sanityClient!.fetch<PublicCatalogueItem[]>(GROQ_PUBLIC_CATALOGUE, { locale });

    source
      .then(rows => {
        if (cancelled) return;
        setItems(rows ?? []);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.warn('[usePublicCatalogue] fetch failed:', err);
        setItems([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return { items, loading };
}
