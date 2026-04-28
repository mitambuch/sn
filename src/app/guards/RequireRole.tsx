// ═══════════════════════════════════════════════════
// RequireRole — gate a subtree to a specific role
//
// WHAT: Wraps RequireAuth + checks user.role matches the required
//       role. Mismatch redirects to the locale HOME (a logged-in
//       user with the wrong role shouldn't be sent back to login).
// WHEN: Wrap admin routes with <RequireRole requiredRole="admin">.
// NAME: prop is `requiredRole`, not `role`, to avoid colliding with
//       the ARIA `role` attribute (jsx-a11y/aria-role).
// ═══════════════════════════════════════════════════

import { getInitialLocale, isLocale, localePath } from '@config/i18n';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import type { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import type { Role } from '@/types/auth';

import { RequireAuth } from './RequireAuth';

// ─── Internal role gate (not exported) ─────────────────────────
// WHY: kept internal so callers only deal with <RequireRole requiredRole="admin">.
// The outer RequireAuth guarantees `user` is non-null before RoleGate
// renders, but we still guard the null case defensively.

interface RoleGateProps {
  requiredRole: Role;
  children: ReactNode;
}

const RoleGate = ({ requiredRole, children }: RoleGateProps) => {
  const { user } = useAuth();
  const { locale } = useParams<{ locale?: string }>();

  if (user === null || user.role !== requiredRole) {
    const fallbackLocale = isLocale(locale) ? locale : getInitialLocale();
    return <Navigate to={localePath(fallbackLocale, ROUTES.HOME)} replace />;
  }

  return <>{children}</>;
};

// ─── Public surface ─────────────────────────────────────────────

export interface RequireRoleProps {
  requiredRole: Role;
  children: ReactNode;
}

/** Ensures the user is authenticated AND holds the required role before rendering children. */
export const RequireRole = ({ requiredRole, children }: RequireRoleProps) => (
  <RequireAuth>
    <RoleGate requiredRole={requiredRole}>{children}</RoleGate>
  </RequireAuth>
);
