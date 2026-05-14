// ═══════════════════════════════════════════════════
// AdminUsers — /:locale/admin/users
// Members table (excludes operator/admin accounts).
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { DataTable, type DataTableColumn } from '@components/ui/DataTable';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { useUsersAdmin } from '@hooks/useUsersAdmin';
import { useTranslation } from 'react-i18next';

import type { User } from '@/types/auth';

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const { rows, loading } = useUsersAdmin();
  const members = rows.filter(u => u.role === 'client');

  const columns: DataTableColumn<User>[] = [
    {
      key: 'fullName',
      label: t('common.fullName'),
      render: r => <span className="text-fg">{r.fullName}</span>,
    },
    {
      key: 'email',
      label: t('auth.email'),
      render: r => <span className="text-muted text-sm">{r.email}</span>,
    },
    {
      key: 'locale',
      label: t('account.preferences.locale'),
      render: r => <span className="text-muted text-xs tracking-widest uppercase">{r.locale}</span>,
    },
    {
      key: 'contact',
      label: t('account.preferences.contactPreference'),
      render: r => (
        <span className="text-muted text-xs tracking-widest uppercase">
          {t(`account.preferences.contact.${r.contactPreference}`)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: t('admin.invitations.createdAt'),
      align: 'right',
      render: r => (
        <span className="text-muted text-sm">
          {new Date(r.createdAt).toLocaleDateString(i18n.language)}
        </span>
      ),
    },
  ];

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.users.title')}
          size="md"
          as="h1"
        />
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="sm" aria-label={t('common.loading')} />
          </div>
        ) : (
          <DataTable
            rows={members}
            columns={columns}
            rowKey={r => r.id}
            emptyLabel={t('common.empty')}
          />
        )}
      </div>
    </Container>
  );
}
