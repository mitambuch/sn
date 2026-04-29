// ═══════════════════════════════════════════════════
// Image — lazy-loaded image with aspect ratio + fallback
//
// WHAT: Renders an <img> with explicit aspect ratio, lazy loading, and a
//       skeleton placeholder until the image loads. Falls back to a
//       neutral surface block if the src fails.
// WHEN: Use everywhere a product/property/timepiece visual appears.
// CHANGE RATIO: pass `ratio="3/4"` etc. — defaults to "4/5" (portrait HNW look).
// CHANGE FALLBACK: edit the empty-state block at the bottom of the file.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { type ImgHTMLAttributes, useState } from 'react';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string;
  alt: string;
  ratio?: '1/1' | '4/3' | '3/4' | '16/9' | '4/5' | '3/2' | '2/3';
  eager?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const ratioStyles: Record<NonNullable<ImageProps['ratio']>, string> = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '16/9': 'aspect-video',
  '4/5': 'aspect-[4/5]',
  '3/2': 'aspect-[3/2]',
  '2/3': 'aspect-[2/3]',
};

/** Lazy-loaded image with aspect ratio, skeleton placeholder, and graceful fallback. */
export const Image = ({
  src,
  alt,
  ratio = '4/5',
  eager = false,
  className,
  wrapperClassName,
  ...rest
}: ImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={cn(
        'bg-surface relative w-full overflow-hidden',
        ratioStyles[ratio],
        wrapperClassName,
      )}
    >
      {!loaded && !errored && (
        <div className="bg-surface absolute inset-0 animate-pulse" aria-hidden="true" />
      )}
      {errored ? (
        <div
          className="text-muted absolute inset-0 flex items-center justify-center text-xs tracking-widest uppercase"
          aria-label={alt}
        >
          —
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...rest}
        />
      )}
    </div>
  );
};
