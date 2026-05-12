// ═══════════════════════════════════════════════════
// JourneyCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image, Card.Badge top-left (duration ·
//       days — temporal signature), HeartButton top-right. Body: kind
//       eyebrow, title, Card.Stats with destinations spanning 2 cols.
//       NO PriceBlock — kind is already in eyebrow, adding it as a pill
//       below would duplicate. Duration in badge + destinations in body
//       cover the at-a-glance need.
// WHEN: JourneysList grid item, catalogue mixed view.
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
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
        <Card.Stats>
          <Card.Stat
            label={t('common.itinerary')}
            value={journey.destinations}
            className="col-span-2"
          />
        </Card.Stats>
      </Card.Body>
    </Card>
  );
};
