// ═══════════════════════════════════════════════════
// LandingLayout — public landing shell (light, full-width, simple)
//
// WHAT: Forces the light theme + soft warm-grey (#d8dcda) background
//       on the document root, mounts a global FilmGrain layer + the
//       LandingHeader at the top, hands the route content over via
//       <Outlet />, and closes with the LandingFooter (which carries
//       the main CONTACTER block). Reverts the theme on unmount so
//       the rest of the app (lot B in dark) stays untouched.
// WHEN: Route element for `/` (Home) and `/invite/:code`.
// CHANGE BG: LANDING_BG below.
// ═══════════════════════════════════════════════════

import { LandingFooter } from '@components/layout/LandingFooter';
import { LandingHeader } from '@components/layout/LandingHeader';
import { FilmGrain } from '@components/ui/FilmGrain';
import { Loader } from '@features/landing/Loader/Loader';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const LANDING_BG = '#d8dcda';

export const LandingLayout = () => {
  useEffect(() => {
    const html = document.documentElement;
    const prevTheme = html.dataset.theme;
    const prevBg = html.style.getPropertyValue('--color-bg');

    html.dataset.theme = 'light';
    html.style.setProperty('--color-bg', LANDING_BG);

    return () => {
      if (prevTheme === undefined) delete html.dataset.theme;
      else html.dataset.theme = prevTheme;
      if (prevBg) html.style.setProperty('--color-bg', prevBg);
      else html.style.removeProperty('--color-bg');
    };
  }, []);

  return (
    <div className="bg-bg text-fg relative min-h-screen w-full">
      <FilmGrain intensity={0.55} density={14} tickMs={100} className="fixed inset-0 -z-10" />
      <Loader />
      <LandingHeader />
      <main id="main-content" className="relative">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
};
