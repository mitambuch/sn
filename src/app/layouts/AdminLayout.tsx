// ═══════════════════════════════════════════════════
// AdminLayout — Valmont's super-admin shell
//
// WHAT: Header + sidebar (Dashboard / Catalogue / Invitations /
//       Inquiries / Users) + main content. RequireRole 'admin' guards
//       the whole tree.
// WHEN: Element of the `/:locale/admin` route segment.
// CHANGE NAV ITEMS: edit the ADMIN_NAV array below — each entry carries
//       a lucide icon for cohesion with the member sidebar.
// ═══════════════════════════════════════════════════

import { RequireRole } from '@app/guards/RequireRole';
import { useLocale } from '@app/LocaleProvider';
import { AuthHeader } from '@components/layout/AuthHeader';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import {
  Inbox,
  LayoutDashboard,
  Library,
  LogOut,
  MailQuestion,
  Share2,
  Ticket,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
}

const ADMIN_NAV: NavItem[] = [
  { to: ROUTES.ADMIN, labelKey: 'admin.nav.dashboard', icon: LayoutDashboard, exact: true },
  { to: ROUTES.ADMIN_CATALOGUE, labelKey: 'admin.nav.catalogue', icon: Library },
  { to: ROUTES.ADMIN_ACCESS_REQUESTS, labelKey: 'admin.nav.accessRequests', icon: MailQuestion },
  { to: ROUTES.ADMIN_INVITATIONS, labelKey: 'admin.nav.invitations', icon: Ticket },
  { to: ROUTES.ADMIN_SHARE_CODES, labelKey: 'admin.nav.shareCodes', icon: Share2 },
  { to: ROUTES.ADMIN_INQUIRIES, labelKey: 'admin.nav.inquiries', icon: Inbox },
  { to: ROUTES.ADMIN_USERS, labelKey: 'admin.nav.users', icon: Users },
];

export const AdminLayout = () => {
  return (
    <RequireRole requiredRole="admin">
      <AdminShell />
    </RequireRole>
  );
};

const AdminShell = () => {
  const { pathname } = useLocation();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // Navigate FIRST so RequireRole/RequireAuth don't redirect to
    // /login while the session is being cleared (see AuthHeader.tsx
    // for the matching pattern + rationale).
    void navigate(localePath(ROUTES.HOME), { replace: true });
    await signOut();
  };

  return (
    <>
      <AuthHeader homeHref={localePath(ROUTES.ADMIN)} postLogoutHref={localePath(ROUTES.HOME)} />
      <aside
        className={cn(
          'border-border bg-bg fixed top-20 right-0 left-0 z-30 border-b',
          'md:right-auto md:bottom-0 md:w-56 md:border-r md:border-b-0',
        )}
      >
        <nav
          aria-label="Admin modules"
          className={cn(
            'flex gap-2 overflow-x-auto px-4 py-3 whitespace-nowrap',
            'md:flex-col md:gap-1 md:px-3 md:py-4',
          )}
        >
          {ADMIN_NAV.map(({ to, labelKey, icon: Icon, exact }) => {
            const href = localePath(to);
            const isActive = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={to}
                to={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'duration-base flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
                  isActive ? 'text-fg bg-surface' : 'text-muted hover:text-fg hover:bg-surface/60',
                )}
              >
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>{t(labelKey)}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              void handleSignOut();
            }}
            className={cn(
              'duration-base text-muted hover:text-fg flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
              'md:border-border md:mt-auto md:border-t md:pt-4',
            )}
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>{t('auth.signOut')}</span>
          </button>
        </nav>
      </aside>
      <main id="main-content" className="flex-1 pt-32 md:pt-20 md:pl-56">
        <div key={pathname} className={prefersReducedMotion ? undefined : 'animate-page-enter'}>
          <Outlet />
        </div>
      </main>
    </>
  );
};
