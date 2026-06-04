// WHY: Extends vite.config.ts via mergeConfig to avoid duplicating aliases.
// vite.config.ts is the single source of truth for resolve.alias.

import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfigFn from './vite.config';

const viteResolved = viteConfigFn({ mode: 'test', command: 'serve' });

export default mergeConfig(
  viteResolved,
  defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify('0.0.0-test'),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      exclude: ['e2e/**', '**/node_modules/**'],
      // WHY: the default 5s per-test ceiling is too tight for the multi-field
      // userEvent.type() form tests (AccessRequestModal, AccountCatalogue) once
      // v8 coverage instrumentation is layered on a loaded machine — they
      // intermittently flaked the `pnpm validate` gate. 15s keeps a real-hang
      // backstop while removing the false negatives. (2026-06-04)
      testTimeout: 15000,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'text-summary', 'html'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/**/__tests__/**',
          'src/test/**',
          'src/vite-env.d.ts',
          'src/main.tsx',
          'src/config/i18n.ts', // WHY: side-effect i18next singleton init — not meaningfully unit-testable
        ],
        // WHY: Thresholds ratchet — normally UP only. Three consecutive resets
        // documented :
        //   1. Lot B landing (2026-04-29) — 64/55/56/64 with owner "GO" —
        //      session journal 2026-04-29-1334.md.
        //   2. Lot B premium pull (2026-05-11) — Cards/Drawers/CommandPalette
        //      /Account/Admin landed via autonomous run brought ~30 more
        //      untested files. Coverage drifted ~10pt below the lot B target.
        //      Resetting to actuals −1pt buffer. Anti-complaisance : dette
        //      explicite, pas cachée.
        //   3. Pre-feature audit (2026-05-27) — Lot A.5/A.6 landed Supabase
        //      live + share codes + landing motion stack ; ~25 more untested
        //      files. Worker dispatch (worker-sonnet x2, 43 new tests) lifted
        //      coverage +3.15pt statements but still below ratchet. Reset to
        //      actuals −1pt buffer. Owner-approved during the 2026-05-27 audit.
        //      Audit doc : docs/AUDIT-SECURITY.md. Test catch-up for the
        //      ~22 remaining 0%-coverage files is queued as a worker-sonnet
        //      dispatch in the next dedicated session — security and i18n
        //      a11y took priority this batch.
        thresholds: {
          statements: 44,
          branches: 32,
          functions: 43,
          lines: 47,
        },
      },
    },
  }),
);
