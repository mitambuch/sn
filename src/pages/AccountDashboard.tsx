// ═══════════════════════════════════════════════════
// AccountDashboard — member home for /:locale/account
//
// WHAT: App-shell dashboard for HNW clients, mobile-first. Flush under
//       AuthHeader (no marketing gap), 5 sections separated by hairlines,
//       no floating cards : greeting · personalised request + shortcuts ·
//       exclusive offers · concierge · recent inquiries.
// WHEN: Index route under AppLayout.
// EDIT COPY: src/locales/{fr,en}.json under account.* — never inline.
// CHANGE DENSITY: section padding lives in `SECTION_PAD` below.
// CHANGE SHORTCUTS: edit REQUEST_SHORTCUTS array.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Skeleton } from '@components/ui/Skeleton';
import { StatusPill } from '@components/ui/StatusPill';
import { ROUTES } from '@constants/routes';
import { useAccountRequest } from '@context/useAccountRequest';
import { type WizardCategory } from '@features/concierge-request/ConciergeRequestWizard';
import { useFakeLoading } from '@hooks/useFakeLoading';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import { Briefcase, Compass, Frame, Mail, Phone, Watch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { listInquiriesForUser } from '@/mocks';
import { currentUser } from '@/mocks/users';

// WHY: shared section padding — single source of truth keeps the vertical
// rhythm consistent across all dashboard blocks. App density (py-5), not
// marketing (py-12).
const SECTION_PAD = 'px-4 py-5 md:px-8 md:py-6';

// Dashboard quick-shortcuts — 4 most-used categories at launch.
const REQUEST_SHORTCUTS: { category: WizardCategory; icon: LucideIcon }[] = [
  { category: 'real-estate', icon: Briefcase },
  { category: 'timepiece', icon: Watch },
  { category: 'art', icon: Frame },
  { category: 'travel', icon: Compass },
];

const Initials = ({ name }: { name: string }) => {
  const parts = name.split(' ');
  const initials = (parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '');
  return (
    <span
      aria-hidden="true"
      className="border-border bg-surface text-fg flex h-10 w-10 items-center justify-center rounded-full border text-xs tracking-widest uppercase"
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

// WHY: hour computed at module scope so react-hooks/purity stays clean.
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
    <header className={cn(SECTION_PAD, 'pt-6 md:pt-8')}>
      <span className="text-muted flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
        <span
          aria-hidden="true"
          className="bg-fg inline-block h-1.5 w-1.5 rounded-full"
          style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
        />
        {t('account.eyebrow')}
        <span aria-hidden="true" className="text-muted/60">
          ·
        </span>
        <span className="tracking-[0.25em]">{todayLabel}</span>
      </span>
      <h1 className="text-fg mt-2 font-mono text-xl font-bold tracking-tight uppercase sm:text-2xl md:text-3xl">
        {t(`account.greeting.${greetingKey(NOW_HOUR)}`, { name: firstName(currentUser.fullName) })}
      </h1>
    </header>
  );
};

/* ─── Section: Personalised request + shortcuts ─────── */
const PersonalisedRequestSection = () => {
  const { t } = useTranslation();
  const { openRequest } = useAccountRequest();

  const openWith = (category?: WizardCategory) => {
    openRequest(category);
  };

  return (
    <section className={SECTION_PAD}>
      <span className="text-muted text-[10px] tracking-widest uppercase">
        {t('wizard.openCta')}
      </span>
      <button
        type="button"
        onClick={() => openWith()}
        className={cn(
          'group mt-2 flex w-full items-center justify-between gap-4 text-left',
          'focus-visible:ring-accent rounded-sm focus-visible:ring-2 focus-visible:outline-none',
        )}
      >
        <span className="text-fg text-base leading-snug font-medium sm:text-lg">
          {t('wizard.openHint')}
        </span>
        <span
          aria-hidden="true"
          className="text-fg shrink-0 text-xl leading-none transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {REQUEST_SHORTCUTS.map(({ category, icon: Icon }) => (
          <button
            key={category}
            type="button"
            onClick={() => openWith(category)}
            className={cn(
              'border-fg/15 text-muted hover:text-fg hover:border-fg/40',
              'inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2.5 font-mono text-[11px] tracking-widest whitespace-nowrap uppercase',
              'duration-base transition-[color,border-color]',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            <Icon size={12} strokeWidth={1.5} aria-hidden="true" />
            {t(`wizard.category.${category}.title`)}
          </button>
        ))}
      </div>
    </section>
  );
};

/* ─── Section: Exclusive offers shortcut ────────────── */
const ExclusiveSection = () => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  return (
    <Link
      to={localePath(ROUTES.ACCOUNT_CATALOGUE)}
      className={cn(
        SECTION_PAD,
        'group hover:bg-surface/40 block transition-colors duration-200',
        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
      )}
    >
      <span className="text-muted text-[10px] tracking-widest uppercase">
        {t('account.exclusive.eyebrow')}
      </span>
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="text-fg text-base leading-snug font-medium sm:text-lg">
          {t('account.exclusive.cta')}
        </span>
        <span
          aria-hidden="true"
          className="text-fg shrink-0 text-xl leading-none transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
};

/* ─── Section: Concierge ─────────────────────────────── */
const ConciergeSection = () => {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="concierge-heading" className={SECTION_PAD}>
      <h2 id="concierge-heading" className="sr-only">
        {t('account.dashboardTitle')}
      </h2>
      <span className="text-muted flex items-center gap-2 text-[10px] tracking-widest uppercase">
        <span
          aria-hidden="true"
          className="bg-success inline-block h-1.5 w-1.5 rounded-full"
          style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
        />
        {t('dock.eyebrow')}
      </span>
      <div className="mt-3 flex items-center gap-3">
        <Initials name={currentUser.conciergeName} />
        <div className="min-w-0">
          <p className="text-fg truncate text-sm font-medium sm:text-base">
            {currentUser.conciergeName}
          </p>
          <p className="text-muted truncate text-xs">salvatore@sawnext.studio</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <a
          href="tel:+41215550000"
          aria-label={t('dock.call')}
          className={cn(
            'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
            'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border text-[11px] tracking-widest whitespace-nowrap uppercase',
            'duration-base transition-[border-color,background-color]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
        >
          <Phone size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>{t('dock.call')}</span>
        </a>
        <a
          href="mailto:salvatore@sawnext.studio"
          aria-label={t('dock.write')}
          className={cn(
            'border-fg/15 text-fg hover:border-fg/60 focus-visible:ring-accent',
            'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border text-[11px] tracking-widest whitespace-nowrap uppercase',
            'duration-base transition-[border-color]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
        >
          <Mail size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>{t('dock.write')}</span>
        </a>
      </div>
    </section>
  );
};

/* ─── Section: Recent inquiries ──────────────────────── */
const RecentInquiriesSection = ({ loading }: { loading: boolean }) => {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const inquiries = listInquiriesForUser(currentUser.id).slice(0, 3);

  return (
    <section aria-labelledby="inquiries-heading" className={SECTION_PAD}>
      <header className="flex items-center justify-between gap-3">
        <h2
          id="inquiries-heading"
          className="text-muted font-mono text-[10px] tracking-widest uppercase"
        >
          {t('account.yourInquiries')}
        </h2>
        <Link
          to={localePath(ROUTES.ACCOUNT_INQUIRIES)}
          className="text-muted hover:text-fg duration-base text-[10px] tracking-widest uppercase transition-colors"
        >
          {t('common.viewAll')} →
        </Link>
      </header>
      {loading ? (
        <ul className="divide-fg/10 mt-3 divide-y">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex flex-col gap-2 py-3">
              <Skeleton className="h-3 w-1/3 rounded-full" />
              <Skeleton className="h-4 w-2/3 rounded-full" />
            </li>
          ))}
        </ul>
      ) : inquiries.length === 0 ? (
        <p className="text-muted mt-3 text-sm">{t('account.noInquiries')}</p>
      ) : (
        <ul className="divide-fg/10 mt-3 divide-y">
          {inquiries.map(inq => (
            <li
              key={inq.id}
              className="flex flex-col gap-1.5 py-3 transition-[padding] duration-300 ease-out hover:pl-2"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted text-[10px] tracking-widest uppercase">
                  {t(`inquiry.sourceLabel.${inq.source}`)} ·{' '}
                  {new Date(inq.createdAt).toLocaleDateString(i18n.language)}
                </span>
                <StatusPill variant={inq.status} label={t(`inquiry.status.${inq.status}`)} />
              </div>
              <span className="text-fg text-sm leading-relaxed">{inq.message ?? '—'}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default function AccountDashboard() {
  const loading = useFakeLoading(450);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="divide-fg/10 divide-y">
        <GreetingSection />
        <PersonalisedRequestSection />
        <ExclusiveSection />
        <ConciergeSection />
        <RecentInquiriesSection loading={loading} />
      </div>
    </div>
  );
}
