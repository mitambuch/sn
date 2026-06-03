// ═══════════════════════════════════════════════════
// AdminSegments — /:locale/admin/segments
//
// WHAT: Manage the audience-segment vocabulary (migration 0018). Create a
//       segment (slug + label + optional note), list every segment with a
//       live member count, delete one. Segments group members so a fiche
//       can later be restricted to one or more of them (fiche audience).
// WHEN: Admin sidebar entry "Segments". RequireRole 'admin'.
// CHANGE FIELDS: edit the create form below; slug format is DB-checked
//       (^[a-z0-9-]{2,40}$) and mirrored client-side in SLUG_RE.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { DataTable, type DataTableColumn } from '@components/ui/DataTable';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { SegmentCreateForm } from '@features/admin/SegmentCreateForm';
import { useSegments } from '@hooks/useSegments';
import { useToast } from '@hooks/useToast';
import { useUsersAdmin } from '@hooks/useUsersAdmin';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { Segment } from '@/types/segment';

export default function AdminSegments() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { segments, loading, create, remove } = useSegments();
  const { rows: members } = useUsersAdmin();

  // member count per slug, computed once per members change
  const countBySlug = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of members) {
      for (const s of m.segments ?? []) map.set(s, (map.get(s) ?? 0) + 1);
    }
    return map;
  }, [members]);

  const handleDelete = async (seg: Segment) => {
    const confirmed = window.confirm(t('admin.segments.confirmDelete', { label: seg.label }));
    if (!confirmed) return;
    const result = await remove(seg.id);
    if (!result.ok) {
      toast({ variant: 'error', message: result.error ?? t('common.error') });
      return;
    }
    toast({ variant: 'success', message: t('admin.segments.deleted') });
  };

  const columns: DataTableColumn<Segment>[] = [
    {
      key: 'label',
      label: t('admin.segments.nameColumn'),
      render: r => (
        <div className="flex flex-col gap-0.5">
          <span className="text-fg">{r.label}</span>
          {r.description ? <span className="text-muted text-xs">{r.description}</span> : null}
        </div>
      ),
    },
    {
      key: 'slug',
      label: t('admin.segments.slugColumn'),
      render: r => <code className="text-muted font-mono text-xs">{r.slug}</code>,
    },
    {
      key: 'members',
      label: t('admin.segments.membersColumn'),
      render: r => (
        <span className="text-muted text-sm">
          {t('admin.segments.membersCount', { count: countBySlug.get(r.slug) ?? 0 })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: t('admin.users.actions'),
      align: 'right',
      render: r => (
        <button
          type="button"
          onClick={() => {
            void handleDelete(r);
          }}
          title={t('admin.segments.delete')}
          className="border-border text-muted hover:text-danger-text hover:border-danger/40 focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none"
        >
          <Trash2 size={12} strokeWidth={1.5} aria-hidden="true" />
          {t('admin.segments.delete')}
        </button>
      ),
    },
  ];

  return (
    <Container size="xl">
      <div className="space-y-10 py-10 md:space-y-12 md:py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.segments.title')}
          lede={t('admin.segments.lede')}
          size="md"
          as="h1"
        />

        <SegmentCreateForm
          onCreate={create}
          onError={message => {
            toast({ variant: 'error', message });
          }}
          onSuccess={label => {
            toast({ variant: 'success', message: t('admin.segments.created', { label }) });
          }}
        />

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="sm" aria-label={t('common.loading')} />
          </div>
        ) : (
          <DataTable
            rows={[...segments]}
            columns={columns}
            rowKey={r => r.id}
            emptyLabel={t('admin.segments.empty')}
          />
        )}
      </div>
    </Container>
  );
}
