// ═══════════════════════════════════════════════════
// PublicFichePanel — read-only public catalogue fiche body (no chrome)
//
// WHAT: The fiche content for a `visibility == "public"` catalogue doc —
//       hero image, type eyebrow, title, event date/venue, summary,
//       description, gallery, and a bottom "demander un accès" CTA. ZERO
//       routing, ZERO frame: the shell (a Modal) owns the close button +
//       backdrop. Pattern: patterns/2026-06-04-shared-panel-two-shells.md.
// WHEN: Rendered inside PublicFicheModal, opened from the home 08.A teaser.
// CLEAN: every field renders ONLY when non-empty — no empty gallery, no
//        empty description, no "—" placeholders. A missing block disappears.
// ═══════════════════════════════════════════════════

import { GalleryGrid } from '@components/ui/GalleryGrid';
import { Image } from '@components/ui/Image';
import { usePublicFiche } from '@features/landing/usePublicFiche';
import { useTranslation } from 'react-i18next';

import { localeStr } from '@/utils/localeString';

interface PublicFichePanelProps {
  type: string | undefined;
  id: string | undefined;
  /** Express interest in this experience — the shell opens the contact form.
   *  Receives the resolved experience title so the lead carries its context. */
  onExpressInterest: (experienceTitle: string) => void;
}

/** The read-only fiche, fields self-hiding when empty. */
export const PublicFichePanel = ({ type, id, onExpressInterest }: PublicFichePanelProps) => {
  const { t, i18n } = useTranslation();
  const { fiche, loading } = usePublicFiche(type, id);
  // Active locale → passed to localeStr() so any field that arrives as a raw
  // {fr,en,es} object (e.g. an image alt the projection didn't flatten) resolves
  // to the visitor's language instead of collapsing to FR.
  const locale = i18n.language === 'en' ? 'en' : i18n.language === 'es' ? 'es' : 'fr';

  if (loading) {
    return (
      <div className="text-muted py-16 text-center font-mono text-xs tracking-widest uppercase">
        {t('common.loading')}
      </div>
    );
  }

  if (!fiche) {
    return (
      <div className="flex flex-col gap-3 py-12 text-center">
        <h2 className="font-mono text-xl font-medium tracking-tight uppercase">
          {t('share.status.notFoundTitle')}
        </h2>
        <p className="text-muted text-sm leading-relaxed">{t('share.status.notFound')}</p>
      </div>
    );
  }

  const title = localeStr(fiche.title, locale);
  const summary = localeStr(fiche.summary, locale);
  const description = localeStr(fiche.description, locale);
  const heroSrc = fiche.heroImage?.src ?? fiche.images?.[0]?.src;
  const heroAlt =
    localeStr(fiche.heroImage?.alt, locale) ||
    localeStr(fiche.images?.[0]?.alt, locale) ||
    title ||
    t('share.fallbackTitle');

  // Prominent date + place line (events only) — present only when in the data.
  const isEvent = fiche._type === 'event';
  const heroDate = (() => {
    if (!isEvent) return '';
    const mode = fiche.dateMode ?? 'exact';
    if (mode === 'exact' && fiche.startsAt) {
      return new Date(fiche.startsAt).toLocaleDateString(i18n.language, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (mode === 'allYear') return t('share.value.allYear');
    return localeStr(fiche.dateLabel, locale) || t('share.value.onRequest');
  })();
  const heroVenue = isEvent
    ? [localeStr(fiche.venue, locale), localeStr(fiche.city, locale)].filter(Boolean).join(' · ')
    : '';

  const galleryImages = (fiche.images ?? []).slice(1);
  const programme = fiche.programme ?? [];
  const capabilities = fiche.capabilities ?? [];

  return (
    <article className="flex flex-col gap-7">
      {/* Top — hero + title side by side on desktop so the fiche reads WIDE and
          SHORT instead of one tall column (owner: desktop, éviter un scroll trop
          long). Mobile keeps the natural stacked order (md:flex-row collapses).
          Hero only renders when there's an image — no broken-image, no empty box. */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        {heroSrc && (
          <div className="bg-surface relative shrink-0 overflow-hidden rounded-lg md:w-1/2">
            <Image src={heroSrc} alt={heroAlt} ratio="16/9" eager />
          </div>
        )}

        <header className="flex flex-1 flex-col gap-3">
          <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            {t(`share.docType.${fiche._type}`)}
          </span>
          <h2 className="font-mono text-2xl leading-tight font-medium tracking-tight uppercase md:text-3xl">
            {title || t('share.fallbackTitle')}
          </h2>
          {(heroDate || heroVenue) && (
            <div className="flex flex-col gap-1 pt-1 font-sans normal-case">
              {heroDate && (
                <p className="text-fg text-lg leading-tight font-medium first-letter:uppercase">
                  {heroDate}
                </p>
              )}
              {heroVenue && <p className="text-muted text-base">{heroVenue}</p>}
            </div>
          )}
          {summary && (
            <p className="text-fg/85 pt-2 font-sans text-base leading-relaxed text-pretty normal-case">
              {summary}
            </p>
          )}
        </header>
      </div>

      {/* Description — hidden when empty. Capped width so lines stay readable
          even in the wide desktop modal. */}
      {description && (
        <section className="border-fg/10 flex flex-col gap-3 border-t pt-6">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('share.section.description')}
          </span>
          <p className="text-muted max-w-3xl font-sans leading-relaxed whitespace-pre-line normal-case">
            {description}
          </p>
        </section>
      )}

      {/* Programme — the full ordered steps of the experience (events show an
          hour, concierge experiences don't). Self-hiding when empty. */}
      {programme.length > 0 && (
        <section className="border-fg/10 flex flex-col gap-5 border-t pt-6">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('share.section.programme')}
          </span>
          <ol className="flex flex-col gap-6">
            {programme.map((step, i) => {
              const stepLabel = localeStr(step.label, locale);
              const stepDesc = localeStr(step.description, locale);
              const stepTime = localeStr(step.time, locale);
              return (
                <li key={i} className="border-fg/15 flex flex-col gap-1.5 border-l-2 pl-4 sm:pl-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {stepTime && (
                      <span className="text-fg font-mono text-xs tracking-wider tabular-nums">
                        {stepTime}
                      </span>
                    )}
                    <span className="text-fg font-sans text-sm font-medium normal-case">
                      {stepLabel}
                    </span>
                  </div>
                  {stepDesc && (
                    <p className="text-muted max-w-2xl font-sans text-sm leading-relaxed normal-case">
                      {stepDesc}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* What's included — concierge experiences' capability bullet list. */}
      {capabilities.length > 0 && (
        <section className="border-fg/10 flex flex-col gap-3 border-t pt-6">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('share.section.included')}
          </span>
          <ul className="flex flex-col gap-2">
            {capabilities.map((cap, i) => (
              <li key={i} className="text-muted flex gap-2 font-sans text-sm normal-case">
                <span aria-hidden="true" className="text-fg/40">
                  —
                </span>
                <span>{localeStr(cap, locale)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Gallery — hidden unless there are photos beyond the hero */}
      {galleryImages.length > 0 && (
        <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('share.section.gallery')}
          </span>
          <GalleryGrid
            images={galleryImages.map(img => ({ src: img.src, alt: localeStr(img.alt, locale) }))}
          />
        </section>
      )}

      {/* Bottom CTA — express interest in this experience. Opens a simple
          contact form (the shell decides how), NOT the access/invitation
          tunnel: a public experience needs a low-friction contact. */}
      <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
        <div className="flex flex-col gap-1">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('share.interest.title')}
          </span>
          <p className="text-muted font-sans text-sm leading-relaxed normal-case">
            {t('share.interest.lede')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onExpressInterest(title || t('share.fallbackTitle'));
          }}
          className="border-fg bg-fg text-bg hover:bg-fg/90 inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
        >
          {t('share.interest.cta')}
          <span aria-hidden="true">↗</span>
        </button>
      </section>
    </article>
  );
};
