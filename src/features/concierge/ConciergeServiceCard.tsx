// ═══════════════════════════════════════════════════
// ConciergeServiceCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface with 4:3 image, category eyebrow, title,
//       summary as expanded meta, lead-time hint in footer.
// WHEN: ConciergeList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. 4:3 unified
//       with Event/Journey (was 3:2 stand-alone before unification).
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';

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
}: ConciergeServiceCardProps) => (
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
      <Card.Footer>
        <Card.Meta>
          {leadTimeLabel}: {service.leadTime}
        </Card.Meta>
      </Card.Footer>
    </Card.Body>
  </Card>
);
