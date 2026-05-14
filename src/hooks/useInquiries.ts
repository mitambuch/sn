// ═══════════════════════════════════════════════════
// useInquiries — Supabase-live inquiry lists with mock fallback
//
// WHAT: Two variants on the same shape :
//   - useInquiriesUser(userId)   → the member's own inquiries
//   - useInquiriesAdmin()        → every inquiry (admin RLS)
// In both cases we map snake_case DB rows to the camelCase domain
// Inquiry type. Falls back to listInquiriesForUser / listInquiriesAdmin
// from @/mocks when Supabase isn't wired.
// WHEN: Account dashboard, account inquiries, admin inquiries.
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';

import { hasSupabase, supabase } from '@/lib/supabase';
import { listInquiries, listInquiriesForUser } from '@/mocks';
import type { Inquiry, InquirySource, InquiryStatus } from '@/types/inquiry';

interface InquiryRow {
  id: string;
  user_id: string;
  source: InquirySource;
  target_id: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
}

function rowToDomain(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    userId: row.user_id,
    source: row.source,
    targetId: row.target_id,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

interface UseInquiriesResult {
  rows: readonly Inquiry[];
  loading: boolean;
  error: string | null;
  /** True when the data shown is mocks. */
  usingFallback: boolean;
}

function useInquiriesQuery(
  filterByUserId: string | null,
  fallback: readonly Inquiry[],
): UseInquiriesResult {
  const [rows, setRows] = useState<readonly Inquiry[]>(fallback);
  const [loading, setLoading] = useState<boolean>(hasSupabase);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSupabase);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!hasSupabase || !supabase) return;
      let query = supabase
        .from('inquiries')
        .select('id, user_id, source, target_id, message, status, created_at')
        .order('created_at', { ascending: false });
      if (filterByUserId) query = query.eq('user_id', filterByUserId);
      const { data, error: fetchErr } = await query;
      if (cancelled) return;
      if (fetchErr) {
        setError(fetchErr.message);
        setRows(fallback);
        setUsingFallback(true);
      } else if (data) {
        setRows((data as InquiryRow[]).map(rowToDomain));
        setUsingFallback(false);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [filterByUserId, fallback]);

  return { rows, loading, error, usingFallback };
}

export function useInquiriesUser(userId: string | null | undefined): UseInquiriesResult {
  const fallback = userId ? listInquiriesForUser(userId) : [];
  return useInquiriesQuery(userId ?? null, fallback);
}

export function useInquiriesAdmin(): UseInquiriesResult {
  return useInquiriesQuery(null, listInquiries());
}
