// ═══════════════════════════════════════════════════
// CatalogueProactiveBanner — bottom-of-list "didn't find what you want?"
//
// WHAT: A bordered, monochrome banner pinned at the bottom of every
//       list page. Headline + lede + lucide Sparkles icon + CTA opening
//       the BespokeRequestDrawer pre-filled with the page's domain.
// WHEN: Mount inside any catalogue list page (Properties, Timepieces,
//       Artworks, Events, Journeys, Concierge, News).
// CHANGE COPY: src/locales/{fr,en}.json under bespoke.banner.* and pass
//              `domain` to pre-select the matching chip.
// ═══════════════════════════════════════════════════

import { BespokeRequestDrawer } from '@features/inquiry/BespokeRequestDrawer';
import { cn } from '@utils/cn';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Domain = 'property' | 'timepiece' | 'artwork' | 'event' | 'journey' | 'concierge' | 'other';

interface CatalogueProactiveBannerProps {
  domain?: Domain;
  className?: string;
}

export const CatalogueProactiveBanner = ({ domain, className }: CatalogueProactiveBannerProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside
        aria-label={t('bespoke.banner.eyebrow')}
        className={cn(
          'border-border bg-surface/40 mt-12 flex flex-col gap-6 rounded-lg border p-8',
          'md:flex-row md:items-center md:justify-between md:p-10',
          className,
        )}
      >
        <div className="flex items-start gap-4">
          <span className="border-border bg-bg text-fg hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border md:flex">
            <Sparkles size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-2">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('bespoke.banner.eyebrow')}
            </span>
            <h2 className="text-fg font-mono text-2xl leading-snug font-bold uppercase">
              {t(`bespoke.banner.${domain ?? 'generic'}.title`, {
                defaultValue: t('bespoke.banner.generic.title'),
              })}
            </h2>
            <p className="text-muted max-w-2xl text-sm leading-relaxed md:text-base">
              {t(`bespoke.banner.${domain ?? 'generic'}.lede`, {
                defaultValue: t('bespoke.banner.generic.lede'),
              })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent shrink-0',
            'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
            'duration-base transition-[border-color,background-color,transform]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'motion-safe:hover:scale-[1.02]',
          )}
        >
          {t('bespoke.banner.cta')}
          <span aria-hidden="true">→</span>
        </button>
      </aside>

      <BespokeRequestDrawer
        open={open}
        onClose={() => setOpen(false)}
        {...(domain ? { initialDomain: domain } : {})}
      />
    </>
  );
};
