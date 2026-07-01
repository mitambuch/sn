// ═══════════════════════════════════════════════════
// useLandingData — i18n-aware data for the landing chrome
//
// WHAT: Reads the t() function and returns the four data arrays consumed
//       by Home.tsx — the IndexOverlay sections list, the two marquee
//       item lists (hero band + final band), and the TerminalBar ticker
//       items. Extracting them out of Home keeps the page function
//       under the 150-line ESLint cap and centralises future changes.
// WHEN: Called once at the top of `Home.tsx`.
// ═══════════════════════════════════════════════════

import type { IndexEntry } from '@features/landing/IndexOverlay';
import { useTranslation } from 'react-i18next';

interface LandingData {
  sections: IndexEntry[];
  heroMarquee: string[];
  finalMarquee: string[];
  tickerItems: string[];
}

const SECTION_KEYS = ['01', '02', '03', '04', '05', '06', '07'] as const;

export function useLandingData(): LandingData {
  const { t } = useTranslation();

  const sections: IndexEntry[] = SECTION_KEYS.map(key => ({
    href: `#s${key}`,
    num: key,
    name: t(`landing.index.s${key}name`),
    label: t(`landing.index.s${key}label`),
  }));

  const heroMarquee = [
    t('landing.marquee.edition'),
    t('landing.marquee.coopOpen'),
    t('landing.marquee.experiencesActive'),
    t('landing.marquee.verticals'),
    t('landing.marquee.circle'),
    t('landing.marquee.location'),
    t('landing.marquee.season'),
  ];

  const finalMarquee = [
    t('landing.marquee.brand'),
    t('landing.marquee.copyright'),
    t('landing.marquee.location'),
    t('landing.marquee.rightsReserved'),
    t('landing.marquee.confidential'),
    t('landing.marquee.cooptationOnly'),
  ];

  const tickerItems = [
    `↗ ${t('landing.marquee.edition')}`,
    t('landing.marquee.coopOpen'),
    t('landing.marquee.experiencesActive'),
    t('landing.marquee.season'),
    t('landing.marquee.verticalsCircle'),
    t('landing.marquee.location'),
    t('landing.marquee.confidential'),
    t('landing.marquee.monthlyUpdate'),
  ];

  return { sections, heroMarquee, finalMarquee, tickerItems };
}
