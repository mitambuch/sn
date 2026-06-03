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
  segments: string[] | null;
  blocked: boolean | null;
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
    segments: row.segments ?? [],
    blocked: row.blocked ?? false,
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
  /** Optimistic segment-tag swap for a member (profiles.segments).
   *  Same RLS policy as updateRole. Rolls back on remote failure. */
  updateSegments: (id: string, next: readonly string[]) => Promise<{ ok: boolean; error?: string }>;
  /** Suspend / reactivate a member (profiles.blocked, migration 0025). */
  updateBlocked: (id: string, next: boolean) => Promise<{ ok: boolean; error?: string }>;
  /** Edit a member's name + phone (admin update all policy). */
  updateProfile: (
    id: string,
    patch: { fullName: string; phone: string | null },
  ) => Promise<{ ok: boolean; error?: string }>;
  /** Permanently delete a member via the admin_delete_user RPC (migration 0025). */
  removeUser: (id: string) => Promise<{ ok: boolean; error?: string }>;
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
          'id, email, full_name, role, locale, contact_preference, avatar_url, concierge_name, phone, segments, blocked, created_at',
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

  const updateSegments = useCallback(
    async (id: string, next: readonly string[]): Promise<{ ok: boolean; error?: string }> => {
      const prevRows = rows;
      setRows(rows.map(r => (r.id === id ? { ...r, segments: next } : r)));
      if (!hasSupabase || !supabase) return { ok: true };
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ segments: next })
        .eq('id', id);
      if (updateErr) {
        setRows(prevRows);
        return { ok: false, error: updateErr.message };
      }
      return { ok: true };
    },
    [rows],
  );

  const updateBlocked = useCallback(
    async (id: string, next: boolean): Promise<{ ok: boolean; error?: string }> => {
      const prevRows = rows;
      setRows(rows.map(r => (r.id === id ? { ...r, blocked: next } : r)));
      if (!hasSupabase || !supabase) return { ok: true };
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ blocked: next })
        .eq('id', id);
      if (updateErr) {
        setRows(prevRows);
        return { ok: false, error: updateErr.message };
      }
      return { ok: true };
    },
    [rows],
  );

  const updateProfile = useCallback(
    async (
      id: string,
      patch: { fullName: string; phone: string | null },
    ): Promise<{ ok: boolean; error?: string }> => {
      const prevRows = rows;
      setRows(
        rows.map(r => {
          if (r.id !== id) return r;
          const next: User = { ...r, fullName: patch.fullName };
          if (patch.phone) next.phone = patch.phone;
          else delete next.phone;
          return next;
        }),
      );
      if (!hasSupabase || !supabase) return { ok: true };
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ full_name: patch.fullName, phone: patch.phone })
        .eq('id', id);
      if (updateErr) {
        setRows(prevRows);
        return { ok: false, error: updateErr.message };
      }
      return { ok: true };
    },
    [rows],
  );

  const removeUser = useCallback(
    async (id: string): Promise<{ ok: boolean; error?: string }> => {
      const prevRows = rows;
      setRows(rows.filter(r => r.id !== id));
      if (!hasSupabase || !supabase) return { ok: true };
      const { error: rpcErr } = await supabase.rpc('admin_delete_user', { p_user: id });
      if (rpcErr) {
        setRows(prevRows);
        return { ok: false, error: rpcErr.message };
      }
      return { ok: true };
    },
    [rows],
  );

  return {
    rows,
    loading,
    error,
    usingFallback,
    updateRole,
    updateSegments,
    updateBlocked,
    updateProfile,
    removeUser,
  };
}
