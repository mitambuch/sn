// ═══════════════════════════════════════════════════
// AdminInquiries — /:locale/admin/inquiries
// Kanban-style 4-column board: new / in_review / contacted / closed.
// Cards are read-only in lot B; assign + status transition land in lot C.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { useInquiriesAdmin } from '@hooks/useInquiries';
import { useUsersAdmin } from '@hooks/useUsersAdmin';
import { useTranslation } from 'react-i18next';

import type { InquiryStatus } from '@/types/inquiry';

const COLUMNS: InquiryStatus[] = ['new', 'in_review', 'contacted', 'closed'];

export default function AdminInquiries() {
  const { t, i18n } = useTranslation();
  const { rows: all, loading } = useInquiriesAdmin();
  const { rows: users } = useUsersAdmin();
  const userById = (id: string) => users.find(u => u.id === id)?.fullName ?? '—';

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.inquiries.title')}
          size="md"
          as="h1"
        />

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
                      className="border-border bg-bg rounded-media flex flex-col gap-2 border p-4"
                    >
                      <span className="text-muted text-xs tracking-widest uppercase">
                        {inq.source}
                      </span>
                      <p className="text-fg text-sm leading-relaxed">{inq.message ?? '—'}</p>
                      <span className="text-muted mt-1 text-xs">
                        {userById(inq.userId)} ·{' '}
                        {new Date(inq.createdAt).toLocaleDateString(i18n.language)}
                      </span>
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
