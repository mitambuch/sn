// ═══════════════════════════════════════════════════
// TimepieceCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 contained image (watch macro centered
//       on neutral bg), HeartButton top-right. Body: brand · year eyebrow,
//       model title, 2-col Card.Stats (reference mono, full-set indicator).
//       Card.PriceBlock with "Prix" + Card.Pill "Sur demande".
// WHEN: TimepiecesList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { useTranslation } from 'react-i18next';

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
}: TimepieceCardProps) => {
  const { t } = useTranslation();
  return (
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
        <Card.Stats>
          <Card.Stat label={t('timepieces.meta.reference')} value={timepiece.reference} mono />
          <Card.Stat label={fullSetLabel} value={timepiece.fullSet ? '✓' : '—'} />
        </Card.Stats>
      </Card.Body>
      <Card.PriceBlock>
        <span className="text-muted text-[10px] tracking-widest uppercase">
          {t('common.price')}
        </span>
        <Card.Pill>{onRequestLabel}</Card.Pill>
      </Card.PriceBlock>
    </Card>
  );
};
