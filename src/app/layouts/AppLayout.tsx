// ═══════════════════════════════════════════════════
// AppLayout — shell for authenticated client surfaces
//
// WHAT: Renders Header + a vertical module sidebar + main content for
//       /:locale/account/* routes. Wraps everything in RequireAuth so
//       unauthenticated users redirect to /:locale/login.
// WHEN: Element of the `/:locale/account` route segment.
// EDGE: Sidebar collapses to a horizontal scrollable bar on mobile to
//       keep main content full-width. Desktop pins it to the left.
// CHANGE NAV ITEMS: edit the ACCOUNT_NAV array below.
// ═══════════════════════════════════════════════════

import { RequireAuth } from '@app/guards/RequireAuth';
import { useLocale } from '@app/LocaleProvider';
import { Header } from '@components/layout/Header';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const ACCOUNT_NAV = [
  { to: ROUTES.ACCOUNT_EVENTS, labelKey: 'account.nav.events' },
  { to: ROUTES.ACCOUNT_PROPERTIES, labelKey: 'account.nav.properties' },
  { to: ROUTES.ACCOUNT_TIMEPIECES, labelKey: 'account.nav.timepieces' },
  { to: ROUTES.ACCOUNT_ARTWORKS, labelKey: 'account.nav.artworks' },
  { to: ROUTES.ACCOUNT_JOURNEYS, labelKey: 'account.nav.journeys' },
  { to: ROUTES.ACCOUNT_CONCIERGE, labelKey: 'account.nav.concierge' },
];

export const AppLayout = () => {
  return (
    <RequireAuth>
      <AppShell />
    </RequireAuth>
  );
};

const AppShell = () => {
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
          aria-label="Account modules"
          className={cn(
            'flex gap-2 overflow-x-auto px-4 py-3 whitespace-nowrap',
            'md:flex-col md:gap-1 md:px-3 md:py-4',
          )}
        >
          {ACCOUNT_NAV.map(({ to, labelKey }) => {
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
              'md:border-border md:mt-auto md:border-t md:pt-4',
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
