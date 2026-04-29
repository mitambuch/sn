// ═══════════════════════════════════════════════════
// ArtworkCard — listing card for Artworks module
//
// WHAT: Square 1:1 image (œuvre dominante), artist · year eyebrow,
//       title, medium, dimensions, on-request price footer.
// ═══════════════════════════════════════════════════

import { HeartButton } from '@components/ui/HeartButton';
import { Image } from '@components/ui/Image';
import { PriceTag } from '@components/ui/PriceTag';
import { cn } from '@utils/cn';

import type { Artwork } from '@/types/artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  href: string;
  onRequestLabel: string;
  mediumLabel: string;
  className?: string;
}

export const ArtworkCard = ({
  artwork,
  href,
  onRequestLabel,
  mediumLabel,
  className,
}: ArtworkCardProps) => {
  return (
    <a
      href={href}
      className={cn(
        'group focus-visible:ring-accent block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <div className="relative">
        <Image
          src={artwork.images[0]?.src ?? ''}
          alt={artwork.images[0]?.alt ?? artwork.title}
          ratio="1/1"
          wrapperClassName="bg-surface"
          className="duration-slow object-cover transition-transform group-hover:scale-[1.02]"
        />
        <HeartButton
          module="artwork"
          slug={artwork.slug}
          size="sm"
          className="absolute top-3 right-3"
        />
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <span className="text-muted text-xs tracking-widest uppercase">
          {artwork.artistName} · {artwork.year}
        </span>
        <h3 className="text-fg text-base font-medium italic">{artwork.title}</h3>
        <span className="text-muted text-xs tracking-wide">
          {mediumLabel} · {artwork.dimensions.heightCm} × {artwork.dimensions.widthCm} cm
        </span>
        <div className="mt-2">
          <PriceTag onRequestLabel={onRequestLabel} />
        </div>
      </div>
    </a>
  );
};
