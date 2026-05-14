// ═══════════════════════════════════════════════════
// observability — opt-in Sentry init
//
// WHAT: When VITE_SENTRY_DSN is set, initialises Sentry's React SDK
//       with sensible defaults (release tagging via APP_NAME + auto
//       breadcrumbs for fetch / console / navigation). When the DSN is
//       absent the module is effectively a no-op — no telemetry calls,
//       no perf overhead.
// WHEN: Called once from src/main.tsx, before React mounts.
// WHY OPT-IN: solo / staging environments don't need telemetry. The
//       owner enables it by setting VITE_SENTRY_DSN in prod env vars.
// ═══════════════════════════════════════════════════

import { env } from '@config/env';
import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';

export const hasSentry: boolean = Boolean(SENTRY_DSN);

export function initObservability(): void {
  if (!hasSentry) return;
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: env.IS_PROD ? 'production' : 'development',
    // 10 % of transactions sampled in prod ; 100 % in dev to make
    // every local crash visible during testing.
    tracesSampleRate: env.IS_PROD ? 0.1 : 1.0,
    // Replay sessions disabled by default — owner can opt in by setting
    // VITE_SENTRY_REPLAYS_SAMPLE_RATE to a non-zero value.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

/** Throw an error with Sentry context attached. Use in catch blocks
 *  where the original error doesn't carry enough breadcrumbs. */
export function reportError(err: unknown, context: Record<string, unknown> = {}): void {
  if (!hasSentry) return;
  Sentry.withScope(scope => {
    Object.entries(context).forEach(([k, v]) => {
      scope.setContext(k, { value: v });
    });
    Sentry.captureException(err);
  });
}
