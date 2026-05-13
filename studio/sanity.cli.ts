// ═══════════════════════════════════════════════════
// Sanity CLI config — projectId / dataset for `sanity deploy`
//
// Values read from env (SANITY_STUDIO_*). No hardcoded fallback in the
// template — client projects set these in studio/.env when onboarding.
// ═══════════════════════════════════════════════════

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Studio hostname for `sanity deploy` — skips the interactive prompt.
  // Resolves to https://<host>.sanity.studio after the first deploy.
  studioHost: process.env.SANITY_STUDIO_HOST ?? 'sawnext-studio',
  // App ID assigned by Sanity on first deploy. Set here to skip the
  // "Add appId to ..." prompt on subsequent deploys.
  deployment: {
    appId: 'x79no8rs214k1unror0sul8y',
  },
});
