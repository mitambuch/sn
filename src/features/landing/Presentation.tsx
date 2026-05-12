// ═══════════════════════════════════════════════════
// Presentation — landing S03 (structure & méthode)
//
// WHAT: 2-column header (h2 + lead quote) above a 3-column body (meta
//       list + two paragraph columns containing 7 paragraphs of brand
//       voice). Below the body, a 3-card triptyque highlights the
//       canonical method verbs : Identifier / Structurer / Faciliter.
//       This is the "qui sommes-nous" section, sober and dense.
// WHEN: After Manifesto. Anchored at #s03.
// CHANGE COPY: edit landing.presentation.* keys in fr.json / en.json.
//       p1..p7 = body paragraphs. triptyque.{identify,structure,facilitate}
//       = method verbs + descriptions.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { SectionTag } from '@features/landing/SectionTag';
import { useTranslation } from 'react-i18next';

const VERBS = ['identify', 'structure', 'facilitate'] as const;

/** Landing S03 — sober presentation with method triptyque. */
export const Presentation = () => {
  const { t } = useTranslation();

  return (
    <section id="s03" className="border-border border-b px-5 py-24 md:px-12 md:py-32">
      {/* ─── Header ─── */}
      <div className="border-border mb-16 grid grid-cols-1 items-end gap-8 border-b pb-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col gap-4">
          <SectionTag num="03" label={t('landing.presentation.tag')} />
          <h2 className="font-mono text-[clamp(1.75rem,4vw,4rem)] leading-[0.95] font-medium tracking-tight uppercase">
            {t('landing.presentation.h2line1')}
            <br />
            {t('landing.presentation.h2line2')}
          </h2>
        </div>
        <div className="self-end">
          <span aria-hidden="true" className="text-fg mb-3.5 block text-sm">
            ↘
          </span>
          <p className="text-fg font-mono text-[clamp(1rem,1.7vw,1.375rem)] leading-[1.4] tracking-tight uppercase">
            {t('landing.presentation.lead')}
          </p>
        </div>
      </div>

      {/* ─── Body : 3 cols (meta + 2 text cols, 7 paragraphs total) ─── */}
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[200px_1fr_1fr] md:gap-12">
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

        <div className="text-fg space-y-5 text-base leading-relaxed">
          <p>{t('landing.presentation.p1')}</p>
          <p>{t('landing.presentation.p2')}</p>
          <p>{t('landing.presentation.p5')}</p>
        </div>

        <div className="text-fg space-y-5 text-base leading-relaxed">
          <p>{t('landing.presentation.p3')}</p>
          <p>{t('landing.presentation.p4')}</p>
          <p>{t('landing.presentation.p6')}</p>
          <p>{t('landing.presentation.p7')}</p>
        </div>
      </div>

      {/* ─── Triptyque : Identifier / Structurer / Faciliter ─── */}
      <div className="mt-20 flex flex-col gap-6 md:mt-24">
        <span className="text-muted font-mono text-[11px] tracking-widest uppercase">
          ↘ {t('landing.presentation.triptyqueIntro')}
        </span>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {VERBS.map((verb, i) => (
            <Card key={verb} padding="none" className="min-h-56">
              <Card.Body density="spacious" className="gap-3">
                <Card.Eyebrow className="text-fg/80 font-mono">
                  {String(i + 1).padStart(2, '0')} · {t('landing.presentation.triptyqueAct')}
                </Card.Eyebrow>
                <Card.Title size="lg" className="text-fg">
                  {t(`landing.presentation.triptyque.${verb}.title`)}
                </Card.Title>
                <Card.Meta className="text-muted text-sm leading-relaxed">
                  {t(`landing.presentation.triptyque.${verb}.desc`)}
                </Card.Meta>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
