// ═══════════════════════════════════════════════════
// Inquiry domain types
//
// Each inquiry expresses interest in a specific item (event, property,
// timepiece, artwork, journey) or a free-form concierge request.
// Submission triggers a Resend email to the operator (see lot A.5).
// ═══════════════════════════════════════════════════

export type InquirySource =
  | 'event'
  | 'property'
  | 'timepiece'
  | 'artwork'
  | 'journey'
  | 'concierge'
  | 'jet'
  | 'object-search'
  | 'event-organize';

export type InquiryStatus = 'new' | 'in_review' | 'contacted' | 'closed' | 'cancelled';

export interface Inquiry {
  id: string;
  userId: string;
  source: InquirySource;
  /** Ref to the source item (event/property/etc. id). Null for free-form concierge requests. */
  targetId: string | null;
  message: string | null;
  status: InquiryStatus;
  createdAt: string;
}
