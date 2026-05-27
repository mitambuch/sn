// ═══════════════════════════════════════════════════
// AdminDashboard — /:locale/admin
// Valmont's home: stats, quick actions to add catalogue items / codes,
// and the 5 most recent inquiries.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Stat } from '@components/ui/Stat';
import { StatusPill } from '@components/ui/StatusPill';
import { ROUTES } from '@constants/routes';
import { useInquiriesAdmin } from '@hooks/useInquiries';
import { useInvitationsAdmin } from '@hooks/useInvitationsAdmin';
import { useUsersAdmin } from '@hooks/useUsersAdmin';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarDays,
  Compass,
  Frame,
  Newspaper,
  Sparkles,
  Ticket,
  Watch,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// WHY: Date.now() called once at module scope so react-hooks/purity is happy.
const NOW_MS = Date.now();

interface QuickAction {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    to: `${ROUTES.ADMIN_CATALOGUE}?module=property`,
    labelKey: 'account.nav.properties',
    icon: Building2,
  },
  {
    to: `${ROUTES.ADMIN_CATALOGUE}?module=timepiece`,
    labelKey: 'account.nav.timepieces',
    icon: Watch,
  },
  {
    to: `${ROUTES.ADMIN_CATALOGUE}?module=artwork`,
    labelKey: 'account.nav.artworks',
    icon: Frame,
  },
  {
    to: `${ROUTES.ADMIN_CATALOGUE}?module=event`,
    labelKey: 'account.nav.events',
    icon: CalendarDays,
  },
  {
    to: `${ROUTES.ADMIN_CATALOGUE}?module=journey`,
    labelKey: 'account.nav.journeys',
    icon: Compass,
  },
  {
    to: `${ROUTES.ADMIN_CATALOGUE}?module=concierge`,
    labelKey: 'account.nav.concierge',
    icon: Sparkles,
  },
  {
    to: `${ROUTES.ADMIN_CATALOGUE}?module=article`,
    labelKey: 'account.nav.news',
    icon: Newspaper,
  },
  { to: ROUTES.ADMIN_INVITATIONS, labelKey: 'admin.invitations.title', icon: Ticket },
];

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();

  const { rows: inquiries } = useInquiriesAdmin();
  const { rows: invitations } = useInvitationsAdmin();
  const { rows: users } = useUsersAdmin();
  const members = users.filter(u => u.role === 'client');

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

        {/* ─── Stats ─── */}
        <div className="grid gap-6 sm:grid-cols-3">
          <Stat label={t('admin.stats.pendingInquiries')} value={String(pending)} />
          <Stat label={t('admin.stats.unusedCodes')} value={String(unusedCodes)} />
          <Stat label={t('admin.stats.signupsLast7d')} value={String(last7d)} />
        </div>

        {/* ─── Quick actions ─── */}
        <section aria-labelledby="quick-actions-heading" className="space-y-6">
          <h2 id="quick-actions-heading" className="text-fg font-mono text-2xl font-bold uppercase">
            {t('admin.quickActions')}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
            {QUICK_ACTIONS.map(({ to, labelKey, icon: Icon }) => (
              <Card
                key={to}
                to={localePath(to)}
                padding="md"
                className="items-start gap-3 text-left"
              >
                <span className="border-border bg-bg text-fg flex h-9 w-9 items-center justify-center rounded-full border">
                  <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-fg text-sm leading-snug font-medium">+ {t(labelKey)}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* ─── Recent inquiries ─── */}
        <section aria-labelledby="recent-inquiries-heading" className="space-y-6">
          <div className="flex items-end justify-between">
            <h2
              id="recent-inquiries-heading"
              className="text-fg font-mono text-2xl font-bold uppercase"
            >
              {t('admin.recentInquiries')}
            </h2>
            <Link
              to={localePath(ROUTES.ADMIN_INQUIRIES)}
              className="text-muted hover:text-fg text-xs tracking-widest uppercase"
            >
              {t('common.viewAll')} →
            </Link>
          </div>

          <Card padding="none">
            <ul className="divide-border divide-y">
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
          </Card>
        </section>
      </div>
    </Container>
  );
}
