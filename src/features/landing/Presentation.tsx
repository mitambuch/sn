// ═══════════════════════════════════════════════════
// Presentation — landing S03 (structure & méthode)
//
// WHAT: 2-column header (h2 + lead quote) above a 3-column body (meta
//       list + two paragraph columns). Establishes who SAW↗NEXT is in
//       sober, factual sentences. No image, no decoration.
// WHEN: After hero + first marquee. Anchored at #s03.
// CHANGE COPY: edit i18n keys under landing.presentation.* in fr.json.
// ═══════════════════════════════════════════════════

import { SectionTag } from '@features/landing/SectionTag';
import { useReveal } from '@hooks/useReveal';
import { useTranslation } from 'react-i18next';

/** Landing S03 — sober presentation block. */
export const Presentation = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="s03" className="border-border border-b px-5 py-24 md:px-12 md:py-32">
      <div ref={ref}>
        {/* ─── Header ─── */}
        <div className="border-border mb-16 grid grid-cols-1 items-end gap-8 border-b pb-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-4">
            <SectionTag num="03" label={t('landing.presentation.tag')} />
            <h2 className="font-mono text-[clamp(1.75rem,4vw,4rem)] leading-[0.95] font-medium tracking-[-0.025em] uppercase">
              {t('landing.presentation.h2line1')}
              <br />
              {t('landing.presentation.h2line2')}
            </h2>
          </div>
          <div className="self-end">
            <span aria-hidden="true" className="text-fg mb-3.5 block text-sm">
              ↘
            </span>
            <p className="text-fg font-mono text-[clamp(1rem,1.7vw,1.375rem)] leading-[1.4] tracking-[-0.01em] uppercase">
              {t('landing.presentation.lead')}
            </p>
          </div>
        </div>

        {/* ─── Body : 3 cols ─── */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[200px_1fr_1fr] md:gap-12">
          {/* col 1 : meta */}
          <dl className="text-muted font-mono text-[10px] leading-[2] tracking-[0.08em] uppercase">
            {(
              [
                ['type', 'typeValue'],
                ['jurisdiction', 'jurisdictionValue'],
                ['accessKey', 'accessValue'],
                ['verticals', 'verticalsValue'],
                ['confidentiality', 'confidentialityValue'],
              ] as const
            ).map(([term, value]) => (
              <div key={term} className="border-border flex justify-between border-b py-2">
                <dt>{t(`landing.presentation.meta.${term}`)}</dt>
                <dd className="text-fg">{t(`landing.presentation.meta.${value}`)}</dd>
              </div>
            ))}
          </dl>

          {/* col 2 : paragraph one */}
          <div className="text-fg space-y-5 text-sm leading-[1.6]">
            <p>{t('landing.presentation.p1')}</p>
            <p>{t('landing.presentation.p2')}</p>
          </div>

          {/* col 3 : paragraph two */}
          <div className="text-fg space-y-5 text-sm leading-[1.6]">
            <p>
              {t('landing.presentation.p3prefix')}{' '}
              <strong className="font-medium">{t('landing.presentation.p3emphasis')}</strong>.{' '}
              {t('landing.presentation.p3suffix')}
            </p>
            <p>{t('landing.presentation.p4')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
