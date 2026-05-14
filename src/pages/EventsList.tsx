// ═══════════════════════════════════════════════════
// EventsList — /:locale/account/events
//
// WHAT: List of private events with a sticky compact filter bar at the
//       top : title on the left, filter chips on the right (md+) ; on
//       mobile, title sits above the chip row which scrolls
//       horizontally. The big eyebrow + lede pattern was dropped per
//       owner direction 2026-05-14 15:15 — "ça sert à rien, on garde
//       juste événements privés, à droite on met les tag, on monte
//       le tout en haut, je veux que ça remplisse l'espace pas
//       d'infos inutiles".
//
//       Full-viewport width 2026-05-14 15:17 — owner direction "il faut
//       que ça soit sur tout l'écran comme pour la page accueil". The
//       Container wrapper was dropped ; sections carry their own
//       px-4 md:px-6 lg:px-8 padding directly so the grid spans the
//       full width minus the sidebar (md:pl-56 set by AppLayout).
// WHEN: Module page for /account/events.
// CHANGE TITLE: src/locales/{fr,en}.json under account.events.title.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { FilterBar } from '@components/ui/FilterBar';
import { Reveal } from '@components/ui/Reveal';
import { ROUTES } from '@constants/routes';
import { CatalogueProactiveBanner } from '@features/catalogue/CatalogueProactiveBanner';
import { EventCard } from '@features/events/EventCard';
import { useSanityCollection } from '@hooks/useSanityCollection';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GROQ_EVENTS_LIST } from '@/lib/sanityQueries';
import { listEvents } from '@/mocks';
import type { Event, EventCategory } from '@/types/event';

const ROW_PAD = 'px-4 md:px-6 lg:px-8';

export default function EventsList() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const fallback = useMemo(() => listEvents(), []);
  const { data: all } = useSanityCollection<Event>({ query: GROQ_EVENTS_LIST, fallback });

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
    <div className="w-full pb-12">
      {/* Sticky compact header — title left, filter chips right on md+,
          stacks on mobile with chips scrolling horizontally. Pinned just
          under the AuthHeader (h-14 = top-14). */}
      <div className="bg-bg/95 border-fg/10 sticky top-14 z-30 border-b backdrop-blur-md">
        <div
          className={`${ROW_PAD} flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:py-5`}
        >
          <h1 className="text-fg font-mono text-lg font-bold tracking-tight uppercase md:text-xl">
            {t('account.events.title')}
          </h1>
          <FilterBar className="md:justify-end">
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
        </div>
      </div>

      <div className={`${ROW_PAD} space-y-10 pt-8`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
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

        <p className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>

        <CatalogueProactiveBanner domain="event" />
      </div>
    </div>
  );
}
