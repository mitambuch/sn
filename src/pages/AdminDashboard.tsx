// ═══════════════════════════════════════════════════
// AdminDashboard — /:locale/admin
// Valmont's home: stats, quick actions to add catalogue items / codes,
// and a live cross-source activity feed.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Stat } from '@components/ui/Stat';
import { ROUTES } from '@constants/routes';
import { AdminActivityFeed } from '@features/admin/AdminActivityFeed';
import { useAccessRequestsAdmin } from '@hooks/useAccessRequestsAdmin';
import { useInquiriesAdmin } from '@hooks/useInquiries';
import { useInvitationsAdmin } from '@hooks/useInvitationsAdmin';
import { useUsersAdmin } from '@hooks/useUsersAdmin';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CalendarDays,
  Compass,
  Frame,
  MailQuestion,
  Newspaper,
  Sparkles,
  Ticket,
  Watch,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { hasSanity } from '@/lib/sanity';

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
  {
    to: ROUTES.ADMIN_ACCESS_REQUESTS,
    labelKey: 'admin.accessRequests.title',
    icon: MailQuestion,
  },
  { to: ROUTES.ADMIN_INVITATIONS, labelKey: 'admin.invitations.title', icon: Ticket },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { localePath } = useLocale();

  const { rows: inquiries } = useInquiriesAdmin();
  const { rows: invitations } = useInvitationsAdmin();
  const { rows: users } = useUsersAdmin();
  const { rows: accessRequests } = useAccessRequestsAdmin();
  const members = users.filter(u => u.role === 'client');

  const pending = inquiries.filter(i => i.status === 'new' || i.status === 'in_review').length;
  const newAccessRequests = accessRequests.filter(a => a.status === 'new').length;
  const unusedCodes = invitations.filter(i => i.status === 'unused').length;
  const last7d = members.filter(u => {
    const days = (NOW_MS - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return days < 7;
  }).length;

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

        {/* ─── Sanity status notice ─── */}
        {!hasSanity && (
          <Card padding="md" className="gap-3">
            <div className="flex items-start gap-3">
              <span className="bg-warning/15 text-warning-text mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs">
                !
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-fg text-sm font-medium">{t('admin.sanityNotice.title')}</h3>
                <p className="text-muted text-sm leading-relaxed">{t('admin.sanityNotice.body')}</p>
              </div>
            </div>
          </Card>
        )}

        {/* ─── Stats ─── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={t('admin.accessRequests.title')} value={String(newAccessRequests)} />
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

        {/* ─── Live activity feed ─── */}
        <section aria-labelledby="activity-heading" className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 id="activity-heading" className="text-fg font-mono text-2xl font-bold uppercase">
              {t('admin.activity.title')}
            </h2>
            <Link
              to={localePath(ROUTES.ADMIN_INQUIRIES)}
              className="text-muted hover:text-fg text-xs tracking-widest uppercase"
            >
              {t('common.viewAll')} →
            </Link>
          </div>

          <AdminActivityFeed
            accessRequests={accessRequests}
            inquiries={inquiries}
            invitations={invitations}
            members={members}
            limit={10}
          />
        </section>
      </div>
    </Container>
  );
}
