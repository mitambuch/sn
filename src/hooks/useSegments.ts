// ═══════════════════════════════════════════════════
// useSegments — Supabase-live audience segment vocabulary
//
// WHAT: loads the segment list (migration 0018) and exposes create /
//       remove helpers with optimistic local state. Admin-only surface;
//       RLS ("segments: admin write") is the real barrier.
// WHEN: /admin/segments management page + anywhere segment labels are
//       needed for tagging (AdminUsers, fiche audience editor).
// ═══════════════════════════════════════════════════

import { useCallback, useEffect, useState } from 'react';

import { createSegment, deleteSegment, listSegments } from '@/lib/segments';
import { hasSupabase } from '@/lib/supabase';
import type { Segment } from '@/types/segment';

export interface UseSegmentsResult {
  segments: readonly Segment[];
  loading: boolean;
  error: string | null;
  /** Create a segment; resolves with the created row or an error. */
  create: (
    slug: string,
    label: string,
    description?: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  /** Delete a segment by id. */
  remove: (id: string) => Promise<{ ok: boolean; error?: string }>;
}

export function useSegments(): UseSegmentsResult {
  const [segments, setSegments] = useState<readonly Segment[]>([]);
  const [loading, setLoading] = useState<boolean>(hasSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!hasSupabase) {
        setLoading(false);
        return;
      }
      try {
        const rows = await listSegments();
        if (!cancelled) setSegments(rows);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const create = useCallback(
    async (
      slug: string,
      label: string,
      description?: string,
    ): Promise<{ ok: boolean; error?: string }> => {
      try {
        const created = await createSegment(slug, label, description);
        setSegments(prev => [...prev, created].sort((a, b) => a.label.localeCompare(b.label)));
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
      }
    },
    [],
  );

  const remove = useCallback(
    async (id: string): Promise<{ ok: boolean; error?: string }> => {
      const prev = segments;
      setSegments(prev.filter(s => s.id !== id));
      try {
        await deleteSegment(id);
        return { ok: true };
      } catch (err) {
        setSegments(prev);
        return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
      }
    },
    [segments],
  );

  return { segments, loading, error, create, remove };
}
