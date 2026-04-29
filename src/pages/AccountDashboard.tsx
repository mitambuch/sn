// ═══════════════════════════════════════════════════
// AccountDashboard — member home for /:locale/account
//
// WHAT: Renders three editorial blocks for a vetted member —
//       (1) the dedicated concierge contact card,
//       (2) the current inquiries summary with status pills,
//       (3) a 3-up curated "recently added" cross-module strip.
//       No vanity stats, no marketing — relationship-focused.
// WHEN: Index route under AppLayout (sidebar nav).
// EDIT COPY: src/locales/{fr,en}.json under account.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Image } from '@components/ui/Image';
import { SectionHeader } from '@components/ui/SectionHeader';
import { StatusPill } from '@components/ui/StatusPill';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { listInquiriesForUser } from '@/mocks';
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

export default function AccountDashboard() {
  const { t } = useTranslation();
  const { localePath } = useLocale();

  const inquiries = listInquiriesForUser(currentUser.id).slice(0, 3);

  // Curated cross-module strip — newest item per module
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
    <Container size="xl">
      <div className="space-y-16 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.dashboardTitle')}
          lede={t('account.dashboardLede')}
          size="md"
          as="h1"
        />

        {/* ─── Concierge card ─── */}
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
                  {t('account.dashboardTitle')}
                </span>
                <p className="text-fg mt-1 text-lg font-medium">{currentUser.conciergeName}</p>
                <p className="text-muted text-sm">salva@sawnext.studio</p>
              </div>
            </div>
            <a
              href="tel:+41215550000"
              className={cn(
                'border-border text-fg hover:border-fg/60 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {t('common.callConcierge')}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* ─── Recent inquiries ─── */}
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
          {inquiries.length === 0 ? (
            <p className="text-muted text-sm">{t('account.noInquiries')}</p>
          ) : (
            <ul className="divide-border border-border divide-y rounded-lg border">
              {inquiries.map(inq => (
                <li key={inq.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-fg text-sm">{inq.message ?? '—'}</span>
                    <span className="text-muted text-xs tracking-widest uppercase">
                      {inq.source} ·{' '}
                      {new Date(inq.createdAt).toLocaleDateString(currentUser.locale)}
                    </span>
                  </div>
                  <StatusPill variant={inq.status} label={t(`inquiry.status.${inq.status}`)} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ─── Recently added — curated 3-up ─── */}
        <section aria-labelledby="recent-heading" className="space-y-6">
          <h2 id="recent-heading" className="text-fg text-2xl font-light">
            {t('account.recentlyAdded')}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map(({ kind, title, image, href }) => (
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
      </div>
    </Container>
  );
}
