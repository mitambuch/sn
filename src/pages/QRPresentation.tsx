// ═══════════════════════════════════════════════════
// QRPresentation — public salon one-pager at /QR
//
// WHAT: A standalone, mobile-first presentation page reached by scanning a
//       QR code at a trade show. Summarises the offer, the service quality
//       and the member platform, then converts via a bespoke form + two
//       CTAs (become a member / see the site). Multilingual (FR/EN/ES) via
//       an in-page language switcher. Lives OUTSIDE the /:locale tree and
//       outside LocaleProvider — so it manages its own language + meta.
// WHEN: /QR (top-level route, no app chrome). Kept deliberately light — no
//       Sanity fetch, no cinematic loader — so it loads instantly on a phone.
// EDIT COPY: src/locales/{fr,en,es}.json under qr.*
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { Reveal } from '@components/ui/Reveal';
import { useCyclingWord } from '@features/landing/useCyclingWord';
import { cn } from '@utils/cn';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { siteConfig } from '@/config/site';

// The 10 service verticales — content reused from the landing (landing.domains.*),
// rendered here as a condensed, scannable list (no Sanity, no hover preview).
const DOMAIN_KEYS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'] as const;
const QUALITY_ITEMS = [1, 2, 3, 4] as const;
const PLATFORM_POINTS = [1, 2, 3] as const;

/** Eyebrow tag + section heading, revealed on scroll. */
function SectionHeading({ tag, heading }: { tag: string; heading: string }) {
  return (
    <Reveal className="mb-10 flex flex-col gap-3">
      <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">{tag}</span>
      <h2 className="font-mono text-[clamp(1.5rem,5vw,3rem)] leading-[1] font-medium tracking-[-0.02em] text-balance uppercase">
        {heading}
      </h2>
    </Reveal>
  );
}

/** S02 — the 10 domains, condensed and scannable. */
function OfferSection() {
  const { t } = useTranslation();
  return (
    <section className="border-border border-t px-5 py-20 md:px-10 md:py-28">
      <SectionHeading tag={t('qr.offer.tag')} heading={t('qr.offer.heading')} />
      <Reveal className="text-muted mb-12 max-w-xl text-sm leading-relaxed text-pretty md:text-base">
        {t('qr.offer.lede')}
      </Reveal>
      <div className="border-border border-t">
        {DOMAIN_KEYS.map((k, i) => (
          <Reveal key={k} index={i}>
            <div className="border-border grid grid-cols-[40px_1fr_auto] items-baseline gap-4 border-b py-4">
              <span className="text-muted font-mono text-[10px] tracking-wider">{k}/10</span>
              <span className="font-mono text-[clamp(1rem,4.5vw,1.5rem)] tracking-[-0.01em] uppercase">
                {t(`landing.domains.${k}.name`)}
              </span>
              <span aria-hidden="true" className="text-muted font-mono text-sm">
                ↗
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** S03 — service quality, four pillars. */
function QualitySection() {
  const { t } = useTranslation();
  return (
    <section className="border-border border-t px-5 py-20 md:px-10 md:py-28">
      <SectionHeading tag={t('qr.quality.tag')} heading={t('qr.quality.heading')} />
      <div className="grid gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
        {QUALITY_ITEMS.map((n, i) => (
          <Reveal key={n} index={i}>
            <div className="flex flex-col gap-2">
              <h3 className="font-mono text-sm tracking-wide uppercase">
                {t(`qr.quality.item${String(n)}Title`)}
              </h3>
              <p className="text-muted text-sm leading-relaxed text-pretty">
                {t(`qr.quality.item${String(n)}Body`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** S04 — the member platform. */
function PlatformSection() {
  const { t } = useTranslation();
  return (
    <section className="border-border border-t px-5 py-20 md:px-10 md:py-28">
      <SectionHeading tag={t('qr.platform.tag')} heading={t('qr.platform.heading')} />
      <Reveal className="text-fg mb-12 max-w-xl text-base leading-relaxed text-pretty md:text-lg">
        {t('qr.platform.body')}
      </Reveal>
      <div className="grid gap-8 md:grid-cols-3 md:gap-12">
        {PLATFORM_POINTS.map((n, i) => (
          <Reveal key={n} index={i}>
            <div className="border-border flex flex-col gap-2 border-t pt-5">
              <h3 className="font-mono text-sm tracking-wide uppercase">
                {t(`qr.platform.point${String(n)}Title`)}
              </h3>
              <p className="text-muted text-sm leading-relaxed text-pretty">
                {t(`qr.platform.point${String(n)}Body`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function QRPresentation() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';

  // Outside LocaleProvider → sync <html lang> ourselves (i18n-sanity lesson #3).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const cyclingWord = useCyclingWord([
    t('qr.hero.word1'),
    t('qr.hero.word2'),
    t('qr.hero.word3'),
    t('qr.hero.word4'),
  ]);

  const title = `${t('qr.seo.title')} | ${siteConfig.name}`;
  const description = t('qr.seo.description');

  return (
    <div className="bg-bg text-fg min-h-screen">
      {/* React 19 hoists these into <head>. noindex → salon-exclusive. */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteConfig.url}/QR`} />

      {/* ─── Top chrome — brand mark + language switcher ─── */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <Link to={`/${lang}`} aria-label={t('qr.brandHomeLabel')} className="inline-flex">
          <BrandMark variant="full" className="text-base md:text-lg" />
        </Link>
        <LanguageSwitcher />
      </header>

      {/* ─── Hero ─── */}
      <section className="flex min-h-[100svh] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
        <p className="text-muted mb-6 font-mono text-[11px] tracking-[0.3em] uppercase">
          {t('qr.hero.eyebrow')}
        </p>
        <h1 className="font-mono text-[clamp(2.25rem,9vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-balance uppercase">
          {t('qr.hero.title')}
          <br />
          <span
            key={cyclingWord}
            className="text-accent inline-block motion-safe:animate-[fadeInWord_500ms_ease-out]"
          >
            {cyclingWord}
            <span aria-hidden="true" className="text-fg/40">
              .
            </span>
          </span>
        </h1>
        <p className="text-muted mt-8 max-w-xl text-base leading-relaxed text-pretty md:text-lg">
          {t('qr.hero.lede')}
        </p>

        <span
          aria-hidden="true"
          className={cn(
            'text-muted/60 mt-14 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase',
          )}
        >
          {t('qr.hero.scrollHint')} <span className="motion-safe:animate-bounce">↓</span>
        </span>
      </section>

      <OfferSection />
      <QualitySection />
      <PlatformSection />
    </div>
  );
}
