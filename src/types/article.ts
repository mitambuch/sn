// ═══════════════════════════════════════════════════
// Article — editorial story / news domain types
//
// Articles are short editorial pieces published by Sawnext (new
// arrivals, partnerships, stories from past inquiries). Each can
// optionally link to a catalogue item via `relatedItem`.
// ═══════════════════════════════════════════════════

import type { InquirySource } from './inquiry';

export type ArticleKind = 'launch' | 'opening' | 'partnership' | 'editorial' | 'story';

export interface ArticleImage {
  src: string;
  alt: string;
}

export interface ArticleRelatedItem {
  module: Extract<
    InquirySource,
    'event' | 'property' | 'timepiece' | 'artwork' | 'journey' | 'concierge'
  >;
  slug: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  kind: ArticleKind;
  /** ISO date. */
  publishedAt: string;
  /** Reading time hint in minutes. */
  readMinutes: number;
  cover: ArticleImage;
  /** Optional pointer to a catalogue item this article elevates. */
  relatedItem?: ArticleRelatedItem;
}
