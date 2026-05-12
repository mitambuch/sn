// ═══════════════════════════════════════════════════
// DetailHero — full-bleed visual hero with overlay metadata
//
// WHAT: Renders a tall hero with one primary image, an editorial title,
//       optional eyebrow + caption, and a slot for action CTAs (e.g. the
//       "manifester votre intérêt" button). Title sits at the bottom-left
//       with a subtle gradient scrim for legibility.
// WHEN: Top of every Detail page (Property, Timepiece, Artwork, etc.).
// CHANGE HEIGHT: edit the heightStyles map.
// ═══════════════════════════════════════════════════

import { Image } from '@components/ui/Image';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface DetailHeroProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  caption?: string;
  actions?: ReactNode;
  height?: 'short' | 'tall' | 'full';
  className?: string;
}

const heightStyles: Record<NonNullable<DetailHeroProps['height']>, string> = {
  short: 'aspect-[4/3] md:aspect-[16/9]',
  tall: 'aspect-[3/4] md:aspect-[16/10]',
  full: 'aspect-[3/4] md:h-[85vh] md:aspect-auto',
};

/** Full-bleed visual hero with bottom-left metadata + actions slot. */
export const DetailHero = ({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  caption,
  actions,
  height = 'tall',
  className,
}: DetailHeroProps) => {
  return (
    <section className={cn('relative w-full overflow-hidden', heightStyles[height], className)}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        eager
        wrapperClassName="absolute inset-0 h-full"
        ratio="16/9"
        className="h-full w-full"
      />
      <div
        className="from-bg/90 via-bg/30 absolute inset-0 bg-gradient-to-t to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-12 md:pb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            {eyebrow && (
              <span className="text-muted text-xs tracking-[0.3em] uppercase">{eyebrow}</span>
            )}
            <h1 className="text-fg max-w-3xl font-mono text-2xl font-bold tracking-tight text-balance uppercase md:text-4xl lg:text-5xl">
              {title}
            </h1>
            {caption && <p className="text-muted max-w-xl text-sm md:text-base">{caption}</p>}
          </div>
          {actions && <div className="flex flex-shrink-0 items-center gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
};
