// ═══════════════════════════════════════════════════
// TimepieceCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 contained image (watch macro centered
//       on neutral bg), HeartButton top-right. Body: brand · year eyebrow,
//       model title, 2-col Card.Stats (reference mono · material —
//       the identifying couple for HNW collectors: Submariner Steel
//       116610 vs Gold 126618 reads instantly). Card.PriceBlock with
//       "Prix" + Card.Pill "Sur demande".
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
  className?: string;
  /** Mark as priority — adds pulsing outline ring. */
  important?: boolean;
  /** ISO end-date for limited-offer countdown. */
  countdownEndsAt?: string;
}

export const TimepieceCard = ({
  timepiece,
  href,
  onRequestLabel,
  className,
  important,
  countdownEndsAt,
}: TimepieceCardProps) => {
  const { t, i18n } = useTranslation();
  // Material may come from the mock (an enum key like "steel" → i18n label)
  // or from Sanity (free text like "Or jaune 18k"). Use the i18n label when
  // the key exists, otherwise render the raw value as-is.
  const materialKey = `timepieces.material.${timepiece.material}`;
  const materialLabel = i18n.exists(materialKey) ? t(materialKey) : timepiece.material;
  return (
    <Card href={href} padding="none" important={important} className={className}>
      <Card.Media
        src={timepiece.images[0]?.src}
        alt={timepiece.images[0]?.alt ?? `${timepiece.brand} ${timepiece.model}`}
        ratio="4/3"
        fit="contain"
      />
      {countdownEndsAt && (
        <Card.Countdown
          endsAt={countdownEndsAt}
          label={t('common.limitedOffer')}
          className="top-3 left-3"
        />
      )}
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
          <Card.Stat label={t('timepieces.meta.material')} value={materialLabel} />
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
