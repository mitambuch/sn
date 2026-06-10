// ═══════════════════════════════════════════════════
// teamData — Source de vérité des fiches membres (landing S09)
//
// WHAT: The five SAW Next team members, each with every field the
//       Interlocutor card renders: identity, sector title, function
//       label, contact channels and the per-member CTA. Each member is
//       fully independent — no value is inherited from Valmont.
// WHEN: Consumed by features/landing/Interlocutor.tsx. This is the single
//       structured source the card reads from; nothing member-specific is
//       hardcoded in the JSX.
// CHANGE A MEMBER: edit its object below.
// ADD A LINKEDIN: fill the optional `linkedin` field with a REAL url —
//       leave it undefined to hide that row (never a "#" placeholder).
// WHATSAPP: derived from `phone` automatically; set `whatsapp` only to
//       override with a specific wa.me link.
// ═══════════════════════════════════════════════════

import type { Locale } from '@config/i18n';

/** A short label translated in every supported locale. */
export type LocaleLabel = Record<Locale, string>;

export interface TeamMemberData {
  /** Stable key — matches the Sanity-derived key (firstName lowercased, spaces stripped). */
  key: string;
  firstName: string;
  lastName: string;
  /** URL slug — used for the per-member CTA anchor. */
  slug: string;
  /** Focal contact: loads first and anchors the autoplay rotation. */
  isFocal: boolean;
  /** Display rank (Valmont = 1). Lower sorts first. */
  order: number;
  /** Small label near the name, top of the card (the "titre secteur"). */
  sectorTitle: LocaleLabel;
  /** Function shown lower on the card (the "fonction") — was a shared static value. */
  functionLabel: LocaleLabel;
  /** Phone in human format, e.g. "+33 6 88 38 01 86". */
  phone: string;
  email: string;
  /** Explicit wa.me link; when absent it is derived from `phone`. */
  whatsapp?: string;
  /** Real LinkedIn url; the row is hidden when absent (no placeholder). */
  linkedin?: string;
}

/**
 * The team, in display order (Valmont first, then the network circle).
 * Order matches the rotation sequence shown in the bottom progress bar.
 */
export const TEAM_MEMBERS: readonly TeamMemberData[] = [
  {
    key: 'valmont',
    firstName: 'Valmont',
    lastName: 'Seragone Mato',
    slug: 'valmont-seragone-mato',
    isFocal: true,
    order: 1,
    sectorTitle: {
      fr: 'Fondateur opérationnel',
      en: 'Operating founder',
      es: 'Fundador operativo',
    },
    functionLabel: {
      fr: 'Fondateur opérationnel',
      en: 'Operating founder',
      es: 'Fundador operativo',
    },
    phone: '+41 78 749 81 70',
    email: 'info@saw-next.ch',
  },
  {
    key: 'harvy',
    firstName: 'Harvy',
    lastName: "O'Rollin",
    slug: 'harvy-orollin',
    isFocal: false,
    order: 2,
    sectorTitle: {
      fr: 'SPORT • LIFESTYLE PREMIUM • RÉSEAUX INTERNATIONAUX',
      en: 'SPORT • PREMIUM LIFESTYLE • INTERNATIONAL NETWORKS',
      es: 'DEPORTE • LIFESTYLE PREMIUM • REDES INTERNACIONALES',
    },
    functionLabel: {
      fr: 'Relations internationales & développement',
      en: 'International relations & development',
      es: 'Relaciones internacionales y desarrollo',
    },
    phone: '+33 6 42 00 14 74',
    email: 'info@saw-next.ch',
  },
  {
    key: 'lucian',
    firstName: 'Lucian',
    lastName: 'Trial',
    slug: 'lucian-trial',
    isFocal: false,
    order: 3,
    sectorTitle: {
      fr: 'ÉVÉNEMENTIEL • SHOWBIZ • HOSPITALITÉ',
      en: 'EVENTS • SHOWBIZ • HOSPITALITY',
      es: 'EVENTOS • SHOWBIZ • HOSPITALIDAD',
    },
    functionLabel: {
      fr: 'Relations VIP & développement',
      en: 'VIP relations & development',
      es: 'Relaciones VIP y desarrollo',
    },
    phone: '+41 76 492 77 76',
    email: 'info@saw-next.ch',
  },
  {
    key: 'tavio',
    firstName: 'Tavio',
    lastName: 'Modic',
    slug: 'tavio-modic',
    isFocal: false,
    order: 4,
    sectorTitle: {
      fr: 'IMMOBILIER • ARCHITECTURE • ART DE VIVRE',
      en: 'REAL ESTATE • ARCHITECTURE • ART OF LIVING',
      es: 'INMOBILIARIA • ARQUITECTURA • ARTE DE VIVIR',
    },
    functionLabel: {
      fr: 'Développement & vision de projets',
      en: 'Development & project vision',
      es: 'Desarrollo y visión de proyectos',
    },
    phone: '+41 79 417 39 49',
    email: 'info@saw-next.ch',
  },
  {
    key: 'sergio',
    firstName: 'Sergio',
    lastName: 'Kubas',
    slug: 'sergio-kubas',
    isFocal: false,
    order: 5,
    sectorTitle: {
      fr: 'SPORT & CERCLES PRIVÉS',
      en: 'SPORT & PRIVATE CIRCLES',
      es: 'DEPORTE Y CÍRCULOS PRIVADOS',
    },
    functionLabel: {
      fr: 'Relations internationales & développement',
      en: 'International relations & development',
      es: 'Relaciones internacionales y desarrollo',
    },
    phone: '+33 6 88 38 01 86',
    email: 'info@saw-next.ch',
  },
] as const;

/** The focal member (the operational contact) — falls back to the first entry. */
export const FOCAL_MEMBER: TeamMemberData =
  TEAM_MEMBERS.find(member => member.isFocal) ?? TEAM_MEMBERS[0]!;

/** Build a `tel:` href from a display phone, keeping the leading "+". */
export const toTelHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`;

/**
 * Resolve the WhatsApp link for a member.
 * - explicit `https://wa.me/…` wins,
 * - otherwise the digits of `whatsapp` (if set) or `phone` are used,
 *   stripping spaces, "+", parentheses and dashes.
 */
export const toWhatsAppHref = (member: Pick<TeamMemberData, 'phone' | 'whatsapp'>): string => {
  if (member.whatsapp && /^https?:\/\//i.test(member.whatsapp)) return member.whatsapp;
  const digits = (member.whatsapp ?? member.phone).replace(/\D/g, '');
  return `https://wa.me/${digits}`;
};
