import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { FicheAudience } from '@/types/segment';

import { useFicheAudienceMap } from '../useFicheAudienceMap';

const SAMPLE: FicheAudience[] = [
  {
    sanityDocId: 'evt-1',
    sanityDocType: 'event',
    mode: 'segments',
    segments: ['piguet-galland'],
    excludedMemberIds: [],
    note: null,
  },
];

vi.mock('@/lib/segments', () => ({
  listFicheAudiences: vi.fn(() => Promise.resolve(SAMPLE)),
}));

describe('useFicheAudienceMap', () => {
  it('loads the rules into a Map keyed by sanity doc id', async () => {
    const { result } = renderHook(() => useFicheAudienceMap());
    // starts empty, then populates after the async load resolves
    await waitFor(() => {
      expect(result.current.map.size).toBe(1);
    });
    expect(result.current.map.get('evt-1')?.mode).toBe('segments');
    expect(typeof result.current.reload).toBe('function');
  });
});
