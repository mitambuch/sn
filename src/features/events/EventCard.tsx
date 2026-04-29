// ═══════════════════════════════════════════════════
// EventCard — listing card for Events module
//
// WHAT: 16:9 visual + LARGE date prominent (eyebrow → day · month) +
//       title + city · venue + small category badge.
// ═══════════════════════════════════════════════════

import { Image } from '@components/ui/Image';
import { cn } from '@utils/cn';

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
    <a
      href={href}
      className={cn(
        'group focus-visible:ring-accent block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <Image
        src={event.images[0]?.src ?? ''}
        alt={event.images[0]?.alt ?? event.title}
        ratio="16/9"
        className="duration-slow transition-transform group-hover:scale-[1.02]"
      />
      <div className="mt-4 flex items-start gap-4">
        <div className="border-border flex shrink-0 flex-col items-center justify-center rounded-md border px-3 py-2 text-center">
          <span className="text-fg text-xl leading-none font-light">{day}</span>
          <span className="text-muted mt-1 text-xs tracking-widest uppercase">{month}</span>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-muted text-xs tracking-widest uppercase">
            {categoryLabel} · {event.city}
          </span>
          <h3 className="text-fg text-base font-medium">{event.title}</h3>
          <span className="text-muted text-xs">
            {event.venue} · {time}
          </span>
        </div>
      </div>
    </a>
  );
};
