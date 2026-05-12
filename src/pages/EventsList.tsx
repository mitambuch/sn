// ═══════════════════════════════════════════════════
// EventsList — /:locale/account/events
// Filter by category.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { FilterBar } from '@components/ui/FilterBar';
import { Reveal } from '@components/ui/Reveal';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { CatalogueProactiveBanner } from '@features/catalogue/CatalogueProactiveBanner';
import { EventCard } from '@features/events/EventCard';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { listEvents } from '@/mocks';
import type { EventCategory } from '@/types/event';

export default function EventsList() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const all = useMemo(() => listEvents(), []);

  const [activeCats, setActiveCats] = useState<Set<EventCategory>>(new Set());

  const toggleCat = (c: EventCategory) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const filtered = activeCats.size === 0 ? all : all.filter(e => activeCats.has(e.category));
  const allCats = Array.from(new Set(all.map(e => e.category)));

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.events.title')}
          lede={t('account.events.lede')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {allCats.map(c => (
            <FilterBar.Chip
              key={c}
              label={t(`events.category.${c}`)}
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
          {filtered.map((e, i) => (
            <Reveal key={e.id} index={i}>
              <EventCard
                event={e}
                href={localePath(ROUTES.ACCOUNT_EVENTS + '/' + e.slug)}
                categoryLabel={t(`events.category.${e.category}`)}
                locale={i18n.language}
              />
            </Reveal>
          ))}
        </div>

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>

        <CatalogueProactiveBanner domain="event" />
      </div>
    </Container>
  );
}
