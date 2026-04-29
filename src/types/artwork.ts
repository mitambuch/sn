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
  artistBio: string;
  year: number;
  medium: ArtworkMedium;
  dimensions: ArtworkDimensions;
  signed: boolean;
  edition?: string;
  provenance: string[];
  exhibitions: string[];
  summary: string;
  description: string;
  priceCHF?: number;
  images: ArtworkImage[];
  createdAt: string;
}
