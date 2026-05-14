// ═══════════════════════════════════════════════════
// AdminInvitations — /:locale/admin/invitations
//
// WHAT: Live admin table of every invitation_code row. Generate inserts
//       a fresh 8-char code in Supabase. Revoke flips the status. Copy
//       puts the SAW-XXXX-XXXX display form on the clipboard. When the
//       backend isn't wired the page falls back to the mock dataset and
//       all actions become local-state only — see useInvitationsAdmin.
// WHEN: Admin sidebar entry "Invitations".
// EDIT COPY: src/locales/{fr,en}.json under admin.invitations.*
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { DataTable, type DataTableColumn } from '@components/ui/DataTable';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { useInvitationsAdmin } from '@hooks/useInvitationsAdmin';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import type { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { INVITATION_CODE_PREFIX, type InvitationCode } from '@/types/invitation';

const formatCode = (canonical: string) =>
  `${INVITATION_CODE_PREFIX}${canonical.slice(0, 4)}-${canonical.slice(4, 8)}`;

interface ColumnsCtx {
  t: TFunction;
  language: string;
  busy: string | null;
  onCopy: (canonical: string) => void;
  onRevoke: (id: string) => void;
}

function buildColumns(ctx: ColumnsCtx): DataTableColumn<InvitationCode>[] {
  const { t, language, busy, onCopy, onRevoke } = ctx;
  return [
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
          {new Date(r.createdAt).toLocaleDateString(language)}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      label: t('admin.invitations.expiresAt'),
      render: r =>
        r.expiresAt ? (
          <span className="text-muted text-sm">
            {new Date(r.expiresAt).toLocaleDateString(language)}
          </span>
        ) : (
          <span className="text-muted text-xs">—</span>
        ),
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: r => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              onCopy(r.code);
            }}
            disabled={r.status !== 'unused'}
            className="text-muted hover:text-fg text-xs tracking-widest uppercase disabled:opacity-40"
          >
            {t('admin.invitations.copy')}
          </button>
          {r.status === 'unused' && (
            <button
              type="button"
              onClick={() => {
                onRevoke(r.id);
              }}
              disabled={busy === r.id}
              className="text-danger hover:text-danger/80 text-xs tracking-widest uppercase disabled:opacity-40"
            >
              {busy === r.id ? t('common.loading') : t('admin.invitations.revoke')}
            </button>
          )}
        </div>
      ),
    },
  ];
}

export default function AdminInvitations() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { rows, loading, error, usingFallback, generate, revoke } = useInvitationsAdmin();
  const [busy, setBusy] = useState<string | null>(null);

  const handleCopy = (canonical: string) => {
    void navigator.clipboard.writeText(formatCode(canonical));
    toast({ variant: 'success', message: t('admin.invitations.copied') });
  };

  const handleGenerate = async () => {
    setBusy('generate');
    const result = await generate();
    setBusy(null);
    if (!result.ok) {
      toast({ variant: 'error', message: result.error ?? t('common.error') });
      return;
    }
    toast({ variant: 'success', message: t('admin.invitations.generated') });
    if (result.code) handleCopy(result.code.code);
  };

  const handleRevoke = async (id: string) => {
    setBusy(id);
    const result = await revoke(id);
    setBusy(null);
    if (!result.ok) {
      toast({ variant: 'error', message: result.error ?? t('common.error') });
      return;
    }
    toast({ variant: 'success', message: t('admin.invitations.revoked') });
  };

  const columns = buildColumns({
    t,
    language: i18n.language,
    busy,
    onCopy: handleCopy,
    onRevoke: id => {
      void handleRevoke(id);
    },
  });

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
            onClick={() => {
              void handleGenerate();
            }}
            disabled={busy === 'generate'}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
              'duration-base transition-[border-color,background-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {busy === 'generate' ? t('common.loading') : t('admin.invitations.generate')}
            <span aria-hidden="true">+</span>
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="border-danger/30 bg-danger/5 text-danger rounded-md border px-3 py-2 text-sm"
          >
            {error}
          </p>
        )}

        {usingFallback && (
          <p className="border-border bg-surface/40 text-muted rounded-md border px-3 py-2 font-mono text-[11px] tracking-widest uppercase">
            {t('admin.invitations.mockBanner')}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="sm" aria-label={t('common.loading')} />
          </div>
        ) : (
          <DataTable
            rows={[...rows]}
            columns={columns}
            rowKey={r => r.id}
            emptyLabel={t('common.empty')}
          />
        )}
      </div>
    </Container>
  );
}
