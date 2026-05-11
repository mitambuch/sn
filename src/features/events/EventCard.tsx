// ═══════════════════════════════════════════════════
// EventCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface with 4:3 image, floating date badge (day + month)
//       overlaid top-left in frosted glass, category · city eyebrow, title,
//       venue · time meta.
// WHEN: EventsList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. Date badge uses
//       backdrop-blur over media — design signature for Events module.
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
      <Card.Overlay>
        {/* Floating date badge — frosted glass over image */}
        <div className="bg-bg/55 border-border/40 absolute top-3 left-3 flex flex-col items-center rounded-[10px] border px-3 py-2 backdrop-blur-md">
          <span className="text-fg text-lg leading-none font-light">{day}</span>
          <span className="text-fg/80 mt-1 text-[10px] tracking-widest uppercase">{month}</span>
        </div>
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
        <Card.Meta>
          {event.venue} · {time}
        </Card.Meta>
      </Card.Body>
    </Card>
  );
};
