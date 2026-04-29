// ═══════════════════════════════════════════════════
// AdminCatalogue — /:locale/admin/catalogue
// Salvatore's super-admin for all 7 catalogue modules.
// Module tabs at top, DataTable below with edit-on-click + delete +
// "Ajouter" CTA. Form drawer for create/edit.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { DataTable, type DataTableColumn } from '@components/ui/DataTable';
import { SectionHeader } from '@components/ui/SectionHeader';
import { AdminItemDrawer } from '@features/admin/AdminItemDrawer';
import { SCHEMAS } from '@features/admin/schemas';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarDays,
  Compass,
  Frame,
  Newspaper,
  Plus,
  Sparkles,
  Watch,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { type AdminModule, useAdminStore } from '@/store/adminStore';

const TABS: { module: AdminModule; labelKey: string; icon: LucideIcon }[] = [
  { module: 'property', labelKey: 'account.nav.properties', icon: Building2 },
  { module: 'timepiece', labelKey: 'account.nav.timepieces', icon: Watch },
  { module: 'artwork', labelKey: 'account.nav.artworks', icon: Frame },
  { module: 'event', labelKey: 'account.nav.events', icon: CalendarDays },
  { module: 'journey', labelKey: 'account.nav.journeys', icon: Compass },
  { module: 'concierge', labelKey: 'account.nav.concierge', icon: Sparkles },
  { module: 'article', labelKey: 'account.nav.news', icon: Newspaper },
];

const formatCellValue = (value: unknown, locale: string): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') {
    // ISO date detection
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString(locale, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    }
    return value;
  }
  if (typeof value === 'number') return new Intl.NumberFormat(locale).format(value);
  if (typeof value === 'boolean') return value ? '✓' : '—';
  return String(value);
};

export default function AdminCatalogue() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleFromUrl = (searchParams.get('module') ?? 'property') as AdminModule;
  const activeModule: AdminModule = TABS.some(t => t.module === moduleFromUrl)
    ? moduleFromUrl
    : 'property';
  const store = useAdminStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const setActiveModule = (m: AdminModule) => {
    setSearchParams({ module: m });
  };

  const items = store.listItems(activeModule);
  const schema = SCHEMAS[activeModule];

  const openCreate = () => {
    setEditingSlug(null);
    setDrawerOpen(true);
  };

  const openEdit = (slug: string) => {
    setEditingSlug(slug);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingSlug(null);
  };

  const columns: DataTableColumn<Record<string, unknown>>[] = [
    ...schema.tableColumns.map(col => ({
      key: col.key,
      label: t(col.labelKey),
      render: (row: Record<string, unknown>) => (
        <span className="text-fg text-sm">{formatCellValue(row[col.key], i18n.language)}</span>
      ),
    })),
    {
      key: '__actions',
      label: '',
      align: 'right' as const,
      render: () => (
        <span className="text-muted text-xs tracking-widest uppercase">
          {t('admin.editAction')} →
        </span>
      ),
    },
  ];

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.catalogue.title')}
          lede={t('admin.catalogue.lede')}
          size="md"
          as="h1"
        />

        {/* Module tabs */}
        <nav
          aria-label={t('admin.catalogue.tabs')}
          className="border-border flex flex-wrap gap-2 border-b pb-3"
        >
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = tab.module === activeModule;
            return (
              <button
                key={tab.module}
                type="button"
                onClick={() => setActiveModule(tab.module)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-widest uppercase',
                  'duration-base transition-[color,background-color,border-color]',
                  'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  active
                    ? 'bg-fg text-bg border-fg'
                    : 'border-border text-muted hover:text-fg hover:border-fg/40 bg-transparent',
                )}
              >
                <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
                {t(tab.labelKey)}
                <span className="text-[10px] opacity-60">
                  ({store.listItems(tab.module).length})
                </span>
              </button>
            );
          })}
        </nav>

        {/* Header row with count + Add CTA */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-muted text-xs tracking-widest uppercase">
            {t('common.showing', { count: items.length })}
          </p>
          <button
            type="button"
            onClick={openCreate}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
              'duration-base transition-[border-color,background-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
            {t('admin.addItem', { module: t(`admin.modules.${activeModule}`).toLowerCase() })}
          </button>
        </div>

        {/* Items table */}
        <DataTable<Record<string, unknown>>
          rows={items as unknown as Record<string, unknown>[]}
          columns={columns}
          rowKey={r => String(r.slug)}
          emptyLabel={t('admin.empty')}
          onRowClick={r => openEdit(String(r.slug))}
        />

        <AdminItemDrawer
          key={`${activeModule}:${editingSlug ?? 'new'}`}
          open={drawerOpen}
          module={activeModule}
          editingSlug={editingSlug}
          onClose={closeDrawer}
        />
      </div>
    </Container>
  );
}
