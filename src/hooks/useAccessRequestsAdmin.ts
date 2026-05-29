// ═══════════════════════════════════════════════════
// useAccessRequestsAdmin — Supabase-live access requests list + triage
//
// WHAT: Reads public.access_requests (admin RLS) ordered by creation
//       desc, exposes an optimistic updateStatus() that updates the
//       row in place. Falls back to an empty list when Supabase isn't
//       wired so the admin shell still renders.
// WHEN: /admin/access-requests page + AdminDashboard counter.
// ═══════════════════════════════════════════════════

import { useCallback, useEffect, useState } from 'react';

import { hasSupabase, supabase } from '@/lib/supabase';
import type { AccessRequest, AccessRequestStatus } from '@/types/accessRequest';

interface AccessRequestRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  activity: string | null;
  message: string | null;
  status: AccessRequestStatus;
  created_at: string;
}

function rowToDomain(row: AccessRequestRow): AccessRequest {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    activity: row.activity,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export interface UseAccessRequestsAdminResult {
  rows: readonly AccessRequest[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
  updateStatus: (id: string, next: AccessRequestStatus) => Promise<{ ok: boolean; error?: string }>;
}

export function useAccessRequestsAdmin(): UseAccessRequestsAdminResult {
  const [rows, setRows] = useState<readonly AccessRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(hasSupabase);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSupabase);

  useEffect(() => {
    if (!hasSupabase || !supabase) return;
    const controller = new AbortController();
    void (async () => {
      const { data, error: fetchErr } = await supabase
        .from('access_requests')
        .select(
          'id, first_name, last_name, email, phone, company, activity, message, status, created_at',
        )
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal);
      if (controller.signal.aborted) return;
      if (fetchErr) {
        setError(fetchErr.message);
        setUsingFallback(true);
      } else if (data) {
        setRows((data as AccessRequestRow[]).map(rowToDomain));
        setUsingFallback(false);
      }
      setLoading(false);
    })();
    return () => {
      controller.abort();
    };
  }, []);

  const updateStatus = useCallback(
    async (id: string, next: AccessRequestStatus): Promise<{ ok: boolean; error?: string }> => {
      // Optimistic local update — list re-renders immediately.
      const prevRows = rows;
      setRows(rows.map(r => (r.id === id ? { ...r, status: next } : r)));
      if (!hasSupabase || !supabase) return { ok: true };
      const { error: updateErr } = await supabase
        .from('access_requests')
        .update({ status: next })
        .eq('id', id);
      if (updateErr) {
        // Roll back on remote failure.
        setRows(prevRows);
        return { ok: false, error: updateErr.message };
      }
      return { ok: true };
    },
    [rows],
  );

  return { rows, loading, error, usingFallback, updateStatus };
}
