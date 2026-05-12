// ═══════════════════════════════════════════════════
// TimepieceDetail — /:locale/account/timepieces/:slug
//
// WHAT: Detail page for a horological piece. Restructured mobile-first :
//       hero image at top, then a single info cluster (eyebrow + title +
//       summary + primary CTA), then description + specs side-by-side
//       on desktop / stacked on mobile, then optional provenance +
//       gallery, then a compact "similar items" strip.
// WHEN: Linked from TimepiecesList, catalogue, saved collection.
// PATTERN: drop duplicate REFERENCE mini-block (was duplicating the
//          specs table below). Drop AudioNote until owner re-asks.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { GalleryGrid } from '@components/ui/GalleryGrid';
import { Image } from '@components/ui/Image';
import { MetaList } from '@components/ui/MetaList';
import { PriceTag } from '@components/ui/PriceTag';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Timeline } from '@components/ui/Timeline';
import { ROUTES } from '@constants/routes';
import { SimilarItemsStrip } from '@features/catalogue/SimilarItemsStrip';
import { InquiryDrawer } from '@features/inquiry/InquiryDrawer';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';

import { getTimepiece } from '@/mocks';

export default function TimepieceDetail() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const tp = slug ? getTimepiece(slug) : undefined;
  if (!tp) return <Navigate to={localePath(ROUTES.ACCOUNT_TIMEPIECES)} replace />;

  const meta = [
    { label: t('timepieces.meta.brand'), value: tp.brand },
    { label: t('timepieces.meta.model'), value: tp.model },
    { label: t('timepieces.meta.reference'), value: tp.reference },
    { label: t('timepieces.meta.year'), value: String(tp.year) },
    ...(tp.caliber ? [{ label: t('timepieces.meta.caliber'), value: tp.caliber }] : []),
    ...(tp.caseDiameterMm
      ? [{ label: t('timepieces.meta.diameter'), value: `${String(tp.caseDiameterMm)} mm` }]
      : []),
    { label: t('timepieces.meta.material'), value: t(`timepieces.material.${tp.material}`) },
    { label: t('timepieces.meta.condition'), value: t(`timepieces.condition.${tp.condition}`) },
    {
      label: t('timepieces.meta.fullSet'),
      value: tp.fullSet ? t('common.yes') : t('common.no'),
    },
  ];

  return (
    <Container size="xl">
      <div className="space-y-12 py-10 md:space-y-16 md:py-12">
        {/* ─── Hero : image left, dense info cluster right ────────
            Right column packs all the buying info (specs preview + price
            + CTA) so the desktop space doesn't feel empty next to the
            1:1 image. Description moves below as a self-contained block. */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <Image
            src={tp.images[0]?.src ?? ''}
            alt={tp.images[0]?.alt ?? `${tp.brand} ${tp.model}`}
            ratio="1/1"
            eager
            wrapperClassName="bg-surface rounded-card"
            className="object-contain"
          />

          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow={`${tp.brand} · ${String(tp.year)}`}
              title={tp.model}
              lede={tp.summary}
              size="md"
              as="h1"
            />

            {/* Specs preview — fills the desktop space, scannable in 1s */}
            <MetaList items={meta} />

            {/* Price — structural slot. priceCHF optional in data (Sanity
                future), falls back to "Sur demande" silent HNW convention. */}
            <div className="border-border flex items-baseline justify-between border-t pt-4">
              <span className="text-muted text-xs tracking-widest uppercase">
                {t('common.price')}
              </span>
              <PriceTag
                {...(tp.priceCHF !== undefined && { amount: tp.priceCHF, currency: 'CHF' })}
                onRequestLabel={t('common.onRequest')}
                size="md"
              />
            </div>

            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-sm tracking-widest uppercase sm:w-auto sm:self-start',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {t('common.expressInterest')}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* ─── Description — full-width block ──────────────────── */}
        <div className="space-y-4">
          <SectionHeader title={t('common.details')} size="sm" as="h2" />
          <p className="text-muted max-w-3xl leading-relaxed">{tp.description}</p>
        </div>

        {/* ─── Provenance ──────────────────────────────── */}
        {tp.provenance.length > 0 && (
          <div className="space-y-6">
            <SectionHeader title={t('timepieces.provenance')} size="sm" as="h2" />
            <Timeline items={tp.provenance.map(p => ({ title: p }))} />
          </div>
        )}

        {/* ─── Gallery ─────────────────────────────────── */}
        {tp.images.length > 1 && (
          <div className="space-y-6">
            <SectionHeader title={t('timepieces.gallery')} size="sm" as="h2" />
            <GalleryGrid images={tp.images.slice(1)} />
          </div>
        )}

        {/* ─── Similar — compact strip ──────────────────── */}
        <SimilarItemsStrip module="timepiece" currentSlug={tp.slug} />

        <Link
          to={localePath(ROUTES.ACCOUNT_TIMEPIECES)}
          className="text-muted hover:text-fg duration-base inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors"
        >
          ← {t('common.back')}
        </Link>
      </div>

      <InquiryDrawer
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        source="timepiece"
        itemTitle={`${tp.brand} ${tp.model}`}
        targetId={tp.id}
      />
    </Container>
  );
}
