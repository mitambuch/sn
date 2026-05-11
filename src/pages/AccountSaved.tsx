// ═══════════════════════════════════════════════════
// AccountSaved — /:locale/account/saved
//
// WHAT: "Ma collection" — every catalogue item the member has hearted,
//       rendered through the unified Card atom (Apple-closed surface)
//       so the saved view reads coherent with the rest of the catalogue.
//       Empty state nudges towards browsing.
// WHEN: Sidebar entry "Ma collection".
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { SectionHeader } from '@components/ui/SectionHeader';
import { ROUTES } from '@constants/routes';
import { type SavedModule, useSavedItems } from '@hooks/useSavedItems';
import { cn } from '@utils/cn';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  getArtwork,
  getConciergeService,
  getEvent,
  getJourney,
  getProperty,
  getTimepiece,
} from '@/mocks';

interface SimpleImage {
  src: string;
  alt: string;
}

type ResolvedItem = {
  module: SavedModule;
  slug: string;
  title: string;
  image?: SimpleImage;
  href: string;
};

const MODULE_LABEL: Record<SavedModule, string> = {
  property: 'account.nav.properties',
  timepiece: 'account.nav.timepieces',
  artwork: 'account.nav.artworks',
  event: 'account.nav.events',
  journey: 'account.nav.journeys',
  concierge: 'account.nav.concierge',
};

const MODULE_ROUTE: Record<SavedModule, string> = {
  property: ROUTES.ACCOUNT_PROPERTIES,
  timepiece: ROUTES.ACCOUNT_TIMEPIECES,
  artwork: ROUTES.ACCOUNT_ARTWORKS,
  event: ROUTES.ACCOUNT_EVENTS,
  journey: ROUTES.ACCOUNT_JOURNEYS,
  concierge: ROUTES.ACCOUNT_CONCIERGE,
};

function resolve(module: SavedModule, slug: string): { title: string; image?: SimpleImage } | null {
  const wrap = (title: string, image: SimpleImage | undefined) =>
    image ? { title, image } : { title };
  switch (module) {
    case 'property': {
      const p = getProperty(slug);
      return p ? wrap(p.title, p.images[0]) : null;
    }
    case 'timepiece': {
      const t = getTimepiece(slug);
      return t ? wrap(`${t.brand} ${t.model}`, t.images[0]) : null;
    }
    case 'artwork': {
      const a = getArtwork(slug);
      return a ? wrap(`${a.artistName} — ${a.title}`, a.images[0]) : null;
    }
    case 'event': {
      const e = getEvent(slug);
      return e ? wrap(e.title, e.images[0]) : null;
    }
    case 'journey': {
      const j = getJourney(slug);
      return j ? wrap(j.title, j.images[0]) : null;
    }
    case 'concierge': {
      const c = getConciergeService(slug);
      return c ? wrap(c.title, c.images[0]) : null;
    }
  }
}

export default function AccountSaved() {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const { items } = useSavedItems();

  const resolved: ResolvedItem[] = items
    .map(({ module, slug }) => {
      const r = resolve(module, slug);
      if (!r) return null;
      return {
        module,
        slug,
        href: localePath(MODULE_ROUTE[module] + '/' + slug),
        ...r,
      };
    })
    .filter((v): v is ResolvedItem => v !== null);

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('saved.title')}
          lede={t('saved.lede')}
          size="md"
          as="h1"
        />

        {resolved.length === 0 ? (
          <Card padding="none">
            <div className="flex flex-col items-center gap-6 px-6 py-20 text-center sm:px-8">
              <span className="border-border bg-bg text-muted flex h-16 w-16 items-center justify-center rounded-full border">
                <Heart size={28} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div className="flex max-w-md flex-col gap-2">
                <h2 className="text-fg text-xl font-light">{t('saved.emptyTitle')}</h2>
                <p className="text-muted text-sm leading-relaxed">{t('saved.emptyLede')}</p>
              </div>
              <Link
                to={localePath(ROUTES.ACCOUNT)}
                className={cn(
                  'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                  'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                  'duration-base transition-[border-color,background-color]',
                  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                )}
              >
                {t('saved.emptyCta')}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {resolved.map(item => (
              <div key={`${item.module}:${item.slug}`} className="h-full *:h-full">
                <Card to={item.href} padding="none">
                  <Card.Media
                    src={item.image?.src}
                    alt={item.image?.alt ?? item.title}
                    ratio="4/3"
                  />
                  <Card.Body>
                    <Card.Eyebrow>{t(MODULE_LABEL[item.module])}</Card.Eyebrow>
                    <Card.Title>{item.title}</Card.Title>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
