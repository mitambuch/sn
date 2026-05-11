// ═══════════════════════════════════════════════════
// PropertyCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 image (full-bleed, no top-left overlay
//       to respect the property visual), HeartButton top-right. Body
//       carries kind · region eyebrow, title, surface · bedrooms meta,
//       "on request" PriceTag in footer.
// WHEN: PropertiesList grid item, recent items cross-module strips.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. No badge —
//       Property is a product, the image speaks for itself.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { HeartButton } from '@components/ui/HeartButton';
import { PriceTag } from '@components/ui/PriceTag';

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
}: PropertyCardProps) => (
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
      <Card.Meta>
        {property.surfaceSqm} m² · {property.bedrooms} ch.
      </Card.Meta>
      <Card.Footer>
        <PriceTag onRequestLabel={onRequestLabel} />
      </Card.Footer>
    </Card.Body>
  </Card>
);
