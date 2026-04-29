// ═══════════════════════════════════════════════════
// AccountDashboard — member home for /:locale/account
//
// WHAT: Premium concierge dashboard composing 6 sections — greeting,
//       intent prompts, concierge card (Salvatore), inquiries summary,
//       Stories strip, recently-added cross-module. Skeleton loaders
//       simulate the eventual Supabase async swap.
// WHEN: Index route under AppLayout.
// EDIT COPY: src/locales/{fr,en}.json under account.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { CardSkeleton } from '@components/ui/CardSkeleton';
import { Image } from '@components/ui/Image';
import { Skeleton } from '@components/ui/Skeleton';
import { StatusPill } from '@components/ui/StatusPill';
import { ROUTES } from '@constants/routes';
import { IntentCards } from '@features/inquiry/IntentCards';
import { TrustBadge } from '@features/trust/TrustBadge';
import { useFakeLoading } from '@hooks/useFakeLoading';
import { cn } from '@utils/cn';
import { Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { listArticles, listInquiriesForUser } from '@/mocks';
import { listEvents, listProperties, listTimepieces } from '@/mocks';
import { unsplash } from '@/mocks/unsplash';
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
      <h1 className="text-fg text-4xl font-light tracking-tight md:text-6xl">
        {t(`account.greeting.${greetingKey(NOW_HOUR)}`, { name: firstName(currentUser.fullName) })}
      </h1>
      <p className="text-muted max-w-2xl text-base leading-relaxed md:text-lg">
        {t('account.dashboardLede')}
      </p>
    </header>
  );
};

/* ─── Section: Concierge card ────────────────────────── */
const ConciergeCard = () => {
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="concierge-heading"
      className="border-border bg-surface/40 rounded-lg border p-8"
    >
      <h2 id="concierge-heading" className="sr-only">
        {t('account.dashboardTitle')}
      </h2>
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
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
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:+41215550000"
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-5 py-2.5 text-xs tracking-widest uppercase',
              'duration-base transition-[border-color,background-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            <Phone size={14} strokeWidth={1.5} aria-hidden="true" />
            {t('dock.call')}
          </a>
          <a
            href="mailto:salvatore@sawnext.studio"
            className={cn(
              'border-border text-fg hover:border-fg/60 focus-visible:ring-accent',
              'inline-flex items-center gap-3 rounded-full border px-5 py-2.5 text-xs tracking-widest uppercase',
              'duration-base transition-[border-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            <Mail size={14} strokeWidth={1.5} aria-hidden="true" />
            {t('dock.write')}
          </a>
        </div>
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
        <ul className="border-border divide-border divide-y rounded-lg border">
          {inquiries.map(inq => (
            <li key={inq.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-fg text-sm">{inq.message ?? '—'}</span>
                <span className="text-muted text-xs tracking-widest uppercase">
                  {t(`inquiry.sourceLabel.${inq.source}`)} ·{' '}
                  {new Date(inq.createdAt).toLocaleDateString(i18n.language)}
                </span>
              </div>
              <StatusPill variant={inq.status} label={t(`inquiry.status.${inq.status}`)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

/* ─── Section: Stories strip ─────────────────────────── */
const StoriesStripSection = ({ loading }: { loading: boolean }) => {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const stories = listArticles().slice(0, 3);

  return (
    <section aria-labelledby="stories-heading" className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 id="stories-heading" className="text-fg text-2xl font-light">
          {t('account.news.heading')}
        </h2>
        <Link
          to={localePath(ROUTES.ACCOUNT_NEWS)}
          className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
        >
          {t('common.viewAll')} →
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} ratio="3/2" />)
          : stories.map(story => (
              <Link
                key={story.id}
                to={localePath(ROUTES.ACCOUNT_NEWS + '/' + story.slug)}
                className="group focus-visible:ring-accent block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Image
                  src={story.cover.src}
                  alt={story.cover.alt}
                  ratio="3/2"
                  className="duration-slow transition-transform group-hover:scale-[1.02]"
                />
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-muted text-xs tracking-widest uppercase">
                    {t(`articles.kind.${story.kind}`)} ·{' '}
                    {new Date(story.publishedAt).toLocaleDateString(i18n.language, {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  <span className="text-fg text-base font-medium">{story.title}</span>
                  <span className="text-muted line-clamp-2 text-sm leading-relaxed">
                    {story.excerpt}
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};

/* ─── Section: Recently added cross-module ───────────── */
const RecentlyAddedSection = ({ loading }: { loading: boolean }) => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const property = listProperties()[0]!;
  const timepiece = listTimepieces()[0]!;
  const event = listEvents()[0]!;
  const featured = [
    {
      kind: 'properties' as const,
      title: property.title,
      image: property.images[0],
      href: localePath(`/account/properties/${property.slug}`),
    },
    {
      kind: 'timepieces' as const,
      title: `${timepiece.brand} ${timepiece.model}`,
      image: timepiece.images[0],
      href: localePath(`/account/timepieces/${timepiece.slug}`),
    },
    {
      kind: 'events' as const,
      title: event.title,
      image: event.images[0],
      href: localePath(`/account/events/${event.slug}`),
    },
  ];

  return (
    <section aria-labelledby="recent-heading" className="space-y-6">
      <h2 id="recent-heading" className="text-fg text-2xl font-light">
        {t('account.recentlyAdded')}
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} ratio="3/4" />)
          : featured.map(({ kind, title, image, href }) => (
              <Link
                key={href}
                to={href}
                className="group focus-visible:ring-accent block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Image
                  src={image?.src ?? unsplash('luxury-product')}
                  alt={image?.alt ?? title}
                  ratio="3/4"
                  className="duration-slow transition-transform group-hover:scale-[1.02]"
                />
                <div className="mt-4 flex flex-col gap-1">
                  <span className="text-muted text-xs tracking-widest uppercase">
                    {t(`account.nav.${kind}`)}
                  </span>
                  <span className="text-fg text-sm font-medium">{title}</span>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default function AccountDashboard() {
  const loading = useFakeLoading(450);

  return (
    <Container size="xl">
      <div className="space-y-16 py-12">
        <GreetingSection />
        <div>
          <TrustBadge />
        </div>
        <IntentCards />
        <ConciergeCard />
        <RecentInquiriesSection loading={loading} />
        <StoriesStripSection loading={loading} />
        <RecentlyAddedSection loading={loading} />
      </div>
    </Container>
  );
}
