// ═══════════════════════════════════════════════════
// useLandingContent — typed hook for the `landing` singleton
//
// WHAT: Fetches the Sanity `landing` document at stable ID
//       `landing-singleton` and returns a typed SanityLanding. When
//       Sanity is not configured the hook returns { data: null,
//       loading: false } and every landing section falls back to its
//       i18n string via resolveFieldOrFallback() — the site keeps
//       working in the starter state with no creds.
// WHEN: Used by Home + Hero + Presentation + Principles + Domains +
//       Access + Interlocutor + TerminalBar + LandingFooter.
// RULE: i18n-sanity.md lesson #6 — branch on `loading` before any
//       redirect decision.
// ═══════════════════════════════════════════════════

import { GROQ_LANDING } from '@/lib/sanityQueries';
import type { SanityLanding } from '@/types/landing';

import { useSanityDoc } from './useSanityDoc';

export function useLandingContent() {
  return useSanityDoc<SanityLanding>(GROQ_LANDING, undefined, 'landing');
}
