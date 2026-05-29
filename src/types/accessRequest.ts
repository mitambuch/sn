// ═══════════════════════════════════════════════════
// AccessRequest — anonymous lead from the landing wizard
//
// Mirrors public.access_requests (migration 0012). Distinct from
// Inquiry which requires an authenticated user. AccessRequests are
// pre-auth — the operator triages then optionally generates an
// invitation code for accepted leads.
// ═══════════════════════════════════════════════════

export type AccessRequestStatus = 'new' | 'contacted' | 'accepted' | 'declined';

export interface AccessRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  activity: string | null;
  message: string | null;
  status: AccessRequestStatus;
  createdAt: string;
}
