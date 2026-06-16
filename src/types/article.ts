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

/** One media-gallery item: a photo, an uploaded video, or a hosted embed.
 *  Discriminated by `kind` — the GROQ projection flattens each Sanity
 *  object type (domainImage / videoFile / videoEmbed) into this shape. */
export type ArticleMedia =
  | { kind: 'image'; src: string; alt: string; caption?: string }
  | { kind: 'video'; src: string; poster?: string; alt?: string; caption?: string }
  | { kind: 'embed'; url: string; caption?: string };

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
  /** Mixed media gallery (photos + videos). Sanity-only — absent on mock
   *  articles, so optional + guarded at render. */
  gallery?: ArticleMedia[];
  /** Optional pointer to a catalogue item this article elevates. */
  relatedItem?: ArticleRelatedItem;
}
