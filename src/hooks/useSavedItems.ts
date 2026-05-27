// ═══════════════════════════════════════════════════
// useSavedItems — wishlist of catalogue items
//
// WHAT: Tracks the items a member has hearted across the 6 modules.
//       Persisted in localStorage as a Set of "module:slug" composite
//       keys (snappy UI — no loading state on heart toggle). When the
//       user is authenticated AND Supabase is wired, the hook also
//       syncs to the `saved_items` table : pull on mount, push on
//       toggle. localStorage is the source of truth for the UI ;
//       Supabase carries the cross-device persistence.
// WHEN: Use anywhere a heart toggle or "saved" count is shown.
// RACE: Eventually consistent. If a write to Supabase fails, the
//       local UI is correct and the next mount will reconcile on the
//       next device's pull. Conflict resolution = union (local-first).
// MIGRATION: supabase/migrations/0011_saved_items.sql must be applied.
// ═══════════════════════════════════════════════════

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { hasSupabase, supabase } from '@/lib/supabase';

export type SavedModule = 'property' | 'timepiece' | 'artwork' | 'event' | 'journey' | 'concierge';

export interface SavedItem {
  module: SavedModule;
  slug: string;
}

const STORAGE_KEY = '__sn_saved_items';

const composeKey = (module: SavedModule, slug: string): string => `${module}:${slug}`;
const splitKey = (key: string): SavedItem | null => {
  const [module, slug] = key.split(':');
  if (!module || !slug) return null;
  return { module: module as SavedModule, slug };
};

let cache: string[] = read();
const listeners = new Set<() => void>();

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

function write(next: string[]): void {
  cache = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // private mode — silently swallow.
    }
  }
  listeners.forEach(fn => {
    fn();
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  return cache;
}

// ─── Supabase sync layer ──────────────────────────────────────
// Pull the remote rows for a signed-in user and merge them with the
// local cache via union (local-first conflict resolution).
async function pullFromSupabase(userId: string): Promise<void> {
  if (!hasSupabase || !supabase) return;
  const { data, error } = await supabase
    .from('saved_items')
    .select('module, slug')
    .eq('user_id', userId);
  if (error || !data) return;
  const remoteKeys = (data as { module: SavedModule; slug: string }[]).map(r =>
    composeKey(r.module, r.slug),
  );
  if (remoteKeys.length === 0) return;
  const merged = Array.from(new Set([...cache, ...remoteKeys]));
  // Only write if the merge actually adds something — avoid an extra
  // re-render when local already covers the remote set.
  if (merged.length !== cache.length) write(merged);
}

async function pushToSupabase(
  userId: string,
  action: 'add' | 'remove',
  module: SavedModule,
  slug: string,
): Promise<void> {
  if (!hasSupabase || !supabase) return;
  if (action === 'add') {
    // upsert so a re-add after a stale local cache doesn't 409 on PK conflict.
    await supabase.from('saved_items').upsert({ user_id: userId, module, slug });
  } else {
    await supabase.from('saved_items').delete().match({ user_id: userId, module, slug });
  }
}

export function useSavedItems() {
  const [userId, setUserId] = useState<string | null>(null);
  const keys = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Track the current Supabase user via the auth state listener. Reading
  // directly from supabase.auth rather than @context/AuthContext keeps
  // the hook self-contained — consumers (HeartButton inside any card)
  // don't need to be wrapped in AuthProvider, which matters for tests
  // and isolated component renders.
  useEffect(() => {
    if (!hasSupabase || !supabase) return undefined;
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setUserId(data.session?.user.id ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setUserId(session?.user.id ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // Pull remote rows once per user sign-in. Eventually-consistent merge.
  useEffect(() => {
    if (userId) void pullFromSupabase(userId);
  }, [userId]);

  const isSaved = useCallback(
    (module: SavedModule, slug: string) => keys.includes(composeKey(module, slug)),
    [keys],
  );

  const toggle = useCallback(
    (module: SavedModule, slug: string) => {
      const key = composeKey(module, slug);
      const has = cache.includes(key);
      write(has ? cache.filter(k => k !== key) : [...cache, key]);
      // Background-write to Supabase. Fire-and-forget — local state is
      // already authoritative for the UI ; a failed remote write will
      // reconcile on the next mount via pullFromSupabase.
      if (userId) void pushToSupabase(userId, has ? 'remove' : 'add', module, slug);
    },
    [userId],
  );

  const items: SavedItem[] = keys.map(splitKey).filter((v): v is SavedItem => v !== null);

  return { items, isSaved, toggle, count: keys.length };
}
