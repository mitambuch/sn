// ═══════════════════════════════════════════════════
// Timepiece — watch/horology domain types
//
// Curated horology pieces. Strictly fact-driven — no marketing prose.
// Provenance and papers are central to HNW collector trust.
// ═══════════════════════════════════════════════════

export type TimepieceCondition =
  | 'mint'
  | 'unworn'
  | 'excellent'
  | 'very-good'
  | 'good'
  | 'restored';

export type TimepieceMaterial =
  | 'steel'
  | 'gold-yellow'
  | 'gold-white'
  | 'gold-rose'
  | 'platinum'
  | 'titanium'
  | 'two-tone'
  | 'ceramic';

export interface TimepieceImage {
  src: string;
  alt: string;
}

export interface Timepiece {
  id: string;
  slug: string;
  brand: string;
  model: string;
  reference: string;
  year: number;
  caliber?: string;
  caseDiameterMm?: number;
  material: TimepieceMaterial;
  condition: TimepieceCondition;
  /** Box, papers, certificate availability — affects inquiry routing. */
  fullSet: boolean;
  /** Provenance chain in chronological order ("First owner: Geneva, 2018"). */
  provenance: string[];
  summary: string;
  description: string;
  priceCHF?: number;
  images: TimepieceImage[];
  createdAt: string;
}
