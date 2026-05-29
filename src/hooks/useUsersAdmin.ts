// ═══════════════════════════════════════════════════
// useUsersAdmin — Supabase-live list of every member profile
//
// WHAT: SELECTs profiles for admin views (RLS policy "profiles: admin
//       read all" allows it). Falls back to mock listUsers() when
//       Supabase isn't wired so the admin UI keeps showing data in
//       demo / preview environments.
// WHEN: /admin/users + admin inquiries (lookup user name by id).
// ═══════════════════════════════════════════════════

import { useCallback, useEffect, useState } from 'react';

import { hasSupabase, supabase } from '@/lib/supabase';
import { listUsers } from '@/mocks';
import type { Role, User, UserContactPreference, UserLocale } from '@/types/auth';

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
  created_at: string;
}

function rowToDomain(row: ProfileRow): User {
  const user: User = {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    locale: row.locale,
    contactPreference: row.contact_preference,
    conciergeName: row.concierge_name,
    createdAt: row.created_at,
  };
  if (row.avatar_url) user.avatarUrl = row.avatar_url;
  if (row.phone) user.phone = row.phone;
  return user;
}

export interface UseUsersAdminResult {
  rows: readonly User[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
  /** Optimistic role swap. Updates Supabase under the "profiles: admin
   *  update all" RLS policy. Rolls back on remote failure. */
  updateRole: (id: string, next: Role) => Promise<{ ok: boolean; error?: string }>;
}

export function useUsersAdmin(): UseUsersAdminResult {
  const [rows, setRows] = useState<readonly User[]>(() => listUsers());
  const [loading, setLoading] = useState<boolean>(hasSupabase);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSupabase);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!hasSupabase || !supabase) return;
      const { data, error: fetchErr } = await supabase
        .from('profiles')
        .select(
          'id, email, full_name, role, locale, contact_preference, avatar_url, concierge_name, phone, created_at',
        )
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (fetchErr) {
        setError(fetchErr.message);
        setRows(listUsers());
        setUsingFallback(true);
      } else if (data) {
        setRows((data as ProfileRow[]).map(rowToDomain));
        setUsingFallback(false);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateRole = useCallback(
    async (id: string, next: Role): Promise<{ ok: boolean; error?: string }> => {
      const prevRows = rows;
      setRows(rows.map(r => (r.id === id ? { ...r, role: next } : r)));
      if (!hasSupabase || !supabase) return { ok: true };
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ role: next })
        .eq('id', id);
      if (updateErr) {
        setRows(prevRows);
        return { ok: false, error: updateErr.message };
      }
      return { ok: true };
    },
    [rows],
  );

  return { rows, loading, error, usingFallback, updateRole };
}
