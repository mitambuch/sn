import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('sanity lib (no env configured)', () => {
  beforeEach(() => {
    // WHY: the repo may have a populated .env.local (owner demo project m7ea02li).
    // These tests assert the "unconfigured" shape — stub env to empty + reset
    // modules so sanity.ts re-initializes with the stubbed values.
    vi.stubEnv('VITE_SANITY_PROJECT_ID', '');
    vi.stubEnv('VITE_SANITY_DATASET', '');
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('exposes hasSanity=false when SANITY_PROJECT_ID env is empty', async () => {
    const { hasSanity } = await import('../sanity');
    expect(hasSanity).toBe(false);
  });

  it('exposes a null sanityClient when not configured', async () => {
    const { sanityClient } = await import('../sanity');
    expect(sanityClient).toBeNull();
  });

  it('throws a clear error when urlFor is called without Sanity', async () => {
    const { urlFor } = await import('../sanity');
    expect(() =>
      urlFor({ _type: 'image', asset: { _ref: 'image-abc', _type: 'reference' } }),
    ).toThrowError(/Sanity is not configured/);
  });
});
