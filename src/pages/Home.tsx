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

import { useLocale } from '@app/LocaleProvider';
import { BrandMark } from '@components/brand/BrandMark';
import { SeoHead } from '@components/features/SeoHead';
import { ROUTES } from '@constants/routes';
import {
  Access,
  Domains,
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
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
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
      href: '#s05',
      num: '05',
      name: t('landing.index.s05name'),
      label: t('landing.index.s05label'),
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

      {/* ─── Top corner : BrandMark (left, big enough to read) + INDEX (right) ─── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-100 flex items-center justify-between px-5 py-4 md:px-12 md:py-5">
        <a href="#s01" className="pointer-events-auto" aria-label={t('landing.index.title')}>
          <BrandMark className="text-fg text-base md:text-lg" />
        </a>
        <button
          type="button"
          onClick={openIndex}
          className="border-fg text-fg hover:bg-fg hover:text-bg pointer-events-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors"
          aria-haspopup="dialog"
          aria-expanded={indexOpen}
        >
          <span aria-hidden="true" className="flex flex-col gap-0.5">
            <span className="bg-fg block h-px w-3.5" />
            <span className="bg-fg block h-px w-3.5" />
            <span className="bg-fg block h-px w-3.5" />
          </span>
          {t('landing.indexButton')}
        </button>
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
        primaryCtaLabel={t('landing.cta.requestAccess')}
        primaryCtaHref="#s08"
        secondaryCtaLabel={t('landing.cta.privateArea')}
        secondaryCtaNode={
          <Link
            to={localePath(ROUTES.LOGIN)}
            onClick={closeIndex}
            className="border-bg text-bg hover:bg-bg hover:text-fg inline-flex items-center justify-between gap-3 rounded-full border px-6 py-4 font-mono text-xs tracking-widest uppercase transition-colors md:py-5 md:text-sm"
          >
            <span>{t('landing.cta.privateArea')}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        }
      />

      {/* ─── Main — TerminalBar is sticky at the end, no overlay risk ─── */}
      <main>
        <Hero />
        <Marquee items={heroMarquee} tone="dark" />
        <Presentation />
        <Domains />
        <Marquee items={finalMarquee} tone="light" />
        <Access />
        <Interlocutor />
        <Marquee items={finalMarquee} tone="dark" />
        <LandingFooter />

        <TerminalBar
          tickerItems={tickerItems}
          statusLabel={t('landing.terminal.status')}
          tzLabel={t('landing.terminal.tz')}
          primaryCtaLabel={t('landing.cta.requestAccess')}
          primaryCtaHref="#s08"
          secondaryCtaLabel={t('landing.cta.privateArea')}
          secondaryCtaHref={localePath(ROUTES.LOGIN)}
        />
      </main>
    </>
  );
}
