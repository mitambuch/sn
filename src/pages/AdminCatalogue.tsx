// ═══════════════════════════════════════════════════
// AdminCatalogue — /:locale/admin/catalogue
//
// WHAT: Monitoring hub for all 7 catalogue collections. Pulls every
//       document from Sanity (events / properties / timepieces /
//       artworks / journeys / concierge / articles) via a single GROQ
//       query, displays them as cards grouped by module tab, with
//       thumbnails + status + a deep link "Modifier dans Sanity" that
//       opens the matching doc right in sawnext-studio.sanity.studio.
//       Header CTA "Créer une fiche" deep-links to the same Studio,
//       on the active module's list, so Salva clicks New there.
// WHEN: /admin/catalogue route. The form-based create/edit drawer of
//       the previous iteration was removed — Sanity Studio is the
//       authoring tool, the site admin is for monitoring only.
// CHANGE STUDIO URL: edit STUDIO_BASE_URL below if the Studio host
//       changes (post `pnpm studio:deploy` with a new hostname).
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { Stat } from '@components/ui/Stat';
import { type AudienceFicheRef, FicheAudienceModal } from '@features/admin/FicheAudienceModal';
import {
  type CatalogueModule,
  type CatalogueRow,
  useAdminCatalogue,
} from '@hooks/useAdminCatalogue';
import { useSegments } from '@hooks/useSegments';
import { useToast } from '@hooks/useToast';
import { useUsersAdmin } from '@hooks/useUsersAdmin';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Compass,
  ExternalLink,
  Frame,
  Newspaper,
  Plus,
  Sparkles,
  Users,
  Watch,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const STUDIO_BASE_URL = 'https://sawnext-studio.sanity.studio';

interface ModuleTab {
  module: CatalogueModule;
  labelKey: string;
  icon: LucideIcon;
  /** Sanity desk listItem id (see studio/structure/deskStructure.ts). */
  deskId: string;
}

const TABS: ModuleTab[] = [
  {
    module: 'event',
    labelKey: 'account.nav.events',
    icon: CalendarDays,
    deskId: 'collection-event',
  },
  {
    module: 'property',
    labelKey: 'account.nav.properties',
    icon: Building2,
    deskId: 'collection-property',
  },
  {
    module: 'timepiece',
    labelKey: 'account.nav.timepieces',
    icon: Watch,
    deskId: 'collection-timepiece',
  },
  {
    module: 'artwork',
    labelKey: 'account.nav.artworks',
    icon: Frame,
    deskId: 'collection-artwork',
  },
  {
    module: 'journey',
    labelKey: 'account.nav.journeys',
    icon: Compass,
    deskId: 'collection-journey',
  },
  {
    module: 'conciergeService',
    labelKey: 'account.nav.concierge',
    icon: Sparkles,
    deskId: 'collection-conciergeService',
  },
  {
    module: 'article',
    labelKey: 'account.nav.news',
    icon: Newspaper,
    deskId: 'collection-article',
  },
];

function studioEditUrl(deskId: string, docId: string): string {
  return `${STUDIO_BASE_URL}/structure/${deskId};${docId}`;
}

function studioCreateUrl(deskId: string): string {
  return `${STUDIO_BASE_URL}/structure/${deskId}`;
}

const VISIBILITY_LABEL: Record<string, string> = {
  public: 'Public',
  shareCode: 'Code partagé',
  private: 'Privé',
};

function CatalogueCard({
  row,
  deskId,
  onAudience,
}: {
  row: CatalogueRow;
  deskId: string;
  onAudience: (row: CatalogueRow) => void;
}) {
  const { t } = useTranslation();
  const visLabel = row.visibility ? (VISIBILITY_LABEL[row.visibility] ?? row.visibility) : '—';
  return (
    <div
      className={cn(
        'group border-border bg-surface/40 hover:border-fg/30',
        'flex flex-col gap-3 rounded-lg border p-3 transition-[border-color,background-color] duration-200',
      )}
    >
      <a
        href={studioEditUrl(deskId, row.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-visible:ring-accent flex flex-col gap-3 rounded-md focus-visible:ring-2 focus-visible:outline-none"
      >
        <div className="bg-bg/40 relative aspect-4/3 w-full overflow-hidden rounded-md">
          {row.thumbnail ? (
            <img src={row.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="text-muted/40 flex h-full items-center justify-center font-mono text-[10px] tracking-widest uppercase">
              Pas d'image
            </div>
          )}
          <span className="bg-bg/80 absolute top-2 left-2 rounded-full px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase backdrop-blur-sm">
            {visLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-fg line-clamp-2 text-sm leading-tight font-medium">{row.title}</h3>
          <p className="text-muted truncate font-mono text-[10px] tracking-widest uppercase">
            {row.slug || row.id}
          </p>
        </div>
      </a>
      <div className="border-border flex items-center justify-between gap-2 border-t pt-2.5">
        <button
          type="button"
          onClick={() => {
            onAudience(row);
          }}
          className="text-muted hover:text-fg focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none"
        >
          <Users size={12} strokeWidth={1.5} aria-hidden="true" />
          {t('admin.catalogue.audience.button')}
        </button>
        <a
          href={studioEditUrl(deskId, row.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-fg inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase"
        >
          Modifier
          <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function ModuleTabs({
  activeModule,
  countsByModule,
  onSelect,
}: {
  activeModule: CatalogueModule;
  countsByModule: Record<CatalogueModule, number>;
  onSelect: (module: CatalogueModule) => void;
}) {
  const { t } = useTranslation();
  return (
    <nav
      aria-label="Modules du catalogue"
      className="border-border -mx-4 flex gap-2 overflow-x-auto border-b px-4 pb-3 md:mx-0 md:flex-wrap md:px-0"
    >
      {TABS.map(tab => {
        const Icon = tab.icon;
        const active = tab.module === activeModule;
        return (
          <button
            key={tab.module}
            type="button"
            onClick={() => {
              onSelect(tab.module);
            }}
            aria-pressed={active}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] tracking-widest whitespace-nowrap uppercase',
              'duration-base transition-[color,background-color,border-color]',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              active
                ? 'bg-fg text-bg border-fg'
                : 'border-border text-muted hover:text-fg hover:border-fg/40',
            )}
          >
            <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
            {t(tab.labelKey)}
            <span className="text-[10px] opacity-60">({countsByModule[tab.module]})</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function AdminCatalogue() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleFromUrl = (searchParams.get('module') ?? 'event') as CatalogueModule;
  const activeModule = TABS.some(t => t.module === moduleFromUrl) ? moduleFromUrl : 'event';
  const activeTab = TABS.find(t => t.module === activeModule) ?? TABS[0]!;
  const { rows, loading, error, usingFallback } = useAdminCatalogue();
  const { segments } = useSegments();
  const { rows: members } = useUsersAdmin();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFiche, setAudienceFiche] = useState<AudienceFicheRef | null>(null);

  const filtered = rows.filter(r => {
    if (r.type !== activeModule) return false;
    if (searchTerm.trim() === '') return true;
    const q = searchTerm.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q);
  });

  const countsByModule = TABS.reduce<Record<CatalogueModule, number>>(
    (acc, tab) => {
      acc[tab.module] = rows.filter(r => r.type === tab.module).length;
      return acc;
    },
    {} as Record<CatalogueModule, number>,
  );

  const stats = {
    total: rows.length,
    public: rows.filter(r => r.visibility === 'public').length,
    shareCode: rows.filter(r => r.visibility === 'shareCode').length,
    private: rows.filter(r => r.visibility === 'private').length,
  };

  return (
    <Container size="xl">
      <div className="space-y-10 py-10 md:space-y-12 md:py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.catalogue.title')}
          lede={t('admin.catalogue.ledeStudio')}
          size="md"
          as="h1"
        />

        {/* Stats — totals by visibility */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={t('admin.catalogue.statsTotal')} value={String(stats.total)} />
          <Stat label={t('admin.catalogue.statsPublic')} value={String(stats.public)} />
          <Stat label={t('admin.catalogue.statsShareCode')} value={String(stats.shareCode)} />
          <Stat label={t('admin.catalogue.statsPrivate')} value={String(stats.private)} />
        </div>

        {/* Module tabs — scrollable on mobile */}
        <ModuleTabs
          activeModule={activeModule}
          countsByModule={countsByModule}
          onSelect={module => {
            setSearchParams({ module });
            setSearchTerm('');
          }}
        />

        {usingFallback && (
          <p className="border-border bg-surface/40 text-muted rounded-md border px-3 py-2 font-mono text-[10px] tracking-widest uppercase">
            {t('admin.catalogue.fallbackNotice')}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="border-danger/30 bg-danger/5 text-danger rounded-md border px-3 py-2 text-sm"
          >
            {error}
          </p>
        )}

        {/* Search + Create CTA */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
            placeholder={`Chercher dans ${t(activeTab.labelKey).toLowerCase()}…`}
            className="border-border bg-bg/60 text-fg placeholder:text-muted/60 focus:border-accent focus:ring-accent flex-1 rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
          />
          <a
            href={studioCreateUrl(activeTab.deskId)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-5 py-2.5 font-mono text-xs tracking-widest whitespace-nowrap uppercase',
              'duration-base transition-[border-color,background-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
            Créer dans Sanity
            <ExternalLink size={12} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="sm" aria-label="Chargement" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-border bg-surface/30 rounded-lg border px-6 py-12 text-center">
            <p className="text-muted text-sm">
              {searchTerm ? 'Aucun résultat pour cette recherche.' : 'Aucune fiche dans ce module.'}
            </p>
            <a
              href={studioCreateUrl(activeTab.deskId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-fg/80 mt-3 inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
            >
              <Plus size={12} strokeWidth={1.5} aria-hidden="true" />
              Créer la première
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map(row => (
              <CatalogueCard
                key={row.id}
                row={row}
                deskId={activeTab.deskId}
                onAudience={r => {
                  setAudienceFiche({ id: r.id, type: r.type, title: r.title });
                }}
              />
            ))}
          </div>
        )}
      </div>

      <FicheAudienceModal
        fiche={audienceFiche}
        segments={segments}
        members={members}
        onClose={() => {
          setAudienceFiche(null);
        }}
        onResult={result => {
          if (!result.ok) {
            toast({ variant: 'error', message: result.error ?? t('common.error') });
            return;
          }
          toast({ variant: 'success', message: t('admin.catalogue.audience.saved') });
        }}
      />
    </Container>
  );
}
