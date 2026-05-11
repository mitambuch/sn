// ═══════════════════════════════════════════════════
// PropertyCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image, HeartButton top-right. Body
//       carries kind · region eyebrow + title + 2-col Card.Stats grid
//       (surface, bedrooms). Card.PriceBlock footer with "Prix" label
//       on left + "Sur demande" on right (edge-to-edge with subtle bg
//       shift). At-a-glance: type, lieu, taille, prix in one look.
// WHEN: PropertiesList grid item, recent items cross-module strips.
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { PriceTag } from '@components/ui/PriceTag';
import { useTranslation } from 'react-i18next';

import type { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  href: string;
  kindLabel: string;
  onRequestLabel: string;
  className?: string;
}

export const PropertyCard = ({
  property,
  href,
  kindLabel,
  onRequestLabel,
  className,
}: PropertyCardProps) => {
  const { t } = useTranslation();
  return (
    <Card href={href} padding="none" className={className}>
      <Card.Media
        src={property.images[0]?.src}
        alt={property.images[0]?.alt ?? property.title}
        ratio="4/3"
      />
      <Card.Overlay>
        <HeartButton
          module="property"
          slug={property.slug}
          size="sm"
          className="absolute top-3 right-3"
        />
      </Card.Overlay>
      <Card.Body>
        <Card.Eyebrow>
          {kindLabel} · {property.region}
        </Card.Eyebrow>
        <Card.Title>{property.title}</Card.Title>
        <Card.Stats>
          <Card.Stat label={t('properties.meta.surface')} value={`${property.surfaceSqm} m²`} />
          <Card.Stat label={t('properties.meta.bedrooms')} value={property.bedrooms} />
        </Card.Stats>
      </Card.Body>
      <Card.PriceBlock>
        <span className="text-muted text-[10px] tracking-widest uppercase">
          {t('common.price')}
        </span>
        <PriceTag onRequestLabel={onRequestLabel} />
      </Card.PriceBlock>
    </Card>
  );
};
