// ═══════════════════════════════════════════════════
// useSavedItems — localStorage-backed wishlist of catalogue items
//
// WHAT: Tracks the items a member has hearted across the 6 modules.
//       Persisted in localStorage as a Set of "module:slug" composite
//       keys. Subscribes via useSyncExternalStore so every consumer
//       (HeartButton, AccountSaved page, dashboard count) stays in
//       sync without prop drilling.
// WHEN: Use anywhere a heart toggle or "saved" count is shown.
// REPLACE LATER: lot C swaps the localStorage layer with a Supabase
//       `wishlist_items` table (same shape).
// ═══════════════════════════════════════════════════

import { useCallback, useSyncExternalStore } from 'react';

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

export function useSavedItems() {
  const keys = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isSaved = useCallback(
    (module: SavedModule, slug: string) => keys.includes(composeKey(module, slug)),
    [keys],
  );

  const toggle = useCallback((module: SavedModule, slug: string) => {
    const key = composeKey(module, slug);
    const has = cache.includes(key);
    write(has ? cache.filter(k => k !== key) : [...cache, key]);
  }, []);

  const items: SavedItem[] = keys.map(splitKey).filter((v): v is SavedItem => v !== null);

  return { items, isSaved, toggle, count: keys.length };
}
