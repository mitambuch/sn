// ═══════════════════════════════════════════════════
// ConciergeList — /:locale/account/concierge
// Filter by category. Service cards are bordered (different texture
// from item modules — these are capabilities, not catalogue items).
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { FilterBar } from '@components/ui/FilterBar';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { CatalogueProactiveBanner } from '@features/catalogue/CatalogueProactiveBanner';
import { ConciergeServiceCard } from '@features/concierge/ConciergeServiceCard';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { listConciergeServices } from '@/mocks';
import type { ConciergeCategory } from '@/types/concierge';

export default function ConciergeList() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const all = useMemo(() => listConciergeServices(), []);

  const [activeCats, setActiveCats] = useState<Set<ConciergeCategory>>(new Set());
  const toggleCat = (c: ConciergeCategory) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const filtered = activeCats.size === 0 ? all : all.filter(s => activeCats.has(s.category));
  const allCats = Array.from(new Set(all.map(s => s.category)));

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.concierge.title')}
          lede={t('account.concierge.lede')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {allCats.map(c => (
            <FilterBar.Chip
              key={c}
              label={t(`concierge.category.${c}`)}
              selected={activeCats.has(c)}
              onToggle={() => toggleCat(c)}
            />
          ))}
          <FilterBar.Reset
            label={t('common.reset')}
            onReset={() => setActiveCats(new Set())}
            visible={activeCats.size > 0}
          />
        </FilterBar>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => (
            <ConciergeServiceCard
              key={s.id}
              service={s}
              href={localePath(ROUTES.ACCOUNT_CONCIERGE + '/' + s.slug)}
              categoryLabel={t(`concierge.category.${s.category}`)}
              leadTimeLabel={t('concierge.leadTime')}
            />
          ))}
        </div>

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>

        <CatalogueProactiveBanner domain="concierge" />
      </div>
    </Container>
  );
}
