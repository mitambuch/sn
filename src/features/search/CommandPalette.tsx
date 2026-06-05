// ═══════════════════════════════════════════════════
// CommandPalette — Cmd+K / Ctrl+K omnibox search
//
// WHAT: Modal overlay (top-third of viewport) with a search input and a
//       grouped results list across the 7 indexable surfaces (Properties,
//       Timepieces, Artworks, Events, Journeys, Concierge services,
//       News articles). Keyboard arrow navigation + Enter to open + Esc
//       to close. Recent items shown as defaults when query is empty.
// WHEN: Mounted once in AppLayout — opens via Cmd+K (Mac), Ctrl+K
//       (others) or click on the small "K" button in the header.
// REPLACE LATER: lot C swaps the in-memory index for a Supabase fts query.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Kbd } from '@components/ui/Kbd';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarDays,
  Compass,
  CornerDownLeft,
  Frame,
  Newspaper,
  Search,
  Sparkles,
  Watch,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  listArticles,
  listArtworks,
  listConciergeServices,
  listEvents,
  listJourneys,
  listProperties,
  listTimepieces,
} from '@/mocks';

type Group = 'property' | 'timepiece' | 'artwork' | 'event' | 'journey' | 'concierge' | 'article';

interface IndexEntry {
  group: Group;
  title: string;
  subtitle: string;
  href: string;
  search: string;
}

const GROUP_ICON: Record<Group, LucideIcon> = {
  property: Building2,
  timepiece: Watch,
  artwork: Frame,
  event: CalendarDays,
  journey: Compass,
  concierge: Sparkles,
  article: Newspaper,
};

const GROUP_LABEL_KEY: Record<Group, string> = {
  property: 'account.nav.properties',
  timepiece: 'account.nav.timepieces',
  artwork: 'account.nav.artworks',
  event: 'account.nav.events',
  journey: 'account.nav.journeys',
  concierge: 'account.nav.concierge',
  article: 'account.nav.news',
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ open, onClose }: CommandPaletteProps) => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  // Build index once per render — it's tiny (mocks, ~50 entries).
  const index = useMemo<IndexEntry[]>(() => {
    const entries: IndexEntry[] = [];
    listProperties().forEach(p =>
      entries.push({
        group: 'property',
        title: p.title,
        subtitle: `${p.region} · ${String(p.surfaceSqm)} m²`,
        href: localePath(ROUTES.ACCOUNT_PROPERTIES + '/' + p.slug),
        search: `${p.title} ${p.region} ${p.kind}`.toLowerCase(),
      }),
    );
    listTimepieces().forEach(tp =>
      entries.push({
        group: 'timepiece',
        title: `${tp.brand} ${tp.model}`,
        subtitle: `${tp.reference} · ${String(tp.year)}`,
        href: localePath(ROUTES.ACCOUNT_TIMEPIECES + '/' + tp.slug),
        search: `${tp.brand} ${tp.model} ${tp.reference}`.toLowerCase(),
      }),
    );
    listArtworks().forEach(a =>
      entries.push({
        group: 'artwork',
        title: `${a.artistName} — ${a.title}`,
        subtitle: `${a.medium.replace(/-/g, ' ')} · ${String(a.year)}`,
        href: localePath(ROUTES.ACCOUNT_ARTWORKS + '/' + a.slug),
        search: `${a.artistName} ${a.title} ${a.medium}`.toLowerCase(),
      }),
    );
    listEvents().forEach(e =>
      entries.push({
        group: 'event',
        title: e.title,
        subtitle: `${e.city} · ${e.venue}`,
        href: localePath(ROUTES.ACCOUNT_EVENTS + '/' + e.slug),
        search: `${e.title} ${e.city} ${e.venue} ${e.category}`.toLowerCase(),
      }),
    );
    listJourneys().forEach(j => {
      const dest = Array.isArray(j.destinations) ? j.destinations.join(' · ') : j.destinations;
      entries.push({
        group: 'journey',
        title: j.title,
        subtitle: dest,
        href: localePath(ROUTES.ACCOUNT_JOURNEYS + '/' + j.slug),
        search: `${j.title} ${dest} ${j.kind}`.toLowerCase(),
      });
    });
    listConciergeServices().forEach(c =>
      entries.push({
        group: 'concierge',
        title: c.title,
        subtitle: c.summary,
        href: localePath(ROUTES.ACCOUNT_CONCIERGE + '/' + c.slug),
        search: `${c.title} ${c.summary} ${c.category}`.toLowerCase(),
      }),
    );
    listArticles().forEach(art =>
      entries.push({
        group: 'article',
        title: art.title,
        subtitle: art.excerpt,
        href: localePath(ROUTES.ACCOUNT_NEWS + '/' + art.slug),
        search: `${art.title} ${art.excerpt} ${art.kind}`.toLowerCase(),
      }),
    );
    return entries;
  }, [localePath]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return index.slice(0, 8);
    return index.filter(e => e.search.includes(q)).slice(0, 24);
  }, [index, query]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        const target = filtered[activeIndex];
        if (target) {
          onClose();
          void navigate(target.href);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, filtered, activeIndex, navigate]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('search.label')}
      className="fixed inset-0 z-(--z-modal) flex items-start justify-center px-4 pt-24 md:pt-32"
    >
      <button
        type="button"
        aria-label={t('common.close')}
        onClick={onClose}
        className="bg-bg/85 absolute inset-0 backdrop-blur-md"
      />
      <div
        className={cn(
          'border-border bg-bg relative w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl',
          'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200',
        )}
      >
        {/* Input */}
        <div className="border-border flex items-center gap-3 border-b px-5 py-4">
          <Search size={18} strokeWidth={1.5} aria-hidden="true" className="text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={t('search.placeholder')}
            className="text-fg placeholder:text-muted/60 flex-1 bg-transparent text-base focus:outline-none"
            aria-label={t('search.label')}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('common.close')}
              className="text-muted hover:text-fg duration-base transition-colors"
            >
              <X size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Results */}
        <ul className="max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="text-muted px-5 py-12 text-center text-sm">{t('search.empty')}</li>
          ) : (
            filtered.map((entry, i) => {
              const Icon = GROUP_ICON[entry.group];
              const active = i === activeIndex;
              return (
                <li key={entry.href}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      onClose();
                      void navigate(entry.href);
                    }}
                    className={cn(
                      'flex w-full items-center gap-4 px-5 py-3 text-left',
                      active ? 'bg-surface' : 'hover:bg-surface/60',
                      'duration-base transition-colors',
                    )}
                  >
                    <span
                      className={cn(
                        'border-border bg-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                        active ? 'text-fg' : 'text-muted',
                      )}
                    >
                      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-fg truncate text-sm font-medium">{entry.title}</span>
                      <span className="text-muted truncate text-xs">
                        {t(GROUP_LABEL_KEY[entry.group])} · {entry.subtitle}
                      </span>
                    </div>
                    {active && (
                      <CornerDownLeft
                        size={14}
                        strokeWidth={1.5}
                        className="text-muted"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer hint */}
        <footer className="border-border text-muted flex items-center justify-between gap-4 border-t px-5 py-3 text-xs tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>{t('search.navigate')}</span>
          </span>
          <span className="flex items-center gap-2">
            <Kbd>↵</Kbd>
            <span>{t('search.open')}</span>
          </span>
          <span className="flex items-center gap-2">
            <Kbd>Esc</Kbd>
            <span>{t('common.close')}</span>
          </span>
        </footer>
      </div>
    </div>
  );
};
