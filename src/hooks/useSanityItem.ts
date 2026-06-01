// ═══════════════════════════════════════════════════
// useSanityItem — fetch a single GROQ doc with mock fallback
//
// WHAT: Same fallback semantics as useSanityCollection but for a single
//       document (e.g. detail page, single share fiche). When the doc
//       is missing in Sanity, returns the provided fallback (typically
//       the matching mock item).
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hasSanity, sanityClient } from '@/lib/sanity';

interface UseSanityItemOpts<TResult, TFallback> {
  query: string;
  fallback: TFallback | null;
  transform?: (row: unknown) => TResult;
}

interface UseSanityItemResult<TResult, TFallback> {
  data: TResult | TFallback | null;
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
}

export function useSanityItem<TResult, TFallback = TResult>(
  opts: UseSanityItemOpts<TResult, TFallback>,
): UseSanityItemResult<TResult, TFallback> {
  const { query, fallback, transform } = opts;
  // WHY: detail queries project editorial fields via $locale (see
  // sanityQueries.ts) — pass the active locale so the fiche renders in
  // the visitor's language with a FR fallback. Switching locale refetches.
  // Locale comes from i18next (kept in sync with the URL by LocaleProvider)
  // — hooks/ may not import from app/, and this is the canonical signal.
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : 'fr';

  const [data, setData] = useState<TResult | TFallback | null>(fallback);
  const [loading, setLoading] = useState<boolean>(hasSanity);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSanity);

  useEffect(() => {
    // No-op when Sanity isn't configured. Initial state already reflects
    // !hasSanity (loading=false, usingFallback=true) so no setState here.
    if (!sanityClient) return;
    // No-op when query is empty (e.g. slug undefined, caller already
    // redirects). Avoids firing a useless fetch.
    if (!query) return;

    let cancelled = false;

    sanityClient
      .fetch<unknown>(query, { locale })
      .then(row => {
        if (cancelled) return;
        if (!row) {
          setData(fallback);
          setUsingFallback(true);
        } else {
          const mapped = transform ? transform(row) : (row as unknown as TResult);
          setData(mapped);
          setUsingFallback(false);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.warn('[useSanityItem] fetch failed, falling back:', err);
        setError(err instanceof Error ? err.message : 'Unknown Sanity error');
        setData(fallback);
        setUsingFallback(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, fallback, transform, locale]);

  return { data, loading, error, usingFallback };
}
