// ═══════════════════════════════════════════════════
// AuthContext — session state + auth actions stub
//
// WHAT: Holds the current { user, session, loading } AuthState plus the
//       four canonical auth actions (signIn / signOut / signInWithMagicLink
//       / redeemInvitationCode). All four return typed `{ ok, error? }`
//       promises today and resolve to `ok: false` until lot A.5 wires the
//       real Supabase client. Consumers (Login page, guards, Header) can
//       already type against the final shape.
// WHEN: Wrap the app once at the root, above the Router. Read via the
//       useAuth() hook exported below.
// DEV : a localStorage flag `__sn_dev_session` lets you simulate any role
//       locally without a real Supabase backend. Gated by import.meta.env
//       .DEV — the methods no-op in production builds. Use the React
//       devtools or a /lab button to trigger __setDevSession('client') /
//       __setDevSession('admin').
// RULE: see .claude/rules/security.md — anon key is public, RLS gates
//       row-level access. service_role NEVER reaches the client.
// ═══════════════════════════════════════════════════

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { AuthState, Role, Session } from '@/types/auth';

const DEV_SESSION_KEY = '__sn_dev_session';
const DEV_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

interface AuthActionResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<AuthActionResult>;
  redeemInvitationCode: (rawCode: string, email: string) => Promise<AuthActionResult>;
  /** DEV-only: simulate a logged-in session for local UI work. No-op in prod. */
  __setDevSession: (role: Role) => void;
  /** DEV-only: clear the simulated session. No-op in prod. */
  __clearDevSession: () => void;
}

// WHY: kept module-local (not exported) so this file stays Fast-Refresh
// compatible — see react-refresh/only-export-components rule. The Provider
// + useAuth hook below are the public surface.
const AuthContext = createContext<AuthContextValue | null>(null);

const NOT_WIRED: AuthActionResult = {
  ok: false,
  error: 'Auth backend not wired yet — see lot A.5 (Supabase live).',
};

function readDevSession(): Session | null {
  if (!import.meta.env.DEV) return null;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DEV_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    // Fail closed if shape is wrong.
    if (
      typeof parsed?.user?.id !== 'string' ||
      typeof parsed?.user?.role !== 'string' ||
      typeof parsed?.accessToken !== 'string'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function initialAuthState(): AuthState {
  const session = readDevSession();
  if (session) return { user: session.user, session, loading: false };
  return { user: null, session: null, loading: false };
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // WHY: lazy init reads localStorage once on mount — no useEffect needed
  // because the dev-session lookup is synchronous. When lot A.5 wires
  // Supabase, this becomes loading=true with a useEffect that resolves
  // via supabase.auth.getSession().
  const [state, setState] = useState<AuthState>(initialAuthState);

  const signIn = useCallback<AuthContextValue['signIn']>(() => Promise.resolve(NOT_WIRED), []);

  const signOut = useCallback<AuthContextValue['signOut']>(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(DEV_SESSION_KEY);
      } catch {
        // Safari private mode — ignore.
      }
    }
    setState({ user: null, session: null, loading: false });
    return Promise.resolve();
  }, []);

  const signInWithMagicLink = useCallback<AuthContextValue['signInWithMagicLink']>(
    () => Promise.resolve(NOT_WIRED),
    [],
  );

  const redeemInvitationCode = useCallback<AuthContextValue['redeemInvitationCode']>(
    () => Promise.resolve(NOT_WIRED),
    [],
  );

  const __setDevSession = useCallback<AuthContextValue['__setDevSession']>((role: Role) => {
    if (!import.meta.env.DEV) return;
    const now = new Date();
    const session: Session = {
      user: {
        id: `dev-${role}`,
        email: `dev+${role}@sawnext.local`,
        fullName: role === 'admin' ? 'Salvatore Montemagno' : 'Hugo Méredith',
        role,
        locale: 'fr',
        contactPreference: 'phone',
        conciergeName: 'Salvatore Montemagno',
        createdAt: now.toISOString(),
      },
      expiresAt: new Date(now.getTime() + DEV_SESSION_TTL_MS).toISOString(),
      accessToken: 'dev-stub-token',
    };
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(session));
      } catch {
        // ignore — state still updates.
      }
    }
    setState({ user: session.user, session, loading: false });
  }, []);

  const __clearDevSession = useCallback<AuthContextValue['__clearDevSession']>(() => {
    if (!import.meta.env.DEV) return;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(DEV_SESSION_KEY);
      } catch {
        // ignore.
      }
    }
    setState({ user: null, session: null, loading: false });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signOut,
      signInWithMagicLink,
      redeemInvitationCode,
      __setDevSession,
      __clearDevSession,
    }),
    [
      state,
      signIn,
      signOut,
      signInWithMagicLink,
      redeemInvitationCode,
      __setDevSession,
      __clearDevSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Read the auth context. Throws if used outside an <AuthProvider> — that's
 * always a wiring bug, never a runtime degraded mode.
 */
// eslint-disable-next-line react-refresh/only-export-components -- HMR cost negligible for context file
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};
