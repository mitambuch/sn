import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider, useAuth } from '../AuthContext';

const DEV_SESSION_KEY = '__sn_dev_session';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('boots with no session and loading=false', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('falls back to a DEV session when Supabase is not wired', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    // signIn + registerWithCode synthesize a client session when there's
    // no backend — the demo flow stays walkable without env vars.
    let signInResult: { ok: boolean; error?: string } | undefined;
    await act(async () => {
      signInResult = await result.current.signIn('a@b.test', 'pw');
    });
    expect(signInResult?.ok).toBe(true);
    expect(result.current.user?.role).toBe('client');

    // registerWithCode walks straight into a client session in demo mode.
    await act(async () => {
      const registerResult = await result.current.registerWithCode({
        email: 'a@b.test',
        code: 'SAW-AB23-C7DE',
        password: 'motdepasse1',
        fullName: 'Hugo Méredith',
      });
      expect(registerResult.ok).toBe(true);
    });

    // Password-reset + update both resolve ok without a backend (no-op).
    await act(async () => {
      const resetResult = await result.current.requestPasswordReset('a@b.test');
      expect(resetResult.ok).toBe(true);
      const updateResult = await result.current.updatePassword('nouveaupass1');
      expect(updateResult.ok).toBe(true);
    });
  });

  it('__setDevSession populates user + session and writes localStorage', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.__setDevSession('client'));

    expect(result.current.user?.role).toBe('client');
    expect(result.current.user?.email).toBe('dev+client@sawnext.local');
    expect(result.current.session?.accessToken).toBe('dev-stub-token');
    expect(localStorage.getItem(DEV_SESSION_KEY)).not.toBeNull();
  });

  it('__clearDevSession + signOut wipe state and storage', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.__setDevSession('admin'));
    expect(result.current.user?.role).toBe('admin');

    await act(async () => {
      await result.current.signOut();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(localStorage.getItem(DEV_SESSION_KEY)).toBeNull();
  });

  it('rehydrates from a valid dev session in localStorage', async () => {
    const stored = {
      user: {
        id: 'dev-admin',
        email: 'dev+admin@sawnext.local',
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
      },
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      accessToken: 'dev-stub-token',
    };
    localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user?.id).toBe('dev-admin');
    expect(result.current.user?.role).toBe('admin');
  });

  it('ignores corrupt JSON in localStorage and starts anonymous', async () => {
    localStorage.setItem(DEV_SESSION_KEY, '{not json');
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it('useAuth throws when used outside <AuthProvider>', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(/useAuth must be used inside/);
    errorSpy.mockRestore();
  });
});
