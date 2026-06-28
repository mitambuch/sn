/* ═══════════════════════════════════════════════════════════════
   THE ODYSSEY — bespoke private-journey presentation content.

   All user-facing copy for the /the-hidden-shore page lives here so the
   layout file (src/pages/TheHiddenShore.tsx) stays focused on structure.
   This is a one-off, client-specific pitch — English only by design
   (the recipient is anglophone). Not part of the i18n/Sanity content
   stack. Edit the text here; the page re-renders it as-is.

   The route stays /the-hidden-shore so the link already shared keeps
   working; only the displayed title changed to THE ODYSSEY.

   A/B MODULE : the page now ships as a single programme. The A/B
   schedule module (optionLabels / dayPhases / timeline + the <Day/>
   component) is retained but DORMANT — `timeline` is empty and <Day/>
   is gated off via `SHOW_DAY` in the page. To surface a second version,
   refill the three exports below and flip `SHOW_DAY` to true.
   ═══════════════════════════════════════════════════════════════ */

export const hiddenShore = {
  brand: 'A Saw Next Experience',
  title: 'The Odyssey',
  subtitle: 'An Exclusive Birthday Journey',
  location: 'Cascais → Algarve · Portugal',
  dates: '1 – 3 July',
  epigraph: ['Some celebrations are remembered.', 'Others become legends.'],
} as const;

/** Opening thesis — first line set large, the rest as supporting statements. */
export const manifesto = {
  tag: 'The Concept',
  lead: 'A three-day voyage along the Portuguese coast, imagined as a succession of moments rather than an event.',
  lines: [
    "Conceived for Burna Boy's birthday.",
    'More than an event — an immersive journey where luxury, privacy and emotion meet.',
    'Every detail is designed for an adventure the guests will never forget.',
  ],
} as const;

export interface Chapter {
  /** Roman numeral shown as the chapter index. */
  num: string;
  title: string;
  /** Short editorial fragments, each rendered on its own line. */
  lines: string[];
}

export const chapters: Chapter[] = [
  {
    num: 'I',
    title: 'The Departure',
    lines: [
      'Day one — 1 July. Late morning.',
      "Departure from Cascais, one of Portugal's most prestigious destinations, near Lisbon.",
      'Guests board a fully privatised yacht for an exceptional passage toward the Algarve.',
      'Along the way, carefully chosen stops:',
      'Secluded coves.',
      'Secret beaches.',
      'Spectacular landscapes.',
      'Iconic coastal villages.',
      'Spots reachable only by sea.',
      'Each stop is an experience in itself — rest, gastronomy, swimming, discovery.',
      'The first night is spent on board.',
    ],
  },
  {
    num: 'II',
    title: 'The Arrival',
    lines: [
      'Day two — 2 July.',
      'The yacht continues along the most beautiful stretches of the Algarve.',
      'Guests discover new exceptional places before reaching the destination chosen for the celebration.',
      "At day's end, the yacht is berthed or held at anchor, subject to the authorisations obtained.",
      'Capacity is limited to 12 guests under sail; up to 40 guests when static, subject to approval by the competent authorities.',
      'The birthday celebration takes place entirely on board.',
      'The yacht becomes a private reception venue, transformed for the occasion.',
    ],
  },
  {
    num: 'III',
    title: 'The Celebration',
    lines: [
      'A celebration imagined down to the last detail.',
      'Premium open bar.',
      'Private chef.',
      'Gastronomic dinner.',
      'Signature cocktails.',
      'Private DJ.',
      'Sunset atmosphere.',
      'World Cup broadcast on a giant screen.',
      'Lounge spaces.',
      'Celebration until sunrise.',
      'Breakfast served facing the ocean.',
    ],
  },
  {
    num: 'IV',
    title: 'The Signature Moment',
    lines: [
      'To make this celebration truly unique, contemporary artist Julien Durix will personally present Burna Boy with an original work, created exclusively for his birthday.',
      'A single piece.',
      'A timeless keepsake.',
      'A work that will exist in one example only.',
    ],
  },
  {
    num: 'V',
    title: 'The Sunrise',
    lines: [
      'Day three — 3 July.',
      'After breakfast on board, guests enjoy a final moment of calm before the experience ends.',
      'The yacht is returned on 3 July at 10:00.',
    ],
  },
  {
    num: 'VI',
    title: 'The Saw Next Philosophy',
    lines: [
      'At Saw Next, we do not simply offer a yacht.',
      'We create experiences.',
      'Every project is imagined bespoke.',
      'Every detail is considered with precision.',
      'Every moment is designed to leave a lasting mark.',
    ],
  },
];

/* ───────────────────────────────────────────────────────────────
   A/B SCHEDULE MODULE — DORMANT. Retained for a future second version
   of the journey. `timeline` is intentionally empty and <Day/> is gated
   off (SHOW_DAY=false) in the page. Refill to re-enable. ─────────── */

export type OptionKey = 'a' | 'b';

export const optionLabels: Record<OptionKey, { name: string; tagline: string }> = {
  a: { name: 'Option A', tagline: 'Version A' },
  b: { name: 'Option B', tagline: 'Version B' },
};

/** Phases that group the dormant schedule. Neutral placeholder until a
 *  second version is authored. */
export const dayPhases = ['Schedule'] as const;

export type DayPhase = (typeof dayPhases)[number];

export interface TimelineEntry {
  /** Which act of the day this moment belongs to. */
  phase: DayPhase;
  /** Left-column label (a clock time or a moment name). Null when the time
   *  depends on the chosen option — then `options` supplies both values. */
  label: string | null;
  /** Option-dependent start times (used when `label` is null). */
  options?: Record<OptionKey, string>;
  body: string;
}

/** Empty by design — the journey ships as a single programme. */
export const timeline: TimelineEntry[] = [];

/** At-a-glance key facts — a compact, always-visible orientation strip. */
export const facts = [
  { label: 'Destination', value: 'Cascais → Algarve' },
  { label: 'Dates', value: '1 – 3 July' },
  { label: 'Yacht', value: 'Private · 6 cabins' },
  { label: 'Guests', value: '12 sailing · 40 static' },
] as const;

/** The vessel — the yacht itself. Designer credits, key specifications from
 *  the Azimut spec sheet, and a link out to the builder so the recipient can
 *  browse photos and full detail. */
export const vessel = {
  name: 'Azimut Grande Trideck',
  lead: 'The journey unfolds aboard the Azimut Grande Trideck — a 38-metre superyacht with exterior design by Alberto Mancini and interiors by m2atelier. Four cascading terraces, from the sundeck down to a sea-level beach area.',
  designers: [
    { role: 'Concept & exterior', name: 'Alberto Mancini' },
    { role: 'Interior', name: 'm2atelier' },
    { role: 'Builder', name: 'Azimut Yachts' },
  ],
  specs: [
    { label: 'Length overall', value: '38.22 m · 125′5″' },
    { label: 'Beam', value: '7.98 m · 26′2″' },
    { label: 'Cabins', value: '5/6 + 4 crew' },
    { label: 'Berths', value: '10 + 6 crew' },
    { label: 'Engines', value: '2 × MTU' },
    { label: 'Max speed', value: '23–25 knots' },
  ],
  link: 'https://azimutyachts.com/en/grande-series/grande-trideck/',
  linkLabel: 'Explore the yacht on Azimut',
} as const;

export interface IncludedGroup {
  title: string;
  items: string[];
}

export const included: IncludedGroup[] = [
  {
    title: 'The Yacht',
    items: [
      'Fully privatised yacht',
      'Private navigation from Cascais to the Algarve',
      '6 double cabins',
      '12 guests maximum under sail',
      'Dedicated professional crew',
      'Indoor and outdoor living spaces',
      'Sun deck',
      'Lounge areas',
    ],
  },
  {
    title: 'The Celebration',
    items: [
      'Premium open bar',
      'Private chef',
      'Gastronomic dinner',
      'Signature cocktails',
      'Private DJ',
      'Sunset atmosphere',
      'World Cup on a giant screen',
      'Lounge spaces',
      'Celebration until sunrise',
      'Sunrise breakfast facing the ocean',
    ],
  },
  {
    title: 'Signature Gift',
    items: [
      'Original Julien Durix artwork',
      'Created exclusively for the occasion',
      'A single, one-of-one piece',
    ],
  },
  {
    title: 'Coordination & Confidentiality',
    items: [
      'Bespoke project management',
      'On-site coordination',
      'NDA signed by every partner and provider',
      'Total privacy and security',
    ],
  },
];

export const closing = ['The finest memories are never improvised.', 'They are created.'] as const;
