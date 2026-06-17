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
import { Button } from '@components/ui/Button';
import { Checkbox } from '@components/ui/Checkbox';
import { Input } from '@components/ui/Input';
import { LanguageSwitcher } from '@components/ui/LanguageSwitcher';
import { Reveal } from '@components/ui/Reveal';
import { Textarea } from '@components/ui/Textarea';
import { useCyclingWord } from '@features/landing/useCyclingWord';
import { cn } from '@utils/cn';
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { siteConfig } from '@/config/site';
import { hasSupabase, supabase } from '@/lib/supabase';

/** Boundary email check — good enough for a salon form, not RFC-perfect. */
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

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

/** S05 — anonymous bespoke lead form. Writes to access_requests (the same
 *  anon-write path as the membership request) → the Postgres trigger emails
 *  the operator. Marked activity "Salon / QR" so Salva knows the source.
 *  Falls back to a simulator when no backend (starter without .env.local). */
function BespokeForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const valid = name.trim() !== '' && isValidEmail(email) && message.trim() !== '' && consent;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending' || !valid) return;
    setStatus('sending');
    const parts = name.trim().split(/\s+/);
    const first = parts[0] ?? name.trim();
    const last = parts.slice(1).join(' ') || first;

    if (hasSupabase && supabase) {
      const { error } = await supabase.from('access_requests').insert({
        first_name: first,
        last_name: last,
        email: email.trim(),
        phone: phone.trim() || null,
        activity: 'Salon / QR',
        message: message.trim(),
      });
      setStatus(error ? 'error' : 'ok');
      return;
    }
    await new Promise<void>(resolve => {
      setTimeout(resolve, 600);
    });
    setStatus('ok');
  };

  return (
    <section id="qr-bespoke" className="border-border border-t px-5 py-20 md:px-10 md:py-28">
      <SectionHeading tag={t('qr.form.tag')} heading={t('qr.form.heading')} />
      {status === 'ok' ? (
        <Reveal className="border-border bg-surface/40 max-w-xl rounded-lg border p-8">
          <p className="text-fg text-base leading-relaxed">{t('qr.form.success')}</p>
        </Reveal>
      ) : (
        <Reveal className="max-w-xl">
          <p className="text-muted mb-8 text-sm leading-relaxed text-pretty md:text-base">
            {t('qr.form.lede')}
          </p>
          <form
            className="flex flex-col gap-5"
            onSubmit={e => {
              void handleSubmit(e);
            }}
          >
            <Input
              label={t('qr.form.name')}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('qr.form.namePlaceholder')}
              autoComplete="name"
              required
            />
            <Input
              label={t('qr.form.email')}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('qr.form.emailPlaceholder')}
              autoComplete="email"
              required
            />
            <Input
              label={t('qr.form.phone')}
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t('qr.form.phonePlaceholder')}
              autoComplete="tel"
            />
            <Textarea
              label={t('qr.form.message')}
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t('qr.form.messagePlaceholder')}
              required
            />
            <Checkbox
              label={t('qr.form.consent')}
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
            />
            {status === 'error' && (
              <p className="text-danger-text text-sm" role="alert">
                {t('qr.form.error')}
              </p>
            )}
            <Button
              type="submit"
              isLoading={status === 'sending'}
              disabled={!valid}
              className="self-start"
            >
              {status === 'sending' ? t('qr.form.sending') : t('qr.form.submit')}
            </Button>
          </form>
        </Reveal>
      )}
    </section>
  );
}

/** S06 — bottom conversion: become a member (scrolls to the form), see the
 *  site, and the native share micro-feature (Web Share API → clipboard). */
function CtaSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';
  const [copied, setCopied] = useState(false);

  const scrollToForm = () => {
    document.getElementById('qr-bespoke')?.scrollIntoView({ behavior: 'smooth' });
  };

  const share = async () => {
    const url = typeof window === 'undefined' ? `${siteConfig.url}/QR` : window.location.href;
    const data = { title: siteConfig.name, text: t('qr.cta.shareText'), url };
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(data);
      } catch {
        /* user dismissed the share sheet — no-op */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <section className="border-border border-t px-5 py-24 md:px-10 md:py-32">
      <Reveal className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-mono text-[clamp(1.75rem,6vw,3.5rem)] leading-[1] font-medium tracking-[-0.02em] text-balance uppercase">
            {t('qr.cta.heading')}
          </h2>
          <p className="text-muted max-w-md text-base leading-relaxed text-pretty">
            {t('qr.cta.body')}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button type="button" onClick={scrollToForm} className="justify-center">
            {t('qr.cta.becomeMember')} <span aria-hidden="true">↗</span>
          </Button>
          <Link
            to={`/${lang}`}
            className={cn(
              'border-border text-fg hover:bg-fg/5 inline-flex items-center justify-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
              'duration-base transition-colors',
            )}
          >
            {t('qr.cta.seeSite')} <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              void share();
            }}
            className="text-muted hover:text-fg duration-base inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 font-mono text-xs tracking-widest uppercase transition-colors"
          >
            {copied ? t('qr.cta.shared') : t('qr.cta.share')} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </Reveal>
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
      <BespokeForm />
      <CtaSection />

      <footer className="border-border flex items-center justify-between border-t px-5 py-8 md:px-10">
        <BrandMark variant="short" className="text-muted text-sm" />
        <span className="text-muted/70 font-mono text-[10px] tracking-[0.3em] uppercase">
          {t('qr.hero.eyebrow')}
        </span>
      </footer>
    </div>
  );
}
