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

import type { SanityLanding } from '@/types/landing';

import { useSanityDoc } from './useSanityDoc';

const QUERY = `*[_id == "landing-singleton"][0]{
  _id, _updatedAt,
  terminalStatus, terminalTz,
  ctaRequestAccess, ctaPrivateArea, ctaCallDirect,
  heroMetaStructure,
  heroMetaType, heroMetaTypeValue,
  heroMetaStatus, heroMetaStatusValue,
  heroMetaModel, heroMetaModelValue,
  heroMetaEstablished, heroMetaEstablishedValue,
  heroFieldLabel, heroFieldText,
  heroGpsLabel, heroGpsValue,
  presentationEyebrow, presentationHeadline, presentationLede,
  principlesEyebrow, principlesHeadline,
  principles[]{ _key, title, body },
  domainsEyebrow, domainsHeadline, domainsLede,
  domainTiles[]{ _key, key, title, lead },
  accessEyebrow, accessTitleA, accessTitleB, accessLede,
  accessEventsEyebrow, accessLockedEyebrow,
  interlocutorEyebrow, interlocutorHeadlineA, interlocutorHeadlineB,
  interlocutorCircleTag, interlocutorRole,
  footerNote, footerLocation, footerEdition
}`;

export function useLandingContent() {
  return useSanityDoc<SanityLanding>(QUERY);
}
