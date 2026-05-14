// ═══════════════════════════════════════════════════
// AppBottomNav — fixed mobile bottom navigation with center FAB
//
// WHAT: Native-app-style bottom tab bar for the authenticated client
//       surface (/account). 4 tabs (Accueil · Tout · Demandes · Plus)
//       + a CENTER-DOCKED FAB that sits raised above the bar and
//       opens the ConciergeRequestWizard — the canonical entry point
//       for any inquiry-creation form (real-estate, timepiece, art,
//       travel, etc.). "Plus" opens the sidebar drawer which holds
//       the remaining modules (Nouveautés, Événements, Propriétés,
//       Garde-temps, Œuvres, Voyages, Conciergerie, Ma collection,
//       Profil, Préférences, Déconnexion). "Ma collection" lives in
//       the drawer (was on the bottom nav but its 12-char label
//       wrapped on 2 lines — owner direction 2026-05-14 14:03).
//       Hidden on md+ (desktop uses floor-to-ceiling sidebar).
// WHEN: Mounted by AppLayout above the <main> on mobile only.
// CHANGE FAB ACTION: edit the openRequest call (currently opens the
//       global ConciergeRequestWizard via useAccountRequest).
// CHANGE TABS: edit BOTTOM_TABS below — keep 4 around the FAB.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { ROUTES } from '@constants/routes';
import { useAccountRequest } from '@context/useAccountRequest';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import { Grid3x3, Inbox, LayoutDashboard, MoreHorizontal, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

interface BottomTab {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
}

// 4 tabs : 2 left of the FAB + 2 right. Stays symmetric.
const TABS_LEFT: readonly BottomTab[] = [
  { to: ROUTES.ACCOUNT, labelKey: 'account.nav.dashboard', icon: LayoutDashboard, exact: true },
  { to: ROUTES.ACCOUNT_CATALOGUE, labelKey: 'account.nav.catalogue', icon: Grid3x3 },
];
const TABS_RIGHT: readonly BottomTab[] = [
  { to: ROUTES.ACCOUNT_INQUIRIES, labelKey: 'account.nav.inquiries', icon: Inbox, exact: true },
];

interface AppBottomNavProps {
  /** Click handler for the "Plus" tab — opens the sidebar drawer with
   *  the full module list + profile + preferences + logout. */
  onMoreClick: () => void;
  /** Whether the drawer is currently open — drives the active highlight
   *  on the "Plus" tab so users get a clear state cue. */
  moreOpen: boolean;
}

const TabLink = ({ tab, pathname }: { tab: BottomTab; pathname: string }) => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const href = localePath(tab.to);
  const isActive = tab.exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
  const Icon = tab.icon;
  return (
    <Link
      to={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex flex-col items-center justify-center gap-1 px-1 text-[10px] tracking-widest uppercase',
        'transition-colors duration-200',
        isActive ? 'text-on-ink' : 'text-on-ink/55',
      )}
    >
      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      <span className="font-mono">{t(tab.labelKey)}</span>
    </Link>
  );
};

/** Mobile bottom navigation — 4 tabs + center FAB + drawer trigger. */
export const AppBottomNav = ({ onMoreClick, moreOpen }: AppBottomNavProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { openRequest } = useAccountRequest();

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        'bg-ink text-on-ink fixed inset-x-0 bottom-0 z-40',
        'border-on-ink/15 border-t',
        'pb-[env(safe-area-inset-bottom)]',
        'md:hidden',
      )}
    >
      {/* Center FAB — bg-bg + text-ink for max contrast, raised above the
          bar by ~28px so it reads as a primary action separate from the
          flat tabs. Opens the ConciergeRequestWizard (any-form entry). */}
      <button
        type="button"
        onClick={() => {
          openRequest();
        }}
        aria-label={t('account.fab.request')}
        className={cn(
          'bg-bg text-ink border-ink/10 absolute -top-6 left-1/2 -translate-x-1/2',
          'inline-flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg',
          'transition-transform duration-150 ease-out active:scale-95',
          'focus-visible:ring-on-ink focus-visible:ring-offset-ink focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        )}
      >
        <Plus size={26} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* 5-col grid : 2 tabs left | FAB spacer | 1 tab right | Plus tab */}
      <div className="mx-auto grid h-14 max-w-md grid-cols-5">
        {TABS_LEFT.map(tab => (
          <TabLink key={tab.to} tab={tab} pathname={pathname} />
        ))}

        {/* Spacer cell for the FAB — keeps the grid balanced */}
        <span aria-hidden="true" />

        {TABS_RIGHT.map(tab => (
          <TabLink key={tab.to} tab={tab} pathname={pathname} />
        ))}

        <button
          type="button"
          onClick={onMoreClick}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          aria-label={t('a11y.openMenu')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 px-1 text-[10px] tracking-widest uppercase',
            'transition-colors duration-200',
            moreOpen ? 'text-on-ink' : 'text-on-ink/55',
          )}
        >
          <MoreHorizontal size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="font-mono">{t('account.nav.more')}</span>
        </button>
      </div>
    </nav>
  );
};
