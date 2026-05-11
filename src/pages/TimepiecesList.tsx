// ═══════════════════════════════════════════════════
// TimepiecesList — /:locale/account/timepieces
// Mirrors PropertiesList — brand-based filter chips.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { FilterBar } from '@components/ui/FilterBar';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { CatalogueProactiveBanner } from '@features/catalogue/CatalogueProactiveBanner';
import { TimepieceCard } from '@features/timepieces/TimepieceCard';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { listTimepieces } from '@/mocks';

export default function TimepiecesList() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const all = useMemo(() => listTimepieces(), []);

  const [activeBrands, setActiveBrands] = useState<Set<string>>(new Set());

  const toggleBrand = (b: string) => {
    setActiveBrands(prev => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  };

  const filtered = activeBrands.size === 0 ? all : all.filter(t => activeBrands.has(t.brand));
  const allBrands = Array.from(new Set(all.map(t => t.brand))).sort();

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.timepieces.title')}
          lede={t('account.timepieces.lede')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {allBrands.map(b => (
            <FilterBar.Chip
              key={b}
              label={b}
              selected={activeBrands.has(b)}
              onToggle={() => toggleBrand(b)}
            />
          ))}
          <FilterBar.Reset
            label={t('common.reset')}
            onReset={() => setActiveBrands(new Set())}
            visible={activeBrands.size > 0}
          />
        </FilterBar>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(tp => (
            <TimepieceCard
              key={tp.id}
              timepiece={tp}
              href={localePath(ROUTES.ACCOUNT_TIMEPIECES + '/' + tp.slug)}
              onRequestLabel={t('common.onRequest')}
            />
          ))}
        </div>

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>

        <CatalogueProactiveBanner domain="timepiece" />
      </div>
    </Container>
  );
}
