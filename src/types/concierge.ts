// ═══════════════════════════════════════════════════
// Concierge — bespoke service catalogue (transport, gastronomy, security…)
//
// Differs from other modules: a Concierge service is not an item with
// fixed metadata — it's a capability the operator can fulfil on request.
// ═══════════════════════════════════════════════════

export type ConciergeCategory =
  | 'transport'
  | 'gastronomy'
  | 'security'
  | 'medical'
  | 'cultural'
  | 'wellness'
  | 'family'
  | 'logistics';

export interface ConciergeServiceImage {
  src: string;
  alt: string;
}

/** A reusable case study to ground the abstract service in a concrete example. */
export interface ConciergeCaseStudy {
  /** Anonymised label, e.g. "Genève → Tokyo, 6 hours notice". */
  context: string;
  /** What was delivered. */
  outcome: string;
}

export interface ConciergeService {
  id: string;
  slug: string;
  title: string;
  category: ConciergeCategory;
  /** Short editorial sentence shown on the listing card. */
  summary: string;
  /** Long-form description on the detail page. */
  description: string;
  /** Examples of past fulfilment, anonymised. */
  caseStudies: ConciergeCaseStudy[];
  /** Typical lead-time hint, e.g. "6h notice", "48h advance". */
  leadTime: string;
  images: ConciergeServiceImage[];
  createdAt: string;
}
