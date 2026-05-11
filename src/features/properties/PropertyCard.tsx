// ═══════════════════════════════════════════════════
// PropertyCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface with 3:4 portrait image, region · kind eyebrow,
//       title, surface m² · bedrooms meta, "on request" PriceTag in footer.
//       Silent price convention — never "from CHF X".
// WHEN: PropertiesList grid item, recent items cross-module strips.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. Change ratio prop
//       to 4/3 for a more landscape grid look (kept 3/4 for real-estate intuition).
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
      ratio="3/4"
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
