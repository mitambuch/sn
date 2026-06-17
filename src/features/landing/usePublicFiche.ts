// ═══════════════════════════════════════════════════
// usePublicFiche — one public catalogue fiche by type + id
//
// WHAT: Fetches a SINGLE catalogue doc flagged `visibility == "public"` in
//       Sanity, by `_type` + `_id`. Powers the public read-only fiche popup
//       (opened from the home "08.A Aperçu du catalogue" teaser).
//       Gate-aware : reads through the Netlify function's `publicFiche` action
//       when the audience gate is on (private dataset), otherwise hits Sanity
//       directly. The server HARD-restricts to visibility=="public", so a
//       private/shareCode doc can never surface here even with a guessed id.
// WHEN: Consumed once by the PublicFiche page.
// DEV: with NO Sanity connection it resolves from the mock dataset so the
//      teaser → fiche flow is testable offline. Never reached in prod.
// ═══════════════════════════════════════════════════

import type { PublicCatalogueType } from '@features/landing/usePublicCatalogue';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hasSanity, sanityClient } from '@/lib/sanity';
import { gateEnabled, gatePublicFiche } from '@/lib/sanityGate';
import { GROQ_PUBLIC_FICHE } from '@/lib/sanityQueries';
import {
  getArticle,
  getArtwork,
  getConciergeService,
  getEvent,
  getJourney,
  getProperty,
  getTimepiece,
} from '@/mocks';

/** Shape rendered by the public fiche — strictly the fields in
 *  `PUBLIC_FICHE_PROJECTION` (a whitelist). No price / specsheet / provenance:
 *  those stay behind access and are never fetched on the public route. */
export interface PublicFicheData {
  _type: PublicCatalogueType;
  _id: string;
  slug?: string;
  title?: string;
  summary?: string;
  description?: string;
  images?: { src: string; alt?: string }[];
  heroImage?: { src?: string; alt?: string };
  dateMode?: string;
  startsAt?: string;
  dateLabel?: string;
  venue?: string;
  city?: string;
  countryCode?: string;
}

const PUBLIC_TYPES: readonly PublicCatalogueType[] = [
  'event',
  'journey',
  'property',
  'timepiece',
  'artwork',
  'conciergeService',
  'article',
];

export function isPublicFicheType(value: string | undefined): value is PublicCatalogueType {
  return value !== undefined && (PUBLIC_TYPES as readonly string[]).includes(value);
}

/** Resolve a fiche from the mock dataset (dev-only fallback). Events carry the
 *  date/venue specsheet; the rest expose the generic core. */
function mockFiche(type: PublicCatalogueType, id: string): PublicFicheData | null {
  if (type === 'event') {
    const e = getEvent(id);
    if (!e) return null;
    // Conditional spreads (not direct assignment) — exactOptionalPropertyTypes
    // forbids assigning `string | undefined` to an optional `string`.
    return {
      _type: 'event',
      _id: e.id,
      ...(e.slug ? { slug: e.slug } : {}),
      ...(e.title ? { title: e.title } : {}),
      ...(e.summary ? { summary: e.summary } : {}),
      ...(e.description ? { description: e.description } : {}),
      ...(e.images ? { images: e.images } : {}),
      ...(e.dateMode ? { dateMode: e.dateMode } : {}),
      ...(e.startsAt ? { startsAt: e.startsAt } : {}),
      ...(e.dateLabel ? { dateLabel: e.dateLabel } : {}),
      ...(e.venue ? { venue: e.venue } : {}),
      ...(e.city ? { city: e.city } : {}),
      ...(e.countryCode ? { countryCode: e.countryCode } : {}),
    };
  }
  const lookup: Record<
    Exclude<PublicCatalogueType, 'event'>,
    (slugOrId: string) =>
      | {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string;
          description?: string;
          images?: { src: string; alt?: string }[];
        }
      | undefined
  > = {
    property: getProperty,
    timepiece: getTimepiece,
    artwork: getArtwork,
    journey: getJourney,
    conciergeService: getConciergeService,
    article: getArticle,
  };
  const item = lookup[type]?.(id);
  if (!item) return null;
  return {
    _type: type,
    _id: item.id ?? id,
    ...(item.slug ? { slug: item.slug } : {}),
    ...(item.title ? { title: item.title } : {}),
    ...(item.summary ? { summary: item.summary } : {}),
    ...(item.description ? { description: item.description } : {}),
    ...(item.images ? { images: item.images } : {}),
  };
}

interface UsePublicFicheResult {
  fiche: PublicFicheData | null;
  loading: boolean;
}

export function usePublicFiche(
  type: string | undefined,
  id: string | undefined,
): UsePublicFicheResult {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';

  const valid = isPublicFicheType(type) && Boolean(id);
  const mock = useMemo(
    () => (isPublicFicheType(type) && id ? mockFiche(type, id) : null),
    [type, id],
  );

  // Static cases are resolved by the initialisers — NO setState in the effect
  // body (mirrors usePublicCatalogue). The live fetch sets state in .then/.catch.
  //  • no live source (dev, no Sanity) → the mock IS the answer, no spinner.
  //  • a live source exists            → start in loading, fetch fills it in.
  const hasLiveSource = gateEnabled || hasSanity;
  const [fiche, setFiche] = useState<PublicFicheData | null>(() =>
    valid && !hasLiveSource ? mock : null,
  );
  const [loading, setLoading] = useState<boolean>(valid && hasLiveSource);

  useEffect(() => {
    // Static cases need no work — the initial state already reflects them.
    if (!isPublicFicheType(type) || !id) return;
    if (!gateEnabled && !sanityClient) return;

    let cancelled = false;
    const source = gateEnabled
      ? gatePublicFiche<PublicFicheData>(type, id, locale)
      : sanityClient!.fetch<PublicFicheData | null>(GROQ_PUBLIC_FICHE(type, id), { locale });

    Promise.resolve(source)
      .then(row => {
        if (cancelled) return;
        // NO mock fallback on the live path — the public fiche never shows a
        // fake fiche in prod (mirrors usePublicCatalogue).
        setFiche(row ?? null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.warn('[usePublicFiche] fetch failed:', err);
        setFiche(null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type, id, locale]);

  return { fiche, loading };
}
