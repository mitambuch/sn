// ═══════════════════════════════════════════════════
// RequireAuth — gate any subtree to authenticated sessions
//
// WHAT: If no session, redirects to /:locale/login while preserving
//       the original location in `state.from` so post-login flow can
//       restore the intended destination.
// WHEN: Wrap routes like /:locale/account/* or any private surface.
// EDGE: While `loading=true` (booting from localStorage/Supabase),
//       render a centered <Spinner /> placeholder. Avoids a brief
//       login-page flicker on hard refresh once Supabase is wired.
// ═══════════════════════════════════════════════════

import { Spinner } from '@components/ui/Spinner';
import { getInitialLocale, isLocale, localePath } from '@config/i18n';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import type { ReactNode } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

export interface RequireAuthProps {
  children: ReactNode;
}

/** Redirects unauthenticated users to /:locale/login, preserving the intended destination in state.from. */
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { session, loading } = useAuth();
  const { locale } = useParams<{ locale?: string }>();
  const location = useLocation();

  if (loading) {
    return (
      <div className="bg-bg flex min-h-screen items-center justify-center">
        <Spinner size="sm" aria-label="Checking session" />
      </div>
    );
  }

  if (!session) {
    // WHY: resolve locale defensively — the guard can appear in non-locale trees
    // (e.g. during testing or if routing evolves). Fall back to detected locale.
    const fallbackLocale = isLocale(locale) ? locale : getInitialLocale();
    return (
      <Navigate to={localePath(fallbackLocale, ROUTES.LOGIN)} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};
