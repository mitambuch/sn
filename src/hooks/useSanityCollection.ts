// ═══════════════════════════════════════════════════
// useSanityCollection — fetch a GROQ list with mock fallback
//
// WHAT: Generic hook that fetches a Sanity GROQ query and falls back to
//       a provided mock dataset when :
//         - Sanity is not configured (hasSanity === false)
//         - the fetch errors out
//         - the result is null / empty array
//       This makes every page where it's used "Sanity-ready" without
//       breaking when the dataset is empty (initial state).
//
//       Loading semantics : returns loading=true ONLY during a real
//       Sanity fetch. Falls back synchronously when hasSanity is false
//       (no flicker for stub mode).
// WHEN: useSanityCollection<Event>({ query: GROQ_EVENTS_LIST, fallback: events });
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hasSanity, sanityClient } from '@/lib/sanity';
import { gateEnabled, gateList } from '@/lib/sanityGate';

interface UseSanityCollectionOpts<TResult, TFallback> {
  /** GROQ query string. */
  query: string;
  /** Static fallback data when Sanity is unconfigured / errors / empty. */
  fallback: readonly TFallback[];
  /** Optional mapper Sanity row → TResult. Default = identity (no map). */
  transform?: (row: unknown) => TResult;
  /** Catalogue module key. When set AND the gate is enabled, the list is
   *  fetched through the audience server gate (private dataset) instead of
   *  Sanity directly — restricted fiches are filtered out server-side. */
  gateModule?: string | undefined;
}

interface UseSanityCollectionResult<TResult, TFallback> {
  data: readonly TResult[] | readonly TFallback[];
  loading: boolean;
  error: string | null;
  /** True when the data shown is the fallback (Sanity not in use here). */
  usingFallback: boolean;
}

export function useSanityCollection<TResult, TFallback = TResult>(
  opts: UseSanityCollectionOpts<TResult, TFallback>,
): UseSanityCollectionResult<TResult, TFallback> {
  const { query, fallback, transform, gateModule } = opts;
  // WHY: GROQ queries below project editorial fields via $locale (see
  // sanityQueries.ts). Passing the active locale resolves content to the
  // visitor's language with a FR fallback. Switching locale refetches.
  // Locale comes from i18next (kept in sync with the URL by LocaleProvider)
  // — hooks/ may not import from app/, and this is the canonical signal.
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';

  const [data, setData] = useState<readonly TResult[] | readonly TFallback[]>(fallback);
  const [loading, setLoading] = useState<boolean>(hasSanity);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSanity);

  useEffect(() => {
    // When the gate is on for this module, read through the server (private
    // dataset) — restricted fiches are filtered out before they reach us.
    const useGate = gateEnabled && Boolean(gateModule);
    // No-op when neither the gate nor a direct client is available. Initial
    // state already reflects !hasSanity (loading=false, usingFallback=true).
    if (!useGate && !sanityClient) return;

    let cancelled = false;

    const source = useGate
      ? gateList<unknown>('list', {
          ...(gateModule !== undefined && { module: gateModule }),
          locale,
        })
      : sanityClient!.fetch<unknown[]>(query, { locale });

    source
      .then(rows => {
        if (cancelled) return;
        if (!rows || rows.length === 0) {
          setData(fallback);
          setUsingFallback(true);
        } else {
          const mapped = transform ? rows.map(transform) : (rows as unknown as TResult[]);
          setData(mapped);
          setUsingFallback(false);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.warn('[useSanityCollection] fetch failed, falling back:', err);
        setError(err instanceof Error ? err.message : 'Unknown Sanity error');
        setData(fallback);
        setUsingFallback(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, fallback, transform, locale, gateModule]);

  return { data, loading, error, usingFallback };
}
