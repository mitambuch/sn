// ═══════════════════════════════════════════════════
// AdminInquiries — /:locale/admin/inquiries
//
// WHAT: Kanban-style 4-column board (new / in_review / contacted /
//       closed) of every inquiry the operator has received. Each card
//       has a status <select> that updates the row in public.inquiries
//       via the admin RLS policy. Local-optimistic — the card moves
//       columns immediately ; remote failure rolls back.
// WHEN: Admin sidebar entry "Inquiries". Requires role='admin'.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { Stat } from '@components/ui/Stat';
import { useInquiriesAdmin } from '@hooks/useInquiries';
import { useToast } from '@hooks/useToast';
import { useUsersAdmin } from '@hooks/useUsersAdmin';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';

import type { InquiryStatus } from '@/types/inquiry';

const COLUMNS: InquiryStatus[] = ['new', 'in_review', 'contacted', 'closed'];
const ALL_STATUSES: InquiryStatus[] = ['new', 'in_review', 'contacted', 'closed', 'cancelled'];

export default function AdminInquiries() {
  const { t, i18n } = useTranslation();
  const { toast, dismiss } = useToast();
  const { rows: all, loading, updateStatus } = useInquiriesAdmin();
  const { rows: users } = useUsersAdmin();
  const userById = (id: string) => users.find(u => u.id === id)?.fullName ?? '—';

  const handleStatusChange = async (id: string, next: InquiryStatus) => {
    // Bottom-right loading box (spinner) while the status write is in flight —
    // duration 0 = stays until we dismiss it on completion.
    const loadingId = toast({
      variant: 'info',
      message: t(next === 'cancelled' ? 'admin.inquiries.cancelling' : 'admin.inquiries.updating'),
      duration: 0,
      icon: <Spinner size="sm" aria-hidden="true" />,
    });
    const result = await updateStatus(id, next);
    dismiss(loadingId);
    if (!result.ok) {
      toast({ variant: 'error', message: result.error ?? t('common.error') });
    }
  };

  const stats = {
    total: all.length,
    open: all.filter(i => i.status === 'new' || i.status === 'in_review').length,
    contacted: all.filter(i => i.status === 'contacted').length,
    closed: all.filter(i => i.status === 'closed').length,
  };

  return (
    <Container size="xl">
      <div className="space-y-10 py-10 md:space-y-12 md:py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.inquiries.title')}
          lede={t('admin.inquiries.lede')}
          size="md"
          as="h1"
        />

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={t('admin.inquiries.statsTotal')} value={String(stats.total)} />
          <Stat label={t('admin.inquiries.statsOpen')} value={String(stats.open)} />
          <Stat label={t('admin.inquiries.statsContacted')} value={String(stats.contacted)} />
          <Stat label={t('admin.inquiries.statsClosed')} value={String(stats.closed)} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="sm" aria-label={t('common.loading')} />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map(col => {
            const items = all.filter(i => i.status === col);
            return (
              <section
                key={col}
                aria-labelledby={`col-${col}`}
                className="border-border bg-surface rounded-card shadow-card-rest flex flex-col gap-4 border p-5"
              >
                <header className="flex items-center justify-between">
                  <h2 id={`col-${col}`} className="text-fg text-xs tracking-widest uppercase">
                    {t(`inquiry.status.${col}`)}
                  </h2>
                  <span className="text-muted font-mono text-xs">{items.length}</span>
                </header>
                <ul className="flex flex-col gap-3">
                  {items.map(inq => (
                    <li
                      key={inq.id}
                      className="border-border bg-bg rounded-media flex flex-col gap-3 border p-4"
                    >
                      <span className="text-muted text-xs tracking-widest uppercase">
                        {inq.source}
                      </span>
                      <p className="text-fg text-sm leading-relaxed">{inq.message ?? '—'}</p>
                      <span className="text-muted mt-1 text-xs">
                        {userById(inq.userId)} ·{' '}
                        {new Date(inq.createdAt).toLocaleDateString(i18n.language)}
                      </span>
                      <div className="flex items-center gap-2 pt-2">
                        <label
                          htmlFor={`status-${inq.id}`}
                          className="text-muted font-mono text-[9px] tracking-[0.2em] uppercase"
                        >
                          {t('admin.inquiries.moveTo')}
                        </label>
                        <select
                          id={`status-${inq.id}`}
                          value={inq.status}
                          onChange={e => {
                            void handleStatusChange(inq.id, e.target.value as InquiryStatus);
                          }}
                          className={cn(
                            'border-border bg-bg text-fg font-mono text-[10px] tracking-[0.18em] uppercase',
                            'rounded-md border px-2 py-1.5',
                            'focus-visible:border-fg/40 focus-visible:ring-fg/10 focus-visible:ring-2 focus-visible:outline-none',
                          )}
                          aria-label={t('admin.inquiries.statusFor', { source: inq.source })}
                        >
                          {ALL_STATUSES.map(s => (
                            <option key={s} value={s}>
                              {t(`inquiry.status.${s}`)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </li>
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
      </div>
    </Container>
  );
}
