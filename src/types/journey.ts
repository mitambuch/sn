// ═══════════════════════════════════════════════════
// Journey — bespoke travel domain types (jet/yacht/expedition)
// ═══════════════════════════════════════════════════

export type JourneyKind = 'private-jet' | 'yacht' | 'expedition' | 'safari' | 'rail-luxury';

export interface JourneyLeg {
  /** ISO date. */
  date: string;
  location: string;
  /** Editorial single-line caption ("Glacier ascent, Heliski guide"). */
  highlight: string;
}

export interface JourneyImage {
  src: string;
  alt: string;
}

export interface Journey {
  id: string;
  slug: string;
  title: string;
  kind: JourneyKind;
  durationDays: number;
  /** Departure city or "On request". */
  origin: string;
  /** Comma-separated destination summary, e.g. "Reykjavík · Akureyri · Húsavík". */
  destinations: string;
  /** Earliest available start date — ISO. */
  earliestStart?: string;
  /** Maximum guests served by this configuration. */
  guestCapacity: number;
  inclusions: string[];
  exclusions: string[];
  legs: JourneyLeg[];
  summary: string;
  description: string;
  priceCHF?: number;
  images: JourneyImage[];
  createdAt: string;
}
