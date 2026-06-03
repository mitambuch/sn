// ═══════════════════════════════════════════════════
// authMapping — Supabase row/session → domain types
//
// WHAT: Bridges Supabase's snake_case rows + auth.User into our
//       camelCase domain types (User, Session). Centralised so any
//       schema add (e.g. new profile column) lives in one place.
// WHEN: Called by AuthContext on mount + every onAuthStateChange.
// ═══════════════════════════════════════════════════

import type { Session as SupabaseSession } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type { Role, Session, User, UserContactPreference, UserLocale } from '@/types/auth';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  locale: UserLocale;
  contact_preference: UserContactPreference;
  avatar_url: string | null;
  concierge_name: string;
  phone: string | null;
  segments: string[] | null;
  blocked: boolean | null;
  created_at: string;
}

/**
 * Read the profile row that mirrors the authenticated user. Returns
 * null if the row isn't there yet (e.g. signup happened but the
 * `on_auth_user_created` trigger hasn't completed — caller should retry
 * or treat as a transient state).
 */
export async function fetchProfile(userId: string): Promise<User | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, email, full_name, role, locale, contact_preference, avatar_url, concierge_name, phone, segments, blocked, created_at',
    )
    .eq('id', userId)
    .maybeSingle<ProfileRow>();
  if (error || !data) return null;
  const user: User = {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
    locale: data.locale,
    contactPreference: data.contact_preference,
    conciergeName: data.concierge_name,
    segments: data.segments ?? [],
    blocked: data.blocked ?? false,
    createdAt: data.created_at,
  };
  if (data.avatar_url) user.avatarUrl = data.avatar_url;
  if (data.phone) user.phone = data.phone;
  return user;
}

/** Wrap a Supabase session + hydrated profile into our domain Session. */
export function buildSession(supa: SupabaseSession, user: User): Session {
  const expiresAtSec = supa.expires_at ?? Math.floor(Date.now() / 1000) + 3600;
  return {
    user,
    accessToken: supa.access_token,
    expiresAt: new Date(expiresAtSec * 1000).toISOString(),
  };
}
