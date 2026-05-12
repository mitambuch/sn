// ═══════════════════════════════════════════════════
// Presentation — landing S03 (structure & méthode)
//
// WHAT: 2-column header (h2 left, lead quote + method triptyque right
//       below it) followed by a 2-column body (meta dl + three dense
//       paragraphs). The method triptyque (Identifier / Structurer /
//       Faciliter) lives compactly under the lead quote — owner
//       direction 2026-05-13 : "sur la colonne de droite (sous ↘ Lead)
//       donc plus petit". No sticky pinning here : the content is
//       dense and would not fit in one viewport with the triptyque
//       added.
// WHEN: After Manifesto. Anchored at #s03.
// CHANGE COPY: landing.presentation.{paragraph1,paragraph2,paragraph3}
//       + landing.method.{identify,structure,facilitate}.{title,desc}
//       in fr.json / en.json.
// ═══════════════════════════════════════════════════

import { SectionTag } from '@features/landing/SectionTag';
import { useTranslation } from 'react-i18next';

const VERBS = ['identify', 'structure', 'facilitate'] as const;

/** Landing S03 — sober presentation + compact method triptyque (right col). */
export const Presentation = () => {
  const { t } = useTranslation();

  return (
    <section id="s03" className="border-border bg-bg border-b px-5 py-20 md:px-12 md:py-28">
      {/* ─── Header : h2 + (lead quote + compact triptyque) ─── */}
      <div className="border-border mb-16 grid grid-cols-1 items-start gap-10 border-b pb-10 md:grid-cols-2 md:gap-16">
        {/* Left : SectionTag + h2 */}
        <div className="flex flex-col gap-4">
          <SectionTag num="03" label={t('landing.presentation.tag')} />
          <h2 className="font-mono text-[clamp(1.75rem,4vw,3.5rem)] leading-[0.95] font-medium tracking-tight uppercase">
            {t('landing.presentation.h2line1')} {t('landing.presentation.h2line2')}
          </h2>
        </div>

        {/* Right : lead quote + method triptyque (compact, hairline rows) */}
        <div className="flex flex-col gap-10">
          <div>
            <span aria-hidden="true" className="text-fg mb-3 block text-sm">
              ↘
            </span>
            <p className="text-fg font-mono text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.4] tracking-tight uppercase">
              {t('landing.presentation.lead')}
            </p>
          </div>

          {/* Method triptyque — compact, hairline rows, no Card box */}
          <div className="border-border border-t">
            {VERBS.map((verb, i) => (
              <div
                key={verb}
                className="border-border flex flex-col gap-2 border-b py-4 md:flex-row md:items-baseline md:gap-6"
              >
                <span className="text-muted shrink-0 font-mono text-[10px] tracking-widest uppercase md:w-24">
                  {String(i + 1).padStart(2, '0')} · {t('landing.method.act')}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="text-fg font-mono text-[clamp(1.125rem,1.8vw,1.5rem)] leading-tight font-medium tracking-tight uppercase">
                    {t(`landing.method.${verb}.title`)}
                  </h3>
                  <p className="text-muted text-[13px] leading-relaxed">
                    {t(`landing.method.${verb}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Body : meta dl + 3 dense paragraphs ─── */}
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[200px_1fr] md:gap-16">
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
    </section>
  );
};
