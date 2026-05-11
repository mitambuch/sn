// ═══════════════════════════════════════════════════
// TimepieceCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image contained on neutral bg (watch
//       macro centered, image speaks for itself — no top-left overlay),
//       HeartButton top-right. Body: brand · year eyebrow, model title,
//       reference (mono) meta, optional full-set hint, PriceTag footer.
// WHEN: TimepiecesList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. No badge —
//       Timepiece is a product (macro shot owns the frame).
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { PriceTag } from '@components/ui/PriceTag';

import type { Timepiece } from '@/types/timepiece';

interface TimepieceCardProps {
  timepiece: Timepiece;
  href: string;
  onRequestLabel: string;
  fullSetLabel: string;
  className?: string;
}

export const TimepieceCard = ({
  timepiece,
  href,
  onRequestLabel,
  fullSetLabel,
  className,
}: TimepieceCardProps) => (
  <Card href={href} padding="none" className={className}>
    <Card.Media
      src={timepiece.images[0]?.src}
      alt={timepiece.images[0]?.alt ?? `${timepiece.brand} ${timepiece.model}`}
      ratio="4/3"
      fit="contain"
    />
    <Card.Overlay>
      <HeartButton
        module="timepiece"
        slug={timepiece.slug}
        size="sm"
        className="absolute top-3 right-3"
      />
    </Card.Overlay>
    <Card.Body>
      <Card.Eyebrow>
        {timepiece.brand} · {timepiece.year}
      </Card.Eyebrow>
      <Card.Title>{timepiece.model}</Card.Title>
      <Card.Meta mono>{timepiece.reference}</Card.Meta>
      {timepiece.fullSet && <Card.Meta className="mt-1">✓ {fullSetLabel}</Card.Meta>}
      <Card.Footer>
        <PriceTag onRequestLabel={onRequestLabel} />
      </Card.Footer>
    </Card.Body>
  </Card>
);
