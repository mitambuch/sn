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
import { ExperienceInterestModal } from '@features/landing/ExperienceInterestModal';
import { PublicFicheModal } from '@features/landing/PublicFicheModal';
import { SectionTag } from '@features/landing/SectionTag';
import { type PublicCatalogueType, usePublicCatalogue } from '@features/landing/usePublicCatalogue';
import { useReveal } from '@hooks/useReveal';
import { resolveFieldOrFallback } from '@lib/i18nField';
import { cn } from '@utils/cn';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isVitrineMode } from '@/config/env';

/** Total tiles in the 08.A teaser — real public items first, then locked
 *  cadenas teasers fill the rest. "Max 6 vignettes" (owner 2026-06-17). */
const MAX_TILES = 6;

/** _type → i18n label key for the card eyebrow (reuses the member nav labels). */
const TYPE_LABEL: Record<PublicCatalogueType, string> = {
  event: 'account.nav.events',
  journey: 'account.nav.journeys',
  property: 'account.nav.properties',
  timepiece: 'account.nav.timepieces',
  artwork: 'account.nav.artworks',
  conciergeService: 'account.nav.concierge',
  article: 'account.nav.news',
};

/** Landing S08 — catalogue teaser + cooptation gate. */
export const Access = () => {
  const { t, i18n } = useTranslation();
  const { data: landing } = useLandingContext();
  const locale = (i18n.language as 'fr' | 'en') ?? 'fr';
  const ref = useReveal<HTMLDivElement>();
  const { openAccessRequest } = useAccessRequestModal();
  const { items } = usePublicCatalogue();
  // Which public item the fiche popup is showing (null = closed).
  const [ficheItem, setFicheItem] = useState<{ type: PublicCatalogueType; id: string } | null>(
    null,
  );
  // The experience the contact form is open for (null = closed). Opened from a
  // fiche CTA — a public experience gets a simple contact, not the access tunnel.
  const [interestFor, setInterestFor] = useState<string | null>(null);

  // Real public items first (capped), locked cadenas teasers fill up to MAX_TILES.
  // Only feature items that ACTUALLY have an image — a teaser tile with no photo
  // reads as broken (regression after the teaser broadened to all types: an
  // image-less public article surfaced and rendered a blank gradient tile). An
  // image-less public doc is skipped here; a locked cadenas fills its slot
  // instead. To surface such a doc, upload an image on it in Sanity.
  const shownItems = items.filter(item => item.image?.src).slice(0, MAX_TILES);
  const lockedCount = Math.max(0, MAX_TILES - shownItems.length);

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

        {/* ─── Catalogue teaser — backend Card style, max 6 tiles ───
             ANY catalogue doc tagged `visibility: public` (event, journey,
             property…) shown clearly + LOCKED cadenas cards filling up to 6
             so the visitor feels there's more behind access. Every card opens
             the AccessRequestModal — the teaser is a funnel. No public doc
             published yet ⇒ the row gracefully shows locked cards only (no
             fake fiche). Owner 2026-06-17 : "si un événement est tag public on
             le met, max 6 vignettes ... reprends le petit cadenas". */}
        <div className="flex flex-col gap-6">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
            {resolveFieldOrFallback(
              landing?.accessEventsEyebrow,
              locale,
              t('landing.access.eventsEyebrow'),
            )}
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {/* Real public items (ANY type tagged public) — clear, clickable.
                Opens the read-only fiche as a popup OVER the landing (owner
                2026-06-17 : modal, not a separate page). The bottom CTAs remain
                the cooptation gate. */}
            {shownItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFicheItem({ type: item.type, id: item.id });
                }}
                aria-label={t('landing.access.cardOpenAria', { title: item.title })}
                className="rounded-card block text-left focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
              >
                <Card interactive padding="none" className="h-full border-white/15">
                  <Card.Media
                    src={item.image?.src}
                    alt={item.image?.alt ?? item.title}
                    ratio="4/3"
                  />
                  <Card.Body>
                    <Card.Eyebrow className="text-white/60">
                      {t(TYPE_LABEL[item.type])}
                    </Card.Eyebrow>
                    <Card.Title className="text-white">{item.title}</Card.Title>
                  </Card.Body>
                </Card>
              </button>
            ))}

            {/* Locked cadenas teasers — content redacted + veiled, hover lifts
                the blur a touch. Click opens access. */}
            {Array.from({ length: lockedCount }).map((_, i) => (
              <button
                key={`locked-${String(i)}`}
                type="button"
                onClick={() => {
                  openAccessRequest('request');
                }}
                aria-label={t('landing.access.lockedAria')}
                className="group/locked rounded-card block text-left focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
              >
                <Card interactive padding="none" className="relative h-full border-white/15">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none blur-[6px] saturate-0 transition-[filter] duration-500 ease-out select-none group-hover/locked:blur-[3px]"
                  >
                    <div className="bg-ink relative aspect-4/3 w-full overflow-hidden">
                      <MonoGradientPlaceholder
                        tone="dark"
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-3 p-5">
                      <span className="block h-2 w-1/3 rounded-full bg-white/15" />
                      <span className="block h-4 w-3/4 rounded-full bg-white/25" />
                      <span className="block h-2 w-1/2 rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white">
                      <Lock size={16} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-white uppercase">
                      {t('landing.access.lockedLabel')}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.18em] text-white/55 uppercase">
                      {t('landing.access.lockedHint')}
                    </span>
                  </div>
                </Card>
              </button>
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

      {/* Fiche popup over the landing — opened by a teaser card. Its CTA closes
          the fiche then opens the experience contact form (no stacked modals).
          NOTE: this is the EXPERIENCE contact form, not the access tunnel — the
          bottom-strip + cadenas CTAs above still open the access request. */}
      <PublicFicheModal
        item={ficheItem}
        onClose={() => {
          setFicheItem(null);
        }}
        onExpressInterest={experienceTitle => {
          setFicheItem(null);
          setInterestFor(experienceTitle);
        }}
      />

      {/* Experience contact form — simple message + coordinates, posts a lead. */}
      <ExperienceInterestModal
        experienceTitle={interestFor}
        onClose={() => {
          setInterestFor(null);
        }}
      />
    </section>
  );
};
