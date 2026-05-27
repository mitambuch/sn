import { beforeEach, describe, expect, it, vi } from 'vitest';

import { submitInquiry } from '../inquiry';

// ─── Supabase mock — module-level, dynamically toggled per test ─────
// The helper reads hasSupabase + supabase at call time, so the mock
// just exposes mutable refs that each test sets up before invoking.

const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));
let hasSupabaseValue = false;
let supabaseValue: { from: typeof fromMock } | null = null;

vi.mock('@/lib/supabase', () => ({
  get hasSupabase() {
    return hasSupabaseValue;
  },
  get supabase() {
    return supabaseValue;
  },
}));

beforeEach(() => {
  hasSupabaseValue = false;
  supabaseValue = null;
  insertMock.mockReset();
  fromMock.mockClear();
});

describe('submitInquiry', () => {
  describe('simulator fallback', () => {
    it('uses the simulator when Supabase is not configured', async () => {
      const result = await submitInquiry({
        source: 'jet',
        message: 'test',
        userId: 'user-123',
        simulatorDelayMs: 0,
      });
      expect(result).toEqual({ ok: true, simulated: true });
      expect(insertMock).not.toHaveBeenCalled();
    });

    it('uses the simulator when userId is null', async () => {
      hasSupabaseValue = true;
      supabaseValue = { from: fromMock };
      const result = await submitInquiry({
        source: 'property',
        message: 'test',
        userId: null,
        simulatorDelayMs: 0,
      });
      expect(result).toEqual({ ok: true, simulated: true });
      expect(insertMock).not.toHaveBeenCalled();
    });

    it('uses the simulator when userId is undefined', async () => {
      hasSupabaseValue = true;
      supabaseValue = { from: fromMock };
      const result = await submitInquiry({
        source: 'property',
        message: 'test',
        userId: undefined,
        simulatorDelayMs: 0,
      });
      expect(result.simulated).toBe(true);
    });

    it('uses the simulator when userId is a dev session id', async () => {
      hasSupabaseValue = true;
      supabaseValue = { from: fromMock };
      const result = await submitInquiry({
        source: 'concierge',
        message: 'test',
        userId: 'dev-admin',
        simulatorDelayMs: 0,
      });
      expect(result.simulated).toBe(true);
      expect(insertMock).not.toHaveBeenCalled();
    });

    it('respects simulatorDelayMs: 0 by resolving immediately', async () => {
      const start = performance.now();
      await submitInquiry({
        source: 'jet',
        message: 'test',
        userId: null,
        simulatorDelayMs: 0,
      });
      expect(performance.now() - start).toBeLessThan(50);
    });
  });

  describe('real Supabase insert', () => {
    beforeEach(() => {
      hasSupabaseValue = true;
      supabaseValue = { from: fromMock };
    });

    it('inserts a row when env + userId are present and not dev', async () => {
      insertMock.mockResolvedValueOnce({ error: null });
      const result = await submitInquiry({
        source: 'property',
        message: 'Looking for a chalet',
        targetId: 'chalet-verbier',
        userId: 'real-uuid-123',
      });
      expect(result).toEqual({ ok: true, simulated: false });
      expect(fromMock).toHaveBeenCalledWith('inquiries');
      expect(insertMock).toHaveBeenCalledWith({
        user_id: 'real-uuid-123',
        source: 'property',
        message: 'Looking for a chalet',
        target_id: 'chalet-verbier',
      });
    });

    it('omits target_id from the payload when not provided', async () => {
      insertMock.mockResolvedValueOnce({ error: null });
      await submitInquiry({
        source: 'jet',
        message: 'Departure Geneva',
        userId: 'real-uuid-123',
      });
      const payload = insertMock.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(payload).not.toHaveProperty('target_id');
    });

    it('omits target_id when explicitly null', async () => {
      insertMock.mockResolvedValueOnce({ error: null });
      await submitInquiry({
        source: 'jet',
        message: 'test',
        targetId: null,
        userId: 'real-uuid-123',
      });
      const payload = insertMock.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(payload).not.toHaveProperty('target_id');
    });

    it('trims the message and stores null for empty strings', async () => {
      insertMock.mockResolvedValueOnce({ error: null });
      await submitInquiry({
        source: 'concierge',
        message: '   ',
        userId: 'real-uuid-123',
      });
      const payload = insertMock.mock.calls[0]?.[0] as { message: string | null };
      expect(payload.message).toBeNull();
    });

    it('stores null when message is already null', async () => {
      insertMock.mockResolvedValueOnce({ error: null });
      await submitInquiry({
        source: 'concierge',
        message: null,
        userId: 'real-uuid-123',
      });
      const payload = insertMock.mock.calls[0]?.[0] as { message: string | null };
      expect(payload.message).toBeNull();
    });

    it('returns ok:false with the Supabase error message on insert failure', async () => {
      insertMock.mockResolvedValueOnce({
        error: { message: 'permission denied for table inquiries' },
      });
      const result = await submitInquiry({
        source: 'property',
        message: 'test',
        userId: 'real-uuid-123',
      });
      expect(result.ok).toBe(false);
      expect(result.simulated).toBe(false);
      expect(result.error).toBe('permission denied for table inquiries');
    });
  });

  describe('canPersist heuristic edge cases', () => {
    beforeEach(() => {
      hasSupabaseValue = true;
      supabaseValue = { from: fromMock };
    });

    it('rejects empty-string userId', async () => {
      const result = await submitInquiry({
        source: 'jet',
        message: 'test',
        userId: '',
        simulatorDelayMs: 0,
      });
      expect(result.simulated).toBe(true);
      expect(insertMock).not.toHaveBeenCalled();
    });

    it('accepts a userId that contains "dev-" mid-string but does not start with it', async () => {
      // Defense against the heuristic over-rejecting valid uuids that
      // happen to contain "dev-" later in the string.
      insertMock.mockResolvedValueOnce({ error: null });
      const result = await submitInquiry({
        source: 'jet',
        message: 'test',
        userId: 'abc-dev-123',
        simulatorDelayMs: 0,
      });
      expect(result.simulated).toBe(false);
      expect(insertMock).toHaveBeenCalled();
    });
  });
});
