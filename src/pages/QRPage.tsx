// ═══════════════════════════════════════════════════
// QRPage — the salon QR holder at /QR
//
// WHAT: A single, brand-dressed page whose only job is to display a large
//       scannable QR code pointing at /presentation. The presenter opens it,
//       shows the phone, visitors scan and land on the presentation. Same
//       universe as the landing — grey bg, global film grain, ✦ marquee,
//       mix-blend chrome — with the QR sitting in a clean white card for
//       reliable scanning. Multilingual, mobile-first.
// WHEN: /QR (top-level route, outside LocaleProvider — self-manages i18n + meta).
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { Marquee } from '@features/landing/Marquee';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { siteConfig } from '@/config/site';

const DOMAIN_KEYS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'] as const;

export default function QRPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const url = `${siteConfig.url}/presentation`;
  const title = `${t('qr.qrpage.eyebrow')} | ${siteConfig.name}`;
  const marqueeItems = DOMAIN_KEYS.map(k => t(`landing.domains.${k}.name`));

  return (
    <div className="bg-bg text-fg relative flex min-h-screen flex-col">
      <title>{title}</title>
      <meta name="robots" content="noindex, nofollow" />

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

      <main className="flex flex-1 flex-col items-center justify-center gap-9 px-5 py-28 text-center">
        <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
          ↗ {t('qr.qrpage.eyebrow')}
        </span>
        <h1 className="font-mono text-[clamp(1.75rem,6vw,3rem)] leading-[1] font-medium tracking-[-0.02em] text-balance uppercase">
          {t('qr.qrpage.title')}
        </h1>

        {/* White card → reliable scan contrast over the grey grain bg. */}
        <div className="rounded-media border-border/60 border bg-white p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]">
          <QRCodeSVG
            value={url}
            size={320}
            level="M"
            fgColor="#000000"
            bgColor="#ffffff"
            marginSize={1}
            className="h-auto w-[min(72vw,320px)]"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-fg font-mono text-xs tracking-widest">
            {url.replace(/^https?:\/\//, '')}
          </p>
          <p className="text-muted max-w-xs text-sm leading-relaxed text-pretty">
            {t('qr.qrpage.hint')}
          </p>
        </div>
      </main>

      <Marquee items={marqueeItems} tone="dark" />
    </div>
  );
}
