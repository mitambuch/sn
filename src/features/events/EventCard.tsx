// ═══════════════════════════════════════════════════
// EventCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image, Card.Badge top-left (day · month
//       date stamp), HeartButton top-right. Body: category · city eyebrow,
//       title, 2-col Card.Stats (venue, time). Card.PriceBlock with
//       "Heure" label + Card.Pill (Clock icon + time string).
// WHEN: EventsList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. Card.Badge
//       date is the canonical pattern reused by sibling temporal cards.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  href: string;
  categoryLabel: string;
  locale: string;
  className?: string;
}

export const EventCard = ({ event, href, categoryLabel, locale, className }: EventCardProps) => {
  const { t } = useTranslation();
  const date = new Date(event.startsAt);
  const day = date.toLocaleDateString(locale, { day: '2-digit' });
  const month = date.toLocaleDateString(locale, { month: 'short' });
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  return (
    <Card href={href} padding="none" className={className}>
      <Card.Media
        src={event.images[0]?.src}
        alt={event.images[0]?.alt ?? event.title}
        ratio="4/3"
      />
      <Card.Badge top={day} bottom={month} />
      <Card.Overlay>
        <HeartButton
          module="event"
          slug={event.slug}
          size="sm"
          className="absolute top-3 right-3"
        />
      </Card.Overlay>
      <Card.Body>
        <Card.Eyebrow>
          {categoryLabel} · {event.city}
        </Card.Eyebrow>
        <Card.Title>{event.title}</Card.Title>
        <Card.Stats>
          <Card.Stat label={t('events.meta.venue')} value={event.venue} />
          <Card.Stat label={t('common.time')} value={time} />
        </Card.Stats>
      </Card.Body>
      <Card.PriceBlock>
        <span className="text-muted text-[10px] tracking-widest uppercase">{t('common.time')}</span>
        <Card.Pill>
          <Clock size={11} strokeWidth={1.5} aria-hidden="true" />
          {time}
        </Card.Pill>
      </Card.PriceBlock>
    </Card>
  );
};
