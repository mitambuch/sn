/* ═══════════════════════════════════════════════════════════════
   THE ODYSSEY — bespoke private-journey presentation content.

   All user-facing copy for the /the-hidden-shore page lives here so the
   layout file (src/pages/TheHiddenShore.tsx) stays focused on structure.
   This is a one-off, client-specific pitch — English only by design
   (the recipient is anglophone). Not part of the i18n/Sanity content
   stack. Edit the text here; the page re-renders it as-is.

   The route stays /the-hidden-shore so the link already shared keeps
   working; only the displayed title is THE ODYSSEY.

   A/B MODULE : the page ships as a single programme. The A/B schedule
   module (optionLabels / dayPhases / timeline + the <Day/> component) is
   retained but DORMANT — `timeline` is empty and <Day/> is gated off via
   `SHOW_DAY` in the page. To surface a second version, refill the three
   exports below and flip `SHOW_DAY` to true.
   ═══════════════════════════════════════════════════════════════ */

export const hiddenShore = {
  brand: 'A Saw Next Experience',
  title: 'The Odyssey',
  subtitle: 'An Exclusive Birthday Experience',
  location: 'Algarve · Portugal',
  dates: '2 – 3 July',
  epigraph: ['Some celebrations are remembered.', 'Others become legends.'],
} as const;

/** Opening thesis — first line set large, the rest as supporting statements. */
export const manifesto = {
  tag: 'The Concept',
  lead: "A private, immersive experience imagined exclusively to celebrate Burna Boy's birthday.",
  lines: [
    'For 24 hours the yacht becomes a floating private residence — a succession of exclusive moments between navigation, the Algarve coast and celebration.',
    'The aim: an experience the guests will remember for the rest of their lives.',
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
    title: 'The Programme',
    lines: [
      '2 July, 2:00 pm — pickup of Burna Boy and his guests directly at Faro.',
      'Boarding the fully privatised yacht.',
      'The yacht is at your disposal for 24 hours, until 3 July at 2:00 pm.',
    ],
  },
  {
    num: 'II',
    title: 'Navigation',
    lines: [
      'Discovery of the Algarve coast.',
      "Cruising along the region's most beautiful landscapes.",
      'Stops in coves, bays and iconic spots reachable only by sea.',
      'Swimming.',
      'Relaxation.',
      'Cocktails.',
      'Music.',
      'Sunset.',
      "Navigation is limited to 12 guests, in line with the yacht's authorisations.",
      'Six double cabins let guests enjoy the experience fully and spend the night on board.',
    ],
  },
  {
    num: 'III',
    title: 'The Celebration',
    lines: [
      "At day's end, the yacht reaches its final location — Portimão, Vilamoura or another authorised site.",
      'The yacht becomes the exclusive venue for the celebration.',
      'At anchor or alongside, it can host up to 30–35 guests, subject to approval by the competent authorities.',
      'The entire evening takes place on board.',
    ],
  },
  {
    num: 'IV',
    title: 'The Signature Moment',
    lines: [
      'At a high point of the evening, contemporary artist Julien Durix will personally present Burna Boy with an original work, created exclusively for his birthday.',
      'The presentation is an integral part of the experience.',
    ],
  },
  {
    num: 'V',
    title: 'Confidentiality',
    lines: [
      'Confidentiality is an absolute priority.',
      'Every partner, supplier, provider and contributor signs a non-disclosure agreement to guarantee total discretion throughout the event.',
      'Guests move through an entirely private and secure environment.',
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
  { label: 'Destination', value: 'Algarve · Portugal' },
  { label: 'Dates', value: '2 – 3 July · 24h' },
  { label: 'Yacht', value: 'Private · 6 cabins' },
  { label: 'Guests', value: '12 at sea · 30–35 moored' },
] as const;

/** The vessel — the yacht itself. Designer credits, key specifications from
 *  the Azimut spec sheet, and a link out to the builder so the recipient can
 *  browse photos and full detail. */
export const vessel = {
  name: 'Azimut Grande Trideck',
  lead: 'The experience unfolds aboard the Azimut Grande Trideck — a 38-metre superyacht with exterior design by Alberto Mancini and interiors by m2atelier. Four cascading terraces, from the sundeck down to a sea-level beach area.',
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
    title: 'Catering & Cuisine',
    items: ['High-end catering', 'Private chef', 'Premium breakfast served on board'],
  },
  {
    title: 'Bar',
    items: ['Premium open bar', 'Champagne', 'Premium spirits', 'Signature cocktails'],
  },
  {
    title: 'Atmosphere',
    items: [
      'Private DJ',
      'Lounge spaces',
      'World Cup on a giant screen',
      'Celebration until sunrise',
    ],
  },
];

/** Offer validity — a time-sensitive commercial note from the client. */
export const offer = {
  tag: 'Offer validity',
  lines: [
    'This proposal is subject to the current availability of the yacht and of the various partners.',
    'Given high-season demand, the offer and availability are guaranteed only until this evening. After that, they must be reconfirmed with all providers.',
  ],
} as const;

export const closing = ['The finest memories are never improvised.', 'They are created.'] as const;
