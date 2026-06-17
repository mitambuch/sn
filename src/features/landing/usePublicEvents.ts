// ═══════════════════════════════════════════════════
// usePublicEvents — public events for the landing teaser
//
// WHAT: Fetches events flagged `visibility == "public"` in Sanity, for the
//       public home Events section. Gate-aware : reads through the Netlify
//       function's `publicEvents` action when the audience gate is on
//       (private dataset), otherwise hits Sanity directly. NO mock fallback
//       — the public home must never show fake fiches, so when nothing real
//       is published the section simply renders nothing.
// WHEN: Consumed once by LandingEvents.
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hasSanity, sanityClient } from '@/lib/sanity';
import { gateEnabled, gateList } from '@/lib/sanityGate';
import { GROQ_PUBLIC_EVENTS } from '@/lib/sanityQueries';
import { listEvents } from '@/mocks';
import type { PublicEvent } from '@/types/event';

interface UsePublicEventsResult {
  events: readonly PublicEvent[];
  loading: boolean;
}

/** DEV-only preview seed : when running locally with NO Sanity connection,
 *  surface a couple of mock events so the section is visible while building.
 *  `import.meta.env.DEV` is false in every production build, so this can
 *  never ship fake fiches to a real client. The moment real Sanity creds are
 *  present (sanityClient set) or the gate is on, this is bypassed entirely. */
const devSeed = (): readonly PublicEvent[] =>
  import.meta.env.DEV && !gateEnabled && !sanityClient ? listEvents().slice(0, 2) : [];

export function usePublicEvents(): UsePublicEventsResult {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';

  const [events, setEvents] = useState<readonly PublicEvent[]>(devSeed);
  // Only "loading" when there's actually a source to read from.
  const [loading, setLoading] = useState<boolean>(gateEnabled || hasSanity);

  useEffect(() => {
    // No source to read from. Initial `loading` already reflects this
    // (gateEnabled || hasSanity === false here), so just bail — calling
    // setState synchronously in an effect is a lint error and pointless.
    if (!gateEnabled && !sanityClient) return;

    let cancelled = false;

    const source = gateEnabled
      ? gateList<PublicEvent>('publicEvents', { locale })
      : sanityClient!.fetch<PublicEvent[]>(GROQ_PUBLIC_EVENTS, { locale });

    source
      .then(rows => {
        if (cancelled) return;
        setEvents(rows ?? []);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.warn('[usePublicEvents] fetch failed:', err);
        setEvents([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return { events, loading };
}
