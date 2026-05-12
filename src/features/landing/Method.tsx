// ═══════════════════════════════════════════════════
// Method — landing S03b (Identifier / Structurer / Faciliter)
//
// WHAT: Section pinnée full-screen qui affiche les 3 verbes méthode
//       en typographie display monumentale. Chaque verbe occupe une
//       row plein écran avec numéro acte + verbe en clamp(3-9rem) +
//       description discrète. Sticky pinning pendant ~1 viewport de
//       scroll. Remplace l'ancien triptyque Card de Presentation.
// WHEN: Juste après Presentation S03. Anchored at #s03b. Mobile
//       déroule naturellement (pas de sticky < md).
// CHANGE COPY: landing.method.{identify,structure,facilitate}.{title,desc}
//       + landing.method.{tag,eyebrow}.
// ═══════════════════════════════════════════════════

import { useTranslation } from 'react-i18next';

const VERBS = ['identify', 'structure', 'facilitate'] as const;

/** Landing S03b — three method verbs as monumental display rows. */
export const Method = () => {
  const { t } = useTranslation();

  return (
    <section id="s03b" className="bg-bg border-border relative h-auto border-b md:h-[180vh]">
      <div className="flex flex-col overflow-hidden px-5 py-20 md:sticky md:top-0 md:h-screen md:px-12 md:py-24">
        {/* Top meta */}
        <div className="text-muted mb-10 flex items-baseline justify-between font-mono text-[10px] tracking-widest uppercase md:mb-12">
          <span>↘ {t('landing.method.tag')}</span>
          <span>{t('landing.method.eyebrow')}</span>
        </div>

        {/* Three monumental rows */}
        <div className="flex flex-1 flex-col justify-center gap-12 md:gap-16">
          {VERBS.map((verb, i) => (
            <div
              key={verb}
              className="border-border flex flex-col gap-3 border-b pb-6 last:border-b-0 md:flex-row md:items-baseline md:gap-12 md:pb-8"
            >
              <span className="text-muted shrink-0 font-mono text-[10px] tracking-widest uppercase md:w-32 md:pt-4">
                {String(i + 1).padStart(2, '0')} · {t('landing.method.act')}
              </span>
              <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
                <h3 className="text-fg font-mono text-[clamp(2.5rem,8vw,8rem)] leading-[0.9] font-medium tracking-tight uppercase">
                  {t(`landing.method.${verb}.title`)}
                </h3>
                <p className="text-muted max-w-md text-base leading-relaxed md:text-right">
                  {t(`landing.method.${verb}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
