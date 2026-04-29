// ═══════════════════════════════════════════════════
// AccountInquiries — /:locale/account/inquiries
// Full history of the member's inquiries with filter by status.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
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
  const { localePath: _localePath } = useLocale();
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
      <div className="space-y-12 py-12">
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
          <ul className="border-border divide-border divide-y rounded-lg border">
            {filtered.map(inq => (
              <li
                key={inq.id}
                className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-muted text-xs tracking-widest uppercase">
                    {inq.source} ·{' '}
                    {new Date(inq.createdAt).toLocaleDateString(i18n.language, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <p className="text-fg text-sm leading-relaxed">{inq.message ?? '—'}</p>
                </div>
                <StatusPill variant={inq.status} label={t(`inquiry.status.${inq.status}`)} />
              </li>
            ))}
          </ul>
        )}

        <p className="text-muted text-xs tracking-widest uppercase">
          {t('common.showing', { count: filtered.length })}
        </p>
      </div>
    </Container>
  );
}
