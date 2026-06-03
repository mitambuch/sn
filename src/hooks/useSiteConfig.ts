// ═══════════════════════════════════════════════════
// useSiteConfig — typed hook for the siteConfig singleton
//
// WHAT: Fetches the Sanity `siteConfig` document with stable ID
//       `siteConfig-singleton` and returns a typed SanitySiteConfig.
// WHEN: Any component that needs global site data (header nav, footer,
//       SEO defaults, contact info).
// RULE: i18n-sanity.md lesson #6 — callers must branch on `loading`
//       before making navigation/redirect decisions.
// ═══════════════════════════════════════════════════

import { GROQ_SITE_CONFIG } from '@/lib/sanityQueries';
import type { SanitySiteConfig } from '@/types/siteConfig';

import { useSanityDoc } from './useSanityDoc';

export function useSiteConfig() {
  return useSanityDoc<SanitySiteConfig>(GROQ_SITE_CONFIG, undefined, 'siteConfig');
}
