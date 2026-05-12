// ═══════════════════════════════════════════════════
// SimilarItemsStrip — compact "you might also like" strip
//
// WHAT: Renders 3 alternative items from the same module as compact
//       Card-atom listings (4:3 landscape, low body). On mobile the
//       strip is 2 columns (compact tiles), 3 columns on desktop.
// WHEN: Mount at the bottom of every DetailPage above the back link.
// EDIT VISUAL: change ratio in Card.Media below + col counts.
// ═══════════════════════════════════════════════════
//
// HEIGHT DESIGN: previously 3:4 portrait + 3-col grid → ~500px per
// card stacked vertically on mobile = 1500px section. Now 4:3 + 2-col
// mobile = ~200px per card, much lighter scroll cost.

import { useLocale } from '@app/LocaleProvider';
import { Card } from '@components/ui/Card';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import type { SavedModule } from '@hooks/useSavedItems';
import { useTranslation } from 'react-i18next';

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

const NAV_KEY_BY_MODULE: Record<SavedModule, string> = {
  property: 'account.nav.properties',
  timepiece: 'account.nav.timepieces',
  artwork: 'account.nav.artworks',
  event: 'account.nav.events',
  journey: 'account.nav.journeys',
  concierge: 'account.nav.concierge',
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
    <section aria-labelledby="similar-heading" className="space-y-6">
      <SectionHeader title={t('common.similar')} size="sm" as="h2" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {items.map(item => (
          <Card
            key={item.slug}
            to={localePath(ROUTE_BY_MODULE[module] + '/' + item.slug)}
            padding="none"
          >
            <Card.Media src={item.imageSrc} alt={item.imageAlt ?? item.title} ratio="4/3" />
            <Card.Body density="compact">
              <Card.Eyebrow>{t(NAV_KEY_BY_MODULE[module])}</Card.Eyebrow>
              <Card.Title>{item.title}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    </section>
  );
};
