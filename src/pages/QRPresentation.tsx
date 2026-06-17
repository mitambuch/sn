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
import { useCyclingWord } from '@features/landing/useCyclingWord';
import { cn } from '@utils/cn';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { siteConfig } from '@/config/site';

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
    </div>
  );
}
