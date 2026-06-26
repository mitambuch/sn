/* ═══════════════════════════════════════════════════════════════
   THE HIDDEN SHORE — bespoke private-journey presentation content.

   All user-facing copy for the /the-hidden-shore page lives here so the
   layout file (src/pages/TheHiddenShore.tsx) stays focused on structure.
   This is a one-off, client-specific pitch — English only by design
   (the recipient is anglophone). Not part of the i18n/Sanity content
   stack. Edit the text here; the page re-renders it as-is.

   OPTION A / OPTION B : the journey is identical; only the morning
   departure schedule changes (midday vs afternoon). Those entries carry
   an `options` pair instead of a fixed `label`.
   ═══════════════════════════════════════════════════════════════ */

export const hiddenShore = {
  brand: 'A Saw Next Experience',
  title: 'The Hidden Shore',
  subtitle: 'An Exclusive Birthday Journey',
  location: 'Portimão · Portugal',
  dates: '2 – 3 July',
  epigraph: ['Some celebrations are remembered.', 'Others become legends.'],

  meta: [
    { label: 'Destination', value: 'Algarve · Portugal' },
    { label: 'Dates', value: '2 – 3 July' },
    { label: 'Format', value: 'Private charter · 24h' },
  ],

  marquee: [
    'Portimão · Portugal',
    'Azimut 80 Fly',
    'Private charter',
    'The Hidden Shore',
    'Algarve coastline',
    '2 – 3 July',
  ],
} as const;

/** Opening thesis — first line set large, the rest as supporting statements. */
export const manifesto = {
  tag: 'A Private Journey',
  lead: 'This experience has been imagined as a succession of moments rather than an event.',
  lines: [
    'Nothing is left to chance.',
    'Every detail has been designed to surprise, elevate emotions and create memories that will last a lifetime.',
    'Absolute privacy.',
    'Exceptional service.',
    'A destination that remains secret until the very last moment.',
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
    title: 'The Invitation',
    lines: [
      "The experience begins directly from the guests' private villas.",
      'Luxury vehicles collect each guest individually.',
      'No destination is announced.',
      'The journey has already begun.',
    ],
  },
  {
    num: 'II',
    title: 'Leaving the Shore',
    lines: [
      'Private boarding aboard the Azimut 80 Fly.',
      'Welcome cocktails.',
      'Champagne.',
      'Personalised soundtrack.',
      'The yacht slowly leaves the marina to begin an exclusive cruise along the Algarve coastline.',
      'Time slows down.',
    ],
  },
  {
    num: 'III',
    title: 'The Ocean',
    lines: [
      'Several hours dedicated to freedom.',
      'Swimming.',
      'Sun.',
      'Music.',
      'Fine wines.',
      'Premium spirits.',
      'Signature cocktails.',
      'Private chef.',
      'Exceptional scenery.',
      'An afternoon designed to disconnect from everything except the present moment.',
    ],
  },
  {
    num: 'IV',
    title: 'The Hidden Shore',
    lines: [
      'As the sun begins to set, the yacht anchors offshore.',
      'Luxury tenders approach.',
      'Guests leave the yacht without knowing where they are heading.',
      'A few minutes later…',
      'An entirely private beach appears.',
      'No public.',
      'No spectators.',
      'No distractions.',
      'Only a place created for one evening.',
      'Only for one celebration.',
    ],
  },
  {
    num: 'V',
    title: 'Under the Stars',
    lines: [
      'Rei das Praias has been transformed into an exclusive private residence.',
      'An elegant atmosphere.',
      'Warm lighting.',
      'Personalised decoration.',
      'Live music.',
      'Premium open bar.',
      'Signature cocktails.',
      'A gastronomic dinner prepared exclusively for the occasion.',
      'An evening where every detail contributes to a unique atmosphere.',
    ],
  },
  {
    num: 'VI',
    title: 'The Celebration',
    lines: [
      'As night falls, the atmosphere naturally evolves.',
      'The lounge becomes a celebration.',
      'Music.',
      'Dance.',
      'Conversations.',
      'Laughter.',
      'Open Bar.',
      'Private DJ.',
      'Premium service.',
      'The celebration continues without interruption.',
    ],
  },
  {
    num: 'VII',
    title: 'The Legacy',
    lines: [
      'A unique work of art is revealed.',
      'Created exclusively for Burna Boy by contemporary French artist Julien Durix.',
      'A one-of-one artwork.',
      'Created for one person.',
      'A timeless reminder of an unforgettable night.',
    ],
  },
  {
    num: 'VIII',
    title: 'Sunrise',
    lines: [
      'The music gently fades.',
      'The first light appears over the ocean.',
      'Breakfast is served facing the sea.',
      'Fresh pastries.',
      'Seasonal fruits.',
      'Eggs prepared to order.',
      'Fresh juices.',
      'Coffee.',
      'Tea.',
      'Champagne available.',
      'A peaceful ending before returning to the villas.',
    ],
  },
];

export type OptionKey = 'a' | 'b';

export const optionLabels: Record<OptionKey, { name: string; tagline: string }> = {
  a: { name: 'Option A', tagline: 'Midday departure' },
  b: { name: 'Option B', tagline: 'Afternoon departure' },
};

export interface TimelineEntry {
  /** Left-column label (a clock time or a phase name). Null when the time
   *  depends on the chosen option — then `options` supplies both values. */
  label: string | null;
  /** Option-dependent start times (used when `label` is null). */
  options?: Record<OptionKey, string>;
  body: string;
}

export const timeline: TimelineEntry[] = [
  {
    label: null,
    options: { a: '11:00', b: '14:00' },
    body: "Private collection from the guests' villas.",
  },
  {
    label: null,
    options: { a: '11:45', b: '14:45' },
    body: 'Arrival at Portimão Marina. Private boarding. Welcome cocktails. Champagne.',
  },
  {
    label: null,
    options: { a: '12:00', b: '15:00' },
    body: 'Departure. Private navigation. Relaxation. Swimming. Water activities. Lunch and drinks served on board.',
  },
  {
    label: 'Throughout the afternoon',
    body: 'Exploration of the Algarve coastline. Stops for swimming. Cocktail service. Music. Photography.',
  },
  {
    label: 'Golden Hour',
    body: 'Sunset navigation. Signature cocktails. Premium canapés.',
  },
  {
    label: '18:30',
    body: 'Arrival offshore. Transfer by luxury tenders.',
  },
  {
    label: '18:45',
    body: 'Arrival at the Hidden Shore. Private welcome. Champagne. Cocktails. Live music.',
  },
  {
    label: 'World Cup Lounge',
    body: 'Private screening of the FIFA World Cup on a giant LED screen. Premium lounge seating. Cocktail service. Open Bar.',
  },
  {
    label: 'Dinner Experience',
    body: "Exclusive gastronomic dinner. Chef's tasting menu. Wine pairing. Live culinary experience.",
  },
  {
    label: 'Celebration',
    body: 'Private DJ. Premium Open Bar. Dance floor. Late-night food. Exclusive entertainment.',
  },
  {
    label: 'Signature Moment',
    body: 'Presentation of the Julien Durix artwork. Birthday cake. Champagne. Celebration.',
  },
  {
    label: 'Until Sunrise',
    body: 'Music. Cocktails. Premium service. Late-night lounge. Breakfast preparation.',
  },
  {
    label: 'Sunrise Breakfast',
    body: 'Breakfast served facing the sea. Relaxation. Private transfers back to the villas.',
  },
];

export interface IncludedGroup {
  title: string;
  items: string[];
}

export const included: IncludedGroup[] = [
  {
    title: 'Private Yacht',
    items: [
      'Azimut 80 Fly exclusive charter',
      'Captain',
      'Crew',
      'Fuel',
      'Port fees',
      'Cleaning',
      'Insurance',
    ],
  },
  {
    title: 'Maritime Operations',
    items: ['Luxury tenders', 'Tender captains', 'Fuel', 'Guest transfers'],
  },
  {
    title: 'Ground Transportation',
    items: [
      'Premium Mercedes V-Class',
      'Professional chauffeurs',
      'Coordination',
      'Guest logistics',
    ],
  },
  {
    title: 'Exclusive Venue',
    items: ['Full privatisation', 'Exclusive use', 'Venue management', 'Operational coordination'],
  },
  {
    title: 'Event Design',
    items: [
      'Complete decoration',
      'Floral design',
      'Lounge furniture',
      'Ambient lighting',
      'Candles & lanterns',
      'Styling',
    ],
  },
  {
    title: 'Gastronomy',
    items: [
      'Private chef',
      'Kitchen brigade',
      'Service staff',
      'Cocktail reception',
      'Gastronomic dinner',
      'Late-night food',
      'Sunrise breakfast',
      'Birthday cake',
    ],
  },
  {
    title: 'Premium Bar',
    items: [
      'Champagne',
      'Fine wines',
      'Premium spirits',
      'Signature cocktails',
      'Mocktails',
      'Soft drinks',
      'Mineral waters',
      'Fresh juices',
      'Coffee & Tea',
      'Ice',
      'Glassware',
      'Mixologist',
      'Bartenders',
    ],
  },
  {
    title: 'Entertainment',
    items: [
      'Private DJ',
      'Professional sound system',
      'Architectural lighting',
      'World Cup giant screen',
      'Audiovisual production',
    ],
  },
  {
    title: 'Security',
    items: [
      'Close protection',
      'Private security officers',
      'Access control',
      'Venue security',
      'Yacht security',
      'Guest management',
    ],
  },
  {
    title: 'Media',
    items: [
      'Photographer',
      'Videographer',
      'Drone footage (subject to authorisation)',
      'Private content delivery',
    ],
  },
  {
    title: 'Signature Gift',
    items: [
      'Exclusive Julien Durix artwork',
      'Certificate of authenticity',
      'Premium presentation',
    ],
  },
  {
    title: 'Concierge & Production',
    items: [
      'Complete project management',
      'Event production',
      'Operational coordination',
      'On-site management',
      '24/7 assistance',
      'Wi-Fi & backup internet',
      'Technical support',
      'Weather contingency',
      'Operational backup plan',
    ],
  },
];

export const closing = ['The experience ends.', 'The memory remains forever.'] as const;
