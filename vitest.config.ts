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
        // WHY: Thresholds ratchet — normally UP only, reset DOWN for v6.4 with
        // owner explicit approval (anti-complaisance : dette loggée, pas cachée).
        // Playground Bible v6.4 ajoute 166+ specimens sans tests — couverture
        // passe de 90.15/81.26/90.76/92.37 (v5.2.0) à 81.9/70.35/78.89/84.78.
        // Seuils alignés sur actuels −1pt (jitter buffer). Regain prévu via
        // tests shared utilities puis specimens. Voir
        // decisions/2026-04-19-coverage-ratchet-reset.md pour plan + dette.
        thresholds: {
          statements: 81,
          branches: 69,
          functions: 78,
          lines: 84,
        },
      },
    },
  }),
);
