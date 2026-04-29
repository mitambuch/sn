// ═══════════════════════════════════════════════════
// PublicLayout — shell for un-authenticated public surfaces
//
// WHAT: Renders the standard Header on top of a main content area with
//       page-enter transition. Used for /, /login, /onboarding,
//       /playground, /lab — anything reachable without a session.
// WHEN: Element of the parent route segment that nests public pages
//       under /:locale/. The Outlet renders the matched child route.
// CHANGE TRANSITIONS: edit the `animate-page-enter` keyframes in
//                     src/styles/animations.css.
// ═══════════════════════════════════════════════════

import { Footer } from '@components/layout/Footer';
import { Header } from '@components/layout/Header';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { Outlet, useLocation } from 'react-router-dom';

export const PublicLayout = () => {
  const { pathname } = useLocation();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-20">
        <div key={pathname} className={prefersReducedMotion ? undefined : 'animate-page-enter'}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};
