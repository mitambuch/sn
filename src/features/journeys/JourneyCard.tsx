// ═══════════════════════════════════════════════════
// JourneyCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image, frosted-glass badge top-left
//       (duration · "jours"), HeartButton top-right, kind eyebrow,
//       title, destinations summary as meta.
// WHEN: JourneysList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';

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
}: JourneyCardProps) => (
  <Card href={href} padding="none" className={className}>
    <Card.Media
      src={journey.images[0]?.src}
      alt={journey.images[0]?.alt ?? journey.title}
      ratio="4/3"
    />
    <Card.Badge top={journey.durationDays} bottom={daysLabel} />
    <Card.Overlay>
      <HeartButton
        module="journey"
        slug={journey.slug}
        size="sm"
        className="absolute top-3 right-3"
      />
    </Card.Overlay>
    <Card.Body>
      <Card.Eyebrow>{kindLabel}</Card.Eyebrow>
      <Card.Title>{journey.title}</Card.Title>
      <Card.Meta>{journey.destinations}</Card.Meta>
    </Card.Body>
  </Card>
);
