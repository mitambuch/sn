// ═══════════════════════════════════════════════════
// ConciergeDetail — /:locale/account/concierge/:slug
//
// Service capability page: long description, anonymised case studies
// (Context → Outcome), lead-time, then a custom inquiry form.
// No item gallery, no on-request price — service is sur-mesure.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { Image } from '@components/ui/Image';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Timeline } from '@components/ui/Timeline';
import { ROUTES } from '@constants/routes';
import { SimilarItemsStrip } from '@features/catalogue/SimilarItemsStrip';
import { InquiryDrawer } from '@features/inquiry/InquiryDrawer';
import { useSanityItem } from '@hooks/useSanityItem';
import { cn } from '@utils/cn';
import { humanizeToken } from '@utils/humanizeToken';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';

import { GROQ_CONCIERGE_DETAIL } from '@/lib/sanityQueries';
import { getConciergeService } from '@/mocks';
import type { ConciergeService } from '@/types/concierge';

export default function ConciergeDetail() {
  const { t, i18n } = useTranslation();
  const { localePath } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const mockService = slug ? getConciergeService(slug) : null;
  const { data: service } = useSanityItem<ConciergeService>({
    query: slug ? GROQ_CONCIERGE_DETAIL(slug) : '',
    gateModule: 'conciergeService',
    gateSlug: slug,
    fallback: mockService ?? null,
  });
  if (!service) return <Navigate to={localePath(ROUTES.ACCOUNT_CONCIERGE)} replace />;

  // category: mock enum → i18n label; Sanity value with no key → humanise.
  const catKey = `concierge.category.${service.category}`;
  const catLabel = i18n.exists(catKey) ? t(catKey) : humanizeToken(service.category);

  return (
    <Container size="xl">
      <div className="space-y-16 py-12">
        <SectionHeader
          eyebrow={catLabel}
          title={service.title}
          lede={service.summary}
          size="md"
          as="h1"
        />

        {service.images[0] && (
          <Image
            src={service.images[0].src}
            alt={service.images[0].alt}
            ratio="16/9"
            eager
            wrapperClassName="bg-surface rounded-lg"
          />
        )}

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <p className="text-fg text-lg leading-relaxed text-pretty">{service.description}</p>

            {service.programme && service.programme.length > 0 && (
              <div className="space-y-4">
                <SectionHeader title={t('concierge.programme')} size="sm" as="h2" />
                <Timeline
                  items={service.programme.map(step => ({
                    title: step.label,
                    ...(step.description ? { description: step.description } : {}),
                  }))}
                />
              </div>
            )}
          </div>
          <aside className="border-border bg-surface/40 space-y-4 rounded-lg border p-6">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('concierge.leadTime')}
            </span>
            <p className="text-fg text-base">{service.leadTime}</p>
            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className={cn(
                'mt-4 w-full',
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center justify-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {t('common.expressInterest')}
              <span aria-hidden="true">→</span>
            </button>
          </aside>
        </div>

        {service.caseStudies && service.caseStudies.length > 0 && (
          <div className="space-y-6">
            <SectionHeader title={t('concierge.caseStudies')} size="sm" as="h2" />
            <ul className="border-border divide-border divide-y rounded-lg border">
              {service.caseStudies.map(cs => (
                <li key={cs.context} className="px-6 py-4">
                  <p className="text-muted text-xs tracking-widest uppercase">{cs.context}</p>
                  <p className="text-fg mt-2 text-sm leading-relaxed">{cs.outcome}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <SimilarItemsStrip module="concierge" currentSlug={service.slug} />

        <Link
          to={localePath(ROUTES.ACCOUNT_CONCIERGE)}
          className="text-muted hover:text-fg duration-base inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors"
        >
          ← {t('common.back')}
        </Link>
      </div>

      <InquiryDrawer
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        source="concierge"
        itemTitle={service.title}
        targetId={service.id}
      />
    </Container>
  );
}
