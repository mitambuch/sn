// ═══════════════════════════════════════════════════
// EventCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image, frosted-glass date badge top-left
//       (day · month) via Card.Badge — the canonical pattern reused by
//       sibling domain cards. HeartButton top-right, category eyebrow,
//       title, venue · city · time meta.
// WHEN: EventsList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. This card is
//       the visual reference — keep its Card.Badge usage idiomatic.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';

import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  href: string;
  categoryLabel: string;
  locale: string;
  className?: string;
}

export const EventCard = ({ event, href, categoryLabel, locale, className }: EventCardProps) => {
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
        <Card.Eyebrow>{categoryLabel}</Card.Eyebrow>
        <Card.Title>{event.title}</Card.Title>
        <Card.Meta>
          {event.venue} · {event.city} · {time}
        </Card.Meta>
      </Card.Body>
    </Card>
  );
};
