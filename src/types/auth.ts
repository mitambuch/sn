// ═══════════════════════════════════════════════════
// Auth domain types
//
// Source of truth for user identity, role, and session shape.
// Mirrored at the DB level in Supabase `profiles.*` columns
// (see lot A.5 — Supabase live).
// ═══════════════════════════════════════════════════

export type Role = 'client' | 'admin';

export type UserContactPreference = 'email' | 'phone' | 'secure-message';

export type UserLocale = 'fr' | 'en';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  locale: UserLocale;
  contactPreference: UserContactPreference;
  /** Phone — collected by the Onboarding wizard. Optional. */
  phone?: string;
  /** Display avatar URL. Optional — falls back to initials. */
  avatarUrl?: string;
  /** Operator assigned as the member's dedicated concierge. */
  conciergeName: string;
  /** Audience segment slugs this member belongs to (migration 0018).
   *  Optional — only the live profile paths populate it; mocks omit it. */
  segments?: readonly string[];
  createdAt: string;
}

export interface Session {
  user: User;
  expiresAt: string;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}
