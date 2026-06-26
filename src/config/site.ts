/* ═══════════════════════════════════════════════════════════════
   SITE CONFIG — SEO, contact, and social data
   Edit this file ONCE per project.
   SeoHead and OG tags read from here.
   Navigation lives in Header.tsx (needs icons + routes).
   ═══════════════════════════════════════════════════════════════ */

import { env } from './env';

export const siteConfig = {
  name: env.APP_NAME,
  url: env.APP_URL,
  locale: 'fr',
  language: 'fr',

  // ─── SEO defaults ──────────────────────────────────────────
  title: env.APP_NAME,
  description:
    'Conciergerie privée suisse — accès curaté à des biens, expériences et opportunités exclusives.',
  ogImage: '/images/sn-og.png', // SN-branded share card — public/images/sn-og.png

  // ─── Contact ───────────────────────────────────────────────
  email: '',
  phone: '',
  address: '',

  // ─── Social links ─────────────────────────────────────────
  socials: {
    instagram: '',
    facebook: '',
    linkedin: '',
  },

  // WHY: Set to true by /init — controls setup banner and Header display
  initialized: true,
} as const;
