// ═══════════════════════════════════════════════════
// HeartButton — toggle wishlist state for any catalogue item
//
// WHAT: Small circular button with a Heart icon (lucide). Filled when
//       the item is saved, outlined otherwise. Calls useSavedItems
//       under the hood so all instances of the same item across the
//       app stay in sync.
// WHEN: Overlay top-right of any catalogue card, or inline next to a
//       DetailHero title.
// CHANGE SIZE: pass `size="sm" | "md"` (md by default).
// ═══════════════════════════════════════════════════

import { type SavedModule, useSavedItems } from '@hooks/useSavedItems';
import { cn } from '@utils/cn';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeartButtonProps {
  module: SavedModule;
  slug: string;
  size?: 'sm' | 'md';
  className?: string;
  /** When true, stops the click event from bubbling — use when nested in a card link. */
  stopPropagation?: boolean;
}

const sizeStyles: Record<NonNullable<HeartButtonProps['size']>, { box: string; icon: number }> = {
  sm: { box: 'h-8 w-8', icon: 14 },
  md: { box: 'h-10 w-10', icon: 16 },
};

export const HeartButton = ({
  module,
  slug,
  size = 'md',
  className,
  stopPropagation = true,
}: HeartButtonProps) => {
  const { t } = useTranslation();
  const { isSaved, toggle } = useSavedItems();
  const saved = isSaved(module, slug);
  const style = sizeStyles[size];

  return (
    <button
      type="button"
      aria-label={saved ? t('saved.remove') : t('saved.add')}
      aria-pressed={saved}
      onClick={e => {
        if (stopPropagation) {
          e.preventDefault();
          e.stopPropagation();
        }
        toggle(module, slug);
      }}
      className={cn(
        'group focus-visible:ring-accent flex shrink-0 items-center justify-center rounded-full border',
        'duration-base transition-[border-color,background-color,color]',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        saved
          ? 'bg-fg text-bg border-fg'
          : 'border-border bg-bg/80 text-fg hover:border-fg/60 backdrop-blur-md',
        style.box,
        className,
      )}
    >
      <Heart
        size={style.icon}
        strokeWidth={1.5}
        fill={saved ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
    </button>
  );
};
