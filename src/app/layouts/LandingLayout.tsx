// ═══════════════════════════════════════════════════
// LandingLayout — full-bleed light surface for the public landing
//                 page and the personal invitation page.
//
// WHAT: Wraps the route Outlet without Header/Footer. Forces the
//       `light` theme + the brand off-white #edf2f1 background, scoped
//       to the document root for the lifetime of the route. Reverts on
//       unmount so the rest of the app (lot B in dark) is untouched.
// WHEN: Route element for `/` (Home immersive) and `/invite/:code`.
// CHANGE BG TINT: edit LANDING_BG below — propagates everywhere via
//                 the CSS custom property override.
// ═══════════════════════════════════════════════════

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
    <main id="main-content" className="bg-bg text-fg min-h-screen">
      <Outlet />
    </main>
  );
};
