// ═══════════════════════════════════════════════════
// Domains — landing S05 (services / 10 verticales)
//
// WHAT: Two-column section — left holds the numbered list of the 10
//       service verticales ; right holds a sticky preview panel that
//       updates on hover/click of a list item. Mobile collapses to a
//       single column with preview below the list.
// WHEN: After Presentation. Anchored at #s05. This is the "services"
//       section in casual conversation — 10 verticales = the offer.
// CHANGE COPY: edit landing.domains.NN.* keys in fr.json / en.json.
//       Numerical IDs (01..10) are stable, never renumber.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { SectionTag } from '@features/landing/SectionTag';
import { useReveal } from '@hooks/useReveal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DOMAIN_KEYS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'] as const;
type DomainKey = (typeof DOMAIN_KEYS)[number];

/** Landing S05 — 10 service verticales with hover-driven preview. */
export const Domains = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<DomainKey>('01');

  return (
    <section id="s05" className="border-border border-b px-5 py-24 md:px-12 md:py-32">
      <div ref={ref}>
        {/* ─── Header ─── */}
        <div className="border-border mb-14 flex flex-col gap-6 border-b pb-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="flex flex-col gap-4">
            <SectionTag num="05" label={t('landing.domains.tag')} />
            <h2 className="font-mono text-[clamp(1.75rem,4vw,4rem)] leading-[0.95] font-medium tracking-[-0.025em] uppercase">
              {t('landing.domains.h2line1')}
              <br />
              {t('landing.domains.h2line2')}
            </h2>
          </div>
          <p className="text-muted font-mono text-[10px] leading-[1.9] tracking-widest uppercase md:text-right">
            {t('landing.domains.metaTop')}
            <br />
            {t('landing.domains.metaBottom')}
          </p>
        </div>

        {/* ─── Grid : list + preview ─── */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[5fr_4fr] md:gap-12">
          {/* List */}
          <ul className="border-border border-t">
            {DOMAIN_KEYS.map(key => {
              const isActive = key === active;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onMouseEnter={() => {
                      setActive(key);
                    }}
                    onFocus={() => {
                      setActive(key);
                    }}
                    onClick={() => {
                      setActive(key);
                    }}
                    className="border-border grid w-full grid-cols-[44px_1fr_auto] items-center gap-4 border-b py-4 text-left transition-[padding,color] duration-300 ease-out hover:pl-3 focus-visible:pl-3 focus-visible:outline-none"
                    aria-pressed={isActive}
                  >
                    <span className="text-muted font-mono text-[10px] tracking-wider">
                      {key} / 10
                    </span>
                    <span
                      className={
                        'font-mono text-[clamp(1rem,1.8vw,1.375rem)] tracking-[-0.01em] uppercase transition-[font-weight] ' +
                        (isActive ? 'font-medium' : 'font-normal')
                      }
                    >
                      {t(`landing.domains.${key}.name`)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={
                        'font-mono text-sm transition-[color,transform] ' +
                        (isActive ? 'text-fg translate-x-1 -translate-y-1' : 'text-muted')
                      }
                    >
                      ↗
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Preview — Apple-closed Card */}
          <div className="md:sticky md:top-20">
            <Card padding="lg" className="min-h-[460px]">
              <span className="text-muted mb-3 font-mono text-[10px] tracking-widest uppercase">
                {t('landing.domains.previewTag')} / {active}
              </span>
              <h3 className="text-fg mb-7 font-mono text-[clamp(1.5rem,3vw,2.5rem)] leading-[1] font-medium tracking-[-0.02em] uppercase">
                {t(`landing.domains.${active}.title`)}
              </h3>
              <p className="text-fg mb-8 text-sm leading-[1.6]">
                {t(`landing.domains.${active}.desc`)}
              </p>
              <ul className="border-border mt-auto border-t font-mono text-[11px] tracking-wider uppercase">
                {([1, 2, 3, 4] as const).map(i => (
                  <li
                    key={i}
                    className="border-border flex justify-between border-b py-2.5 last:border-b-0"
                  >
                    <span>{t(`landing.domains.${active}.feat${String(i)}`)}</span>
                    <span aria-hidden="true" className="text-muted">
                      ↗
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
