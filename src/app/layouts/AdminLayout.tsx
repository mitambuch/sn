// ═══════════════════════════════════════════════════
// AdminLayout — shell for the admin (operator) surface
//
// WHAT: Same structure as AppLayout but with the admin module nav and
//       a stricter guard. RequireRole 'admin' redirects logged-in
//       clients to the locale HOME (no point sending them to login).
// WHEN: Element of the `/:locale/admin` route segment.
// CHANGE NAV ITEMS: edit the ADMIN_NAV array below.
// ═══════════════════════════════════════════════════

import { RequireRole } from '@app/guards/RequireRole';
import { useLocale } from '@app/LocaleProvider';
import { Header } from '@components/layout/Header';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const ADMIN_NAV = [
  { to: ROUTES.ADMIN_INVITATIONS, labelKey: 'admin.nav.invitations' },
  { to: ROUTES.ADMIN_INQUIRIES, labelKey: 'admin.nav.inquiries' },
  { to: ROUTES.ADMIN_USERS, labelKey: 'admin.nav.users' },
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
    await signOut();
    void navigate(localePath(ROUTES.HOME), { replace: true });
  };

  return (
    <>
      <Header />
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
          {ADMIN_NAV.map(({ to, labelKey }) => {
            const href = localePath(to);
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={to}
                to={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'duration-base rounded-md px-3 py-2 text-sm transition-colors',
                  'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
                  isActive ? 'text-fg bg-surface' : 'text-muted hover:text-fg hover:bg-surface/60',
                )}
              >
                {t(labelKey)}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              void handleSignOut();
            }}
            className={cn(
              'duration-base text-muted hover:text-fg rounded-md px-3 py-2 text-sm transition-colors',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            {t('auth.signOut')}
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
