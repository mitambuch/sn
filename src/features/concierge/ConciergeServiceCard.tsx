// ═══════════════════════════════════════════════════
// ConciergeServiceCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image (capability metaphor), HeartButton
//       top-right. Body density="spacious": category eyebrow, title,
//       summary paragraph. NO PriceBlock — concierge is a service, not a
//       catalogued product. The summary IS the signature; absence of
//       footer block is the differentiator vs product/temporal cards.
// WHEN: ConciergeList grid item, catalogue mixed view.
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';

import type { ConciergeService } from '@/types/concierge';

interface ConciergeServiceCardProps {
  service: ConciergeService;
  href: string;
  categoryLabel: string;
  className?: string;
}

export const ConciergeServiceCard = ({
  service,
  href,
  categoryLabel,
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
    <Card.Body density="spacious">
      <Card.Eyebrow>{categoryLabel}</Card.Eyebrow>
      <Card.Title>{service.title}</Card.Title>
      <p className="text-muted text-sm leading-relaxed">{service.summary}</p>
    </Card.Body>
  </Card>
);
