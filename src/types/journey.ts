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

/** One day of a journey itinerary — day number is derived from list order
 *  (Jour 1, Jour 2…). Locale already resolved upstream (GROQ L_LABEL). */
export interface ItineraryDay {
  label: string;
  description?: string;
}

/**
 * Shape the journey DETAIL page renders — mirrors the Sanity model (what the
 * operator edits in the Studio): destinations, day-based itinerary, transport,
 * accommodation, party size. Sanity data maps to it 1:1 via GROQ; mock Journey
 * objects are bridged into it via toJourneyDetail() in JourneyDetail.tsx.
 */
export interface JourneyDetailData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  images: JourneyImage[];
  destinations?: string[];
  durationDays?: number;
  partySize?: string;
  itinerary?: ItineraryDay[];
  transport?: string[];
  accommodation?: string[];
}

export interface Journey {
  id: string;
  slug: string;
  title: string;
  kind: JourneyKind;
  durationDays: number;
  /** Departure city or "On request". */
  origin: string;
  /** Destination summary. Mock/admin use a "·"-joined string; Sanity (via
   *  the LARR helper) returns a locale-resolved string[]. Readers normalise. */
  destinations: string | string[];
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
