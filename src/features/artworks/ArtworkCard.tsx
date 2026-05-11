// ═══════════════════════════════════════════════════
// ArtworkCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface with 1:1 contained image (œuvre dominante),
//       artist · year eyebrow, italic title (art convention), medium ·
//       dimensions meta, on-request PriceTag in footer.
// WHEN: ArtworksList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. Italic title
//       is non-negotiable for art (publishing convention).
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { PriceTag } from '@components/ui/PriceTag';

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
}: ArtworkCardProps) => (
  <Card href={href} padding="none" className={className}>
    <Card.Media
      src={artwork.images[0]?.src}
      alt={artwork.images[0]?.alt ?? artwork.title}
      ratio="1/1"
      fit="contain"
    />
    <Card.Overlay>
      <HeartButton
        module="artwork"
        slug={artwork.slug}
        size="sm"
        className="absolute top-3 right-3"
      />
    </Card.Overlay>
    <Card.Body>
      <Card.Eyebrow>
        {artwork.artistName} · {artwork.year}
      </Card.Eyebrow>
      <Card.Title italic>{artwork.title}</Card.Title>
      <Card.Meta>
        {mediumLabel} · {artwork.dimensions.heightCm} × {artwork.dimensions.widthCm} cm
      </Card.Meta>
    </Card.Body>
    <Card.Footer className="px-5 pb-5">
      <PriceTag onRequestLabel={onRequestLabel} />
    </Card.Footer>
  </Card>
);
