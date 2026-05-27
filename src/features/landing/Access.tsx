// ═══════════════════════════════════════════════════
// Access — landing S08 (catalogue teaser + cooptation gate)
//
// WHAT: v3 — owner direction "cette section doit plus être une sorte de
//       teasing des offres qu'on peut avoir si on est inscrit". Reuses
//       the backend <Card> primitive (same look as /account/catalogue)
//       to render a 4-up preview : 2 real event teasers (Cloudinary
//       imagery) + 2 off-market placeholders rendered with
//       <MonoGradientPlaceholder> as media. CTAs at the bottom open
//       the global AccessRequestModal (form / code) — "demander un
//       accès" is no longer the section identity, it's the closing
//       move after the teaser.
// WHEN: Anchored at #s08, après Domaines et avant Interlocutor.
// CHANGE COPY: src/locales/{fr,en}.json under landing.access.*
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { MonoGradientPlaceholder } from '@components/ui/MonoGradientPlaceholder';
import { useLandingContext } from '@context/LandingContentContext';
import { useAccessRequestModal } from '@context/useAccessRequestModal';
import { SectionTag } from '@features/landing/SectionTag';
import { useReveal } from '@hooks/useReveal';
import { resolveFieldOrFallback } from '@lib/i18nField';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';

import { isVitrineMode } from '@/config/env';
import { unsplash } from '@/mocks/unsplash';

interface EventTeaser {
  imgSlug: string;
  imgAlt: string;
  keyBase: 'evt01' | 'evt02';
  day: string;
  month: string;
}

const EVENTS: EventTeaser[] = [
  {
    imgSlug: 'geneva-united-nations-gala',
    imgAlt: 'Palais des Nations en gala',
    keyBase: 'evt01',
    day: '14',
    month: 'juin',
  },
  {
    imgSlug: 'art-basel-fair',
    imgAlt: 'Art Basel galerie principale',
    keyBase: 'evt02',
    day: '16',
    month: 'juin',
  },
];

const LOCKED_KEYS = ['locked1', 'locked2', 'locked3', 'locked4'] as const;

/** Landing S08 — catalogue teaser + cooptation gate. */
export const Access = () => {
  const { t, i18n } = useTranslation();
  const { data: landing } = useLandingContext();
  const locale = (i18n.language as 'fr' | 'en') ?? 'fr';
  const ref = useReveal<HTMLDivElement>();
  const { openAccessRequest } = useAccessRequestModal();

  return (
    <section id="s08" data-landing-dark="true" data-theme="dark" className="bg-ink text-white">
      <div
        ref={ref}
        className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-24 md:gap-20 md:px-12 md:py-32"
      >
        {/* ─── Header ─── */}
        <header className="flex flex-col gap-6">
          <SectionTag
            num="08.A"
            label={resolveFieldOrFallback(
              landing?.accessEyebrow,
              locale,
              t('landing.access.eyebrow'),
            )}
          />
          <h2 className="max-w-5xl font-mono text-[clamp(1.75rem,4vw,4rem)] leading-[0.95] font-medium tracking-tight uppercase">
            {resolveFieldOrFallback(landing?.accessTitleA, locale, t('landing.access.heroTitleA'))}
            <br />
            <span className="text-white/60">
              {resolveFieldOrFallback(
                landing?.accessTitleB,
                locale,
                t('landing.access.heroTitleB'),
              )}
            </span>
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            {resolveFieldOrFallback(landing?.accessLede, locale, t('landing.access.heroLede'))}
          </p>
        </header>

        {/* ─── Catalogue teaser — backend Card style, 4-up ─── */}
        <div className="flex flex-col gap-6">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
            {resolveFieldOrFallback(
              landing?.accessEventsEyebrow,
              locale,
              t('landing.access.eventsEyebrow'),
            )}
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {/* Real event teasers — Cloudinary imagery */}
            {EVENTS.map(evt => (
              <Card key={evt.keyBase} padding="none" className="border-white/15">
                <Card.Media src={unsplash(evt.imgSlug)} alt={evt.imgAlt} ratio="4/3" />
                <Card.Badge top={evt.day} bottom={evt.month} />
                <Card.Body>
                  <Card.Eyebrow className="text-white/60">
                    {t(`landing.access.${evt.keyBase}.tag`)}
                  </Card.Eyebrow>
                  <Card.Title className="text-white">
                    {t(`landing.access.${evt.keyBase}.title`)}
                  </Card.Title>
                  <Card.Meta className="text-xs leading-relaxed text-white/55">
                    {t(`landing.access.${evt.keyBase}.venue`)}
                  </Card.Meta>
                </Card.Body>
              </Card>
            ))}

            {/* Off-market placeholders — MonoGradientPlaceholder as media */}
            {LOCKED_KEYS.slice(0, 2).map(key => (
              <Card key={key} padding="none" className="border-white/15">
                <div className="bg-ink relative aspect-4/3 w-full overflow-hidden">
                  <MonoGradientPlaceholder tone="dark" className="absolute inset-0 h-full w-full" />
                </div>
                <Card.Body>
                  <Card.Eyebrow className="text-white/60">
                    {t(`landing.access.${key}.tag`)}
                  </Card.Eyebrow>
                  <Card.Title className="text-white">{t(`landing.access.${key}.title`)}</Card.Title>
                  <Card.Meta className="text-xs leading-relaxed text-white/55">
                    {t(`landing.access.${key}.stat`)}
                  </Card.Meta>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        {/* ─── Off-market secondary row (2 more locked teasers, compact) ─── */}
        <div className="flex flex-col gap-6">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
            {resolveFieldOrFallback(
              landing?.accessLockedEyebrow,
              locale,
              t('landing.access.lockedEyebrow'),
            )}
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LOCKED_KEYS.slice(2).map(key => (
              <Card key={key} padding="none" className="border-white/15">
                <div className="grid grid-cols-[140px_1fr]">
                  <div className="bg-ink relative overflow-hidden">
                    <MonoGradientPlaceholder
                      tone="dark"
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  <Card.Body density="spacious" className="gap-2">
                    <Card.Eyebrow className="text-white/60">
                      {t(`landing.access.${key}.tag`)}
                    </Card.Eyebrow>
                    <Card.Title className="text-white" size="base">
                      {t(`landing.access.${key}.title`)}
                    </Card.Title>
                    <Card.Meta className="text-xs leading-relaxed text-white/55">
                      {t(`landing.access.${key}.stat`)}
                    </Card.Meta>
                  </Card.Body>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ─── Bottom CTA strip — cooptation gate ─── */}
        <div className="flex flex-col gap-6 border-t border-white/15 pt-12 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">
            {t('landing.access.modal.lede')}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => {
                openAccessRequest('request');
              }}
              className={cn(
                'text-ink inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-mono text-xs tracking-[0.3em] uppercase',
                'duration-base transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none',
              )}
            >
              {t('landing.access.ctaRequest')}
              <span aria-hidden="true">↗</span>
            </button>
            {isVitrineMode ? null : (
              <button
                type="button"
                onClick={() => {
                  openAccessRequest('code');
                }}
                className={cn(
                  'inline-flex items-center justify-center gap-3 rounded-full border border-white/40 px-7 py-4 font-mono text-xs tracking-[0.3em] text-white uppercase',
                  'duration-base transition-colors hover:border-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none',
                )}
              >
                {t('landing.access.ctaCode')}
                <span aria-hidden="true">↗</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
