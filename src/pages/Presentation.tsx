// ═══════════════════════════════════════════════════
// Presentation — public salon presentation page at /presentation
//
// WHAT: The destination scanned from /QR. Immersive, editorial, in the
//       landing's visual universe — a cinematic video hero (same Cloudinary
//       shots as the landing), global film grain, ✦ marquees, a big manifesto
//       statement, a two-column domain index, service quality as prose, an
//       ink platform statement, then a bespoke lead form + CTAs. Layout is
//       deliberately VARIED (statement / index / prose / ink) rather than a
//       repeated card grid. Multilingual (FR/EN/ES), mobile-first.
// WHEN: /presentation (top-level route, outside LocaleProvider — self-manages
//       language + meta). Pattern: patterns/2026-06-17-standalone-public-page-outside-localeprovider.md
// EDIT COPY: src/locales/{fr,en,es}.json under qr.*  ·  EDIT FOOTAGE: config/heroVideos.ts
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { Reveal } from '@components/ui/Reveal';
import { Marquee } from '@features/landing/Marquee';
import { SectionTag } from '@features/landing/SectionTag';
import { FOCAL_MEMBER } from '@features/landing/teamData';
import { useCyclingWord } from '@features/landing/useCyclingWord';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { HERO_VIDEOS } from '@/config/heroVideos';
import { siteConfig } from '@/config/site';
import { resolveDeviceLocale } from '@/lib/deviceLocale';

const DOMAIN_KEYS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'] as const;
const QUALITY_ITEMS = [1, 2, 3, 4] as const;
const PLATFORM_POINTS = [1, 2, 3] as const;
const HERO_META = [1, 2, 3] as const;

/** S01 — cinematic video hero (same shots as the landing), grain, cycling
 *  word in mix-blend negative over the footage, terminal meta strip. */
function Hero() {
  const { t } = useTranslation();
  const [videoSrc] = useState(
    () => HERO_VIDEOS[Math.floor(Math.random() * HERO_VIDEOS.length)] ?? HERO_VIDEOS[0],
  );
  const word = useCyclingWord([
    t('qr.hero.word1'),
    t('qr.hero.word2'),
    t('qr.hero.word3'),
    t('qr.hero.word4'),
  ]);
  return (
    <section className="bg-ink relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pt-28 pb-8 text-white md:px-12 md:pt-32">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src={videoSrc}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-black/45" />

      <SectionTag num="01" label={t('qr.hero.eyebrow')} className="text-white/70" />

      <div className="flex flex-1 flex-col justify-center py-12">
        <h1 className="max-w-5xl font-mono text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] font-medium tracking-[-0.03em] text-balance uppercase">
          {t('qr.hero.title')}
          <br />
          <span
            key={word}
            className="inline-block text-white motion-safe:animate-[fadeInWord_500ms_ease-out]"
            style={{ mixBlendMode: 'difference' }}
          >
            {word}
            <span aria-hidden="true" className="text-white/40">
              .
            </span>
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-pretty text-white/85 md:text-lg">
          {t('qr.hero.lede')}
        </p>
      </div>

      <div className="flex flex-col gap-6 border-t border-white/25 pt-6">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-white/70 uppercase">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-1 w-1 rounded-full bg-white"
              style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
            />
            {t('qr.hero.scrollHint')}
          </span>
          <span>{t('qr.hero.gps')}</span>
        </div>
        <dl className="grid grid-cols-1 gap-x-12 gap-y-1.5 font-mono text-[10px] leading-[1.9] tracking-wider uppercase sm:grid-cols-3">
          {HERO_META.map(n => (
            <div key={n} className="flex justify-between border-b border-white/15 py-1.5">
              <dt className="text-white/55">{t(`qr.hero.m${String(n)}Label`)}</dt>
              <dd className="font-medium text-white">{t(`qr.hero.m${String(n)}Value`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** S02 — a single immersive statement (the offer thesis, set large). */
function Manifesto() {
  const { t } = useTranslation();
  return (
    <section className="px-5 py-28 md:px-12 md:py-40">
      <Reveal>
        <p className="text-fg max-w-4xl font-mono text-[clamp(1.5rem,4.2vw,2.75rem)] leading-[1.2] font-medium tracking-[-0.02em] text-balance uppercase">
          {t('qr.offer.lede')}
        </p>
      </Reveal>
    </section>
  );
}

/** S03 — the ten domains as a dense two-column index. */
function Offer() {
  const { t } = useTranslation();
  return (
    <section className="border-border border-y px-5 py-24 md:px-12 md:py-32">
      <Reveal className="mb-12 flex flex-col gap-4">
        <SectionTag num="02" label={t('qr.offer.tag')} />
        <h2 className="font-mono text-[clamp(1.75rem,5vw,3.5rem)] leading-[0.98] font-medium tracking-[-0.025em] text-balance uppercase">
          {t('qr.offer.heading')}
        </h2>
      </Reveal>
      <div className="border-border grid border-t sm:grid-cols-2">
        {DOMAIN_KEYS.map((k, i) => (
          <Reveal key={k} index={i}>
            <div className="border-border group flex items-baseline gap-4 border-b py-4 transition-[padding] duration-300 ease-out hover:pl-2 sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
              <span className="text-muted font-mono text-[10px] tracking-wider">{k}</span>
              <span className="flex-1 font-mono text-[clamp(1rem,3.5vw,1.4rem)] tracking-[-0.01em] uppercase">
                {t(`landing.domains.${k}.name`)}
              </span>
              <span
                aria-hidden="true"
                className="text-muted group-hover:text-fg font-mono text-sm transition-[color,transform] group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** S04 — service quality as flowing editorial prose, not a card grid. */
function Quality() {
  const { t } = useTranslation();
  return (
    <section className="px-5 py-24 md:px-12 md:py-32">
      <Reveal className="mb-14 flex max-w-3xl flex-col gap-5">
        <SectionTag num="03" label={t('qr.quality.tag')} />
        <h2 className="font-mono text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.025em] text-balance uppercase">
          {t('qr.quality.heading')}
        </h2>
      </Reveal>
      <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
        {QUALITY_ITEMS.map((n, i) => (
          <Reveal key={n} index={i}>
            <p className="text-muted max-w-xl text-base leading-[1.7] text-pretty md:text-lg">
              <span className="text-fg mr-2 font-mono text-sm tracking-wide uppercase">
                {t(`qr.quality.item${String(n)}Title`)} —
              </span>
              {t(`qr.quality.item${String(n)}Body`)}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** S05 — the member platform as an immersive ink statement + run-in points. */
function Platform() {
  const { t } = useTranslation();
  return (
    <section className="bg-ink text-on-ink relative isolate overflow-hidden px-5 py-28 md:px-12 md:py-40">
      <Reveal className="flex max-w-4xl flex-col gap-6">
        <SectionTag num="04" label={t('qr.platform.tag')} className="text-on-ink/70" />
        <h2 className="font-mono text-[clamp(1.75rem,5vw,3.5rem)] leading-[1] font-medium tracking-[-0.025em] text-balance uppercase">
          {t('qr.platform.heading')}
        </h2>
        <p className="text-on-ink/85 text-[clamp(1.125rem,2.5vw,1.6rem)] leading-[1.45] text-pretty">
          {t('qr.platform.body')}
        </p>
      </Reveal>
      <div className="border-on-ink/20 mt-16 grid gap-10 border-t pt-12 md:grid-cols-3 md:gap-12">
        {PLATFORM_POINTS.map((n, i) => (
          <Reveal key={n} index={i}>
            <div className="flex flex-col gap-2">
              <span className="text-on-ink/50 font-mono text-[10px] tracking-wider">
                0{String(n)}
              </span>
              <h3 className="font-mono text-base tracking-tight uppercase">
                {t(`qr.platform.point${String(n)}Title`)}
              </h3>
              <p className="text-on-ink/70 text-sm leading-relaxed text-pretty">
                {t(`qr.platform.point${String(n)}Body`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Sober A4 takeaway — hidden on screen, shown only when printing
 *  ("Télécharger le PDF" → window.print()). Same mono typography, black on
 *  white, just the essentials. */
function PrintSheet() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';
  return (
    <div className="hidden bg-white font-mono text-black print:fixed print:inset-0 print:block print:overflow-hidden">
      <div className="flex items-baseline justify-between border-b border-black/25 pb-4">
        <BrandMark variant="full" className="text-2xl" />
        <span className="text-[10px] tracking-[0.3em] uppercase">{t('qr.hero.eyebrow')}</span>
      </div>
      <p className="mt-10 max-w-2xl text-xl leading-snug font-medium tracking-tight uppercase">
        {t('qr.offer.lede')}
      </p>
      <div className="mt-12">
        <span className="text-[10px] tracking-[0.3em] text-black/60 uppercase">
          ↘ {t('qr.offer.tag')}
        </span>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/75">
          {t('qr.offer.heading')}
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-x-12">
          {DOMAIN_KEYS.map(k => (
            <li key={k} className="flex gap-3 border-b border-black/10 py-2 text-sm uppercase">
              <span className="text-black/50">{k}</span>
              <span>{t(`landing.domains.${k}.name`)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-12 max-w-2xl text-base leading-relaxed">{t('qr.experience.body')}</p>
      <div className="mt-12 flex items-end justify-between gap-6 border-t border-black/25 pt-5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-[0.3em] text-black/55 uppercase">
            {t('qr.pdf.contact')}
          </span>
          <span className="text-sm font-medium uppercase">
            {FOCAL_MEMBER.firstName} {FOCAL_MEMBER.lastName}
          </span>
          <span className="text-xs text-black/65 uppercase">
            {FOCAL_MEMBER.functionLabel[lang]}
          </span>
          <span className="text-xs">
            {FOCAL_MEMBER.phone} · {FOCAL_MEMBER.email}
          </span>
        </div>
        <span className="text-lg font-bold tracking-[0.12em] uppercase">saw-next.ch</span>
      </div>
    </div>
  );
}

export default function Presentation() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';

  // Open in the visitor's own device language — England → EN, Paris → FR
  // (owner direction 2026-06-17). Runs once; the switcher still overrides.
  useEffect(() => {
    void i18n.changeLanguage(resolveDeviceLocale());
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const title = `${t('qr.seo.title')} | ${siteConfig.name}`;
  const description = t('qr.seo.description');
  const marqueeItems = DOMAIN_KEYS.map(k => t(`landing.domains.${k}.name`));

  return (
    <>
      <div className="bg-bg text-fg min-h-screen print:hidden">
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteConfig.url}/presentation`} />

        <header
          className="pointer-events-none fixed inset-x-0 top-0 z-100 flex items-center justify-between px-5 py-4 text-white md:px-12 md:py-5"
          style={{ mixBlendMode: 'difference' }}
        >
          <Link
            to={`/${lang}`}
            aria-label={t('qr.brandHomeLabel')}
            className="pointer-events-auto inline-flex"
          >
            <BrandMark variant="full" className="text-base md:text-lg" />
          </Link>
          <LanguageSwitcher tone="inverted" className="pointer-events-auto" />
        </header>

        <Hero />
        <Marquee items={marqueeItems} tone="dark" />
        <Manifesto />
        <Offer />
        <Quality />
        <Marquee items={marqueeItems} tone="light" />
        <Platform />

        {/* S06 — closing: every service is lived as an experience → redirect to
          the site (no form), plus a sober A4 PDF takeaway. */}
        <section className="px-5 py-28 md:px-12 md:py-36">
          <Reveal className="flex flex-col gap-8">
            <div className="flex max-w-3xl flex-col gap-4">
              <SectionTag num="06" label={t('qr.experience.tag')} />
              <h2 className="font-mono text-[clamp(2rem,7vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.025em] text-balance uppercase">
                {t('qr.experience.heading')}
              </h2>
              <p className="text-muted max-w-2xl text-lg leading-relaxed text-pretty md:text-xl">
                {t('qr.experience.body')}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <Link
                to={`/${lang}`}
                className="border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent inline-flex items-center justify-center gap-3 rounded-full border px-7 py-3.5 font-mono text-xs tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t('qr.cta.seeSite')} <span aria-hidden="true">↗</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="border-border text-fg hover:bg-fg/5 inline-flex items-center justify-center gap-3 rounded-full border px-7 py-3.5 font-mono text-xs tracking-widest uppercase transition-colors"
              >
                {t('qr.pdf.download')} <span aria-hidden="true">↓</span>
              </button>
            </div>
          </Reveal>
        </section>

        <footer className="border-border flex items-center justify-between border-t px-5 py-8 md:px-12">
          <BrandMark variant="short" className="text-muted text-sm" />
          <span className="text-muted/70 font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('qr.hero.eyebrow')}
          </span>
        </footer>
      </div>
      <PrintSheet />
    </>
  );
}
