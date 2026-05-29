// ═══════════════════════════════════════════════════
// AdminAccessRequests — /:locale/admin/access-requests
//
// WHAT: Triage board for anonymous landing leads (table public.
//       access_requests, migration 0012). 4-column kanban: new /
//       contacted / accepted / declined. Each card exposes the
//       contact info + status select with optimistic update.
// WHEN: Admin sidebar entry "Demandes d'accès". RequireRole 'admin'
//       enforced by AdminLayout.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { useAccessRequestsAdmin } from '@hooks/useAccessRequestsAdmin';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';

import type { AccessRequest, AccessRequestStatus } from '@/types/accessRequest';

const COLUMNS: AccessRequestStatus[] = ['new', 'contacted', 'accepted', 'declined'];

const COLUMN_DOT: Record<AccessRequestStatus, string> = {
  new: 'bg-muted',
  contacted: 'bg-info',
  accepted: 'bg-success',
  declined: 'bg-danger',
};

interface RequestCardProps {
  request: AccessRequest;
  dateFmt: (iso: string) => string;
  onStatusChange: (id: string, next: AccessRequestStatus) => void;
}

function RequestCard({ request, dateFmt, onStatusChange }: RequestCardProps) {
  const { t } = useTranslation();
  const fullName = `${request.firstName} ${request.lastName}`.trim();
  return (
    <li className="border-border bg-bg rounded-media flex flex-col gap-3 border p-4">
      <div className="flex flex-col gap-1">
        <span className="text-fg text-sm font-medium">{fullName || '—'}</span>
        <a href={`mailto:${request.email}`} className="text-muted hover:text-fg truncate text-xs">
          {request.email}
        </a>
      </div>

      <dl className="flex flex-col gap-1 text-xs">
        {request.phone && (
          <div className="flex items-center gap-2">
            <dt className="text-muted font-mono text-[9px] tracking-widest uppercase">
              {t('admin.accessRequests.field.phone')}
            </dt>
            <dd>
              <a href={`tel:${request.phone}`} className="text-fg hover:underline">
                {request.phone}
              </a>
            </dd>
          </div>
        )}
        {request.company && (
          <div className="flex items-baseline gap-2">
            <dt className="text-muted font-mono text-[9px] tracking-widest uppercase">
              {t('admin.accessRequests.field.company')}
            </dt>
            <dd className="text-fg">{request.company}</dd>
          </div>
        )}
        {request.activity && (
          <div className="flex items-baseline gap-2">
            <dt className="text-muted font-mono text-[9px] tracking-widest uppercase">
              {t('admin.accessRequests.field.activity')}
            </dt>
            <dd className="text-fg">{request.activity}</dd>
          </div>
        )}
      </dl>

      {request.message && (
        <p className="text-fg/80 border-border border-t pt-2 text-sm leading-relaxed">
          {request.message}
        </p>
      )}

      <div className="border-border flex items-center justify-between gap-2 border-t pt-2">
        <span className="text-muted text-[10px] tracking-wider uppercase">
          {dateFmt(request.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor={`ar-status-${request.id}`} className="sr-only">
            {t('admin.accessRequests.moveTo')}
          </label>
          <select
            id={`ar-status-${request.id}`}
            value={request.status}
            onChange={e => {
              onStatusChange(request.id, e.target.value as AccessRequestStatus);
            }}
            className={cn(
              'border-border bg-bg text-fg font-mono text-[10px] tracking-[0.18em] uppercase',
              'rounded-md border px-2 py-1.5',
              'focus-visible:border-fg/40 focus-visible:ring-fg/10 focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            {COLUMNS.map(s => (
              <option key={s} value={s}>
                {t(`admin.accessRequests.status.${s}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </li>
  );
}

export default function AdminAccessRequests() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { rows, loading, error, usingFallback, updateStatus } = useAccessRequestsAdmin();

  const handleStatusChange = (id: string, next: AccessRequestStatus) => {
    void updateStatus(id, next).then(result => {
      if (!result.ok) {
        toast({ variant: 'error', message: result.error ?? t('common.error') });
      }
    });
  };

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Container size="xl">
      <div className="space-y-10 py-10 md:space-y-12 md:py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.accessRequests.title')}
          lede={t('admin.accessRequests.lede')}
          size="md"
          as="h1"
        />

        {usingFallback && (
          <p className="border-border bg-surface/40 text-muted rounded-md border px-3 py-2 font-mono text-[10px] tracking-widest uppercase">
            {t('admin.accessRequests.fallbackNotice')}
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

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="sm" aria-label={t('common.loading')} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map(col => {
              const items = rows.filter(r => r.status === col);
              return (
                <section
                  key={col}
                  aria-labelledby={`ar-col-${col}`}
                  className="border-border bg-surface rounded-card shadow-card-rest flex flex-col gap-4 border p-5"
                >
                  <header className="flex items-center justify-between">
                    <h2
                      id={`ar-col-${col}`}
                      className="text-fg flex items-center gap-2 text-xs tracking-widest uppercase"
                    >
                      <span
                        className={cn('h-1.5 w-1.5 rounded-full', COLUMN_DOT[col])}
                        aria-hidden="true"
                      />
                      {t(`admin.accessRequests.status.${col}`)}
                    </h2>
                    <span className="text-muted font-mono text-xs">{items.length}</span>
                  </header>
                  <ul className="flex flex-col gap-3">
                    {items.map(req => (
                      <RequestCard
                        key={req.id}
                        request={req}
                        dateFmt={dateFmt}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                    {items.length === 0 && (
                      <li className="text-muted py-8 text-center text-xs tracking-widest uppercase">
                        —
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
