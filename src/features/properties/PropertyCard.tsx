// ═══════════════════════════════════════════════════
// PropertyCard — listing card for Properties module
//
// WHAT: Renders a portrait Image (3:4), small uppercase region/kind row,
//       title, and a discreet "on request" PriceTag at the bottom.
//       No marketing chrome, no "from CHF X" — convention is silent price.
// WHEN: PropertiesList grid item.
// EDIT COPY: parent passes already-localized `kindLabel` (i18n key resolution
//            happens at the page level for fewer t() calls in lists).
// ═══════════════════════════════════════════════════

import { HeartButton } from '@components/ui/HeartButton';
import { Image } from '@components/ui/Image';
import { PriceTag } from '@components/ui/PriceTag';
import { cn } from '@utils/cn';

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
          src={property.images[0]?.src ?? ''}
          alt={property.images[0]?.alt ?? property.title}
          ratio="3/4"
          className="duration-slow transition-transform group-hover:scale-[1.02]"
        />
        <HeartButton
          module="property"
          slug={property.slug}
          size="sm"
          className="absolute top-3 right-3"
        />
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <span className="text-muted text-xs tracking-widest uppercase">
          {kindLabel} · {property.region}
        </span>
        <h3 className="text-fg text-base font-medium">{property.title}</h3>
        <div className="text-muted mt-1 flex items-center gap-3 text-xs tracking-widest uppercase">
          <span>{property.surfaceSqm} m²</span>
          <span aria-hidden="true">·</span>
          <span>{property.bedrooms} ch.</span>
        </div>
        <div className="mt-2">
          <PriceTag onRequestLabel={onRequestLabel} />
        </div>
      </div>
    </a>
  );
};
