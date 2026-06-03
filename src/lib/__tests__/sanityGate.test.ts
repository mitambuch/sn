import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { gateItem, gateList, gateShared } from '../sanityGate';

// The gate lib POSTs to the Netlify function and unwraps { data } / share
// payloads. supabase is null in the test env (no creds) → no auth header,
// which is fine: we assert request shaping + response handling, not auth.

const okJson = (body: unknown) =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) } as Response);
const errJson = (status: number) =>
  Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  } as Response);

describe('sanityGate', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('gateList returns the data array and posts the action', async () => {
    const fetchMock = vi.fn((_url: string, _init?: RequestInit) =>
      okJson({ data: [{ id: 'a' }, { id: 'b' }] }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const rows = await gateList<{ id: string }>('list', { module: 'event', locale: 'fr' });

    expect(rows).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledOnce();
    const init = fetchMock.mock.calls[0]![1];
    const body = JSON.parse((init as RequestInit).body as string) as Record<string, unknown>;
    expect(body.action).toBe('list');
    expect(body.module).toBe('event');
  });

  it('gateList returns [] when data is null', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => okJson({ data: null })),
    );
    expect(await gateList('team')).toEqual([]);
  });

  it('gateItem returns the doc, or null when forbidden/absent (HTTP error)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => okJson({ data: { id: 'x' } })),
    );
    expect(await gateItem<{ id: string }>('item', { module: 'event', slug: 's' })).toEqual({
      id: 'x',
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(() => errJson(404)),
    );
    expect(await gateItem('item', { module: 'event', slug: 'missing' })).toBeNull();
  });

  it('gateShared returns the share payload, or null on an invalid code', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        okJson({ docs: [{ type: 'event', id: 'e1' }], single: { _id: 'e1' }, collection: null }),
      ),
    );
    const res = await gateShared<{ _id: string }, unknown>('ABC123', 'fr');
    expect(res?.single).toEqual({ _id: 'e1' });

    vi.stubGlobal(
      'fetch',
      vi.fn(() => errJson(404)),
    );
    expect(await gateShared('NOPE12', 'fr')).toBeNull();
  });
});
