// ═══════════════════════════════════════════════════
// PropertyDetail — /:locale/account/properties/:slug
//
// WHAT: DetailHero (first image + title + region) → MetaList specsheet
//       → highlights → long description → secondary GalleryGrid
//       → "Express interest" CTA pinned at the bottom of the hero.
// WHEN: User clicks a PropertyCard from PropertiesList.
// EDGE: Falls back to a 404-like state when the slug is unknown.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { DetailHero } from '@components/ui/DetailHero';
import { GalleryGrid } from '@components/ui/GalleryGrid';
import { MetaList } from '@components/ui/MetaList';
import { PriceTag } from '@components/ui/PriceTag';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { InquiryDrawer } from '@features/inquiry/InquiryDrawer';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';

import { getProperty } from '@/mocks';

const KIND_LABEL_KEYS = {
  chalet: 'properties.kind.chalet',
  villa: 'properties.kind.villa',
  penthouse: 'properties.kind.penthouse',
  estate: 'properties.kind.estate',
  townhouse: 'properties.kind.townhouse',
} as const;

export default function PropertyDetail() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { slug } = useParams<{ slug: string }>();

  const property = slug ? getProperty(slug) : undefined;
  const [inquiryOpen, setInquiryOpen] = useState(false);

  if (!property) {
    return <Navigate to={localePath(ROUTES.ACCOUNT_PROPERTIES)} replace />;
  }

  const heroImage = property.images[0]!;
  const restImages = property.images.slice(1);

  const meta = [
    { label: t('properties.meta.surface'), value: `${String(property.surfaceSqm)} m²` },
    { label: t('properties.meta.bedrooms'), value: String(property.bedrooms) },
    { label: t('properties.meta.bathrooms'), value: String(property.bathrooms) },
    ...(property.plotSqm
      ? [{ label: t('properties.meta.plot'), value: `${String(property.plotSqm)} m²` }]
      : []),
    ...(property.yearBuilt
      ? [{ label: t('properties.meta.yearBuilt'), value: String(property.yearBuilt) }]
      : []),
    {
      label: t('properties.meta.region'),
      value: `${property.region} · ${property.countryCode}`,
    },
    {
      label: t('properties.meta.availability'),
      value: t(`properties.availability.${property.availability}`),
    },
  ];

  return (
    <>
      <DetailHero
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
        eyebrow={t(KIND_LABEL_KEYS[property.kind])}
        title={property.title}
        caption={`${property.region} · ${String(property.surfaceSqm)} m²`}
        height="full"
        actions={
          <button
            type="button"
            onClick={() => setInquiryOpen(true)}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
              'duration-base transition-[border-color,background-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            {t('common.expressInterest')}
            <span aria-hidden="true">→</span>
          </button>
        }
      />

      <InquiryDrawer
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        source="property"
        itemTitle={property.title}
      />

      <Container size="xl">
        <div className="grid gap-12 py-16 lg:grid-cols-3">
          {/* Left column — narrative */}
          <div className="space-y-8 lg:col-span-2">
            <p className="text-fg text-lg leading-relaxed text-pretty">{property.summary}</p>
            <p className="text-muted leading-relaxed">{property.description}</p>

            {property.highlights.length > 0 && (
              <ul className="border-border grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2">
                {property.highlights.map(h => (
                  <li key={h} className="text-fg flex items-start gap-3 text-sm leading-relaxed">
                    <span className="bg-fg mt-2 inline-block h-1 w-2 shrink-0" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right column — specsheet */}
          <aside className="space-y-6">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('common.details')}
            </span>
            <MetaList items={meta} />
            <div className="border-border border-t pt-6">
              <PriceTag onRequestLabel={t('common.onRequest')} size="md" />
            </div>
          </aside>
        </div>

        {restImages.length > 0 && (
          <div className="space-y-6 pb-24">
            <SectionHeader title={t('properties.gallery')} size="sm" as="h2" />
            <GalleryGrid images={restImages} />
          </div>
        )}

        <Link
          to={localePath(ROUTES.ACCOUNT_PROPERTIES)}
          className="text-muted hover:text-fg duration-base mb-12 inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors"
        >
          ← {t('common.back')}
        </Link>
      </Container>
    </>
  );
}
