// ═══════════════════════════════════════════════════
// sanityGate — client side of the audience server gate
//
// WHAT: when the gate is enabled (env.CATALOGUE_GATE), every Sanity read
//       is routed through the Netlify function instead of hitting Sanity
//       directly. The function holds the read token (private dataset) and
//       enforces per-fiche audience server-side. This module is the thin
//       client: it attaches the member's access token and POSTs an action.
// WHEN: consumed by the Sanity hooks (useSanityCollection/Item/Doc, team,
//       admin catalogue) and the share page, all behind `gateEnabled`.
// SAFETY: when gateEnabled is false the hooks never call this — they read
//       Sanity directly, exactly as before. Reversible via the env flag.
// ═══════════════════════════════════════════════════

import { env } from '@/config/env';
import { supabase } from '@/lib/supabase';

export const gateEnabled: boolean = env.CATALOGUE_GATE;

export type Locale = 'fr' | 'en' | 'es';

interface GateBody {
  action: string;
  module?: string;
  slug?: string;
  code?: string;
  /** Sanity `_type` — used by the unauthenticated `publicFiche` read. */
  type?: string;
  /** Sanity `_id` — used by the unauthenticated `publicFiche` read. */
  id?: string;
  locale?: Locale;
}

/** Core call: POST the action to the gate, attaching the session token when
 *  there is one (member/admin actions need it; public actions ignore it). */
async function callGate<T>(body: GateBody): Promise<T> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.authorization = `Bearer ${token}`;
  }
  const res = await fetch(env.CATALOGUE_GATE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // Surface the server's reason (e.g. { role: null } = profile unreadable)
    // so a failing gate call is diagnosable straight from the browser console.
    const detail = await res.text().catch(() => '');
    throw new Error(`[gate] ${body.action} → HTTP ${res.status} ${detail}`);
  }
  return (await res.json()) as T;
}

/** A list read (member catalogue list / team / admin list / public catalogue).
 *  `publicCatalogue` is unauthenticated (public landing teaser). Returns []. */
export async function gateList<T>(
  action: 'list' | 'team' | 'adminList' | 'publicCatalogue',
  opts: { module?: string; locale?: Locale } = {},
): Promise<T[]> {
  const { data } = await callGate<{ data: T[] | null }>({ action, ...opts });
  return data ?? [];
}

/** A single-doc read (member item / landing / siteConfig). Returns null when
 *  absent OR forbidden — callers treat both as "not available". */
export async function gateItem<T>(
  action: 'item' | 'landing' | 'siteConfig',
  opts: { module?: string; slug?: string; locale?: Locale } = {},
): Promise<T | null> {
  try {
    const { data } = await callGate<{ data: T | null }>({ action, ...opts });
    return data ?? null;
  } catch {
    // 404 (forbidden/absent) surfaces as a thrown HTTP error → treat as null.
    return null;
  }
}

/** A single PUBLIC fiche read by type + id (the /c/:type/:id route). Server-side
 *  the action is HARD-restricted to `visibility == "public"`, so this never
 *  surfaces a private/shareCode doc. Unauthenticated. Returns null when absent. */
export async function gatePublicFiche<T>(
  type: string,
  id: string,
  locale: Locale,
): Promise<T | null> {
  try {
    const { data } = await callGate<{ data: T | null }>({
      action: 'publicFiche',
      type,
      id,
      locale,
    });
    return data ?? null;
  } catch {
    return null;
  }
}

export interface GateSharedResult<TSingle, TCollection> {
  docs: { type: string; id: string }[];
  single: TSingle | null;
  collection: TCollection[] | null;
}

/** Validate + resolve a share code server-side (no view bump — the client's
 *  consume already counted this visit). Returns null for an invalid code. */
export async function gateShared<TSingle, TCollection>(
  code: string,
  locale: Locale,
): Promise<GateSharedResult<TSingle, TCollection> | null> {
  try {
    return await callGate<GateSharedResult<TSingle, TCollection>>({
      action: 'shared',
      code,
      locale,
    });
  } catch {
    return null;
  }
}
