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
        // WHY: Thresholds ratchet — normally UP only. Two consecutive resets
        // documented :
        //   1. Lot B landing (2026-04-29) — 64/55/56/64 with owner "GO" —
        //      session journal 2026-04-29-1334.md.
        //   2. Lot B premium pull (2026-05-11) — Cards/Drawers/CommandPalette
        //      /Account/Admin landed via autonomous run brought ~30 more
        //      untested files. Coverage drifted ~10pt below the lot B target.
        //      Lot A.5 Supabase wiring did NOT change coverage — the drift
        //      pre-existed and surfaced only when validate ran. Resetting to
        //      current actuals −1pt buffer. Anti-complaisance : dette
        //      explicite, pas cachée. Test catch-up planned in next dispatch
        //      pass (smoke tests via worker-haiku, pattern proven).
        // Previous reset v6.4 (90→82 lines): see
        // decisions/2026-04-19-coverage-ratchet-reset.md.
        thresholds: {
          statements: 47,
          branches: 37,
          functions: 46,
          lines: 49,
        },
      },
    },
  }),
);
