// ═══════════════════════════════════════════════════
// AppLayout — shell for authenticated client surfaces
//
// WHAT: Renders Header + vertical full-height sidebar + main content for
//       /:locale/account/* routes. The sidebar runs floor-to-ceiling on
//       desktop (border-r visible from top to bottom). On mobile it's a
//       drawer hidden by default, opened via the hamburger button at
//       top-left. Auto-closes on route change + Escape key + backdrop tap.
// WHEN: Element of the `/:locale/account` route segment.
// EDIT NAV ITEMS: edit the ACCOUNT_NAV_* arrays below.
// CHANGE DRAWER WIDTH: w-72 mobile, w-56 desktop in the <aside> below.
// ═══════════════════════════════════════════════════

import { RequireAuth } from '@app/guards/RequireAuth';
import { AppBottomNav } from '@app/layouts/AppBottomNav';
import { useLocale } from '@app/LocaleProvider';
import { AuthHeader } from '@components/layout/AuthHeader';
import { ROUTES } from '@constants/routes';
import { AccountRequestModalProvider } from '@context/AccountRequestModalContext';
import { useAuth } from '@context/AuthContext';
import { CommandPalette } from '@features/search/CommandPalette';
import { useCommandPalette } from '@hooks/useCommandPalette';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarDays,
  Compass,
  Frame,
  Grid3x3,
  Heart,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  Shield,
  Sparkles,
  Ticket,
  User,
  Watch,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

const ACCOUNT_NAV_TOP: NavItem[] = [
  { to: ROUTES.ACCOUNT, labelKey: 'account.nav.dashboard', icon: LayoutDashboard },
  { to: ROUTES.ACCOUNT_CATALOGUE, labelKey: 'account.nav.catalogue', icon: Grid3x3 },
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
  { to: ROUTES.ACCOUNT_SAVED, labelKey: 'account.nav.saved', icon: Heart },
  { to: ROUTES.ACCOUNT_INQUIRIES, labelKey: 'account.nav.inquiries', icon: Inbox },
  { to: ROUTES.ACCOUNT_PROFILE, labelKey: 'account.nav.profile', icon: User },
  { to: ROUTES.ACCOUNT_PREFERENCES, labelKey: 'account.nav.preferences', icon: Settings },
];

// WHY: shown only when the authenticated profile has role='admin'. Salva
// reaches the back-office without having to type the URL by hand.
const ACCOUNT_NAV_ADMIN: NavItem[] = [
  { to: ROUTES.ADMIN, labelKey: 'account.nav.adminHome', icon: Shield },
  { to: ROUTES.ADMIN_INVITATIONS, labelKey: 'account.nav.adminInvitations', icon: Ticket },
];

export const AppLayout = () => {
  return (
    <RequireAuth>
      <AccountRequestModalProvider>
        <AppShell />
      </AccountRequestModalProvider>
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
        'duration-base flex items-center gap-3 rounded-md px-3 py-2 font-mono text-[13px] tracking-tight transition-colors',
        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
        isActive ? 'bg-fg text-bg font-medium' : 'text-muted hover:text-fg hover:bg-surface/60',
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
  const { signOut, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  const palette = useCommandPalette();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Auto-close drawer on route change — derived state pattern (no effect).
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (drawerOpen) setDrawerOpen(false);
  }

  // Escape key closes the drawer.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  // Lock body scroll while drawer is open (mobile only — desktop sidebar is always-on).
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const handleSignOut = async () => {
    // Navigate FIRST so RequireAuth doesn't redirect to /login while
    // the session is being cleared (see AuthHeader.tsx for the
    // matching pattern + rationale).
    void navigate(localePath(ROUTES.HOME), { replace: true });
    await signOut();
  };

  return (
    <>
      <AuthHeader homeHref={localePath(ROUTES.ACCOUNT)} postLogoutHref={localePath(ROUTES.HOME)} />

      {/* Backdrop — mobile only when drawer open. The drawer is triggered by
          the "+" tab in the AppBottomNav (no hamburger top-left). */}
      {drawerOpen && (
        <button
          type="button"
          aria-label={t('a11y.closeMenu')}
          onClick={() => setDrawerOpen(false)}
          className="bg-bg/60 fixed inset-0 z-30 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        id="account-sidebar"
        className={cn(
          'border-border bg-bg fixed top-0 bottom-0 left-0 z-40 w-64 border-r',
          'transition-transform ease-out',
          prefersReducedMotion ? 'duration-0' : 'duration-300',
          'md:w-56 md:translate-x-0',
          drawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <nav
          aria-label="Account modules"
          className="flex h-full flex-col gap-1 overflow-y-auto px-3 pt-24 pb-4"
        >
          {/* Mobile drawer close button — top-right of drawer. */}
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label={t('a11y.closeMenu')}
            className={cn(
              'border-border bg-surface/80 absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
              'md:hidden',
            )}
          >
            <X size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>

          {ACCOUNT_NAV_TOP.map(item => (
            <NavLink
              key={item.to}
              item={item}
              pathname={pathname}
              exact={item.to === ROUTES.ACCOUNT}
            />
          ))}
          <span className="bg-fg/15 my-3 block h-px w-full" aria-hidden="true" />
          {ACCOUNT_NAV_MODULES.map(item => (
            <NavLink key={item.to} item={item} pathname={pathname} />
          ))}
          <span className="bg-fg/15 my-3 block h-px w-full" aria-hidden="true" />
          {ACCOUNT_NAV_USER.map(item => (
            <NavLink key={item.to} item={item} pathname={pathname} exact />
          ))}
          {isAdmin && (
            <>
              <span className="bg-fg/15 my-3 block h-px w-full" aria-hidden="true" />
              {ACCOUNT_NAV_ADMIN.map(item => (
                <NavLink key={item.to} item={item} pathname={pathname} exact />
              ))}
            </>
          )}
          <button
            type="button"
            onClick={() => {
              void handleSignOut();
            }}
            className={cn(
              'duration-base text-muted hover:text-fg flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
              'border-border mt-auto border-t pt-4',
            )}
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>{t('auth.signOut')}</span>
          </button>
        </nav>
      </aside>

      {/* Main content — pt-14 flush under the h-14 AuthHeader (app density, no
          marketing-page gap). pb-20 mobile clears the bottom nav (h-14 +
          safe-area). Desktop pl-56 clears the sidebar floor-to-ceiling. */}
      <main id="main-content" className="flex-1 pt-14 pb-20 md:pb-0 md:pl-56">
        <div key={pathname} className={prefersReducedMotion ? undefined : 'animate-page-enter'}>
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav — 4 primary tabs + "+" opens the sidebar drawer. */}
      <AppBottomNav
        onMoreClick={() => {
          setDrawerOpen(true);
        }}
        moreOpen={drawerOpen}
      />

      {/* CommandPalette stays mounted — accessible via Cmd+K shortcut from
          useCommandPalette hook. Floating button removed per owner audit
          (UI clutter without clear use). ConciergeDock removed entirely
          2026-05-14 14:08 — owner direction : redondant avec le FAB
          central du bottom nav + le ConciergeCard dans le dashboard. */}
      <CommandPalette open={palette.open} onClose={() => palette.setOpen(false)} />
    </>
  );
};
