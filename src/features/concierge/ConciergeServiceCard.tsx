// ═══════════════════════════════════════════════════
// ConciergeServiceCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image, frosted-glass badge top-left
//       (lead-time, single line — e.g. "48H"), HeartButton top-right,
//       category eyebrow, title, summary in body, lead-time label as meta.
// WHEN: ConciergeList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. Badge uses
//       single-line mode (no bottom) because lead-time is a compact label.
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
    <Card.Badge top={service.leadTime} />
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
        <Card.Meta>{leadTimeLabel}</Card.Meta>
      </Card.Footer>
    </Card.Body>
  </Card>
);
