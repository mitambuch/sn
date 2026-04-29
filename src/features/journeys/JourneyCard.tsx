// ═══════════════════════════════════════════════════
// JourneyCard — listing card for Journeys module
// 16:9 image, kind eyebrow, title, destinations summary, duration.
// ═══════════════════════════════════════════════════

import { HeartButton } from '@components/ui/HeartButton';
import { Image } from '@components/ui/Image';
import { cn } from '@utils/cn';

import type { Journey } from '@/types/journey';

interface JourneyCardProps {
  journey: Journey;
  href: string;
  kindLabel: string;
  daysLabel: string;
  className?: string;
}

export const JourneyCard = ({
  journey,
  href,
  kindLabel,
  daysLabel,
  className,
}: JourneyCardProps) => {
  return (
    <a
      href={href}
      className={cn(
        'group focus-visible:ring-accent block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <div className="relative">
        <Image
          src={journey.images[0]?.src ?? ''}
          alt={journey.images[0]?.alt ?? journey.title}
          ratio="16/9"
          className="duration-slow transition-transform group-hover:scale-[1.02]"
        />
        <HeartButton
          module="journey"
          slug={journey.slug}
          size="sm"
          className="absolute top-3 right-3"
        />
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <span className="text-muted text-xs tracking-widest uppercase">
          {kindLabel} · {String(journey.durationDays)} {daysLabel}
        </span>
        <h3 className="text-fg text-base font-medium">{journey.title}</h3>
        <span className="text-muted text-sm">{journey.destinations}</span>
      </div>
    </a>
  );
};
