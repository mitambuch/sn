// ═══════════════════════════════════════════════════
// PropertiesList — /:locale/account/properties
//
// WHAT: Renders SectionHeader + FilterBar (kind + region) + grid of
//       PropertyCard. Filters are client-side over the mock list.
// WHEN: Members reach this page from the AppLayout sidebar nav.
// PATTERN: this is the V1 pilot — Timepieces/Artworks/Events/Journeys/
//          Concierge will mirror the structure in V2 (just per-module
//          filters and a different Card component).
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { FilterBar } from '@components/ui/FilterBar';
import { Reveal } from '@components/ui/Reveal';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { CatalogueProactiveBanner } from '@features/catalogue/CatalogueProactiveBanner';
import { PropertyCard } from '@features/properties/PropertyCard';
import { useSanityCollection } from '@hooks/useSanityCollection';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GROQ_PROPERTIES_LIST } from '@/lib/sanityQueries';
import { listProperties } from '@/mocks';
import type { Property, PropertyKind } from '@/types/property';

const KIND_LABEL_KEYS: Record<PropertyKind, string> = {
  chalet: 'properties.kind.chalet',
  villa: 'properties.kind.villa',
  penthouse: 'properties.kind.penthouse',
  estate: 'properties.kind.estate',
  townhouse: 'properties.kind.townhouse',
};

export default function PropertiesList() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const fallback = useMemo(() => listProperties(), []);
  const { data: all } = useSanityCollection<Property>({
    query: GROQ_PROPERTIES_LIST,
    fallback,
  });

  const [activeKinds, setActiveKinds] = useState<Set<PropertyKind>>(new Set());

  const toggleKind = (k: PropertyKind) => {
    setActiveKinds(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const filtered = activeKinds.size === 0 ? all : all.filter(p => activeKinds.has(p.kind));

  const allKinds = Array.from(new Set(all.map(p => p.kind)));

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.properties.title')}
          lede={t('account.properties.lede')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {allKinds.map(k => (
            <FilterBar.Chip
              key={k}
              label={t(KIND_LABEL_KEYS[k])}
              selected={activeKinds.has(k)}
              onToggle={() => toggleKind(k)}
            />
          ))}
          <FilterBar.Reset
            label={t('common.reset')}
            onReset={() => setActiveKinds(new Set())}
            visible={activeKinds.size > 0}
          />
        </FilterBar>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} index={i}>
              <PropertyCard
                property={p}
                href={localePath(ROUTES.ACCOUNT_PROPERTIES + '/' + p.slug)}
                kindLabel={t(KIND_LABEL_KEYS[p.kind])}
                onRequestLabel={t('common.onRequest')}
              />
            </Reveal>
          ))}
        </div>

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>

        <CatalogueProactiveBanner domain="property" />
      </div>
    </Container>
  );
}
