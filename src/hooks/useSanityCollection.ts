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

import { hasSanity, sanityClient } from '@/lib/sanity';

interface UseSanityCollectionOpts<TResult, TFallback> {
  /** GROQ query string. */
  query: string;
  /** Static fallback data when Sanity is unconfigured / errors / empty. */
  fallback: readonly TFallback[];
  /** Optional mapper Sanity row → TResult. Default = identity (no map). */
  transform?: (row: unknown) => TResult;
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
  const { query, fallback, transform } = opts;

  const [data, setData] = useState<readonly TResult[] | readonly TFallback[]>(fallback);
  const [loading, setLoading] = useState<boolean>(hasSanity);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSanity);

  useEffect(() => {
    // No-op when Sanity isn't configured. Initial state already reflects
    // !hasSanity (loading=false, usingFallback=true) so no setState here.
    if (!sanityClient) return;

    let cancelled = false;

    sanityClient
      .fetch<unknown[]>(query)
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
  }, [query, fallback, transform]);

  return { data, loading, error, usingFallback };
}
