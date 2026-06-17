// ═══════════════════════════════════════════════════
// PublicFiche — Public route /c/:type/:id, one read-only catalogue fiche
//
// WHAT: Opened from the home "08.A Aperçu du catalogue" teaser. Renders a
//       single catalogue doc flagged `visibility == "public"` in Sanity —
//       no authentication, read-only. Shows the essentials (hero image,
//       title, summary, description, event date/venue, gallery) + a
//       "demander un accès" CTA that funnels to the access tunnel. The full
//       specsheet (price, dimensions…) stays behind access — public sees the
//       appetite-whetter, not the deal sheet (HNW discretion).
// WHEN: /c/:type/:id (outside the locale tree, no chrome). Pattern:
//       patterns/2026-06-17-standalone-public-page-outside-localeprovider.md
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { Card } from '@components/ui/Card';
import { GalleryGrid } from '@components/ui/GalleryGrid';
import { Image } from '@components/ui/Image';
import { AccessRequestModal } from '@features/access/AccessRequestModal';
import { type PublicFicheData, usePublicFiche } from '@features/landing/usePublicFiche';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { localeStr } from '@/utils/localeString';

/** The single bordered fiche "box" — hero on top, categorised body inside the
 *  same card so the whole fiche reads as one premium artefact (mirrors /share). */
function FicheView({
  fiche,
  onRequestAccess,
}: {
  fiche: PublicFicheData;
  onRequestAccess: () => void;
}) {
  const { t, i18n } = useTranslation();

  const title = localeStr(fiche.title);
  const summary = localeStr(fiche.summary);
  const description = localeStr(fiche.description);
  const heroSrc = fiche.heroImage?.src ?? fiche.images?.[0]?.src;
  const heroAlt =
    fiche.heroImage?.alt ?? fiche.images?.[0]?.alt ?? (title || t('share.fallbackTitle'));

  // Prominent date + place line (events only) — the data is in the projection.
  const isEvent = fiche._type === 'event';
  const heroDate = (() => {
    if (!isEvent) return '';
    const mode = fiche.dateMode ?? 'exact';
    if (mode === 'exact' && fiche.startsAt) {
      return new Date(fiche.startsAt).toLocaleDateString(i18n.language, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (mode === 'allYear') return t('share.value.allYear');
    return localeStr(fiche.dateLabel) || t('share.value.onRequest');
  })();
  const heroVenue = isEvent
    ? [localeStr(fiche.venue), localeStr(fiche.city)].filter(Boolean).join(' · ')
    : '';

  return (
    <Card padding="none" className="overflow-hidden">
      {/* ─── Top bar : SN logo + label ─── */}
      <div className="border-fg/10 flex items-center justify-between gap-4 border-b px-6 py-4 md:px-10">
        <Link to="/" aria-label="SAW NEXT" className="inline-flex">
          <BrandMark variant="short" className="text-fg text-base md:text-lg" />
        </Link>
        <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
          {t(`share.docType.${fiche._type}`)}
        </span>
      </div>

      {/* Hero — image when present, else a branded placeholder. */}
      {heroSrc ? (
        <div className="bg-surface relative overflow-hidden">
          <Image src={heroSrc} alt={heroAlt} ratio="16/9" eager />
        </div>
      ) : (
        <div className="bg-surface border-fg/10 flex aspect-video items-center justify-center overflow-hidden border-b">
          <BrandMark variant="short" className="text-fg/10 text-6xl md:text-7xl" />
        </div>
      )}

      <div className="flex flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        {/* ─── Title block ─── */}
        <header className="border-fg/10 flex flex-col gap-3 border-b pb-6">
          <h1 className="font-mono text-2xl leading-tight font-medium tracking-tight uppercase md:text-3xl">
            {title || t('share.fallbackTitle')}
          </h1>
          {(heroDate || heroVenue) && (
            <div className="flex flex-col gap-1 pt-1 font-sans normal-case">
              {heroDate && (
                <p className="text-fg text-xl leading-tight font-medium first-letter:uppercase">
                  {heroDate}
                </p>
              )}
              {heroVenue && <p className="text-muted text-base">{heroVenue}</p>}
            </div>
          )}
          {summary && (
            <p className="text-fg/85 max-w-2xl pt-2 font-sans text-base leading-relaxed text-pretty normal-case">
              {summary}
            </p>
          )}
        </header>

        {/* ─── Description ─── */}
        {description && (
          <section className="flex flex-col gap-3">
            <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
              {t('share.section.description')}
            </span>
            <p className="text-muted max-w-3xl font-sans leading-relaxed whitespace-pre-line normal-case">
              {description}
            </p>
          </section>
        )}

        {/* ─── Gallery (photos beyond the hero) ─── */}
        {fiche.images && fiche.images.length > 1 && (
          <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
            <span className="text-muted text-[10px] tracking-[0.3em] uppercase">
              {t('share.section.gallery')}
            </span>
            <GalleryGrid
              images={fiche.images.slice(1).map(i => ({ src: i.src, alt: localeStr(i.alt) }))}
            />
          </section>
        )}

        {/* ─── Interest CTA — enter the access tunnel straight from the fiche ─── */}
        <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
              {t('share.interest.title')}
            </span>
            <p className="text-muted max-w-xl font-sans text-sm leading-relaxed normal-case">
              {t('landing.access.modal.lede')}
            </p>
          </div>
          <button
            type="button"
            onClick={onRequestAccess}
            className="border-fg bg-fg text-bg hover:bg-fg/90 inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
          >
            {t('share.interest.cta')}
            <span aria-hidden="true">↗</span>
          </button>
        </section>
      </div>
    </Card>
  );
}

export default function PublicFiche() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { t, i18n } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const { fiche, loading } = usePublicFiche(type, id);

  const lang = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const ficheTitle = localeStr(fiche?.title);
  const heroSrc = fiche?.heroImage?.src ?? fiche?.images?.[0]?.src;
  const pageTitle = ficheTitle ? `${ficheTitle} — Sawnext` : `Sawnext — ${t('share.privateShare')}`;

  return (
    <main
      data-theme="light"
      data-landing-dark="false"
      className="bg-bg text-fg relative min-h-screen overflow-hidden px-5 py-16 md:px-12 md:py-24"
    >
      {/* Minimal OG metadata — React 19 hoists these into <head>. noindex: the
          public fiche is a teaser surface, not a page we want crawled. */}
      <title>{pageTitle}</title>
      {localeStr(fiche?.summary) && <meta name="description" content={localeStr(fiche?.summary)} />}
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content={pageTitle} />
      {heroSrc && <meta property="og:image" content={heroSrc} />}
      <meta property="og:type" content="website" />

      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {loading && (
          <div className="text-muted py-12 text-center font-mono text-xs tracking-widest uppercase">
            {t('common.loading')}
          </div>
        )}

        {!loading && !fiche && (
          <Card padding="lg" className="flex flex-col gap-6">
            <div className="border-fg/10 flex items-center justify-between gap-4 border-b pb-5">
              <Link to="/" aria-label="SAW NEXT" className="inline-flex">
                <BrandMark variant="short" className="text-fg text-base md:text-lg" />
              </Link>
            </div>
            <h1 className="font-mono text-2xl leading-tight font-medium tracking-tight uppercase md:text-3xl">
              {t('share.status.notFoundTitle')}
            </h1>
            <p className="text-muted leading-relaxed">{t('share.status.notFound')}</p>
            <Link
              to="/"
              className="border-fg/40 text-fg hover:border-fg inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
            >
              {t('qr.brandHomeLabel')}
              <span aria-hidden="true">↗</span>
            </Link>
          </Card>
        )}

        {!loading && fiche && (
          <FicheView
            fiche={fiche}
            onRequestAccess={() => {
              setModalOpen(true);
            }}
          />
        )}
      </div>

      <AccessRequestModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        initialMode="request"
      />
    </main>
  );
}
