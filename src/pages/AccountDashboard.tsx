// ═══════════════════════════════════════════════════
// AccountDashboard — member home for /:locale/account
//
// WHAT: Premium concierge dashboard, deliberately minimal (3 sections) —
//       greeting + dedicated concierge card + 3 most recent inquiries.
//       Catalogue navigation lives in the sidebar; cross-module curated
//       items live on /account/catalogue. The dashboard = human hub
//       (who said hi to you + who's available + what's pending).
// WHEN: Index route under AppLayout.
// EDIT COPY: src/locales/{fr,en}.json under account.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { StatusPill } from '@components/ui/StatusPill';
import { ROUTES } from '@constants/routes';
import { useFakeLoading } from '@hooks/useFakeLoading';
import { cn } from '@utils/cn';
import { Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { listInquiriesForUser } from '@/mocks';
import { currentUser } from '@/mocks/users';

const Initials = ({ name }: { name: string }) => {
  const parts = name.split(' ');
  const initials = (parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '');
  return (
    <span
      aria-hidden="true"
      className="border-border bg-surface text-fg flex h-12 w-12 items-center justify-center rounded-full border text-sm tracking-widest uppercase"
    >
      {initials}
    </span>
  );
};

const firstName = (full: string) => full.split(' ')[0] ?? full;

const greetingKey = (hour: number): 'morning' | 'afternoon' | 'evening' => {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

// WHY: hours computed at module scope so react-hooks/purity stays clean.
const NOW_HOUR = new Date().getHours();

/* ─── Section: Greeting ─────────────────────────────── */
const GreetingSection = () => {
  const { t, i18n } = useTranslation();
  const todayLabel = new Date().toLocaleDateString(i18n.language, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  return (
    <header className="flex flex-col gap-3">
      <span className="text-muted text-xs tracking-[0.3em] uppercase">{todayLabel}</span>
      <h1 className="text-fg text-3xl font-light tracking-tight text-balance sm:text-4xl md:text-5xl">
        {t(`account.greeting.${greetingKey(NOW_HOUR)}`, { name: firstName(currentUser.fullName) })}
      </h1>
      <p className="text-muted max-w-2xl text-sm leading-relaxed text-pretty sm:text-base md:text-lg">
        {t('account.dashboardLede')}
      </p>
    </header>
  );
};

/* ─── Section: Exclusive offers shortcut ────────────── */
const ExclusiveShortcut = () => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  return (
    <Card to={localePath(ROUTES.ACCOUNT_CATALOGUE)} padding="lg" important>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-muted text-xs tracking-widest uppercase">
            {t('account.exclusive.eyebrow')}
          </span>
          <p className="text-fg text-base leading-snug font-medium sm:text-lg">
            {t('account.exclusive.cta')}
          </p>
        </div>
        <span className="text-fg shrink-0 text-xl leading-none" aria-hidden="true">
          →
        </span>
      </div>
    </Card>
  );
};

/* ─── Section: Concierge card ────────────────────────── */
const ConciergeCard = () => {
  const { t } = useTranslation();
  return (
    <Card padding="lg">
      <h2 className="sr-only">{t('account.dashboardTitle')}</h2>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex items-center gap-4">
          <Initials name={currentUser.conciergeName} />
          <div>
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('dock.eyebrow')}
            </span>
            <p className="text-fg mt-1 text-lg font-medium">{currentUser.conciergeName}</p>
            <p className="text-muted text-sm">salvatore@sawnext.studio</p>
          </div>
        </div>
        {/* WHY: on mobile, labels "Appeler maintenant" + "Écrire un message"
            are too long to fit in a shared-width row. We collapse to icon-only
            (sr-only label for a11y) on mobile and reveal the label on md+. */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+41215550000"
            aria-label={t('dock.call')}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border text-xs tracking-widest whitespace-nowrap uppercase md:h-auto md:flex-none md:px-5 md:py-2.5',
              'duration-base transition-[border-color,background-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only md:not-sr-only">{t('dock.call')}</span>
          </a>
          <a
            href="mailto:salvatore@sawnext.studio"
            aria-label={t('dock.write')}
            className={cn(
              'border-border text-fg hover:border-fg/60 focus-visible:ring-accent',
              'inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border text-xs tracking-widest whitespace-nowrap uppercase md:h-auto md:flex-none md:px-5 md:py-2.5',
              'duration-base transition-[border-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only md:not-sr-only">{t('dock.write')}</span>
          </a>
        </div>
      </div>
    </Card>
  );
};

/* ─── Section: Recent inquiries ──────────────────────── */
const RecentInquiriesSection = ({ loading }: { loading: boolean }) => {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const inquiries = listInquiriesForUser(currentUser.id).slice(0, 3);

  return (
    <section aria-labelledby="inquiries-heading" className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 id="inquiries-heading" className="text-fg text-2xl font-light">
          {t('account.yourInquiries')}
        </h2>
        <Link
          to={localePath(ROUTES.ACCOUNT_INQUIRIES)}
          className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
        >
          {t('common.viewAll')} →
        </Link>
      </div>
      {loading ? (
        <ul className="border-border divide-border divide-y rounded-lg border">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-2/3 rounded-full" />
                <Skeleton className="h-3 w-1/4 rounded-full" />
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
            </li>
          ))}
        </ul>
      ) : inquiries.length === 0 ? (
        <p className="text-muted text-sm">{t('account.noInquiries')}</p>
      ) : (
        <Card padding="none">
          <ul className="divide-border divide-y">
            {inquiries.map(inq => (
              <li key={inq.id} className="flex flex-col gap-2 px-5 py-4">
                {/* Top row : meta + StatusPill — both tiny uppercase,
                    fit easily on one line on every viewport. */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted text-xs tracking-widest uppercase">
                    {t(`inquiry.sourceLabel.${inq.source}`)} ·{' '}
                    {new Date(inq.createdAt).toLocaleDateString(i18n.language)}
                  </span>
                  <StatusPill variant={inq.status} label={t(`inquiry.status.${inq.status}`)} />
                </div>
                {/* Body : message full-width, wraps freely. */}
                <span className="text-fg text-sm leading-relaxed">{inq.message ?? '—'}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
};

export default function AccountDashboard() {
  const loading = useFakeLoading(450);

  return (
    <Container size="md">
      <div className="space-y-12 py-12 md:space-y-16 md:py-16">
        <GreetingSection />
        <ExclusiveShortcut />
        <ConciergeCard />
        <RecentInquiriesSection loading={loading} />
      </div>
    </Container>
  );
}
