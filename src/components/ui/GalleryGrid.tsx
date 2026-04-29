// ═══════════════════════════════════════════════════
// GalleryGrid — multi-image editorial grid with fullscreen viewer
//
// WHAT: Lays out 4-12 images in an asymmetric editorial grid; clicking an
//       image opens a fullscreen lightbox with prev/next navigation and
//       Escape to close. Keyboard accessible (Arrow keys + Esc + Tab).
// WHEN: Property gallery, Timepiece macro shots, Artwork series.
// CHANGE COLUMNS: edit gridStyles below.
// ═══════════════════════════════════════════════════

import { Image } from '@components/ui/Image';
import { cn } from '@utils/cn';
import { useCallback, useEffect, useState } from 'react';

export interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  className?: string;
}

/** Asymmetric editorial gallery grid with keyboard-accessible lightbox. */
export const GalleryGrid = ({ images, className }: GalleryGridProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex(i => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setActiveIndex(i => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeIndex, close, next, prev]);

  if (images.length === 0) return null;

  return (
    <>
      <div
        className={cn('grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4', className)}
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={cn(
              'group focus-visible:ring-accent relative overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              i === 0 && 'col-span-2 row-span-2',
            )}
            aria-label={`Open image ${String(i + 1)} of ${String(images.length)}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              ratio={i === 0 ? '4/3' : '1/1'}
              className="duration-slow transition-transform group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
        >
          {/* WHY: invisible full-bleed button is the click-to-close target.
              Lets keyboard users reach close via Tab; visual <img>/nav buttons stay non-interactive backdrops. */}
          <button
            type="button"
            onClick={close}
            className="absolute inset-0 cursor-zoom-out"
            aria-label="Close viewer"
          />
          <img
            src={images[activeIndex]?.src}
            alt={images[activeIndex]?.alt ?? ''}
            className="pointer-events-none relative max-h-[85vh] max-w-[85vw] object-contain"
          />
          <button
            type="button"
            onClick={prev}
            className="text-fg/80 hover:text-fg absolute left-4 text-xs tracking-widest uppercase"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="text-fg/80 hover:text-fg absolute right-4 text-xs tracking-widest uppercase"
            aria-label="Next image"
          >
            →
          </button>
          <span className="text-fg/60 pointer-events-none absolute bottom-4 text-xs tracking-widest uppercase">
            {String(activeIndex + 1)} / {String(images.length)}
          </span>
        </div>
      )}
    </>
  );
};
