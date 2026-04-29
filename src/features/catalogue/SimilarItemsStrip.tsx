// ═══════════════════════════════════════════════════
// SimilarItemsStrip — 3-up "you might also like" strip for detail pages
//
// WHAT: Reads the active module's full list, excludes the current slug,
//       picks the next 3 items (rotating), renders compact cards with
//       3:4 image + title + module label. Heart toggle preserved.
// WHEN: Mount at the bottom of every DetailPage above the back link.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { HeartButton } from '@components/ui/HeartButton';
import { Image } from '@components/ui/Image';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import type { SavedModule } from '@hooks/useSavedItems';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  listArtworks,
  listConciergeServices,
  listEvents,
  listJourneys,
  listProperties,
  listTimepieces,
} from '@/mocks';

interface SimilarItem {
  slug: string;
  title: string;
  imageSrc: string | undefined;
  imageAlt: string | undefined;
}

interface SimilarItemsStripProps {
  module: SavedModule;
  /** Current item slug — excluded from the list. */
  currentSlug: string;
}

const ROUTE_BY_MODULE: Record<SavedModule, string> = {
  property: ROUTES.ACCOUNT_PROPERTIES,
  timepiece: ROUTES.ACCOUNT_TIMEPIECES,
  artwork: ROUTES.ACCOUNT_ARTWORKS,
  event: ROUTES.ACCOUNT_EVENTS,
  journey: ROUTES.ACCOUNT_JOURNEYS,
  concierge: ROUTES.ACCOUNT_CONCIERGE,
};

function listSimilar(module: SavedModule, currentSlug: string): SimilarItem[] {
  switch (module) {
    case 'property':
      return listProperties()
        .filter(p => p.slug !== currentSlug)
        .slice(0, 3)
        .map(p => ({
          slug: p.slug,
          title: p.title,
          imageSrc: p.images[0]?.src,
          imageAlt: p.images[0]?.alt,
        }));
    case 'timepiece':
      return listTimepieces()
        .filter(t => t.slug !== currentSlug)
        .slice(0, 3)
        .map(t => ({
          slug: t.slug,
          title: `${t.brand} ${t.model}`,
          imageSrc: t.images[0]?.src,
          imageAlt: t.images[0]?.alt,
        }));
    case 'artwork':
      return listArtworks()
        .filter(a => a.slug !== currentSlug)
        .slice(0, 3)
        .map(a => ({
          slug: a.slug,
          title: `${a.artistName} — ${a.title}`,
          imageSrc: a.images[0]?.src,
          imageAlt: a.images[0]?.alt,
        }));
    case 'event':
      return listEvents()
        .filter(e => e.slug !== currentSlug)
        .slice(0, 3)
        .map(e => ({
          slug: e.slug,
          title: e.title,
          imageSrc: e.images[0]?.src,
          imageAlt: e.images[0]?.alt,
        }));
    case 'journey':
      return listJourneys()
        .filter(j => j.slug !== currentSlug)
        .slice(0, 3)
        .map(j => ({
          slug: j.slug,
          title: j.title,
          imageSrc: j.images[0]?.src,
          imageAlt: j.images[0]?.alt,
        }));
    case 'concierge':
      return listConciergeServices()
        .filter(c => c.slug !== currentSlug)
        .slice(0, 3)
        .map(c => ({
          slug: c.slug,
          title: c.title,
          imageSrc: c.images[0]?.src,
          imageAlt: c.images[0]?.alt,
        }));
  }
}

export const SimilarItemsStrip = ({ module, currentSlug }: SimilarItemsStripProps) => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const items = listSimilar(module, currentSlug);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="similar-heading" className="space-y-6 pb-16">
      <SectionHeader title={t('common.similar')} size="sm" as="h2" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <Link
            key={item.slug}
            id={item.slug === items[0]?.slug ? 'similar-heading' : undefined}
            to={localePath(ROUTE_BY_MODULE[module] + '/' + item.slug)}
            className="group focus-visible:ring-accent relative block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <div className="relative">
              <Image
                src={item.imageSrc ?? ''}
                alt={item.imageAlt ?? item.title}
                ratio="3/4"
                className="duration-slow transition-transform group-hover:scale-[1.02]"
              />
              <HeartButton
                module={module}
                slug={item.slug}
                size="sm"
                className="absolute top-3 right-3"
              />
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <span className="text-muted text-xs tracking-widest uppercase">
                {t(
                  `account.nav.${
                    module === 'property'
                      ? 'properties'
                      : module === 'timepiece'
                        ? 'timepieces'
                        : module === 'artwork'
                          ? 'artworks'
                          : module === 'event'
                            ? 'events'
                            : module === 'journey'
                              ? 'journeys'
                              : 'concierge'
                  }`,
                )}
              </span>
              <span className="text-fg text-sm font-medium">{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
