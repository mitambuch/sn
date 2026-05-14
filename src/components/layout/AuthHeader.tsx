// ═══════════════════════════════════════════════════
// AuthHeader — minimal top bar for authenticated surfaces
//
// WHAT: Fixed top header for /account/* + /admin/* — SN brand mark on
//       the left (link to the home of that surface), "Déconnexion"
//       button on the right, with an always-visible hairline border
//       at the bottom. Replaces the public <Header /> pill on auth
//       surfaces : owner direction 2026-05-14 14:15 — "le dark mode
//       et le changement de langue on s'en fout, mettre SN à gauche
//       et 'se déconnecter' à droite". The locale / theme toggles
//       move to the sidebar drawer ("Plus" sheet on mobile, sidebar
//       bottom on desktop) where they remain accessible without
//       crowding the chrome.
// WHEN: Mounted by AppLayout (homeHref = /account) and AdminLayout
//       (homeHref = /admin).
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { useAuth } from '@context/AuthContext';
import { cn } from '@utils/cn';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

interface AuthHeaderProps {
  /** Where the brand mark links to — typically `/:locale/account` or
   *  `/:locale/admin` depending on the host layout. */
  homeHref: string;
  /** Where to navigate after logout — typically the public landing. */
  postLogoutHref: string;
}

/** Minimal auth-surface header — brand left, logout right, hairline. */
export const AuthHeader = ({ homeHref, postLogoutHref }: AuthHeaderProps) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // WHY: navigate to the public landing FIRST, then run signOut.
    // Awaiting signOut() before navigating would clear the session
    // while AppLayout/AdminLayout (wrapped in RequireAuth) still
    // renders — the guard sees !session and redirects to /login,
    // racing past our intended HOME navigation. Owner direction
    // 2026-05-14 16:26 : "quand on se déco ça arrive sur une vieille
    // page et faut que ça arrive sur la page du site".
    void navigate(postLogoutHref, { replace: true });
    await signOut();
  };

  return (
    <header
      className={cn('border-fg/15 bg-bg/90 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md')}
    >
      <div className="mx-auto flex h-14 items-center justify-between px-4 md:px-8">
        <Link
          to={homeHref}
          aria-label="SAW NEXT — espace privé"
          className="text-fg focus-visible:ring-accent focus-visible:ring-offset-bg rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <BrandMark variant="short" className="text-base md:text-lg" />
        </Link>
        <button
          type="button"
          onClick={() => {
            void handleSignOut();
          }}
          className={cn(
            'inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase',
            'text-muted hover:text-fg transition-colors duration-200',
            'focus-visible:ring-accent focus-visible:ring-offset-bg rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
        >
          <LogOut size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>{t('auth.signOut')}</span>
        </button>
      </div>
    </header>
  );
};
