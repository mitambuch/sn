// ═══════════════════════════════════════════════════
// AppBottomNav — fixed mobile bottom navigation
//
// WHAT: Native-app-style bottom tab bar for the authenticated client
//       surface (/account). 4 primary tabs + 1 "+" tab that opens the
//       full sidebar drawer (which holds modules + profile + logout).
//       Hidden on md+ (desktop uses the floor-to-ceiling sidebar).
//       Honors iOS safe-area-inset-bottom (notch / home indicator).
// WHEN: Mounted by AppLayout above the <main> on mobile only.
// CHANGE TABS: edit BOTTOM_TABS below — keep max 5 for thumb reach.
// CHANGE STYLES: tokens follow the landing — bg-ink, hairlines, mono
//       caps. Active tab inverts (bg-bg text-ink).
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import { Grid3x3, Heart, Inbox, LayoutDashboard, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

interface BottomTab {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
}

const BOTTOM_TABS: readonly BottomTab[] = [
  { to: ROUTES.ACCOUNT, labelKey: 'account.nav.dashboard', icon: LayoutDashboard, exact: true },
  { to: ROUTES.ACCOUNT_CATALOGUE, labelKey: 'account.nav.catalogue', icon: Grid3x3 },
  { to: ROUTES.ACCOUNT_INQUIRIES, labelKey: 'account.nav.inquiries', icon: Inbox, exact: true },
  { to: ROUTES.ACCOUNT_SAVED, labelKey: 'account.nav.saved', icon: Heart, exact: true },
];

interface AppBottomNavProps {
  /** Click handler for the "+" tab. Opens the sidebar drawer with the
   *  full module list (events, properties, timepieces, etc.) + profile +
   *  preferences + logout. */
  onMoreClick: () => void;
  /** Whether the "+" sheet (drawer) is currently open — drives the
   *  active highlight on the "+" tab so users get a clear state cue. */
  moreOpen: boolean;
}

/** Mobile bottom navigation — 4 main tabs + "+" sheet. */
export const AppBottomNav = ({ onMoreClick, moreOpen }: AppBottomNavProps) => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { pathname } = useLocation();

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
      <div className="mx-auto grid h-14 max-w-md grid-cols-5">
        {BOTTOM_TABS.map(tab => {
          const href = localePath(tab.to);
          const isActive = tab.exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
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
        })}

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
          <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="font-mono">{t('account.nav.more')}</span>
        </button>
      </div>
    </nav>
  );
};
