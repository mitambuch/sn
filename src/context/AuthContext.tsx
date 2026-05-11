// ═══════════════════════════════════════════════════
// AuthContext — Supabase-live session state + auth actions
//
// WHAT: Holds the current { user, session, loading } AuthState plus the
//       four canonical auth actions. When VITE_SUPABASE_* env are set,
//       methods route through `supabase.auth.*` + the `profiles` table.
//       When env is empty (`hasSupabase === false`), methods fall back
//       to a DEV stub so the site stays demoable without a backend.
// WHEN: Wrap the app once at the root, above the Router. Read via the
//       useAuth() hook exported below.
// DEV : a localStorage flag `__sn_dev_session` simulates any role
//       locally. Gated by import.meta.env.DEV — the helper no-ops in
//       prod builds.
// RULE: see .claude/rules/security.md — anon key is public, RLS gates
//       row-level access. service_role NEVER reaches the client.
// ═══════════════════════════════════════════════════

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { buildSession, fetchProfile } from '@/lib/authMapping';
import { hasSupabase, supabase } from '@/lib/supabase';
import type { AuthState, Role, Session } from '@/types/auth';
import { INVITATION_CODE_CANONICAL_PATTERN, normalizeInvitationCode } from '@/types/invitation';

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

const AuthContext = createContext<AuthContextValue | null>(null);

function readDevSession(): Session | null {
  if (!import.meta.env.DEV) return null;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DEV_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
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
  // DEV session takes priority — it's a synthetic override used by tests
  // and local UI work, regardless of whether Supabase is wired.
  const session = readDevSession();
  if (session) return { user: session.user, session, loading: false };
  // Supabase wired → start with loading=true while getSession() resolves.
  if (hasSupabase) {
    return { user: null, session: null, loading: true };
  }
  return { user: null, session: null, loading: false };
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  // Hydrate from Supabase on mount + subscribe to auth changes.
  useEffect(() => {
    if (!hasSupabase || !supabase) return;
    // DEV session active → don't touch Supabase; the synthetic session
    // is intentionally overriding. This keeps tests (which seed localStorage)
    // and manual dev overrides isolated from real auth events.
    if (readDevSession()) return;
    let cancelled = false;
    const client = supabase;

    const hydrate = async (supa: import('@supabase/supabase-js').Session | null) => {
      if (cancelled) return;
      if (!supa) {
        setState({ user: null, session: null, loading: false });
        return;
      }
      const user = await fetchProfile(supa.user.id);
      if (cancelled) return;
      if (!user) {
        // Trigger may not have inserted the profile row yet — fail open
        // (no session) so UI re-prompts. Magic-link flows hit this for ~1s.
        setState({ user: null, session: null, loading: false });
        return;
      }
      setState({ user, session: buildSession(supa, user), loading: false });
    };

    void client.auth.getSession().then(({ data }) => hydrate(data.session));
    const { data: sub } = client.auth.onAuthStateChange((_event, supa) => {
      void hydrate(supa);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback<AuthContextValue['signIn']>(async (email, password) => {
    if (!hasSupabase || !supabase) {
      __setDevSessionImpl('client', setState);
      return { ok: true };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    // Hydrate state synchronously so the caller's navigate() lands on a
    // route whose RequireAuth guard sees a session. Without this, the
    // onAuthStateChange subscriber races the navigation and we redirect
    // back to /login.
    if (data.session) {
      const user = await fetchProfile(data.user.id);
      if (user) {
        setState({ user, session: buildSession(data.session, user), loading: false });
      }
    }
    return { ok: true };
  }, []);

  const signOut = useCallback<AuthContextValue['signOut']>(async () => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(DEV_SESSION_KEY);
      } catch {
        // Safari private mode — ignore.
      }
    }
    if (hasSupabase && supabase) {
      await supabase.auth.signOut();
    }
    setState({ user: null, session: null, loading: false });
  }, []);

  const signInWithMagicLink = useCallback<AuthContextValue['signInWithMagicLink']>(async email => {
    if (!hasSupabase || !supabase) return { ok: true };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/fr/account` },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const redeemInvitationCode = useCallback<AuthContextValue['redeemInvitationCode']>(
    async (rawCode, email) => {
      if (!hasSupabase || !supabase) {
        __setDevSessionImpl('client', setState);
        return { ok: true };
      }
      const normalized = normalizeInvitationCode(rawCode);
      if (!INVITATION_CODE_CANONICAL_PATTERN.test(normalized)) {
        return { ok: false, error: 'Format de code invalide.' };
      }
      const { data: codeRow, error: codeErr } = await supabase
        .from('invitation_codes')
        .select('id, code, status')
        .eq('code', normalized)
        .eq('status', 'unused')
        .maybeSingle<{ id: string; code: string; status: string }>();
      if (codeErr) return { ok: false, error: codeErr.message };
      if (!codeRow) return { ok: false, error: 'Code introuvable ou déjà utilisé.' };

      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/fr/onboarding`,
          data: { invitation_code: normalized },
        },
      });
      if (otpErr) return { ok: false, error: otpErr.message };
      return { ok: true };
    },
    [],
  );

  const __setDevSession = useCallback<AuthContextValue['__setDevSession']>(role => {
    __setDevSessionImpl(role, setState);
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

function __setDevSessionImpl(role: Role, setState: (s: AuthState) => void): void {
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
}

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
