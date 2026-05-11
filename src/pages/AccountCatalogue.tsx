// ═══════════════════════════════════════════════════
// AccountCatalogue — /:locale/account/catalogue
//
// WHAT: Unified "everything" view — aggregates Property + Timepiece +
//       Artwork + Event + Journey + Concierge + Article entries into one
//       grid sorted by recency. FilterBar chips per module (toggleable
//       multi-select). Built for the HNW small-inventory reality
//       (12-15 items total at launch) — single-page scan replaces hopping
//       across 7 module-specific lists.
// WHEN: Top-of-nav entry, right after Dashboard. The catch-all entry
//       for clients who want to see everything curated for them.
// PATTERN: each item rendered with its own domain card component; cards
//       share the same Apple-closed Card atom so the mixed grid reads
//       coherent despite mixed types.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { FilterBar } from '@components/ui/FilterBar';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { ArtworkCard } from '@features/artworks/ArtworkCard';
import { ConciergeServiceCard } from '@features/concierge/ConciergeServiceCard';
import { EventCard } from '@features/events/EventCard';
import { JourneyCard } from '@features/journeys/JourneyCard';
import { ArticleCard } from '@features/news/ArticleCard';
import { PropertyCard } from '@features/properties/PropertyCard';
import { TimepieceCard } from '@features/timepieces/TimepieceCard';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  listArticles,
  listArtworks,
  listConciergeServices,
  listEvents,
  listJourneys,
  listProperties,
  listTimepieces,
} from '@/mocks';

type ModuleKey =
  | 'property'
  | 'timepiece'
  | 'artwork'
  | 'event'
  | 'journey'
  | 'concierge'
  | 'article';

const MODULES: { key: ModuleKey; labelKey: string }[] = [
  { key: 'property', labelKey: 'account.nav.properties' },
  { key: 'timepiece', labelKey: 'account.nav.timepieces' },
  { key: 'artwork', labelKey: 'account.nav.artworks' },
  { key: 'event', labelKey: 'account.nav.events' },
  { key: 'journey', labelKey: 'account.nav.journeys' },
  { key: 'concierge', labelKey: 'account.nav.concierge' },
  { key: 'article', labelKey: 'account.nav.news' },
];

interface CatalogueEntry {
  module: ModuleKey;
  id: string;
  sortKey: string;
  card: ReactNode;
}

type TFn = ReturnType<typeof useTranslation>['t'];
type LocalePathFn = (path: string) => string;

function buildEntries(t: TFn, locale: string, localePath: LocalePathFn): CatalogueEntry[] {
  const onRequest = t('common.onRequest');
  const all: CatalogueEntry[] = [];

  // WHY: demo flags for "offre limitée" countdown + "important" pulsing
  // outline. First Property of the list gets both, first Timepiece gets
  // important only, first Event gets both (countdown replaces date badge).
  // To wire real data: lift `endsAt` + `important` into the domain types
  // and mocks, drop these constants.
  const COUNTDOWN_3D_5H = new Date(Date.now() + 86_400_000 * 3 + 3_600_000 * 5).toISOString();
  const COUNTDOWN_18H = new Date(Date.now() + 3_600_000 * 18).toISOString();
  let firstProperty = true;
  let firstTimepiece = true;
  let firstEvent = true;

  for (const p of listProperties()) {
    const isFirst = firstProperty;
    firstProperty = false;
    all.push({
      module: 'property',
      id: p.id,
      sortKey: p.createdAt,
      card: (
        <PropertyCard
          property={p}
          href={localePath(`${ROUTES.ACCOUNT_PROPERTIES}/${p.slug}`)}
          kindLabel={t(`properties.kind.${p.kind}`)}
          onRequestLabel={onRequest}
          {...(isFirst && { important: true, countdownEndsAt: COUNTDOWN_3D_5H })}
        />
      ),
    });
  }
  for (const tp of listTimepieces()) {
    const isFirst = firstTimepiece;
    firstTimepiece = false;
    all.push({
      module: 'timepiece',
      id: tp.id,
      sortKey: tp.createdAt,
      card: (
        <TimepieceCard
          timepiece={tp}
          href={localePath(`${ROUTES.ACCOUNT_TIMEPIECES}/${tp.slug}`)}
          onRequestLabel={onRequest}
          {...(isFirst && { important: true })}
        />
      ),
    });
  }
  for (const a of listArtworks()) {
    all.push({
      module: 'artwork',
      id: a.id,
      sortKey: a.createdAt,
      card: (
        <ArtworkCard
          artwork={a}
          href={localePath(`${ROUTES.ACCOUNT_ARTWORKS}/${a.slug}`)}
          onRequestLabel={onRequest}
          mediumLabel={t(`artworks.medium.${a.medium}`)}
        />
      ),
    });
  }
  for (const e of listEvents()) {
    const isFirst = firstEvent;
    firstEvent = false;
    all.push({
      module: 'event',
      id: e.id,
      sortKey: e.createdAt,
      card: (
        <EventCard
          event={e}
          href={localePath(`${ROUTES.ACCOUNT_EVENTS}/${e.slug}`)}
          categoryLabel={t(`events.category.${e.category}`)}
          locale={locale}
          {...(isFirst && { important: true, countdownEndsAt: COUNTDOWN_18H })}
        />
      ),
    });
  }
  for (const j of listJourneys()) {
    all.push({
      module: 'journey',
      id: j.id,
      sortKey: j.createdAt,
      card: (
        <JourneyCard
          journey={j}
          href={localePath(`${ROUTES.ACCOUNT_JOURNEYS}/${j.slug}`)}
          kindLabel={t(`journeys.kind.${j.kind}`)}
          daysLabel={t('journeys.days')}
        />
      ),
    });
  }
  for (const s of listConciergeServices()) {
    all.push({
      module: 'concierge',
      id: s.id,
      sortKey: s.createdAt,
      card: (
        <ConciergeServiceCard
          service={s}
          href={localePath(`${ROUTES.ACCOUNT_CONCIERGE}/${s.slug}`)}
          categoryLabel={t(`concierge.category.${s.category}`)}
        />
      ),
    });
  }
  for (const a of listArticles()) {
    all.push({
      module: 'article',
      id: a.id,
      sortKey: a.publishedAt,
      card: (
        <ArticleCard
          article={a}
          href={localePath(`${ROUTES.ACCOUNT_NEWS}/${a.slug}`)}
          kindLabel={t(`articles.kind.${a.kind}`)}
          locale={locale}
          readMinutesLabel={t('articles.readMinutes')}
        />
      ),
    });
  }

  return all.sort((x, y) => y.sortKey.localeCompare(x.sortKey));
}

export default function AccountCatalogue() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const [activeModules, setActiveModules] = useState<Set<ModuleKey>>(new Set());

  const entries: CatalogueEntry[] = useMemo(
    () => buildEntries(t, i18n.language, localePath),
    [t, i18n.language, localePath],
  );

  const toggleModule = (m: ModuleKey) => {
    setActiveModules(prev => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  const filtered =
    activeModules.size === 0 ? entries : entries.filter(e => activeModules.has(e.module));

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.catalogue.title')}
          lede={t('account.catalogue.lede')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {MODULES.map(m => (
            <FilterBar.Chip
              key={m.key}
              label={t(m.labelKey)}
              selected={activeModules.has(m.key)}
              onToggle={() => toggleModule(m.key)}
            />
          ))}
          <FilterBar.Reset
            label={t('common.reset')}
            onReset={() => setActiveModules(new Set())}
            visible={activeModules.size > 0}
          />
        </FilterBar>

        <div className="grid auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(e => (
            <div key={`${e.module}-${e.id}`} className="h-full *:h-full">
              {e.card}
            </div>
          ))}
        </div>

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>
      </div>
    </Container>
  );
}
