// ═══════════════════════════════════════════════════
// Presentation — landing S03 (structure & méthode)
//
// WHAT: Sticky-pinned section that occupies one viewport height for
//       one viewport of scroll. The inner content (sticky top-0
//       h-screen) shows the section header + a 2-col body with a
//       compact meta dl (left) and three dense paragraphs (right).
//       The triptyque verbs moved to a sibling Method section (S03b).
// WHEN: After Manifesto. Anchored at #s03. Mobile drops the sticky
//       (mobile-first natural scroll).
// CHANGE COPY: landing.presentation.{paragraph1,paragraph2,paragraph3}
//       in fr.json / en.json.
// ═══════════════════════════════════════════════════

import { SectionTag } from '@features/landing/SectionTag';
import { useTranslation } from 'react-i18next';

/** Landing S03 — sticky-pinned presentation block, dense paragraphs. */
export const Presentation = () => {
  const { t } = useTranslation();

  return (
    <section id="s03" className="bg-bg relative h-auto md:h-[180vh]">
      <div className="border-border flex flex-col overflow-hidden border-b px-5 py-20 md:sticky md:top-0 md:h-screen md:px-12 md:py-24">
        {/* ─── Header ─── */}
        <div className="border-border mb-10 grid grid-cols-1 items-end gap-6 border-b pb-6 md:mb-12 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-3">
            <SectionTag num="03" label={t('landing.presentation.tag')} />
            <h2 className="font-mono text-[clamp(1.75rem,4vw,3.5rem)] leading-[0.95] font-medium tracking-tight uppercase">
              {t('landing.presentation.h2line1')} {t('landing.presentation.h2line2')}
            </h2>
          </div>
          <div className="self-end">
            <span aria-hidden="true" className="text-fg mb-3 block text-sm">
              ↘
            </span>
            <p className="text-fg font-mono text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.4] tracking-tight uppercase">
              {t('landing.presentation.lead')}
            </p>
          </div>
        </div>

        {/* ─── Body : meta col + 3 dense paragraphs ─── */}
        <div className="grid flex-1 grid-cols-1 items-start gap-8 overflow-hidden md:grid-cols-[200px_1fr] md:gap-16">
          <dl className="text-muted font-mono text-[10px] leading-loose tracking-widest uppercase">
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

          <div className="text-fg max-w-3xl space-y-6 text-base leading-relaxed md:text-[17px] md:leading-[1.7]">
            <p>{t('landing.presentation.paragraph1')}</p>
            <p>{t('landing.presentation.paragraph2')}</p>
            <p>{t('landing.presentation.paragraph3')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
