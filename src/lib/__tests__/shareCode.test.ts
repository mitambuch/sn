import { describe, expect, it, vi } from 'vitest';

import { consumeShareCode } from '../shareCode';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('@/lib/supabase', () => ({ supabase: { rpc } }));

const baseRow = {
  sanity_doc_type: 'event',
  sanity_doc_id: 'a',
  sanity_docs: [],
  status: 'active',
  view_count: 1,
  max_views: null,
  expires_at: null,
  is_valid: true,
};

describe('consumeShareCode — docs resolution', () => {
  it('resolves the full multi-doc list from sanity_docs', async () => {
    rpc.mockResolvedValueOnce({
      data: [
        {
          ...baseRow,
          sanity_docs: [
            { type: 'event', id: 'a' },
            { type: 'property', id: 'b' },
          ],
        },
      ],
      error: null,
    });
    const result = await consumeShareCode('ABC234');
    expect(result?.isValid).toBe(true);
    expect(result?.docs).toHaveLength(2);
    expect(result?.docs[1]).toEqual({ type: 'property', id: 'b' });
  });

  it('falls back to the legacy single (type,id) when sanity_docs is empty', async () => {
    rpc.mockResolvedValueOnce({ data: [baseRow], error: null });
    const result = await consumeShareCode('ABC234');
    expect(result?.docs).toEqual([{ type: 'event', id: 'a' }]);
  });

  it('returns null when the code is not found', async () => {
    rpc.mockResolvedValueOnce({ data: [], error: null });
    expect(await consumeShareCode('ABC234')).toBeNull();
  });

  it('short-circuits the APERCU demo code without hitting the RPC', async () => {
    const result = await consumeShareCode('APERCU');
    expect(result?.isValid).toBe(true);
    expect(result?.docs).toEqual([{ type: 'event', id: 'evt-01' }]);
  });
});
