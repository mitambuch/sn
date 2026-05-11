// ═══════════════════════════════════════════════════
// ArtworkCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 contained image (œuvre on neutral bg),
//       frosted-glass badge top-left (year · medium-short), HeartButton
//       top-right, italic title (art convention), artist eyebrow,
//       dimensions meta, on-request PriceTag in footer.
// WHEN: ArtworksList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. Italic title
//       non-negotiable for art (publishing convention).
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
      ratio="4/3"
      fit="contain"
    />
    <Card.Badge top={artwork.year} bottom={mediumLabel} />
    <Card.Overlay>
      <HeartButton
        module="artwork"
        slug={artwork.slug}
        size="sm"
        className="absolute top-3 right-3"
      />
    </Card.Overlay>
    <Card.Body>
      <Card.Eyebrow>{artwork.artistName}</Card.Eyebrow>
      <Card.Title italic>{artwork.title}</Card.Title>
      <Card.Meta>
        {artwork.dimensions.heightCm} × {artwork.dimensions.widthCm} cm
      </Card.Meta>
      <Card.Footer>
        <PriceTag onRequestLabel={onRequestLabel} />
      </Card.Footer>
    </Card.Body>
  </Card>
);
