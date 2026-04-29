// ═══════════════════════════════════════════════════
// EventDetail — /:locale/account/events/:slug
//
// DetailHero cinematic, large date + venue, programme Timeline,
// dress code / capacity / allocated seats specsheet.
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
import { InquiryDrawer } from '@features/inquiry/InquiryDrawer';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';

import { getEvent } from '@/mocks';

export default function EventDetail() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const event = slug ? getEvent(slug) : undefined;
  if (!event) return <Navigate to={localePath(ROUTES.ACCOUNT_EVENTS)} replace />;

  const startsAt = new Date(event.startsAt);
  const dateLabel = startsAt.toLocaleDateString(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeLabel = startsAt.toLocaleTimeString(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const meta = [
    { label: t('events.meta.date'), value: dateLabel },
    { label: t('events.meta.time'), value: timeLabel },
    { label: t('events.meta.venue'), value: event.venue },
    { label: t('events.meta.city'), value: `${event.city} · ${event.countryCode}` },
    { label: t('events.meta.capacity'), value: String(event.capacity) },
    { label: t('events.meta.allocatedSeats'), value: String(event.allocatedSeats) },
    { label: t('events.meta.dressCode'), value: t(`events.dressCode.${event.dressCode}`) },
    { label: t('events.meta.category'), value: t(`events.category.${event.category}`) },
  ];

  return (
    <>
      <DetailHero
        imageSrc={event.images[0]?.src ?? ''}
        imageAlt={event.images[0]?.alt ?? event.title}
        eyebrow={t(`events.category.${event.category}`)}
        title={event.title}
        caption={`${dateLabel} · ${event.city}`}
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
        source="event"
        itemTitle={event.title}
      />

      <Container size="xl">
        <div className="grid gap-12 py-16 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <p className="text-fg text-lg leading-relaxed text-pretty">{event.summary}</p>
            <p className="text-muted leading-relaxed">{event.description}</p>

            {event.programme.length > 0 && (
              <div className="space-y-4">
                <SectionHeader title={t('events.programme')} size="sm" as="h2" />
                <Timeline items={event.programme.map(p => ({ title: p.label, date: p.time }))} />
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('common.details')}
            </span>
            <MetaList items={meta} />
          </aside>
        </div>

        {event.images.length > 1 && (
          <div className="space-y-6 pb-16">
            <SectionHeader title={t('events.gallery')} size="sm" as="h2" />
            <GalleryGrid images={event.images.slice(1)} />
          </div>
        )}

        <SimilarItemsStrip module="event" currentSlug={event.slug} />

        <Link
          to={localePath(ROUTES.ACCOUNT_EVENTS)}
          className="text-muted hover:text-fg duration-base mb-12 inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors"
        >
          ← {t('common.back')}
        </Link>
      </Container>
    </>
  );
}
