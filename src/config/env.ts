/* ═══════════════════════════════════════════════════════════════
   ENV — environment variable access with safe fallbacks
   Dev: everything has a fallback so the app always starts.
   Prod: VITE_APP_URL is enforced at BUILD time in vite.config.ts for
   initialised client projects. This runtime warn is the last-line guard
   for the base template + any edge case that bypasses the build check.

   Sanity vars are optional — `hasSanity` in src/lib/sanity.ts toggles
   CMS-backed paths on/off based on whether SANITY_PROJECT_ID is present.

   Supabase key safety — two keys, two rules:
   • VITE_SUPABASE_ANON_KEY is PUBLIC by design. Supabase gates access
     row-by-row via Postgres RLS policies, not by keeping the key secret.
     Safe to bundle in client code.
   • SUPABASE_SERVICE_ROLE_KEY is BACKEND ONLY. It bypasses RLS entirely.
     Never prefix it with VITE_. It lives in .env.local without the VITE_
     prefix and is consumed exclusively by serverless functions.

   Resend key safety:
   • VITE_RESEND_FROM_EMAIL is the verified sender domain address (public).
   • RESEND_API_KEY is BACKEND ONLY — no VITE_ prefix. Lives in .env.local
     and is consumed only by serverless/edge functions.
   ═══════════════════════════════════════════════════════════════ */

if (import.meta.env.PROD && !import.meta.env.VITE_APP_URL) {
  console.warn(
    '[env] VITE_APP_URL not set in production — canonical URLs and OG tags will use localhost. Set it in .env.local or your deploy config.',
  );
}

export const env = {
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Project',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  SANITY_PROJECT_ID: import.meta.env.VITE_SANITY_PROJECT_ID || '',
  SANITY_DATASET: import.meta.env.VITE_SANITY_DATASET || 'production',
  SANITY_API_VERSION: import.meta.env.VITE_SANITY_API_VERSION || '2024-06-01',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  RESEND_FROM_EMAIL: import.meta.env.VITE_RESEND_FROM_EMAIL || '',
  DEFAULT_LOCALE: import.meta.env.VITE_DEFAULT_LOCALE || 'fr',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
