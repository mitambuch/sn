// ═══════════════════════════════════════════════════
// Auth domain types
//
// Source of truth for user identity, role, and session shape.
// Mirrored at the DB level in Supabase `profiles.role` column
// (see lot A.5 — Supabase live).
// ═══════════════════════════════════════════════════

export type Role = 'client' | 'admin';

export interface User {
  id: string;
  email: string;
  role: Role;
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
