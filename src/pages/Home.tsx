// ═══════════════════════════════════════════════════
// Home — Sawnext public landing
//
// WHAT: Composes the public landing (v0.6 baseline) — Hero S01 →
//       Manifesto S02 (sticky 300vh) → Presentation S03 → Principles
//       S04 (blur-reveal) → Domains S05 → Access S08 → Interlocutor
//       S09 → Footer + the persistent chrome (TopProgress + INDEX
//       overlay + sticky-at-end TerminalBar). Top-corner chrome
//       (BrandMark + INDEX button) inverts to white when the user
//       scrolls into a section flagged `data-landing-dark="true"`.
// WHEN: Index of /:locale/, mounted OUTSIDE PublicLayout (no Header /
//       no Footer) so the TerminalBar acts as the chrome.
// EDIT COPY: src/locales/{fr,en}.json under landing.* + Sanity
//       `landing-singleton` (preferred for client-editable text).
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { BrandMark } from '@components/brand/BrandMark';
import { SeoHead } from '@components/features/SeoHead';
import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { type Locale } from '@config/i18n';
import { AccessRequestModalProvider } from '@context/AccessRequestModalContext';
import { LandingContentProvider, useLandingContext } from '@context/LandingContentContext';
import { LoginModalProvider } from '@context/LoginModalContext';
import { useAccessRequestModal } from '@context/useAccessRequestModal';
import { useLoginModal } from '@context/useLoginModal';
import {
  Access,
  Domains,
  Hero,
  IndexOverlay,
  Interlocutor,
  LandingFooter,
  Manifesto,
  Marquee,
  Presentation,
  Principles,
  TerminalBar,
  TopProgress,
  useLandingData,
} from '@features/landing';
import { Loader } from '@features/landing/Loader/Loader';
import { resolveFieldOrFallback } from '@lib/i18nField';
import { cn } from '@utils/cn';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isVitrineMode } from '@/config/env';

export default function Home() {
  return (
    <LandingContentProvider>
      <LoginModalProvider>
        <AccessRequestModalProvider>
          <HomeContent />
        </AccessRequestModalProvider>
      </LoginModalProvider>
    </LandingContentProvider>
  );
}

function HomeContent() {
  const { t, i18n } = useTranslation();
  const { data: landing } = useLandingContext();
  const locale = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';
  const { locale: routeLocale, setLocale } = useLocale();
  const { openLogin } = useLoginModal();
  const { openAccessRequest } = useAccessRequestModal();
  const [indexOpen, setIndexOpen] = useState(false);
  const [compactLogo, setCompactLogo] = useState(false);
  // Top-corner chrome stays hidden while the Loader is on screen, then
  // fades in once it has fully lifted away. Owner direction : "on a juste
  // le chargement, le logo apparaît après."
  const [loaderDone, setLoaderDone] = useState(false);

  // Scroll-driven logo morph : SAW↗NEXT → S↗N once past 220px.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      setCompactLogo(window.scrollY > 220);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const openIndex = useCallback(() => {
    setIndexOpen(true);
  }, []);
  const closeIndex = useCallback(() => {
    setIndexOpen(false);
  }, []);

  const { sections, heroMarquee, finalMarquee } = useLandingData();

  // Sanity-resolved labels reused across IndexOverlay + TerminalBar.
  const labelRequestAccess = resolveFieldOrFallback(
    landing?.ctaRequestAccess,
    locale,
    t('landing.cta.requestAccess'),
  );
  const labelPrivateArea = resolveFieldOrFallback(
    landing?.ctaPrivateArea,
    locale,
    t('landing.cta.privateArea'),
  );

  return (
    <>
      <SeoHead />
      {/* Cinematic entry — fires on every landing visit. Skip via the
          top-right "Skip" button or via Esc/Enter/Space once posed. */}
      <Loader
        onDone={() => {
          setLoaderDone(true);
        }}
      />
      <TopProgress />
      <TopCornerChrome
        compactLogo={compactLogo}
        indexOpen={indexOpen}
        openIndex={openIndex}
        title={t('landing.index.title')}
        indexLabel={t('landing.indexButton')}
        visible={loaderDone}
        currentLocale={routeLocale}
        onLocaleChange={setLocale}
      />

      <IndexOverlay
        open={indexOpen}
        onClose={closeIndex}
        sections={sections}
        location={resolveFieldOrFallback(
          landing?.footerLocation,
          locale,
          t('landing.index.footerLocation'),
        )}
        count={t('landing.index.footerCount')}
        edition={resolveFieldOrFallback(
          landing?.footerEdition,
          locale,
          t('landing.index.footerEdition'),
        )}
        closeLabel={t('common.close')}
        title={t('landing.index.title')}
        primaryCtaLabel={labelRequestAccess}
        primaryCtaNode={
          <button
            type="button"
            onClick={() => {
              closeIndex();
              openAccessRequest('request');
            }}
            className="border-bg bg-bg text-fg hover:bg-bg/90 inline-flex items-center justify-between gap-3 rounded-full border px-6 py-4 font-mono text-xs tracking-widest uppercase transition-colors md:py-5 md:text-sm"
          >
            <span>{labelRequestAccess}</span>
            <span aria-hidden="true">↗</span>
          </button>
        }
        secondaryCtaLabel={isVitrineMode ? undefined : labelPrivateArea}
        secondaryCtaNode={
          isVitrineMode ? undefined : (
            <button
              type="button"
              onClick={() => {
                closeIndex();
                openLogin();
              }}
              className="border-bg text-bg hover:bg-bg hover:text-fg inline-flex items-center justify-between gap-3 rounded-full border px-6 py-4 font-mono text-xs tracking-widest uppercase transition-colors md:py-5 md:text-sm"
            >
              <span>{labelPrivateArea}</span>
              <span aria-hidden="true">↗</span>
            </button>
          )
        }
      />

      {/* ─── Main — TerminalBar sits at the natural end. overflow-x clip
           kills any horizontal scroll from negative-margin or grain overlays.
           Owner direction 2026-05-14 : the LoginModal must overlay the
           landing instead of replacing it ("on doit voir derrière"). The
           Modal backdrop (bg-black/60 + backdrop-blur-sm) does the dim,
           and the body.modal-active rule pauses CSS animations. The two
           heaviest JS loops (Hero typewriter setState 90ms + video tag
           autoplay rendering) are paused locally inside Hero when the
           login modal is open — see Hero.tsx for the gates. ─── */}
      <main className="overflow-x-clip">
        <Hero />
        <Marquee items={heroMarquee} tone="dark" />
        <Manifesto />
        <Presentation />
        <Marquee items={finalMarquee} tone="light" />
        <Principles />
        <Domains />
        <Marquee items={finalMarquee} tone="light" />
        <Access />
        <Interlocutor />
        <Marquee items={finalMarquee} tone="dark" />
        <LandingFooter />

        <TerminalBar
          statusLabel={resolveFieldOrFallback(
            landing?.terminalStatus,
            locale,
            t('landing.terminal.status'),
          )}
          tzLabel={resolveFieldOrFallback(landing?.terminalTz, locale, t('landing.terminal.tz'))}
          primaryCtaLabel={labelRequestAccess}
          onPrimaryCta={() => {
            openAccessRequest('request');
          }}
          secondaryCtaLabel={isVitrineMode ? undefined : labelPrivateArea}
          onSecondaryCta={isVitrineMode ? undefined : openLogin}
          callCtaLabel={resolveFieldOrFallback(
            landing?.ctaCallDirect,
            locale,
            t('landing.cta.callDirect'),
          )}
        />
      </main>
    </>
  );
}

interface TopCornerChromeProps {
  compactLogo: boolean;
  indexOpen: boolean;
  openIndex: () => void;
  title: string;
  indexLabel: string;
  /** When false, the entire chrome fades out + becomes inert. Used to
   *  keep the brand mark off-screen until the Loader has fully lifted
   *  away. */
  visible: boolean;
  currentLocale: Locale;
  onLocaleChange: (next: Locale) => void;
}

/** Top-corner chrome — BrandMark (cross-fades SAW↗NEXT ↔ S↗N on scroll)
 *  + INDEX button. Renders white + `mix-blend-mode: difference` so the
 *  chrome auto-inverts against any background (video, bg-ink, bg-bg) —
 *  always visible, always reads as a negative print of whatever sits
 *  below. The `darkActive` prop is kept for future hooks but no longer
 *  drives color (mix-blend handles all backgrounds). */
const TopCornerChrome = ({
  compactLogo,
  indexOpen,
  openIndex,
  title,
  indexLabel,
  visible,
  currentLocale,
  onLocaleChange,
}: TopCornerChromeProps) => {
  const text = 'text-white';
  const border = 'border-white';
  const bar = 'bg-white';

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-100 flex items-center justify-between px-5 py-4 md:px-12 md:py-5"
      style={{
        mixBlendMode: 'difference',
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms ease-out 200ms',
        visibility: visible ? 'visible' : 'hidden',
      }}
      aria-hidden={!visible}
    >
      <a
        href="#s01"
        className={cn('pointer-events-auto transition-colors duration-300', text)}
        aria-label={title}
      >
        <span className="relative inline-flex h-5 items-center md:h-6">
          <BrandMark
            variant="full"
            className={cn(
              'absolute inset-y-0 left-0 inline-flex items-center text-base whitespace-nowrap transition-[opacity,transform] duration-500 ease-out md:text-lg',
              compactLogo
                ? 'pointer-events-none -translate-y-1 opacity-0 blur-[2px]'
                : 'blur-0 translate-y-0 opacity-100',
            )}
          />
          <BrandMark
            variant="short"
            className={cn(
              'absolute inset-y-0 left-0 inline-flex items-center text-base whitespace-nowrap transition-[opacity,transform] duration-500 ease-out md:text-lg',
              compactLogo
                ? 'blur-0 translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-1 opacity-0 blur-[2px]',
            )}
          />
          {/* Invisible sizer keeps the anchor box wide enough to land
              the full mark when scrolled to top. */}
          <BrandMark variant="full" className="invisible text-base whitespace-nowrap md:text-lg" />
        </span>
      </a>
      <div className="flex items-center gap-3 md:gap-4">
        <LanguageSwitcher
          currentLocale={currentLocale}
          onLocaleChange={onLocaleChange}
          tone="inverted"
          className={cn('pointer-events-auto', text)}
        />
        <button
          type="button"
          onClick={openIndex}
          className={cn(
            'pointer-events-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs tracking-widest uppercase',
            text,
            border,
          )}
          aria-haspopup="dialog"
          aria-expanded={indexOpen}
        >
          <span aria-hidden="true" className="flex flex-col gap-0.5">
            <span className={cn('block h-px w-3.5', bar)} />
            <span className={cn('block h-px w-3.5', bar)} />
            <span className={cn('block h-px w-3.5', bar)} />
          </span>
          {indexLabel}
        </button>
      </div>
    </div>
  );
};
