// ═══════════════════════════════════════════════════
// JourneysList — /:locale/account/journeys
// Filter by kind (jet/yacht/expedition/safari/rail-luxury).
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { FilterBar } from '@components/ui/FilterBar';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { JourneyCard } from '@features/journeys/JourneyCard';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { listJourneys } from '@/mocks';
import type { JourneyKind } from '@/types/journey';

export default function JourneysList() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const all = useMemo(() => listJourneys(), []);

  const [activeKinds, setActiveKinds] = useState<Set<JourneyKind>>(new Set());
  const toggleKind = (k: JourneyKind) => {
    setActiveKinds(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const filtered = activeKinds.size === 0 ? all : all.filter(j => activeKinds.has(j.kind));
  const allKinds = Array.from(new Set(all.map(j => j.kind)));

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.journeys.title')}
          lede={t('account.journeys.lede')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {allKinds.map(k => (
            <FilterBar.Chip
              key={k}
              label={t(`journeys.kind.${k}`)}
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
          {filtered.map(j => (
            <JourneyCard
              key={j.id}
              journey={j}
              href={localePath(ROUTES.ACCOUNT_JOURNEYS + '/' + j.slug)}
              kindLabel={t(`journeys.kind.${j.kind}`)}
              daysLabel={t('journeys.days')}
            />
          ))}
        </div>

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>
      </div>
    </Container>
  );
}
