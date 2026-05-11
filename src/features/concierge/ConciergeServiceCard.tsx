// ═══════════════════════════════════════════════════
// ConciergeServiceCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image, HeartButton top-right. Body:
//       category eyebrow, title, summary paragraph (the service narrative).
//       Card.PriceBlock with "Disponibilité" label + Card.Pill (Hourglass
//       icon + leadTime).
// WHEN: ConciergeList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. No Card.Stats
//       — concierge is a service, the summary paragraph is the body
//       density (different from product cards by intent).
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { Hourglass } from 'lucide-react';

import type { ConciergeService } from '@/types/concierge';

interface ConciergeServiceCardProps {
  service: ConciergeService;
  href: string;
  categoryLabel: string;
  leadTimeLabel: string;
  className?: string;
}

export const ConciergeServiceCard = ({
  service,
  href,
  categoryLabel,
  leadTimeLabel,
  className,
}: ConciergeServiceCardProps) => {
  return (
    <Card href={href} padding="none" className={className}>
      <Card.Media
        src={service.images[0]?.src}
        alt={service.images[0]?.alt ?? service.title}
        ratio="4/3"
      />
      <Card.Overlay>
        <HeartButton
          module="concierge"
          slug={service.slug}
          size="sm"
          className="absolute top-3 right-3"
        />
      </Card.Overlay>
      <Card.Body>
        <Card.Eyebrow>{categoryLabel}</Card.Eyebrow>
        <Card.Title>{service.title}</Card.Title>
        <p className="text-muted text-sm leading-relaxed">{service.summary}</p>
      </Card.Body>
      <Card.PriceBlock>
        <span className="text-muted text-[10px] tracking-widest uppercase">{leadTimeLabel}</span>
        <Card.Pill>
          <Hourglass size={11} strokeWidth={1.5} aria-hidden="true" />
          {service.leadTime}
        </Card.Pill>
      </Card.PriceBlock>
    </Card>
  );
};
