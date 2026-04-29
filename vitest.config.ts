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
      exclude: ['e2e/**', 'node_modules/**'],
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
        // WHY: Thresholds ratchet — normally UP only, reset DOWN at lot B
        // landing (2026-04-29) with owner explicit approval ("GO full plan").
        // Lot B added ~25 page/feature components without tests so that the
        // demo landed end-to-end before tests. Expected regain in lot C via
        // smoke tests for each /pages/Account*+Admin* + /features/*. Anti-
        // complaisance : dette loggée explicitement, pas cachée. Seuils
        // alignés sur actuels −1pt (jitter buffer).
        // Previous reset v6.4 (90→82 lines): see
        // decisions/2026-04-19-coverage-ratchet-reset.md. Lot B reset
        // documented in sessions/2026-04-29-*.md (test-debt section).
        thresholds: {
          statements: 60,
          branches: 55,
          functions: 56,
          lines: 64,
        },
      },
    },
  }),
);
