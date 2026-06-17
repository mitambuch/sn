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
  /** Enter the access tunnel from the fiche CTA (the shell decides how). */
  onRequestAccess: () => void;
}

/** The read-only fiche, fields self-hiding when empty. */
export const PublicFichePanel = ({ type, id, onRequestAccess }: PublicFichePanelProps) => {
  const { t, i18n } = useTranslation();
  const { fiche, loading } = usePublicFiche(type, id);

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

  const title = localeStr(fiche.title);
  const summary = localeStr(fiche.summary);
  const description = localeStr(fiche.description);
  const heroSrc = fiche.heroImage?.src ?? fiche.images?.[0]?.src;
  const heroAlt =
    fiche.heroImage?.alt ?? fiche.images?.[0]?.alt ?? (title || t('share.fallbackTitle'));

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
    return localeStr(fiche.dateLabel) || t('share.value.onRequest');
  })();
  const heroVenue = isEvent
    ? [localeStr(fiche.venue), localeStr(fiche.city)].filter(Boolean).join(' · ')
    : '';

  const galleryImages = (fiche.images ?? []).slice(1);

  return (
    <article className="flex flex-col gap-7">
      {/* Hero — only an image when there is one; otherwise nothing (the eyebrow
          + title carry the fiche). No broken-image silhouette, no empty box. */}
      {heroSrc && (
        <div className="bg-surface relative overflow-hidden rounded-lg">
          <Image src={heroSrc} alt={heroAlt} ratio="16/9" eager />
        </div>
      )}

      {/* Title block */}
      <header className="flex flex-col gap-3">
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

      {/* Description — hidden when empty */}
      {description && (
        <section className="border-fg/10 flex flex-col gap-3 border-t pt-6">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('share.section.description')}
          </span>
          <p className="text-muted font-sans leading-relaxed whitespace-pre-line normal-case">
            {description}
          </p>
        </section>
      )}

      {/* Gallery — hidden unless there are photos beyond the hero */}
      {galleryImages.length > 0 && (
        <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('share.section.gallery')}
          </span>
          <GalleryGrid
            images={galleryImages.map(img => ({ src: img.src, alt: localeStr(img.alt) }))}
          />
        </section>
      )}

      {/* Bottom CTA — enter the access tunnel straight from the fiche */}
      <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
        <div className="flex flex-col gap-1">
          <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
            {t('share.interest.title')}
          </span>
          <p className="text-muted font-sans text-sm leading-relaxed normal-case">
            {t('landing.access.modal.lede')}
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestAccess}
          className="border-fg bg-fg text-bg hover:bg-fg/90 inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
        >
          {t('share.interest.cta')}
          <span aria-hidden="true">↗</span>
        </button>
      </section>
    </article>
  );
};
