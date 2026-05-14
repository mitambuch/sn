// ═══════════════════════════════════════════════════
// Presentation — landing S03 (structure & méthode)
//
// WHAT: Header 2-col (h2 left + lead quote right) followed by a 3-col
//       body : meta dl (left, 180px), dense paragraphs (center, 1fr),
//       compact method triptyque (right, 320px) — owner direction
//       2026-05-13 00:33 : "c'était bien avant comme tu vais fais la
//       mise en page en 3 colonne". Each col stands on its own ; the
//       triptyque lists the three method verbs in hairline rows.
// WHEN: After Manifesto. Anchored at #s03.
// CHANGE COPY: landing.presentation.{paragraph1,paragraph2,paragraph3}
//       + landing.method.{identify,structure,facilitate}.{title,desc}
//       in fr.json / en.json.
// ═══════════════════════════════════════════════════

import { useLandingContext } from '@context/LandingContentContext';
import { SectionTag } from '@features/landing/SectionTag';
import { resolveFieldOrFallback } from '@lib/i18nField';
import { useTranslation } from 'react-i18next';

const VERBS = ['identify', 'structure', 'facilitate'] as const;

/** Landing S03 — 3-col body : meta · paragraphs · method triptyque. */
export const Presentation = () => {
  const { t, i18n } = useTranslation();
  const { data: landing } = useLandingContext();
  const locale = (i18n.language as 'fr' | 'en') ?? 'fr';

  return (
    <section id="s03" className="border-border bg-bg border-b px-5 py-20 md:px-12 md:py-28">
      {/* ─── Header : h2 left + lead quote right ─── */}
      <div className="border-border mb-16 grid grid-cols-1 items-end gap-8 border-b pb-8 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4">
          <SectionTag
            num="03"
            label={resolveFieldOrFallback(
              landing?.presentationEyebrow,
              locale,
              t('landing.presentation.tag'),
            )}
          />
          <h2 className="font-mono text-[clamp(1.75rem,4vw,3.5rem)] leading-[0.95] font-medium tracking-tight uppercase">
            {resolveFieldOrFallback(
              landing?.presentationHeadline,
              locale,
              `${t('landing.presentation.h2line1')} ${t('landing.presentation.h2line2')}`,
            )}
          </h2>
        </div>
        <div className="self-end">
          <span aria-hidden="true" className="text-fg mb-3 block text-sm">
            ↘
          </span>
          <p className="text-fg font-mono text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.4] tracking-tight uppercase">
            {resolveFieldOrFallback(
              landing?.presentationLede,
              locale,
              t('landing.presentation.lead'),
            )}
          </p>
        </div>
      </div>

      {/* ─── Body : mirror header — left = meta + paragraphs sub-grid,
           right = method triptyque (same width as the lead quote above). ─── */}
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
        {/* Left half : meta (180px) + paragraphs (1fr) — sub-grid */}
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[180px_1fr] md:gap-10">
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

          <div className="text-fg space-y-6 text-base leading-relaxed md:text-[17px] md:leading-[1.7]">
            <p>{t('landing.presentation.paragraph1')}</p>
            <p>{t('landing.presentation.paragraph2')}</p>
            <p>{t('landing.presentation.paragraph3')}</p>
          </div>
        </div>

        {/* Right half : method triptyque — same width as lead quote above */}
        <div className="border-border border-t">
          {VERBS.map((verb, i) => (
            <div key={verb} className="border-border flex flex-col gap-1 border-b py-4">
              <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
                {String(i + 1).padStart(2, '0')} · {t('landing.method.act')}
              </span>
              <h3 className="text-fg font-mono text-lg leading-tight font-medium tracking-tight uppercase">
                {t(`landing.method.${verb}.title`)}
              </h3>
              <p className="text-muted text-[13px] leading-relaxed">
                {t(`landing.method.${verb}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
