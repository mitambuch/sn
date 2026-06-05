// ═══════════════════════════════════════════════════
// Artwork — fine-art domain types (paintings/sculpture/photography)
// ═══════════════════════════════════════════════════

export type ArtworkMedium =
  | 'painting-oil'
  | 'painting-acrylic'
  | 'painting-watercolor'
  | 'sculpture-bronze'
  | 'sculpture-marble'
  | 'sculpture-mixed'
  | 'photography'
  | 'works-on-paper'
  | 'mixed-media';

export interface ArtworkDimensions {
  heightCm: number;
  widthCm: number;
  depthCm?: number;
}

export interface ArtworkImage {
  src: string;
  alt: string;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  artistName: string;
  /** Mock-only narrative — not in the Sanity schema, optional + guarded. */
  artistBio?: string;
  year: number;
  medium: ArtworkMedium;
  /** Mock uses a structured object; Sanity stores free text ("200 × 150 cm"). */
  dimensions: ArtworkDimensions | string;
  /** Mock-only — Sanity has no `signed` field yet. */
  signed?: boolean;
  edition?: string;
  /** Mock-only lists — not in the Sanity schema yet, optional + guarded. */
  provenance?: string[];
  exhibitions?: string[];
  summary: string;
  description: string;
  priceCHF?: number;
  images: ArtworkImage[];
  createdAt: string;
}

/** Format dimensions for display: Sanity free text passes through; the mock's
 *  structured object renders as "H × W [× D] cm". */
export const formatDimensions = (d: ArtworkDimensions | string): string =>
  typeof d === 'string'
    ? d
    : `${String(d.heightCm)} × ${String(d.widthCm)}${d.depthCm ? ` × ${String(d.depthCm)}` : ''} cm`;
