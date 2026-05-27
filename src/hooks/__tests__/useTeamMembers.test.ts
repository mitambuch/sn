import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTeamMembers } from '../useTeamMembers';

// ─── Sanity mock — same shape as @/lib/sanity exports.
//     Each test toggles hasSanity + the fetch resolver before mounting
//     the hook. The fetchMock is a Promise factory so we can also
//     simulate an in-flight fetch (loading state).

const fetchMock = vi.fn();
let hasSanityValue = false;
let sanityClientValue: { fetch: typeof fetchMock } | null = null;

vi.mock('@/lib/sanity', () => ({
  get hasSanity() {
    return hasSanityValue;
  },
  get sanityClient() {
    return sanityClientValue;
  },
}));

beforeEach(() => {
  hasSanityValue = false;
  sanityClientValue = null;
  fetchMock.mockReset();
});

describe('useTeamMembers', () => {
  it('returns usingFallback:true when Sanity is not configured', () => {
    const { result } = renderHook(() => useTeamMembers());
    expect(result.current.usingFallback).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.members).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('starts in loading state when Sanity is configured', () => {
    hasSanityValue = true;
    sanityClientValue = { fetch: fetchMock };
    fetchMock.mockReturnValueOnce(new Promise(() => undefined)); // never resolves

    const { result } = renderHook(() => useTeamMembers());
    expect(result.current.loading).toBe(true);
    expect(result.current.usingFallback).toBe(false);
  });

  it('falls back when Sanity returns an empty dataset', async () => {
    hasSanityValue = true;
    sanityClientValue = { fetch: fetchMock };
    fetchMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useTeamMembers());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.usingFallback).toBe(true);
    expect(result.current.members).toEqual([]);
  });

  it('maps Sanity docs to the TeamMember shape on success', async () => {
    hasSanityValue = true;
    sanityClientValue = { fetch: fetchMock };
    fetchMock.mockResolvedValueOnce([
      {
        _id: 'team-valmont',
        firstName: 'Valmont',
        lastName: 'Seragone Mato',
        slug: { current: 'valmont-seragone-mato' },
        isFocal: true,
        order: 1,
        tag: { fr: 'Fondateur opérationnel', en: 'Operating founder' },
        bio: { fr: 'Bio FR…', en: 'Bio EN…' },
        phone: '+41787498170',
        email: 'info@saw-next.ch',
        whatsapp: null,
        linkedin: null,
      },
    ]);

    const { result } = renderHook(() => useTeamMembers());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.usingFallback).toBe(false);
    expect(result.current.members).toHaveLength(1);
    expect(result.current.members[0]).toMatchObject({
      id: 'team-valmont',
      firstName: 'Valmont',
      lastName: 'Seragone Mato',
      slug: 'valmont-seragone-mato',
      isFocal: true,
      order: 1,
      tag: { fr: 'Fondateur opérationnel', en: 'Operating founder' },
    });
  });

  it('defaults order to 99 + isFocal to false when missing from the Sanity doc', async () => {
    hasSanityValue = true;
    sanityClientValue = { fetch: fetchMock };
    fetchMock.mockResolvedValueOnce([
      {
        _id: 'team-x',
        firstName: 'X',
        lastName: 'Y',
        slug: null,
        isFocal: null,
        order: null,
        tag: null,
        bio: null,
        phone: null,
        email: null,
        whatsapp: null,
        linkedin: null,
      },
    ]);

    const { result } = renderHook(() => useTeamMembers());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.members[0]).toMatchObject({
      isFocal: false,
      order: 99,
      slug: '',
      tag: {},
      bio: {},
    });
  });

  it('falls back when the Sanity fetch throws', async () => {
    hasSanityValue = true;
    sanityClientValue = { fetch: fetchMock };
    fetchMock.mockRejectedValueOnce(new Error('network down'));

    const { result } = renderHook(() => useTeamMembers());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.usingFallback).toBe(true);
    expect(result.current.error).toBe('network down');
  });
});
