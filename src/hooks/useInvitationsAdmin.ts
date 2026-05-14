// ═══════════════════════════════════════════════════
// useInvitationsAdmin — Supabase-live admin CRUD for invitation_codes
//
// WHAT: Lists every invitation code (admin RLS allows it), exposes a
//       generate() that INSERTs a new 8-char code, and a revoke() that
//       flips the status to 'revoked'. When Sanity/Supabase isn't wired
//       the hook falls back to the same mock dataset the page used
//       before, so dev / docs / preview keep working with no creds.
// WHEN: Used by /:locale/admin/invitations exclusively.
// RLS : the existing migrations 0001 / 0002 grant SELECT / INSERT /
//       UPDATE only when the caller's profile.role = 'admin'.
// ═══════════════════════════════════════════════════

import { useCallback, useEffect, useState } from 'react';

import { hasSupabase, supabase } from '@/lib/supabase';
import { listInvitations } from '@/mocks';
import type { InvitationCode, InvitationStatus } from '@/types/invitation';

interface InvitationRow {
  id: string;
  code: string;
  status: InvitationStatus;
  created_at: string;
  redeemed_at: string | null;
  redeemed_by: string | null;
  expires_at: string | null;
  created_by: string;
}

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const DEFAULT_TTL_DAYS = 90;

function rowToDomain(row: InvitationRow): InvitationCode {
  return {
    id: row.id,
    code: row.code,
    status: row.status,
    createdAt: row.created_at,
    redeemedAt: row.redeemed_at,
    redeemedBy: row.redeemed_by,
    expiresAt: row.expires_at,
    createdBy: row.created_by,
  };
}

function randomCode(): string {
  return Array.from(
    { length: 8 },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
  ).join('');
}

export interface UseInvitationsAdminResult {
  rows: readonly InvitationCode[];
  loading: boolean;
  error: string | null;
  /** True when the data shown is the local mock (Supabase not wired). */
  usingFallback: boolean;
  refresh: () => Promise<void>;
  generate: () => Promise<{ ok: boolean; error?: string; code?: InvitationCode }>;
  revoke: (id: string) => Promise<{ ok: boolean; error?: string }>;
}

export function useInvitationsAdmin(): UseInvitationsAdminResult {
  const [rows, setRows] = useState<readonly InvitationCode[]>(() => listInvitations());
  const [loading, setLoading] = useState<boolean>(hasSupabase);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(!hasSupabase);

  const refresh = useCallback(async () => {
    if (!hasSupabase || !supabase) {
      setRows(listInvitations());
      setUsingFallback(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchErr } = await supabase
      .from('invitation_codes')
      .select('id, code, status, created_at, redeemed_at, redeemed_by, expires_at, created_by')
      .order('created_at', { ascending: false });
    if (fetchErr) {
      setError(fetchErr.message);
      setRows(listInvitations());
      setUsingFallback(true);
    } else if (data) {
      setRows((data as InvitationRow[]).map(rowToDomain));
      setUsingFallback(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // WHY: refresh() is async — its setState calls fire on a future tick,
    // not synchronously in this effect body. The react-hooks/set-state-in-
    // effect lint can't see through the await, so we void the promise via
    // an IIFE to keep the rule satisfied.
    let cancelled = false;
    void (async () => {
      if (!hasSupabase || !supabase) return;
      const { data, error: fetchErr } = await supabase
        .from('invitation_codes')
        .select('id, code, status, created_at, redeemed_at, redeemed_by, expires_at, created_by')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (fetchErr) {
        setError(fetchErr.message);
        setRows(listInvitations());
        setUsingFallback(true);
      } else if (data) {
        setRows((data as InvitationRow[]).map(rowToDomain));
        setUsingFallback(false);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const generate = useCallback<UseInvitationsAdminResult['generate']>(async () => {
    if (!hasSupabase || !supabase) {
      // Mock mode : keep the previous local-only behaviour so the docs /
      // demo pipeline still shows "generated code" feedback.
      const code: InvitationCode = {
        id: `inv-${String(Date.now())}`,
        code: randomCode(),
        status: 'unused',
        createdAt: new Date().toISOString(),
        redeemedAt: null,
        redeemedBy: null,
        expiresAt: new Date(Date.now() + DEFAULT_TTL_DAYS * 86_400_000).toISOString(),
        createdBy: 'usr-op-salva',
      };
      setRows(prev => [code, ...prev]);
      return { ok: true, code };
    }
    const { data: session } = await supabase.auth.getUser();
    const creatorId = session.user?.id;
    if (!creatorId) {
      return { ok: false, error: 'Vous devez être connecté en admin.' };
    }
    // Retry on the (very unlikely) unique constraint collision : 30^8 ≈ 6.5e11
    // codes total, but a single retry covers the theoretical case where two
    // admins race generation at the same millisecond.
    let attempt = 0;
    while (attempt < 3) {
      const candidate = randomCode();
      const expiresAt = new Date(Date.now() + DEFAULT_TTL_DAYS * 86_400_000).toISOString();
      const { data, error: insertErr } = await supabase
        .from('invitation_codes')
        .insert({
          code: candidate,
          status: 'unused' satisfies InvitationStatus,
          expires_at: expiresAt,
          created_by: creatorId,
        })
        .select('id, code, status, created_at, redeemed_at, redeemed_by, expires_at, created_by')
        .single<InvitationRow>();
      if (!insertErr && data) {
        const created = rowToDomain(data);
        setRows(prev => [created, ...prev]);
        return { ok: true, code: created };
      }
      if (insertErr && insertErr.code !== '23505') {
        // Anything other than a unique violation : bail.
        return { ok: false, error: insertErr.message };
      }
      attempt += 1;
    }
    return { ok: false, error: 'Impossible de générer un code unique. Réessayez.' };
  }, []);

  const revoke = useCallback<UseInvitationsAdminResult['revoke']>(async (id: string) => {
    if (!hasSupabase || !supabase) {
      setRows(prev =>
        prev.map(r => (r.id === id ? { ...r, status: 'revoked' satisfies InvitationStatus } : r)),
      );
      return { ok: true };
    }
    const { error: updateErr } = await supabase
      .from('invitation_codes')
      .update({ status: 'revoked' satisfies InvitationStatus })
      .eq('id', id);
    if (updateErr) return { ok: false, error: updateErr.message };
    setRows(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'revoked' satisfies InvitationStatus } : r)),
    );
    return { ok: true };
  }, []);

  return { rows, loading, error, usingFallback, refresh, generate, revoke };
}
