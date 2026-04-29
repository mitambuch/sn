// ═══════════════════════════════════════════════════
// AdminDashboard — /:locale/admin
// Stats summary + 5 most recent inquiries with quick links.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Stat } from '@components/ui/Stat';
import { StatusPill } from '@components/ui/StatusPill';
import { ROUTES } from '@constants/routes';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { listInquiries, listInvitations, listUsers } from '@/mocks';

// WHY: Date.now() called once at module scope so react-hooks/purity is happy
// inside the render path. Lot C replaces with a server snapshot.
const NOW_MS = Date.now();

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();

  const inquiries = listInquiries();
  const invitations = listInvitations();
  const members = listUsers().filter(u => u.role === 'client');

  const pending = inquiries.filter(i => i.status === 'new' || i.status === 'in_review').length;
  const unusedCodes = invitations.filter(i => i.status === 'unused').length;
  const last7d = members.filter(u => {
    const days = (NOW_MS - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return days < 7;
  }).length;

  const recent = inquiries.slice(0, 5);

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow')}
          title={t('admin.dashboardTitle')}
          lede={t('admin.dashboardLede')}
          size="md"
          as="h1"
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <Stat label={t('admin.stats.pendingInquiries')} value={String(pending)} />
          <Stat label={t('admin.stats.unusedCodes')} value={String(unusedCodes)} />
          <Stat label={t('admin.stats.signupsLast7d')} value={String(last7d)} />
        </div>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-fg text-2xl font-light">{t('admin.recentInquiries')}</h2>
            <Link
              to={localePath(ROUTES.ADMIN_INQUIRIES)}
              className="text-muted hover:text-fg text-xs tracking-widest uppercase"
            >
              {t('common.viewAll')} →
            </Link>
          </div>

          <ul className="border-border divide-border divide-y rounded-lg border">
            {recent.map(inq => (
              <li key={inq.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-muted text-xs tracking-widest uppercase">
                    {inq.source} · {new Date(inq.createdAt).toLocaleDateString(i18n.language)}
                  </span>
                  <span className="text-fg text-sm">{inq.message ?? '—'}</span>
                </div>
                <StatusPill variant={inq.status} label={t(`inquiry.status.${inq.status}`)} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
