import { useLocale } from '@app/LocaleProvider';
import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { siteConfig } from '@config/site';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import { Blocks, FlaskConical, House } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

/* ─── Navigation items — edit this array to add/remove links ── */

const NAV_ITEMS: { to: string; labelKey: string; icon: LucideIcon }[] = [
  { to: ROUTES.HOME, labelKey: 'nav.home', icon: House },
  { to: ROUTES.PLAYGROUND, labelKey: 'nav.playground', icon: Blocks },
  { to: ROUTES.LAB, labelKey: 'nav.lab', icon: FlaskConical },
];

/* ─── Scroll-aware hook ──────────────────────────────────── */

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

/* ─── Logo — project name as text link ──────────────────── */

function Logo({ href }: { href: string }) {
  return (
    <Link
      to={href}
      className="text-fg focus-visible:ring-accent max-w-[7rem] truncate rounded-sm text-sm font-medium tracking-tight focus-visible:ring-2 focus-visible:outline-none md:max-w-none md:text-base"
    >
      {siteConfig.name}
    </Link>
  );
}

/* ─── Header ─────────────────────────────────────────────── */

interface HeaderProps {
  className?: string;
}

/** Floating header — morphing logo + navigation pill.
 *  WHY hide nav on auth surfaces: when /account/* or /admin/* is mounted,
 *  the AppLayout / AdminLayout sidebar already carries the same nav (and
 *  more). The top pill becomes pure utility — language + theme — to avoid
 *  duplication and keep the gaze on the page content. */
export const Header = ({ className }: HeaderProps) => {
  const scrolled = useScrolled();
  const { pathname } = useLocation();
  const { locale, setLocale, localePath } = useLocale();
  const { t } = useTranslation();

  const isAuthSurface = pathname.includes('/account') || pathname.includes('/admin');

  return (
    <nav
      aria-label="Main navigation"
      className={cn('fixed top-0 right-0 left-0 z-50', 'px-4 py-4 md:px-8 md:py-5', className)}
    >
      <div className="mx-auto flex w-full max-w-[2440px] items-center justify-between">
        {/* Logo hidden on mobile when in auth surface — hamburger button
            from AppLayout takes the top-left spot to open the drawer. */}
        <div className={cn(isAuthSurface ? 'hidden md:block' : '')}>
          <Logo href={localePath(ROUTES.HOME)} />
        </div>

        {/* Pill nav — ml-auto on auth so it pushes right when Logo is hidden,
            avoiding collision with the AppLayout hamburger button at top-left. */}
        <div
          className={cn(
            'duration-slow flex items-center rounded-full border transition-[border-color,background-color]',
            scrolled
              ? 'border-border bg-surface/60 backdrop-blur-xl'
              : 'border-border/50 bg-surface/30 backdrop-blur-xl',
            isAuthSurface && 'ml-auto',
          )}
        >
          {!isAuthSurface &&
            NAV_ITEMS.map(({ to, labelKey, icon: Icon }) => {
              const href = localePath(to);
              const label = t(labelKey);
              return (
                <Link
                  key={to}
                  to={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className="text-muted hover:text-accent focus-visible:ring-accent border-border/50 duration-base flex items-center gap-1.5 border-r px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:px-4"
                >
                  <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                  <span className="hidden sm:inline" aria-hidden="true">
                    {label}
                  </span>
                </Link>
              );
            })}
          <div className={cn('px-1.5 py-1 sm:px-2', !isAuthSurface && 'border-border/50 border-r')}>
            <LanguageSwitcher
              currentLocale={locale}
              onLocaleChange={setLocale}
              className="bg-transparent"
            />
          </div>
          <div className="px-2 py-1">
            <ThemeToggle className="hover:bg-accent/5 rounded-full p-1.5" />
          </div>
        </div>
      </div>
    </nav>
  );
};
