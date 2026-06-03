// ═══════════════════════════════════════════════════
// ArtworksList — /:locale/account/artworks
// Filter by medium category.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { FilterBar } from '@components/ui/FilterBar';
import { Reveal } from '@components/ui/Reveal';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { ArtworkCard } from '@features/artworks/ArtworkCard';
import { CatalogueProactiveBanner } from '@features/catalogue/CatalogueProactiveBanner';
import { useSanityCollection } from '@hooks/useSanityCollection';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GROQ_ARTWORKS_LIST } from '@/lib/sanityQueries';
import { listArtworks } from '@/mocks';
import type { Artwork, ArtworkMedium } from '@/types/artwork';

const MEDIUM_LABEL_KEYS: Record<ArtworkMedium, string> = {
  'painting-oil': 'artworks.medium.painting-oil',
  'painting-acrylic': 'artworks.medium.painting-acrylic',
  'painting-watercolor': 'artworks.medium.painting-watercolor',
  'sculpture-bronze': 'artworks.medium.sculpture-bronze',
  'sculpture-marble': 'artworks.medium.sculpture-marble',
  'sculpture-mixed': 'artworks.medium.sculpture-mixed',
  photography: 'artworks.medium.photography',
  'works-on-paper': 'artworks.medium.works-on-paper',
  'mixed-media': 'artworks.medium.mixed-media',
};

export default function ArtworksList() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const fallback = useMemo(() => listArtworks(), []);
  const { data: all } = useSanityCollection<Artwork>({
    query: GROQ_ARTWORKS_LIST,
    gateModule: 'artwork',
    fallback,
  });

  const [activeMediums, setActiveMediums] = useState<Set<ArtworkMedium>>(new Set());

  const toggleMedium = (m: ArtworkMedium) => {
    setActiveMediums(prev => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  const filtered = activeMediums.size === 0 ? all : all.filter(a => activeMediums.has(a.medium));
  const allMediums = Array.from(new Set(all.map(a => a.medium)));

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.artworks.title')}
          lede={t('account.artworks.lede')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {allMediums.map(m => (
            <FilterBar.Chip
              key={m}
              label={t(MEDIUM_LABEL_KEYS[m])}
              selected={activeMediums.has(m)}
              onToggle={() => toggleMedium(m)}
            />
          ))}
          <FilterBar.Reset
            label={t('common.reset')}
            onReset={() => setActiveMediums(new Set())}
            visible={activeMediums.size > 0}
          />
        </FilterBar>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <Reveal key={a.id} index={i}>
              <ArtworkCard
                artwork={a}
                href={localePath(ROUTES.ACCOUNT_ARTWORKS + '/' + a.slug)}
                onRequestLabel={t('common.onRequest')}
                mediumLabel={t(MEDIUM_LABEL_KEYS[a.medium])}
              />
            </Reveal>
          ))}
        </div>

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>

        <CatalogueProactiveBanner domain="artwork" />
      </div>
    </Container>
  );
}
