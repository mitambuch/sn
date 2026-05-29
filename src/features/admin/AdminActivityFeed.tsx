// ═══════════════════════════════════════════════════
// AdminActivityFeed — Live operator timeline
//
// WHAT: Unified chronological list of recent platform events across
//       4 sources : new access requests, new inquiries, invitations
//       redeemed, member signups. Each event has an icon + label +
//       timestamp + deep link to its detail page. Sorted desc, capped
//       to N items (default 10).
// WHEN: Embedded in /admin (AdminDashboard) as the main "live signal"
//       widget — replaces the bare "Recent inquiries" list with a
//       cross-source overview.
// CHANGE event sources: edit buildEvents below.
// CHANGE icons: edit the per-type Icon assignment.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Card } from '@components/ui/Card';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import type { TFunction } from 'i18next';
import type { LucideIcon } from 'lucide-react';
import { Inbox, MailQuestion, Ticket, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { AccessRequest } from '@/types/accessRequest';
import type { User } from '@/types/auth';
import type { Inquiry } from '@/types/inquiry';
import type { InvitationCode } from '@/types/invitation';

type ActivityType = 'access_request' | 'inquiry' | 'invitation_redeemed' | 'signup';

interface ActivityEvent {
  id: string;
  type: ActivityType;
  timestamp: string;
  primary: string;
  secondary: string;
  href: string;
}

const ICON: Record<ActivityType, LucideIcon> = {
  access_request: MailQuestion,
  inquiry: Inbox,
  invitation_redeemed: Ticket,
  signup: UserPlus,
};

interface BuildArgs {
  accessRequests: readonly AccessRequest[];
  inquiries: readonly Inquiry[];
  invitations: readonly InvitationCode[];
  members: readonly User[];
  t: TFunction;
}

function buildEvents({
  accessRequests,
  inquiries,
  invitations,
  members,
  t,
}: BuildArgs): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  accessRequests.forEach(req => {
    events.push({
      id: `ar-${req.id}`,
      type: 'access_request',
      timestamp: req.createdAt,
      primary: t('admin.activity.accessRequest', {
        name: `${req.firstName} ${req.lastName}`.trim() || req.email,
      }),
      secondary: req.email,
      href: ROUTES.ADMIN_ACCESS_REQUESTS,
    });
  });

  inquiries.forEach(inq => {
    events.push({
      id: `inq-${inq.id}`,
      type: 'inquiry',
      timestamp: inq.createdAt,
      primary: t('admin.activity.inquiry', { source: inq.source }),
      secondary: inq.message ?? t('admin.activity.noMessage'),
      href: ROUTES.ADMIN_INQUIRIES,
    });
  });

  invitations
    .filter(inv => inv.status === 'redeemed')
    .forEach(inv => {
      const ts = inv.redeemedAt ?? inv.createdAt;
      events.push({
        id: `inv-${inv.id}`,
        type: 'invitation_redeemed',
        timestamp: ts,
        primary: t('admin.activity.invitationRedeemed', { code: inv.code }),
        secondary: t('admin.activity.invitationRedeemedSub'),
        href: ROUTES.ADMIN_INVITATIONS,
      });
    });

  members.forEach(m => {
    events.push({
      id: `usr-${m.id}`,
      type: 'signup',
      timestamp: m.createdAt,
      primary: t('admin.activity.signup', { name: m.fullName || m.email }),
      secondary: m.email,
      href: ROUTES.ADMIN_USERS,
    });
  });

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function relativeTime(iso: string, lang: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${String(mins)} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${String(hours)} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${String(days)} j`;
  return new Date(iso).toLocaleDateString(lang, { day: '2-digit', month: 'short' });
}

interface AdminActivityFeedProps {
  accessRequests: readonly AccessRequest[];
  inquiries: readonly Inquiry[];
  invitations: readonly InvitationCode[];
  members: readonly User[];
  /** Max events to show. Default 10. */
  limit?: number;
}

/** Cross-source live activity feed for the admin dashboard. */
export const AdminActivityFeed = ({
  accessRequests,
  inquiries,
  invitations,
  members,
  limit = 10,
}: AdminActivityFeedProps) => {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const events = buildEvents({ accessRequests, inquiries, invitations, members, t }).slice(
    0,
    limit,
  );

  if (events.length === 0) {
    return (
      <Card padding="md">
        <p className="text-muted text-sm">{t('admin.activity.empty')}</p>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <ul className="divide-border divide-y">
        {events.map(ev => {
          const Icon = ICON[ev.type];
          return (
            <li key={ev.id}>
              <Link
                to={localePath(ev.href)}
                className={cn(
                  'group flex items-start gap-3 px-5 py-4',
                  'hover:bg-surface/50 focus-visible:bg-surface/50 transition-colors',
                  'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
                )}
              >
                <span className="border-border bg-bg text-fg mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                  <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-fg text-sm leading-snug font-medium">{ev.primary}</span>
                  <span className="text-muted truncate text-xs">{ev.secondary}</span>
                </div>
                <span className="text-muted shrink-0 font-mono text-[10px] tracking-widest uppercase">
                  {relativeTime(ev.timestamp, i18n.language)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
