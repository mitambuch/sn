// ═══════════════════════════════════════════════════
// AdminUsers — /:locale/admin/users
//
// WHAT: Member directory + role management. 3 tabs (all / members /
//       admins) + search by name/email + per-row promote/demote action.
//       Role updates go through Supabase via the "profiles: admin
//       update all" RLS policy (migration 0002). Optimistic local
//       state with rollback on remote failure.
// WHEN: Admin sidebar entry "Utilisateurs". RequireRole 'admin'.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { Badge } from '@components/ui/Badge';
import { DataTable, type DataTableColumn } from '@components/ui/DataTable';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { Stat } from '@components/ui/Stat';
import { useAuth } from '@context/AuthContext';
import { UserDetailDrawer } from '@features/admin/UserDetailDrawer';
import { useSegments } from '@hooks/useSegments';
import { useUsersAdmin } from '@hooks/useUsersAdmin';
import { cn } from '@utils/cn';
import type { TFunction } from 'i18next';
import { Tags } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { User } from '@/types/auth';

type RoleFilter = 'all' | 'client' | 'admin';

const TABS: { key: RoleFilter; labelKey: string }[] = [
  { key: 'all', labelKey: 'admin.users.tabs.all' },
  { key: 'client', labelKey: 'admin.users.tabs.members' },
  { key: 'admin', labelKey: 'admin.users.tabs.admins' },
];

interface ColumnsCtx {
  t: TFunction;
  lang: string;
  segmentLabel: (slug: string) => string;
}

// Read-only columns — clicking a row opens the management drawer (edit name/
// phone, segments, suspend/delete/promote). No inline action buttons.
function buildColumns({ t, lang, segmentLabel }: ColumnsCtx): DataTableColumn<User>[] {
  return [
    {
      key: 'fullName',
      label: t('common.fullName'),
      render: r => (
        <div className="flex flex-col gap-0.5">
          <span className="text-fg flex items-center gap-2">
            {r.fullName || '—'}
            {r.blocked && (
              <Badge variant="danger" size="sm">
                {t('admin.users.suspendedBadge')}
              </Badge>
            )}
          </span>
          <span className="text-muted text-xs">{r.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      label: t('admin.users.roleLabel'),
      render: r => (
        <span
          className={cn(
            'border-border inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs tracking-widest uppercase',
            r.role === 'admin' ? 'text-fg bg-fg/5' : 'text-muted',
          )}
        >
          <span
            className={cn('h-1.5 w-1.5 rounded-full', r.role === 'admin' ? 'bg-fg' : 'bg-muted')}
            aria-hidden="true"
          />
          {t(`admin.users.roles.${r.role}`)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: t('admin.invitations.createdAt'),
      render: r => (
        <span className="text-muted text-sm">{new Date(r.createdAt).toLocaleDateString(lang)}</span>
      ),
    },
    {
      key: 'segments',
      label: t('admin.users.segmentsColumn'),
      render: r => {
        const slugs = r.segments ?? [];
        return slugs.length === 0 ? (
          <span className="text-muted/60 inline-flex items-center gap-1.5 text-xs">
            <Tags size={12} strokeWidth={1.5} aria-hidden="true" />
            {t('admin.users.noSegments')}
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {slugs.map(slug => (
              <Badge key={slug} size="sm">
                {segmentLabel(slug)}
              </Badge>
            ))}
          </div>
        );
      },
    },
  ];
}

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const { user: currentUser } = useAuth();
  const { rows, loading, updateRole, updateSegments, updateBlocked, updateProfile, removeUser } =
    useUsersAdmin();
  const { segments } = useSegments();
  const [activeTab, setActiveTab] = useState<RoleFilter>('all');
  const [search, setSearch] = useState('');
  // member whose management drawer is open (null = closed)
  const [editing, setEditing] = useState<User | null>(null);

  const segmentLabel = useMemo(() => {
    const map = new Map(segments.map(s => [s.slug, s.label]));
    return (slug: string) => map.get(slug) ?? slug;
  }, [segments]);

  const adminCount = rows.filter(u => u.role === 'admin').length;
  const memberCount = rows.filter(u => u.role === 'client').length;

  const counts: Record<RoleFilter, number> = {
    all: rows.length,
    client: memberCount,
    admin: adminCount,
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(u => {
      if (activeTab !== 'all' && u.role !== activeTab) return false;
      if (q === '') return true;
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [rows, activeTab, search]);

  const columns = buildColumns({ t, lang: i18n.language, segmentLabel });

  return (
    <Container size="xl">
      <div className="space-y-10 py-10 md:space-y-12 md:py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.users.title')}
          lede={t('admin.users.lede')}
          size="md"
          as="h1"
        />

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          <Stat label={t('admin.users.tabs.all')} value={String(rows.length)} />
          <Stat label={t('admin.users.tabs.members')} value={String(memberCount)} />
          <Stat label={t('admin.users.tabs.admins')} value={String(adminCount)} />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <nav aria-label={t('admin.users.tabs.label')} className="flex gap-2">
            {TABS.map(tab => {
              const active = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                  }}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-widest uppercase',
                    'duration-base transition-[color,background-color,border-color]',
                    'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
                    active
                      ? 'bg-fg text-bg border-fg'
                      : 'border-border text-muted hover:text-fg hover:border-fg/40',
                  )}
                >
                  {t(tab.labelKey)}
                  <span className="text-[10px] opacity-60">({counts[tab.key]})</span>
                </button>
              );
            })}
          </nav>
          <input
            type="search"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
            }}
            placeholder={t('admin.users.searchPlaceholder')}
            className="border-border bg-bg/60 text-fg placeholder:text-muted/60 focus:border-accent focus:ring-accent w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none md:w-72"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="sm" aria-label={t('common.loading')} />
          </div>
        ) : (
          <DataTable
            rows={filtered}
            columns={columns}
            rowKey={r => r.id}
            emptyLabel={t('common.empty')}
            onRowClick={setEditing}
          />
        )}
      </div>

      <UserDetailDrawer
        member={editing}
        segments={segments}
        currentUserId={currentUser?.id}
        onClose={() => {
          setEditing(null);
        }}
        actions={{ updateProfile, updateSegments, updateBlocked, updateRole, removeUser }}
      />
    </Container>
  );
}
