// ═══════════════════════════════════════════════════
// SanityLanding — type matching studio/schemas/documents/landing.ts
//
// Used by useLandingContent() and any landing section that pulls its
// editable copy from Sanity. Keep in sync with the schema — a field
// added in the Studio should be reflected here within the same commit.
// ═══════════════════════════════════════════════════

import type { LocaleField } from '@lib/i18nField';

export interface LandingPrinciple {
  _key?: string;
  title?: LocaleField;
  body?: LocaleField;
}

export interface LandingDomainTile {
  _key?: string;
  /** Technical key — must match the catalogue type slug : event /
   *  property / timepiece / artwork / journey / concierge. */
  key?: string;
  title?: LocaleField;
  lead?: LocaleField;
}

export interface SanityLanding {
  _id: string;
  _updatedAt?: string;

  // Terminal bar + global CTAs
  terminalStatus?: LocaleField;
  terminalTz?: LocaleField;
  ctaRequestAccess?: LocaleField;
  ctaPrivateArea?: LocaleField;
  ctaCallDirect?: LocaleField;

  // Hero meta block
  heroMetaStructure?: LocaleField;
  heroMetaType?: LocaleField;
  heroMetaTypeValue?: LocaleField;
  heroMetaStatus?: LocaleField;
  heroMetaStatusValue?: LocaleField;
  heroMetaModel?: LocaleField;
  heroMetaModelValue?: LocaleField;
  heroMetaEstablished?: LocaleField;
  heroMetaEstablishedValue?: LocaleField;
  heroFieldLabel?: LocaleField;
  heroFieldText?: LocaleField;
  heroGpsLabel?: LocaleField;
  heroGpsValue?: LocaleField;

  // Presentation
  presentationEyebrow?: LocaleField;
  presentationHeadline?: LocaleField;
  presentationLede?: LocaleField;

  // Principles
  principlesEyebrow?: LocaleField;
  principlesHeadline?: LocaleField;
  principles?: LandingPrinciple[];

  // Domains
  domainsEyebrow?: LocaleField;
  domainsHeadline?: LocaleField;
  domainsLede?: LocaleField;
  domainTiles?: LandingDomainTile[];

  // Access
  accessEyebrow?: LocaleField;
  accessTitleA?: LocaleField;
  accessTitleB?: LocaleField;
  accessLede?: LocaleField;
  accessEventsEyebrow?: LocaleField;
  accessLockedEyebrow?: LocaleField;

  // Interlocutor
  interlocutorEyebrow?: LocaleField;
  interlocutorHeadlineA?: LocaleField;
  interlocutorHeadlineB?: LocaleField;
  interlocutorCircleTag?: LocaleField;
  interlocutorRole?: LocaleField;

  // Footer
  footerNote?: LocaleField;
  footerLocation?: LocaleField;
  footerEdition?: LocaleField;
}
