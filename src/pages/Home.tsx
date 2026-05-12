// ═══════════════════════════════════════════════════
// Home — Sawnext public landing
//
// WHAT: Renders the public landing page (v0.6 baseline). Composes the
//       spine sections (Hero S01, Presentation S03, Access S08,
//       Interlocutor S09, Footer) with the persistent chrome
//       (TopProgress + IndexOverlay + TerminalBar). The non-spine
//       sections (S02 sticky manifesto, S04 piliers, S05 domaines,
//       S06 expériences, S07 manifeste II) ship in the next pass.
// WHEN: Index of /:locale/, mounted OUTSIDE PublicLayout (no Header /
//       no Footer) so the TerminalBar acts as the chrome.
// EDIT COPY: src/locales/{fr,en}.json under landing.* — never inline.
// ═══════════════════════════════════════════════════

import { SeoHead } from '@components/features/SeoHead';
import {
  Access,
  Hero,
  type IndexEntry,
  IndexOverlay,
  Interlocutor,
  LandingFooter,
  Marquee,
  Presentation,
  TerminalBar,
  TopProgress,
} from '@features/landing';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [indexOpen, setIndexOpen] = useState(false);

  const openIndex = useCallback(() => {
    setIndexOpen(true);
  }, []);
  const closeIndex = useCallback(() => {
    setIndexOpen(false);
  }, []);

  const sections: IndexEntry[] = [
    {
      href: '#s01',
      num: '01',
      name: t('landing.index.s01name'),
      label: t('landing.index.s01label'),
    },
    {
      href: '#s03',
      num: '03',
      name: t('landing.index.s03name'),
      label: t('landing.index.s03label'),
    },
    {
      href: '#s08',
      num: '08',
      name: t('landing.index.s08name'),
      label: t('landing.index.s08label'),
    },
    {
      href: '#s09',
      num: '09',
      name: t('landing.index.s09name'),
      label: t('landing.index.s09label'),
    },
  ];

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

  return (
    <>
      <SeoHead />

      <TopProgress />

      {/* ─── Top corner : INDEX button (mix-blend pending — fg/bg pour l'instant) ─── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 py-3 md:px-12">
        <span className="text-fg pointer-events-auto font-mono text-[11px] font-semibold tracking-[0.02em]">
          SAW↗NEXT
        </span>
        <div className="pointer-events-auto flex items-center gap-4 font-mono text-[10px] tracking-widest uppercase">
          <span className="text-fg hidden items-center md:flex">
            <span
              aria-hidden="true"
              className="bg-fg mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
              style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
            />
            {t('landing.sessionActive')}
          </span>
          <button
            type="button"
            onClick={openIndex}
            className="border-fg text-fg hover:bg-fg hover:text-bg inline-flex items-center gap-2 border px-3.5 py-1.5 text-[10px] tracking-[0.12em] uppercase transition-colors"
          >
            <span aria-hidden="true" className="flex flex-col gap-[2px]">
              <span className="bg-fg block h-px w-3" />
              <span className="bg-fg block h-px w-3" />
              <span className="bg-fg block h-px w-3" />
            </span>
            {t('landing.indexButton')}
          </button>
        </div>
      </div>

      <IndexOverlay
        open={indexOpen}
        onClose={closeIndex}
        sections={sections}
        location={t('landing.index.footerLocation')}
        count={t('landing.index.footerCount')}
        edition={t('landing.index.footerEdition')}
        closeLabel={t('common.close')}
        title={t('landing.index.title')}
      />

      <main className="pb-13 md:pb-14">
        <Hero />
        <Marquee items={heroMarquee} tone="dark" />
        <Presentation />
        <Marquee items={finalMarquee} tone="light" />
        <Access />
        <Interlocutor />
        <Marquee items={finalMarquee} tone="dark" />
        <LandingFooter />
      </main>

      <TerminalBar
        tickerItems={tickerItems}
        statusLabel={t('landing.terminal.status')}
        tzLabel={t('landing.terminal.tz')}
        primaryCtaLabel={t('landing.cta.requestAccess')}
        primaryCtaHref="#s08"
        secondaryCtaLabel={t('landing.cta.privateArea')}
        secondaryCtaHref="#s08"
      />
    </>
  );
}
