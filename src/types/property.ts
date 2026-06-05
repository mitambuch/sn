// ═══════════════════════════════════════════════════
// Property — real-estate domain types (chalet/villa/penthouse)
//
// Curated residences offered to vetted clients. Address is intentionally
// vague (canton-level only) — full coordinates are released after
// inquiry confirmation.
// ═══════════════════════════════════════════════════

export type PropertyKind = 'chalet' | 'villa' | 'penthouse' | 'estate' | 'townhouse';

export type PropertyAvailability = 'sale' | 'rent' | 'both';

export interface PropertyImage {
  src: string;
  alt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  kind: PropertyKind;
  availability: PropertyAvailability;
  /** Country code or canton — never the full address. */
  region: string;
  countryCode: string;
  surfaceSqm: number;
  bedrooms: number;
  bathrooms: number;
  /** Plot size in square metres, undefined for penthouses without grounds. */
  plotSqm?: number;
  yearBuilt?: number;
  /** "On request" by convention — actual figure stored for operator only. */
  priceCHF?: number;
  /** Editorial blurb, 2-4 sentences. Should already be FR or EN per locale. */
  summary: string;
  /** Long-form description used on detail page. */
  description: string;
  /** First image is the hero. Min 4 images recommended. */
  images: PropertyImage[];
  /** Concierge-curated highlights (e.g. "Private ski room", "Panoramic Mont-Blanc view").
   *  Mock-only for now — not in the Sanity schema, so optional + guarded. */
  highlights?: string[];
  createdAt: string;
}
