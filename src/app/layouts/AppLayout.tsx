// ═══════════════════════════════════════════════════
// AppLayout — shell for authenticated client surfaces
//
// WHAT: Renders Header + a vertical module sidebar + main content for
//       /:locale/account/* routes. Dashboard link sits at the top, then
//       6 catalogue modules + Stories, then user nav (inquiries / profile
//       / preferences) + sign-out. Each item carries a lucide icon so
//       the chrome reads as a true conciergerie desk.
// WHEN: Element of the `/:locale/account` route segment.
// EDGE: Sidebar collapses to a horizontal scrollable bar on mobile.
// CHANGE NAV ITEMS: edit the ACCOUNT_NAV_* arrays below.
// ═══════════════════════════════════════════════════

import { RequireAuth } from '@app/guards/RequireAuth';
import { useLocale } from '@app/LocaleProvider';
import { Header } from '@components/layout/Header';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { ConciergeDock } from '@features/concierge/ConciergeDock';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarDays,
  Compass,
  Frame,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  Sparkles,
  User,
  Watch,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

const ACCOUNT_NAV_TOP: NavItem[] = [
  { to: ROUTES.ACCOUNT, labelKey: 'account.nav.dashboard', icon: LayoutDashboard },
  { to: ROUTES.ACCOUNT_NEWS, labelKey: 'account.nav.news', icon: Newspaper },
];

const ACCOUNT_NAV_MODULES: NavItem[] = [
  { to: ROUTES.ACCOUNT_EVENTS, labelKey: 'account.nav.events', icon: CalendarDays },
  { to: ROUTES.ACCOUNT_PROPERTIES, labelKey: 'account.nav.properties', icon: Building2 },
  { to: ROUTES.ACCOUNT_TIMEPIECES, labelKey: 'account.nav.timepieces', icon: Watch },
  { to: ROUTES.ACCOUNT_ARTWORKS, labelKey: 'account.nav.artworks', icon: Frame },
  { to: ROUTES.ACCOUNT_JOURNEYS, labelKey: 'account.nav.journeys', icon: Compass },
  { to: ROUTES.ACCOUNT_CONCIERGE, labelKey: 'account.nav.concierge', icon: Sparkles },
];

const ACCOUNT_NAV_USER: NavItem[] = [
  { to: ROUTES.ACCOUNT_INQUIRIES, labelKey: 'account.nav.inquiries', icon: Inbox },
  { to: ROUTES.ACCOUNT_PROFILE, labelKey: 'account.nav.profile', icon: User },
  { to: ROUTES.ACCOUNT_PREFERENCES, labelKey: 'account.nav.preferences', icon: Settings },
];

export const AppLayout = () => {
  return (
    <RequireAuth>
      <AppShell />
    </RequireAuth>
  );
};

const NavLink = ({
  item,
  pathname,
  exact = false,
}: {
  item: NavItem;
  pathname: string;
  exact?: boolean;
}) => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const href = localePath(item.to);
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const Icon = item.icon;
  return (
    <Link
      to={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'duration-base flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
        isActive ? 'text-fg bg-surface' : 'text-muted hover:text-fg hover:bg-surface/60',
      )}
    >
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
      <span>{t(item.labelKey)}</span>
    </Link>
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
          {ACCOUNT_NAV_TOP.map(item => (
            <NavLink
              key={item.to}
              item={item}
              pathname={pathname}
              exact={item.to === ROUTES.ACCOUNT}
            />
          ))}
          <span className="bg-border hidden h-px w-full md:my-2 md:block" aria-hidden="true" />
          {ACCOUNT_NAV_MODULES.map(item => (
            <NavLink key={item.to} item={item} pathname={pathname} />
          ))}
          <span className="bg-border hidden h-px w-full md:my-2 md:block" aria-hidden="true" />
          {ACCOUNT_NAV_USER.map(item => (
            <NavLink key={item.to} item={item} pathname={pathname} exact />
          ))}
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
      <ConciergeDock />
    </>
  );
};
