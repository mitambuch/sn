// ═══════════════════════════════════════════════════
// JourneyDetail — /:locale/account/journeys/:slug
//
// DetailHero, itinerary Timeline (legs with dates + locations),
// inclusions vs exclusions 2-col, MetaList summary.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { DetailHero } from '@components/ui/DetailHero';
import { GalleryGrid } from '@components/ui/GalleryGrid';
import { MetaList } from '@components/ui/MetaList';
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

import { getJourney } from '@/mocks';

export default function JourneyDetail() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const journey = slug ? getJourney(slug) : undefined;
  if (!journey) return <Navigate to={localePath(ROUTES.ACCOUNT_JOURNEYS)} replace />;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const meta = [
    { label: t('journeys.meta.kind'), value: t(`journeys.kind.${journey.kind}`) },
    {
      label: t('journeys.meta.duration'),
      value: `${String(journey.durationDays)} ${t('journeys.days')}`,
    },
    { label: t('journeys.meta.origin'), value: journey.origin },
    { label: t('journeys.meta.destinations'), value: journey.destinations },
    {
      label: t('journeys.meta.guestCapacity'),
      value: String(journey.guestCapacity),
    },
    ...(journey.earliestStart
      ? [{ label: t('journeys.meta.earliestStart'), value: formatDate(journey.earliestStart) }]
      : []),
  ];

  return (
    <>
      <DetailHero
        imageSrc={journey.images[0]?.src ?? ''}
        imageAlt={journey.images[0]?.alt ?? journey.title}
        eyebrow={t(`journeys.kind.${journey.kind}`)}
        title={journey.title}
        caption={journey.destinations}
        height="full"
        actions={
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
        }
      />

      <InquiryDrawer
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        source="journey"
        itemTitle={journey.title}
        targetId={journey.id}
      />

      <Container size="xl">
        <div className="grid gap-12 py-16 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <p className="text-fg text-lg leading-relaxed text-pretty">{journey.summary}</p>
            <p className="text-muted leading-relaxed">{journey.description}</p>
          </div>
          <aside className="space-y-6">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('common.details')}
            </span>
            <MetaList items={meta} />
            <AudioNote transcript={t('audio.samples.journey')} durationSeconds={52} />
          </aside>
        </div>

        {journey.legs.length > 0 && (
          <div className="space-y-6 pb-16">
            <SectionHeader title={t('journeys.itinerary')} size="sm" as="h2" />
            <Timeline
              items={journey.legs.map(l => ({
                title: l.location,
                description: l.highlight,
                date: formatDate(l.date),
              }))}
            />
          </div>
        )}

        <div className="grid gap-12 pb-16 md:grid-cols-2">
          <div className="space-y-4">
            <SectionHeader title={t('journeys.inclusions')} size="sm" as="h3" />
            <ul className="space-y-2">
              {journey.inclusions.map(i => (
                <li key={i} className="text-fg flex items-start gap-3 text-sm leading-relaxed">
                  <span className="bg-fg mt-2 inline-block h-1 w-2 shrink-0" aria-hidden="true" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <SectionHeader title={t('journeys.exclusions')} size="sm" as="h3" />
            <ul className="space-y-2">
              {journey.exclusions.map(e => (
                <li key={e} className="text-muted flex items-start gap-3 text-sm leading-relaxed">
                  <span
                    className="bg-muted mt-2 inline-block h-1 w-2 shrink-0"
                    aria-hidden="true"
                  />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {journey.images.length > 1 && (
          <div className="space-y-6 pb-16">
            <SectionHeader title={t('journeys.gallery')} size="sm" as="h2" />
            <GalleryGrid images={journey.images.slice(1)} />
          </div>
        )}

        <SimilarItemsStrip module="journey" currentSlug={journey.slug} />

        <Link
          to={localePath(ROUTES.ACCOUNT_JOURNEYS)}
          className="text-muted hover:text-fg duration-base mb-12 inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors"
        >
          ← {t('common.back')}
        </Link>
      </Container>
    </>
  );
}
