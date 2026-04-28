import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useSiteConfig (no Sanity configured)', () => {
  beforeEach(() => {
    // WHY: tests assert the "Sanity-off" shape; stub env empty so the hook
    // sees hasSanity=false regardless of owner .env.local state.
    vi.stubEnv('VITE_SANITY_PROJECT_ID', '');
    vi.stubEnv('VITE_SANITY_DATASET', '');
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('surfaces the disabled shape when Sanity is not configured', async () => {
    const { useSiteConfig } = await import('../useSiteConfig');
    const { result } = renderHook(() => useSiteConfig());
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
