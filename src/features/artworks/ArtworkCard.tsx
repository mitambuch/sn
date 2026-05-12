// ═══════════════════════════════════════════════════
// ArtworkCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 contained image (œuvre on neutral bg),
//       HeartButton top-right. Body: artist · year eyebrow, italic title
//       (art convention), 2-col Card.Stats (medium, dimensions).
//       Card.PriceBlock with "Prix" + Card.Pill "Sur demande".
// WHEN: ArtworksList grid item.
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <Card href={href} padding="none" className={className}>
      <Card.Media
        src={artwork.images[0]?.src}
        alt={artwork.images[0]?.alt ?? artwork.title}
        ratio="4/3"
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
        <Card.Stats>
          <Card.Stat label={t('artworks.meta.medium')} value={mediumLabel} />
          <Card.Stat
            label={t('artworks.meta.dimensions')}
            value={`${artwork.dimensions.heightCm} × ${artwork.dimensions.widthCm} cm`}
          />
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
