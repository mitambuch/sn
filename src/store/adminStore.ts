// ═══════════════════════════════════════════════════
// adminStore — localStorage-backed CRUD layer over the 7 catalogue modules
//
// WHAT: Valmont's super-admin store. Wraps Properties, Timepieces,
//       Artworks, Events, Journeys, Concierge services and Articles.
//       Reads = static mock seed merged with localStorage delta.
//       Writes (create/update/remove) persist in localStorage and
//       broadcast via useSyncExternalStore so every consumer (admin
//       table + public catalogue list) sees the change instantly.
// WHEN: Use `listX` / `getX` from `@/mocks` — they delegate here.
//       Admin pages mutate via `useAdminStore().createItem(...)`.
// REPLACE LATER: lot C swaps the localStorage layer with Supabase
//       writes. The hook + helper API stay identical.
// ═══════════════════════════════════════════════════

import { useSyncExternalStore } from 'react';

import { articles as seedArticles } from '@/mocks/articles';
import { artworks as seedArtworks } from '@/mocks/artworks';
import { conciergeServices as seedConcierge } from '@/mocks/concierge';
import { events as seedEvents } from '@/mocks/events';
import { journeys as seedJourneys } from '@/mocks/journeys';
import { properties as seedProperties } from '@/mocks/properties';
import { timepieces as seedTimepieces } from '@/mocks/timepieces';
import type { Article } from '@/types/article';
import type { Artwork } from '@/types/artwork';
import type { ConciergeService } from '@/types/concierge';
import type { Event } from '@/types/event';
import type { Journey } from '@/types/journey';
import type { Property } from '@/types/property';
import type { Timepiece } from '@/types/timepiece';

export type AdminModule =
  | 'property'
  | 'timepiece'
  | 'artwork'
  | 'event'
  | 'journey'
  | 'concierge'
  | 'article';

export interface AdminModuleMap {
  property: Property;
  timepiece: Timepiece;
  artwork: Artwork;
  event: Event;
  journey: Journey;
  concierge: ConciergeService;
  article: Article;
}

interface DeltaShape {
  /** Items added through the admin (keyed by slug). */
  added: Record<AdminModule, Record<string, unknown>>;
  /** Field-level overrides for seeded items (keyed by slug). */
  edited: Record<AdminModule, Record<string, unknown>>;
  /** Slugs removed (seed or admin). */
  removed: Record<AdminModule, string[]>;
}

const STORAGE_KEY = '__sn_admin_delta';

const EMPTY_DELTA: DeltaShape = {
  added: {
    property: {},
    timepiece: {},
    artwork: {},
    event: {},
    journey: {},
    concierge: {},
    article: {},
  },
  edited: {
    property: {},
    timepiece: {},
    artwork: {},
    event: {},
    journey: {},
    concierge: {},
    article: {},
  },
  removed: {
    property: [],
    timepiece: [],
    artwork: [],
    event: [],
    journey: [],
    concierge: [],
    article: [],
  },
};

const SEEDS: { [K in AdminModule]: AdminModuleMap[K][] } = {
  property: seedProperties,
  timepiece: seedTimepieces,
  artwork: seedArtworks,
  event: seedEvents,
  journey: seedJourneys,
  concierge: seedConcierge,
  article: seedArticles,
};

let delta: DeltaShape = read();
const listeners = new Set<() => void>();

function read(): DeltaShape {
  if (typeof window === 'undefined') return EMPTY_DELTA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DELTA;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_DELTA;
    return { ...EMPTY_DELTA, ...(parsed as Partial<DeltaShape>) };
  } catch {
    return EMPTY_DELTA;
  }
}

function persist(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(delta));
  } catch {
    // private mode — ignore.
  }
}

function emit(): void {
  listeners.forEach(fn => {
    fn();
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): DeltaShape {
  return delta;
}

/* ─── Read helpers — used by mocks/index.ts and pages ─── */

export const listItems = <K extends AdminModule>(module: K): AdminModuleMap[K][] => {
  const seeds = SEEDS[module] as AdminModuleMap[K][];
  const removed = new Set(delta.removed[module]);
  const editedMap = delta.edited[module];
  const merged = seeds
    .filter(item => !removed.has((item as { slug: string }).slug))
    .map(item => {
      const slug = (item as { slug: string }).slug;
      const override = editedMap[slug];
      return override ? ({ ...item, ...(override as object) } as AdminModuleMap[K]) : item;
    });
  const added = Object.values(delta.added[module]) as AdminModuleMap[K][];
  return [...added, ...merged];
};

export const getItem = <K extends AdminModule>(
  module: K,
  slug: string,
): AdminModuleMap[K] | undefined => {
  const list = listItems(module);
  return list.find(item => (item as { slug: string }).slug === slug);
};

/* ─── Mutations — used by admin pages ─── */

export const createItem = <K extends AdminModule>(module: K, item: AdminModuleMap[K]): void => {
  const slug = (item as { slug: string }).slug;
  delta = {
    ...delta,
    added: {
      ...delta.added,
      [module]: { ...delta.added[module], [slug]: item },
    },
  };
  persist();
  emit();
};

export const updateItem = <K extends AdminModule>(
  module: K,
  slug: string,
  patch: Partial<AdminModuleMap[K]>,
): void => {
  const inAdded = delta.added[module][slug];
  if (inAdded) {
    delta = {
      ...delta,
      added: {
        ...delta.added,
        [module]: {
          ...delta.added[module],
          [slug]: { ...(inAdded as object), ...(patch as object) },
        },
      },
    };
  } else {
    delta = {
      ...delta,
      edited: {
        ...delta.edited,
        [module]: {
          ...delta.edited[module],
          [slug]: { ...(delta.edited[module][slug] as object | undefined), ...(patch as object) },
        },
      },
    };
  }
  persist();
  emit();
};

export const removeItem = (module: AdminModule, slug: string): void => {
  if (delta.added[module][slug]) {
    const next = { ...delta.added[module] };
    delete next[slug];
    delta = { ...delta, added: { ...delta.added, [module]: next } };
  } else {
    delta = {
      ...delta,
      removed: {
        ...delta.removed,
        [module]: [...delta.removed[module], slug],
      },
    };
  }
  persist();
  emit();
};

export const resetAdminDelta = (): void => {
  delta = EMPTY_DELTA;
  persist();
  emit();
};

/* ─── React subscription ─── */

export const useAdminStore = () => {
  // Subscribe so components re-render on any mutation; the actual data
  // is fetched via listItems/getItem at render time.
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { listItems, getItem, createItem, updateItem, removeItem, resetAdminDelta };
};
