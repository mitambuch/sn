import { describe, expect, it } from 'vitest';

import {
  GROQ_ARTICLE_DETAIL,
  GROQ_ARTICLES_LIST,
  GROQ_ARTWORK_DETAIL,
  GROQ_ARTWORKS_LIST,
  GROQ_CONCIERGE_DETAIL,
  GROQ_CONCIERGE_LIST,
  GROQ_EVENT_DETAIL,
  GROQ_EVENTS_LIST,
  GROQ_JOURNEY_DETAIL,
  GROQ_JOURNEYS_LIST,
  GROQ_PROPERTIES_LIST,
  GROQ_PROPERTY_DETAIL,
  GROQ_PUBLIC_CATALOGUE,
  GROQ_PUBLIC_FICHE,
  GROQ_SHARED_FICHE,
  GROQ_SHARED_FICHES,
  GROQ_TIMEPIECE_DETAIL,
  GROQ_TIMEPIECES_LIST,
} from '../sanityQueries';

// Every GROQ string the app can send, materialised. Detail/fiche builders are
// invoked with a representative slug/id so their full query string is checked.
const ALL_QUERIES: Record<string, string> = {
  GROQ_EVENTS_LIST,
  GROQ_PROPERTIES_LIST,
  GROQ_TIMEPIECES_LIST,
  GROQ_ARTWORKS_LIST,
  GROQ_JOURNEYS_LIST,
  GROQ_CONCIERGE_LIST,
  GROQ_ARTICLES_LIST,
  GROQ_PUBLIC_CATALOGUE,
  GROQ_EVENT_DETAIL: GROQ_EVENT_DETAIL('a-slug'),
  GROQ_PROPERTY_DETAIL: GROQ_PROPERTY_DETAIL('a-slug'),
  GROQ_TIMEPIECE_DETAIL: GROQ_TIMEPIECE_DETAIL('a-slug'),
  GROQ_ARTWORK_DETAIL: GROQ_ARTWORK_DETAIL('a-slug'),
  GROQ_JOURNEY_DETAIL: GROQ_JOURNEY_DETAIL('a-slug'),
  GROQ_CONCIERGE_DETAIL: GROQ_CONCIERGE_DETAIL('a-slug'),
  GROQ_ARTICLE_DETAIL: GROQ_ARTICLE_DETAIL('a-slug'),
  GROQ_PUBLIC_FICHE: GROQ_PUBLIC_FICHE('conciergeService', 'concierge-01'),
  GROQ_SHARED_FICHE: GROQ_SHARED_FICHE('conciergeService', 'concierge-01'),
  GROQ_SHARED_FICHES: GROQ_SHARED_FICHES(['concierge-01', 'concierge-02']),
};

describe('GROQ queries — syntax guards', () => {
  // Regression guard for the LARR bug (2026-06-25): `array[]select(…)` is NOT
  // valid GROQ — it makes the whole query 500 at runtime. The valid mapping is
  // `array[]{ "v": select(…) }.v`. Lint/typecheck/build can't catch a malformed
  // query string, so this string-level check is the only gate that can.
  it.each(Object.entries(ALL_QUERIES))(
    '%s does not use the invalid `array[]<expr>` mapping form',
    (_name, query) => {
      // Any `]` immediately followed by a function/keyword call (e.g. `[]select(`)
      // is the broken shape. The valid forms are `[]{`, `[].field`, `[0]`, etc.
      expect(query).not.toMatch(/\[\]select\(/);
    },
  );

  it('flattens localised arrays via the valid `[]{ "v": … }.v` form', () => {
    // conciergeService.capabilities is the canonical LARR consumer.
    expect(GROQ_CONCIERGE_LIST).toContain('capabilities[]{ "v": select(');
    expect(GROQ_CONCIERGE_LIST).toContain('}.v');
    expect(GROQ_PUBLIC_FICHE('conciergeService', 'concierge-01')).toContain(
      'capabilities[]{ "v": select(',
    );
  });
});
