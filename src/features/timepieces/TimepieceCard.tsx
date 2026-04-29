// ═══════════════════════════════════════════════════
// TimepieceCard — listing card for Timepieces module
//
// WHAT: Macro 1:1 image, brand · year eyebrow, model + reference,
//       full-set indicator, on-request price footer.
// WHEN: TimepiecesList grid item.
// ═══════════════════════════════════════════════════

import { Image } from '@components/ui/Image';
import { PriceTag } from '@components/ui/PriceTag';
import { cn } from '@utils/cn';

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
  return (
    <a
      href={href}
      className={cn(
        'group focus-visible:ring-accent block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <Image
        src={timepiece.images[0]?.src ?? ''}
        alt={timepiece.images[0]?.alt ?? `${timepiece.brand} ${timepiece.model}`}
        ratio="1/1"
        wrapperClassName="bg-surface"
        className="duration-slow object-contain transition-transform group-hover:scale-[1.03]"
      />
      <div className="mt-4 flex flex-col gap-1">
        <span className="text-muted text-xs tracking-widest uppercase">
          {timepiece.brand} · {timepiece.year}
        </span>
        <h3 className="text-fg text-base font-medium">{timepiece.model}</h3>
        <span className="text-muted font-mono text-xs tracking-wider">{timepiece.reference}</span>
        {timepiece.fullSet && (
          <span className="text-muted mt-1 text-xs tracking-widest uppercase">
            ✓ {fullSetLabel}
          </span>
        )}
        <div className="mt-2">
          <PriceTag onRequestLabel={onRequestLabel} />
        </div>
      </div>
    </a>
  );
};
