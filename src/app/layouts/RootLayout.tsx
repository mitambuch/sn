// ═══════════════════════════════════════════════════
// RootLayout — outer shell common to every locale-prefixed surface
//
// WHAT: Provides the skip-link, the bg/text token wrapper, and the
//       not-initialized setup banner. Renders <Outlet /> so the
//       Public / App / Admin sub-layouts can take over per route.
// WHEN: Mounted by LocaleLayout in src/app/routes/index.tsx for every
//       /:locale path.
// EDGE: Header lives in the sub-layouts now (each surface has its own
//       chrome). Page-enter transitions also live in sub-layouts so
//       navigating within /account/* doesn't re-mount the sidebar.
// ═══════════════════════════════════════════════════

import { Banner } from '@components/ui/Banner';
import { siteConfig } from '@config/site';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="bg-bg text-fg flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="focus:bg-accent focus:text-bg sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>
      <Outlet />
      {!siteConfig.initialized && (
        <Banner variant="warning">
          Project not initialized — run <code className="font-mono font-bold">pnpm setup</code> then{' '}
          <code className="font-mono font-bold">/init</code>
        </Banner>
      )}
    </div>
  );
}
