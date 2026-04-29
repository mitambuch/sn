// ═══════════════════════════════════════════════════
// AdminInvitations — /:locale/admin/invitations
// Table of all invitation codes + Generate-code stub button.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { DataTable, type DataTableColumn } from '@components/ui/DataTable';
import { SectionHeader } from '@components/ui/SectionHeader';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { listInvitations } from '@/mocks';
import { INVITATION_CODE_PREFIX, type InvitationCode } from '@/types/invitation';

export default function AdminInvitations() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [rows, setRows] = useState<InvitationCode[]>(() => listInvitations());

  const formatCode = (canonical: string) =>
    `${INVITATION_CODE_PREFIX}${canonical.slice(0, 4)}-${canonical.slice(4, 8)}`;

  const handleCopy = (canonical: string) => {
    void navigator.clipboard.writeText(formatCode(canonical));
    toast({ variant: 'success', message: t('admin.invitations.copied') });
  };

  const handleGenerate = () => {
    const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const next = Array.from(
      { length: 8 },
      () => alphabet[Math.floor(Math.random() * alphabet.length)],
    ).join('');
    const newCode: InvitationCode = {
      id: `inv-${String(Date.now())}`,
      code: next,
      status: 'unused',
      createdAt: new Date().toISOString(),
      redeemedAt: null,
      redeemedBy: null,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'usr-op-salva',
    };
    setRows(prev => [newCode, ...prev]);
    toast({ variant: 'success', message: t('admin.invitations.generated') });
  };

  const columns: DataTableColumn<InvitationCode>[] = [
    {
      key: 'code',
      label: t('admin.invitations.code'),
      render: r => <span className="text-fg font-mono">{formatCode(r.code)}</span>,
    },
    {
      key: 'status',
      label: t('admin.invitations.status'),
      render: r => (
        <span className="text-muted text-xs tracking-widest uppercase">
          {t(`admin.invitations.statusValues.${r.status}`)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: t('admin.invitations.createdAt'),
      render: r => (
        <span className="text-muted text-sm">
          {new Date(r.createdAt).toLocaleDateString(i18n.language)}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      label: t('admin.invitations.expiresAt'),
      render: r =>
        r.expiresAt ? (
          <span className="text-muted text-sm">
            {new Date(r.expiresAt).toLocaleDateString(i18n.language)}
          </span>
        ) : (
          <span className="text-muted text-xs">—</span>
        ),
    },
    {
      key: 'copy',
      label: '',
      align: 'right',
      render: r => (
        <button
          type="button"
          onClick={() => handleCopy(r.code)}
          disabled={r.status !== 'unused'}
          className="text-muted hover:text-fg text-xs tracking-widest uppercase disabled:opacity-40"
        >
          {t('admin.invitations.copy')}
        </button>
      ),
    },
  ];

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow={t('admin.eyebrow')}
            title={t('admin.invitations.title')}
            size="md"
            as="h1"
          />
          <button
            type="button"
            onClick={handleGenerate}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
              'duration-base transition-[border-color,background-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            {t('admin.invitations.generate')}
            <span aria-hidden="true">+</span>
          </button>
        </div>

        <DataTable
          rows={rows}
          columns={columns}
          rowKey={r => r.id}
          emptyLabel={t('common.empty')}
        />
      </div>
    </Container>
  );
}
