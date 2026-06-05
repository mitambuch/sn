// ═══════════════════════════════════════════════════
// JourneyDetail — /:locale/account/journeys/:slug
//
// WHAT: Renders the Sanity journey model (what the operator edits in the
//       Studio): summary + description, a meta cluster (duration ·
//       destinations · party size), a DAY-based itinerary ("Jour 1, Jour
//       2…" — no hours), then transport + accommodation lists, then gallery.
// DATA: useSanityItem returns the Sanity shape (JourneyDetailData) directly;
//       a mock Journey is bridged into the same shape via toJourneyDetail()
//       so the dev/demo fallback matches. Sanity content takes precedence.
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
import { useSanityItem } from '@hooks/useSanityItem';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';

import { GROQ_JOURNEY_DETAIL } from '@/lib/sanityQueries';
import { getJourney } from '@/mocks';
import type { Journey, JourneyDetailData } from '@/types/journey';

/** Bridge a mock Journey (legs / guestCapacity / "·"-joined string) into the
 *  Studio model the page renders, so the dev/demo fallback matches Sanity. */
function toJourneyDetail(j: Journey): JourneyDetailData {
  const destinations = Array.isArray(j.destinations)
    ? j.destinations
    : j.destinations
        .split('·')
        .map(s => s.trim())
        .filter(Boolean);
  return {
    id: j.id,
    slug: j.slug,
    title: j.title,
    summary: j.summary,
    description: j.description,
    images: j.images,
    destinations,
    durationDays: j.durationDays,
    ...(j.guestCapacity ? { partySize: String(j.guestCapacity) } : {}),
    ...(j.legs && j.legs.length > 0
      ? { itinerary: j.legs.map(l => ({ label: l.location, description: l.highlight })) }
      : {}),
  };
}

const listItem = 'text-fg flex items-start gap-3 text-sm leading-relaxed';
const bullet = <span className="bg-fg mt-2 inline-block h-1 w-2 shrink-0" aria-hidden="true" />;

export default function JourneyDetail() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const mockJourney = slug ? getJourney(slug) : null;
  const { data: journey } = useSanityItem<JourneyDetailData>({
    query: slug ? GROQ_JOURNEY_DETAIL(slug) : '',
    gateModule: 'journey',
    gateSlug: slug,
    fallback: mockJourney ? toJourneyDetail(mockJourney) : null,
  });
  if (!journey) return <Navigate to={localePath(ROUTES.ACCOUNT_JOURNEYS)} replace />;

  const destinationsLine = (journey.destinations ?? []).join(' · ');
  const durationLabel = journey.durationDays
    ? `${String(journey.durationDays)} ${t('journeys.days')}`
    : '';
  const transport = journey.transport ?? [];
  const accommodation = journey.accommodation ?? [];
  const itinerary = journey.itinerary ?? [];

  const meta = [
    ...(durationLabel ? [{ label: t('journeys.meta.duration'), value: durationLabel }] : []),
    ...(destinationsLine
      ? [{ label: t('journeys.meta.destinations'), value: destinationsLine }]
      : []),
    ...(journey.partySize
      ? [{ label: t('journeys.meta.partySize'), value: journey.partySize }]
      : []),
  ];

  return (
    <>
      <DetailHero
        imageSrc={journey.images[0]?.src ?? ''}
        imageAlt={journey.images[0]?.alt ?? journey.title}
        eyebrow={durationLabel || t('journeys.itinerary')}
        title={journey.title}
        caption={destinationsLine}
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

        {itinerary.length > 0 && (
          <div className="space-y-6 pb-16">
            <SectionHeader title={t('journeys.itinerary')} size="sm" as="h2" />
            <Timeline
              items={itinerary.map((d, i) => ({
                title: `${t('journeys.day')} ${String(i + 1)} · ${d.label}`,
                ...(d.description ? { description: d.description } : {}),
              }))}
            />
          </div>
        )}

        {(transport.length > 0 || accommodation.length > 0) && (
          <div className="grid gap-12 pb-16 md:grid-cols-2">
            {transport.length > 0 && (
              <div className="space-y-4">
                <SectionHeader title={t('journeys.transport')} size="sm" as="h3" />
                <ul className="space-y-2">
                  {transport.map(item => (
                    <li key={item} className={listItem}>
                      {bullet}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {accommodation.length > 0 && (
              <div className="space-y-4">
                <SectionHeader title={t('journeys.accommodation')} size="sm" as="h3" />
                <ul className="space-y-2">
                  {accommodation.map(item => (
                    <li key={item} className={listItem}>
                      {bullet}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
