// ═══════════════════════════════════════════════════
// AccountInquiries — /:locale/account/inquiries
//
// WHAT: Full history of the member's inquiries with status filter chips.
//       Items use the same restructured layout as RecentInquiries on
//       dashboard : top row [meta · status pill] + bottom row [message
//       full-width]. Apple-closed Card surface.
// WHEN: Linked from sidebar "Demandes" + dashboard "Voir l'ensemble".
// EDIT VISUAL: change radius/shadow via src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { FilterBar } from '@components/ui/FilterBar';
import { SectionHeader } from '@components/ui/SectionHeader';
import { StatusPill } from '@components/ui/StatusPill';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { listInquiriesForUser } from '@/mocks';
import { currentUser } from '@/mocks/users';
import type { InquiryStatus } from '@/types/inquiry';

export default function AccountInquiries() {
  const { t, i18n } = useTranslation();
  const all = useMemo(() => listInquiriesForUser(currentUser.id), []);
  const [activeStatuses, setActiveStatuses] = useState<Set<InquiryStatus>>(new Set());

  const toggleStatus = (s: InquiryStatus) => {
    setActiveStatuses(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const statuses: InquiryStatus[] = ['new', 'in_review', 'contacted', 'closed', 'cancelled'];
  const filtered = activeStatuses.size === 0 ? all : all.filter(i => activeStatuses.has(i.status));

  return (
    <Container size="xl">
      <div className="space-y-10 py-10 md:space-y-12 md:py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.inquiriesTitle')}
          size="md"
          as="h1"
        />

        <FilterBar>
          {statuses.map(s => (
            <FilterBar.Chip
              key={s}
              label={t(`inquiry.status.${s}`)}
              selected={activeStatuses.has(s)}
              onToggle={() => toggleStatus(s)}
            />
          ))}
          <FilterBar.Reset
            label={t('common.reset')}
            onReset={() => setActiveStatuses(new Set())}
            visible={activeStatuses.size > 0}
          />
        </FilterBar>

        {filtered.length === 0 ? (
          <p className="text-muted text-sm">{t('account.noInquiries')}</p>
        ) : (
          <Card padding="none">
            <ul className="divide-border divide-y">
              {filtered.map(inq => (
                <li key={inq.id} className="flex flex-col gap-2 px-5 py-4 sm:px-6 sm:py-5">
                  {/* Top row : meta + StatusPill — both tiny uppercase, fit
                      easily on any viewport (mobile-first restructure rule). */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted text-xs tracking-widest uppercase">
                      {t(`inquiry.sourceLabel.${inq.source}`)} ·{' '}
                      {new Date(inq.createdAt).toLocaleDateString(i18n.language, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <StatusPill variant={inq.status} label={t(`inquiry.status.${inq.status}`)} />
                  </div>
                  {/* Body : message full-width, wraps freely. */}
                  <p className="text-fg text-sm leading-relaxed">{inq.message ?? '—'}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>
      </div>
    </Container>
  );
}
