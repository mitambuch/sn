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

export interface Event {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  /** ISO date-time (Europe/Zurich). */
  startsAt: string;
  endsAt?: string;
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
