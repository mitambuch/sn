// ═══════════════════════════════════════════════════
// Event — exclusive event domain types (gala/concert/sport/private)
// ═══════════════════════════════════════════════════

export type EventCategory =
  | 'gala'
  | 'opening'
  | 'concert'
  | 'sport'
  | 'private-dinner'
  | 'auction'
  | 'cultural';

export type EventDressCode =
  | 'black-tie'
  | 'cocktail'
  | 'business'
  | 'smart-casual'
  | 'tenue-d-hiver'
  | 'open';

export interface EventImage {
  src: string;
  alt: string;
}

/**
 * How an event's date is expressed.
 * - `exact`   — calendar `startsAt` (+ optional `endsAt`). Default.
 * - `allYear` — permanently available, no date. Renders a localized label.
 * - `free`    — operator-written free text in `dateLabel` (e.g. "Sur demande").
 * `undefined` is treated as `exact` (legacy docs / mocks predate this field).
 */
export type EventDateMode = 'exact' | 'allYear' | 'free';

export interface Event {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  /** Date expression mode. Absent ⇒ `exact`. */
  dateMode?: EventDateMode;
  /** ISO date-time (Europe/Zurich). Present only in `exact` mode. */
  startsAt?: string;
  endsAt?: string;
  /** Resolved free-text date (active locale) — used in `free` mode. */
  dateLabel?: string;
  city: string;
  countryCode: string;
  venue: string;
  capacity: number;
  /** Number of seats reserved by Sawnext for clients (subset of capacity). */
  allocatedSeats: number;
  dressCode: EventDressCode;
  /** Editorial 2-3 sentences. */
  summary: string;
  description: string;
  /** Programme timeline as label/time pairs. */
  programme: { time: string; label: string }[];
  priceCHF?: number;
  images: EventImage[];
  createdAt: string;
}
