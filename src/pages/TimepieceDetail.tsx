// ═══════════════════════════════════════════════════
// TimepieceDetail — /:locale/account/timepieces/:slug
//
// Hero image is contained (not cropped) in 4:3 — collectors want to
// SEE the dial. MetaList specsheet is the centerpiece. Provenance
// timeline below for trust.
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
import { AudioNote } from '@features/concierge/AudioNote';
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
      <div className="space-y-16 py-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Hero contained image (collector-grade detail) */}
          <Image
            src={tp.images[0]?.src ?? ''}
            alt={tp.images[0]?.alt ?? `${tp.brand} ${tp.model}`}
            ratio="1/1"
            eager
            wrapperClassName="bg-surface rounded-lg"
            className="object-contain"
          />

          <div className="space-y-8">
            <SectionHeader
              eyebrow={`${tp.brand} · ${String(tp.year)}`}
              title={tp.model}
              lede={tp.summary}
              size="md"
              as="h1"
            />

            <div className="space-y-2">
              <span className="text-muted text-xs tracking-widest uppercase">
                {t('timepieces.meta.reference')}
              </span>
              <p className="text-fg font-mono text-base tracking-wider">{tp.reference}</p>
            </div>

            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {t('common.expressInterest')}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionHeader title={t('common.details')} size="sm" as="h2" />
            <p className="text-muted leading-relaxed">{tp.description}</p>
          </div>
          <aside className="space-y-6">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('common.details')}
            </span>
            <MetaList items={meta} />
            <div className="border-border border-t pt-6">
              <PriceTag onRequestLabel={t('common.onRequest')} size="md" />
            </div>
            <AudioNote transcript={t('audio.samples.timepiece')} durationSeconds={48} />
          </aside>
        </div>

        {tp.provenance.length > 0 && (
          <div className="space-y-6">
            <SectionHeader title={t('timepieces.provenance')} size="sm" as="h2" />
            <Timeline items={tp.provenance.map(p => ({ title: p }))} />
          </div>
        )}

        {tp.images.length > 1 && (
          <div className="space-y-6">
            <SectionHeader title={t('timepieces.gallery')} size="sm" as="h2" />
            <GalleryGrid images={tp.images.slice(1)} />
          </div>
        )}

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
