// ═══════════════════════════════════════════════════
// AccountDashboard — member home for /:locale/account
//
// WHAT: True app dashboard. Mobile-first stacked rhythm with breathing
//       air ; desktop (lg+) reorganises into a 12-col grid with proper
//       vertical box separations. Conciergerie block runs in inverted
//       palette (bg-fg text-bg) to read as the human anchor — Salva is
//       always one tap away. Full viewport width on desktop, no
//       narrow-centered-column.
// WHEN: Index route under AppLayout.
// EDIT COPY: src/locales/{fr,en}.json under account.* — never inline.
// CHANGE DENSITY: section padding lives in `SECTION_PAD` below.
// CHANGE GRID: tweak col-spans in the default export grid wrapper.
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
import { ArrowUpRight, Briefcase, Compass, Frame, Mail, Phone, Watch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { listInquiriesForUser } from '@/mocks';
import { currentUser } from '@/mocks/users';

// WHY: shared section padding — single source of truth keeps the vertical
// rhythm consistent across blocks and viewports. Generous on desktop so
// each box reads as its own area, tight enough on mobile to stay app-like.
const SECTION_PAD = 'p-6 md:p-8 lg:p-10';

// WHY: each shortcut may use a short override label (account.shortcut.<cat>)
// when the wizard's canonical title would wrap on a single button line.
// Today : "Voyage sur mesure" → "Voyage" for the dashboard surface only ;
// the wizard category screen keeps the full title.
const REQUEST_SHORTCUTS: { category: WizardCategory; icon: LucideIcon; shortKey?: string }[] = [
  { category: 'real-estate', icon: Briefcase },
  { category: 'timepiece', icon: Watch },
  { category: 'art', icon: Frame },
  { category: 'travel', icon: Compass, shortKey: 'account.shortcut.travel' },
];

const Initials = ({ name }: { name: string }) => {
  const parts = name.split(' ');
  const initials = (parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '');
  return (
    <span
      aria-hidden="true"
      className="border-border bg-bg text-fg flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xs tracking-widest uppercase"
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
    <header className={cn(SECTION_PAD, 'pt-7 md:pt-9 lg:pt-12')}>
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
      <h1 className="text-fg mt-3 font-mono text-2xl font-bold tracking-tight uppercase sm:text-3xl md:text-4xl lg:text-5xl">
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
    <section className={cn(SECTION_PAD, 'flex h-full flex-col')}>
      <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
        {t('wizard.openCta')}
      </span>

      {/* Hero CTA — big tappable block, surface bg so it reads as the
          primary action of the section. */}
      <button
        type="button"
        onClick={() => openWith()}
        className={cn(
          'group bg-surface/60 border-fg/10 hover:border-fg/30 hover:bg-surface',
          'mt-3 flex w-full items-start justify-between gap-5 rounded-xl border p-5 text-left md:p-6',
          'transition-[border-color,background-color] duration-300 ease-out',
          'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
        )}
      >
        <span className="text-fg text-base leading-snug font-medium sm:text-lg md:text-xl">
          {t('wizard.openHint')}
        </span>
        <span
          aria-hidden="true"
          className="border-fg/15 bg-bg text-fg group-hover:border-fg/40 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[border-color,transform] duration-300 group-hover:translate-x-1"
        >
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </span>
      </button>

      {/* Quick shortcuts — bigger, breathable. 2x2 on mobile, 4-up on
          tablet/desktop. */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REQUEST_SHORTCUTS.map(({ category, icon: Icon, shortKey }) => (
          <button
            key={category}
            type="button"
            onClick={() => openWith(category)}
            className={cn(
              'border-fg/15 text-muted hover:text-fg hover:border-fg/40 hover:bg-surface/40',
              'inline-flex items-center justify-center gap-2 rounded-md border px-3 py-3.5 font-mono text-[11px] tracking-widest whitespace-nowrap uppercase',
              'duration-base transition-[color,border-color,background-color]',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
            {t(shortKey ?? `wizard.category.${category}.title`)}
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
        'group hover:bg-surface/40 flex h-full flex-col justify-between transition-colors duration-200',
        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
      )}
    >
      <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
        {t('account.exclusive.eyebrow')}
      </span>
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="text-fg text-base leading-snug font-medium sm:text-lg md:text-xl">
          {t('account.exclusive.cta')}
        </span>
        <span
          aria-hidden="true"
          className="text-fg shrink-0 text-2xl leading-none transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
};

/* ─── Section: Concierge (light surface variant) ────── */
// WHY: original draft used inverted palette (bg-fg text-bg). Owner direction
// 2026-05-14 14:41 — "le noir est trop présent sur mobile, ça nique les yeux".
// Switched to bg-surface light variant : still reads as its own box thanks
// to the surface tint + section border, without the visual weight of a
// black slab on a 375px-wide screen.
const ConciergeSection = () => {
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="concierge-heading"
      className={cn(SECTION_PAD, 'bg-surface flex h-full flex-col')}
    >
      <h2 id="concierge-heading" className="sr-only">
        {t('account.dashboardTitle')}
      </h2>
      <span className="text-muted flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
        <span
          aria-hidden="true"
          className="bg-success inline-block h-1.5 w-1.5 rounded-full"
          style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
        />
        {t('dock.eyebrow')}
      </span>
      <div className="mt-4 flex items-center gap-3">
        <Initials name={currentUser.conciergeName} />
        <div className="min-w-0">
          <p className="text-fg truncate text-base font-medium md:text-lg">
            {currentUser.conciergeName}
          </p>
          <p className="text-muted truncate text-xs md:text-sm">salvatore@sawnext.studio</p>
        </div>
      </div>
      {/* Big touch targets — h-14 (56px) + font-mono text-sm + font-semibold
          + icon size 18 stroke 2 so the buttons read substantial, not
          skinny. Owner direction 2026-05-14 14:45 : "ces boutons sont au
          régime, donne leur à manger". Appel = filled fg/bg ; écrire =
          ghost outline. Uppercase + tracking-[0.15em] keeps the SN mono
          chrome readable at this larger size. */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:mt-auto lg:pt-6">
        <a
          href="tel:+41215550000"
          aria-label={t('dock.call')}
          className={cn(
            'bg-fg text-bg border-fg hover:bg-fg/90 focus-visible:ring-accent',
            'inline-flex h-14 flex-1 items-center justify-center gap-2.5 rounded-md border font-mono text-sm font-semibold tracking-[0.15em] whitespace-nowrap uppercase',
            'duration-base transition-[border-color,background-color]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
        >
          <Phone size={18} strokeWidth={2} aria-hidden="true" />
          <span>{t('dock.call')}</span>
        </a>
        <a
          href="mailto:salvatore@sawnext.studio"
          aria-label={t('dock.write')}
          className={cn(
            'border-fg/30 text-fg hover:border-fg/60 hover:bg-bg/40 focus-visible:ring-accent',
            'inline-flex h-14 flex-1 items-center justify-center gap-2.5 rounded-md border bg-transparent font-mono text-sm font-semibold tracking-[0.15em] whitespace-nowrap uppercase',
            'duration-base transition-[border-color,background-color]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
        >
          <Mail size={18} strokeWidth={2} aria-hidden="true" />
          <span>{t('dock.write')}</span>
        </a>
      </div>
    </section>
  );
};

/* ─── Section: Recent inquiries (full width on every viewport) ── */
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
          className="text-muted hover:text-fg duration-base font-mono text-[10px] tracking-widest uppercase transition-colors"
        >
          {t('common.viewAll')} →
        </Link>
      </header>
      {loading ? (
        <ul className="divide-fg/10 mt-4 divide-y">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex flex-col gap-2 py-4">
              <Skeleton className="h-3 w-1/3 rounded-full" />
              <Skeleton className="h-4 w-2/3 rounded-full" />
            </li>
          ))}
        </ul>
      ) : inquiries.length === 0 ? (
        <p className="text-muted mt-4 text-sm">{t('account.noInquiries')}</p>
      ) : (
        <ul className="divide-fg/10 mt-4 divide-y">
          {inquiries.map(inq => (
            <li
              key={inq.id}
              className="flex flex-col gap-2 py-4 transition-[padding] duration-300 ease-out hover:pl-2 md:flex-row md:items-center md:justify-between md:gap-6"
            >
              <div className="flex min-w-0 flex-col gap-1.5 md:flex-1">
                <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
                  {t(`inquiry.sourceLabel.${inq.source}`)} ·{' '}
                  {new Date(inq.createdAt).toLocaleDateString(i18n.language)}
                </span>
                <span className="text-fg text-sm leading-relaxed md:text-base">
                  {inq.message ?? '—'}
                </span>
              </div>
              <div className="shrink-0">
                <StatusPill variant={inq.status} label={t(`inquiry.status.${inq.status}`)} />
              </div>
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
    <div className="w-full">
      {/* Row 1 : Greeting — full width banner */}
      <div className="border-fg/10 border-b">
        <GreetingSection />
      </div>

      {/* Row 2 : Action grid — 1 col mobile, 3 cols desktop (5/3/4 spans).
          Each cell carries its own divider that resolves to a horizontal
          border below lg and a vertical border at lg+. Conciergerie is in
          inverted palette so it remains the visual anchor at every
          viewport — Salva = the human hub. */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="border-fg/10 border-b lg:col-span-5 lg:border-r lg:border-b-0">
          <PersonalisedRequestSection />
        </div>
        <div className="border-fg/10 border-b lg:col-span-3 lg:border-r lg:border-b-0">
          <ExclusiveSection />
        </div>
        <div className="lg:col-span-4">
          <ConciergeSection />
        </div>
      </div>

      {/* Row 3 : Inquiries — full width, list flows edge-to-edge */}
      <div className="border-fg/10 border-t">
        <RecentInquiriesSection loading={loading} />
      </div>
    </div>
  );
}
