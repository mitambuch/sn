// ═══════════════════════════════════════════════════
// AccountCatalogue — /:locale/account/catalogue
//
// WHAT: Unified "tout" view — aggregates Property + Timepiece + Artwork
//       + Event + Journey + Concierge + Article entries grouped by
//       module, with a sticky filter bar pinned just below the
//       AuthHeader. When no filter is active, every non-empty module
//       gets its own section ; toggling a chip restricts the visible
//       sections to that subset.
//
//       Owner direction 2026-05-14 15:15 — "sur la page 'tout' on peut
//       catégoriser, je veux que ça remplisse l'espace pas d'infos
//       inutiles". The big "Le catalogue" + lede header was dropped ;
//       a single sr-only h1 keeps the page named for screen readers.
// WHEN: Top-of-nav entry, right after Dashboard.
// PATTERN: each item rendered with its own domain card component ; cards
//       share the same Apple-closed Card atom so the mixed grid reads
//       coherent despite mixed types.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { FilterBar } from '@components/ui/FilterBar';
import { Reveal } from '@components/ui/Reveal';
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

  // Demo flags for "offre limitée" countdown + "important" pulsing
  // outline. To wire real data: lift `endsAt` + `important` into the
  // domain types and mocks, drop these constants.
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

  // Sort within each module by recency — preserved when grouping below.
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

  // Group by module ; each bucket inherits the recency sort from buildEntries.
  const entriesByModule = useMemo(() => {
    const grouped = new Map<ModuleKey, CatalogueEntry[]>();
    for (const e of entries) {
      const bucket = grouped.get(e.module) ?? [];
      bucket.push(e);
      grouped.set(e.module, bucket);
    }
    return grouped;
  }, [entries]);

  const toggleModule = (m: ModuleKey) => {
    setActiveModules(prev => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  // Module visible if : (no filter) OR (it's in the active set) — AND it has
  // at least one entry to show.
  const visibleModules = MODULES.filter(m => {
    const hasEntries = (entriesByModule.get(m.key)?.length ?? 0) > 0;
    const matchesFilter = activeModules.size === 0 || activeModules.has(m.key);
    return hasEntries && matchesFilter;
  });

  const totalVisible = visibleModules.reduce(
    (sum, m) => sum + (entriesByModule.get(m.key)?.length ?? 0),
    0,
  );

  return (
    <div className="pb-12">
      {/* sr-only h1 — visible chrome was dropped per owner direction.
          Screen readers still get a proper page heading. */}
      <h1 className="sr-only">{t('account.catalogue.title')}</h1>

      {/* Sticky filter row — pinned just under the AuthHeader. The
          backdrop-blur keeps the underlying grid scrolling readable
          but slightly veiled when content passes behind. Full-bleed
          (no Container) per owner direction 2026-05-14 15:17 — "il
          faut que ça soit sur tout l'écran comme pour la page accueil". */}
      <div className="bg-bg/95 border-fg/10 sticky top-14 z-30 border-b backdrop-blur-md">
        <div className="px-4 py-4 md:px-6 md:py-5 lg:px-8">
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
        </div>
      </div>

      <div className="space-y-12 px-4 pt-8 md:space-y-14 md:px-6 lg:px-8">
        {visibleModules.map(m => {
          const moduleEntries = entriesByModule.get(m.key) ?? [];
          return (
            <section key={m.key} aria-labelledby={`module-${m.key}`}>
              <header className="mb-5 flex items-baseline justify-between gap-3">
                <h2
                  id={`module-${m.key}`}
                  className="text-fg font-mono text-lg font-bold tracking-tight uppercase md:text-xl"
                >
                  {t(m.labelKey)}
                </h2>
                <span className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
                  {t('common.showing', { count: moduleEntries.length })}
                </span>
              </header>
              <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {moduleEntries.map((e, i) => (
                  <Reveal key={`${e.module}-${e.id}`} index={i} className="h-full *:h-full">
                    {e.card}
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}

        {totalVisible === 0 && (
          <p className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
            {t('common.empty')}
          </p>
        )}
      </div>
    </div>
  );
}
