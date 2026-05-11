// ═══════════════════════════════════════════════════
// EventCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image, Card.Badge top-left (day · month
//       date stamp — the temporal signature), HeartButton top-right.
//       Body: category · city eyebrow, title, 2-col Card.Stats (venue · time).
//       NO PriceBlock — date is already signature in badge; time is
//       supporting info in stats; "key info" pill would just duplicate.
// WHEN: EventsList grid item, catalogue mixed view.
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { useTranslation } from 'react-i18next';

import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  href: string;
  categoryLabel: string;
  locale: string;
  className?: string;
  /** Mark as priority — adds pulsing outline ring. */
  important?: boolean;
  /** ISO end-date for limited-offer countdown. Replaces date badge when set. */
  countdownEndsAt?: string;
}

export const EventCard = ({
  event,
  href,
  categoryLabel,
  locale,
  className,
  important,
  countdownEndsAt,
}: EventCardProps) => {
  const { t } = useTranslation();
  const date = new Date(event.startsAt);
  const day = date.toLocaleDateString(locale, { day: '2-digit' });
  const month = date.toLocaleDateString(locale, { month: 'short' });
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  return (
    <Card href={href} padding="none" important={important} className={className}>
      <Card.Media
        src={event.images[0]?.src}
        alt={event.images[0]?.alt ?? event.title}
        ratio="4/3"
      />
      {countdownEndsAt ? (
        <Card.Countdown
          endsAt={countdownEndsAt}
          label={t('common.limitedOffer')}
          className="top-3 left-3"
        />
      ) : (
        <Card.Badge top={day} bottom={month} />
      )}
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
          <Card.Stat label={t('events.meta.time')} value={time} />
        </Card.Stats>
      </Card.Body>
    </Card>
  );
};
