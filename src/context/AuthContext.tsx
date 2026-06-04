// ═══════════════════════════════════════════════════
// AuthContext — Supabase-live session state + auth actions
//
// WHAT: Holds the current { user, session, loading } AuthState plus the
//       canonical auth actions for a PASSWORD-BASED tunnel:
//         • signIn(email, password)          — returning members
//         • registerWithCode({...})           — first connection: an
//           invitation code unlocks account creation WITH a password.
//         • requestPasswordReset(email)        — sends a reset email.
//         • updatePassword(password)           — sets a new password while
//           in a recovery session (the /reset-password page).
//       When VITE_SUPABASE_* env are set, methods route through
//       `supabase.auth.*` + the `profiles` table. When env is empty
//       (`hasSupabase === false`), methods fall back to a DEV stub so the
//       site stays demoable without a backend.
// WHEN: Wrap the app once at the root, above the Router. Read via the
//       useAuth() hook exported below.
// DEV : a localStorage flag `__sn_dev_session` simulates any role
//       locally. Gated by import.meta.env.DEV — the helper no-ops in
//       prod builds.
// EMAILS: every link Supabase emails (reset password, optional signup
//       confirmation) is built from env.APP_URL — the CANONICAL prod
//       domain (https://saw-next.ch) — never window.location.origin,
//       which leaks the Vercel/Netlify preview host into the email.
// RULE: see .claude/rules/security.md — anon key is public, RLS gates
//       row-level access. service_role NEVER reaches the client.
// ═══════════════════════════════════════════════════

import { env } from '@config/env';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { buildSession, fetchProfile } from '@/lib/authMapping';
import { hasSupabase, supabase } from '@/lib/supabase';
import type { AuthState, Role, Session } from '@/types/auth';
import { INVITATION_CODE_CANONICAL_PATTERN, normalizeInvitationCode } from '@/types/invitation';

const DEV_SESSION_KEY = '__sn_dev_session';
const DEV_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// WHY: email links MUST point to the canonical production domain, not the
// host the browser happens to be on (a Vercel/Netlify preview would leak in).
// env.APP_URL is enforced to https://saw-next.ch at build time.
const SITE_URL = env.APP_URL.replace(/\/$/, '');
const SITE_LOCALE = env.DEFAULT_LOCALE;

interface AuthActionResult {
  ok: boolean;
  error?: string;
  /** registerWithCode only: true when the Supabase project has "Confirm
   *  email" ON, so the account exists but needs a click in a confirmation
   *  email before the session is live. The seamless flow turns this OFF. */
  needsEmailConfirm?: boolean;
}

interface RegisterWithCodeParams {
  email: string;
  code: string;
  password: string;
  fullName: string;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  /** First connection — verify the invitation code, create the account with
   *  a password, then atomically consume the code. */
  registerWithCode: (params: RegisterWithCodeParams) => Promise<AuthActionResult>;
  /** Send a password-reset email pointing at the canonical /reset-password. */
  requestPasswordReset: (email: string) => Promise<AuthActionResult>;
  /** Set a new password — called from /reset-password inside the recovery
   *  session Supabase establishes from the email link. */
  updatePassword: (password: string) => Promise<AuthActionResult>;
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
      if (user.blocked) {
        // Suspended by an admin (migration 0025) — terminate the session.
        await client.auth.signOut();
        if (!cancelled) setState({ user: null, session: null, loading: false });
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
      if (user?.blocked) {
        await supabase.auth.signOut();
        setState({ user: null, session: null, loading: false });
        return { ok: false, error: 'Votre compte est suspendu. Contactez votre conciergerie.' };
      }
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

  const registerWithCode = useCallback<AuthContextValue['registerWithCode']>(
    async ({ email, code, password, fullName }) => {
      if (!hasSupabase || !supabase) {
        // DEV / no-backend mode : walk the demo straight into a client session.
        __setDevSessionImpl('client', setState);
        return { ok: true };
      }
      const normalized = normalizeInvitationCode(code);
      if (!INVITATION_CODE_CANONICAL_PATTERN.test(normalized)) {
        return { ok: false, error: 'Format de code invalide.' };
      }
      // 1. Cheap existence/validity check BEFORE creating any account. The
      //    RPC returns only a boolean so the anon role can't enumerate codes.
      const { data: codeExists, error: codeErr } = await supabase.rpc('verify_invitation_code', {
        p_code: normalized,
      });
      if (codeErr) return { ok: false, error: codeErr.message };
      if (codeExists !== true) return { ok: false, error: 'Code introuvable ou déjà utilisé.' };

      // 2. Create the account. full_name flows to the profiles row via the
      //    handle_new_user() trigger (reads raw_user_meta_data->>'full_name').
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim() },
          // Only used if "Confirm email" is ON (fallback path) — always the
          // canonical domain, never the preview host.
          emailRedirectTo: `${SITE_URL}/${SITE_LOCALE}/account`,
        },
      });
      if (error) return { ok: false, error: error.message };

      // 3. No session → "Confirm email" is ON in the project. The account
      //    exists but isn't active yet; the code is left unused until the
      //    person confirms. The seamless tunnel requires this toggle OFF.
      if (!data.session || !data.user) {
        return { ok: true, needsEmailConfirm: true };
      }

      // 4. Session live → consume the code now (atomic, single-use). A redeem
      //    hiccup must not lock out a user who already has a valid account.
      const { error: redeemErr } = await supabase.rpc('redeem_invitation_code', {
        p_code: normalized,
      });
      if (redeemErr) {
        console.warn('[auth] invitation redeem failed after signup:', redeemErr.message);
      }

      const user = await fetchProfile(data.user.id);
      if (user) {
        setState({ user, session: buildSession(data.session, user), loading: false });
      }
      return { ok: true };
    },
    [],
  );

  const requestPasswordReset = useCallback<AuthContextValue['requestPasswordReset']>(
    async email => {
      if (!hasSupabase || !supabase) return { ok: true };
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/${SITE_LOCALE}/reset-password`,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [],
  );

  const updatePassword = useCallback<AuthContextValue['updatePassword']>(async password => {
    if (!hasSupabase || !supabase) return { ok: true };
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

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
      registerWithCode,
      requestPasswordReset,
      updatePassword,
      __setDevSession,
      __clearDevSession,
    }),
    [
      state,
      signIn,
      signOut,
      registerWithCode,
      requestPasswordReset,
      updatePassword,
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
      fullName: role === 'admin' ? 'Valmont Seragone Mato' : 'Hugo Méredith',
      role,
      locale: 'fr',
      contactPreference: 'phone',
      conciergeName: 'Valmont Seragone Mato',
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
