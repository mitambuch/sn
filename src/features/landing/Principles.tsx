// ═══════════════════════════════════════════════════
// Principles — landing S04 (the three non-negotiables)
//
// WHAT: Black section displaying the 3 founding principles (Confiance /
//       Confidentialité / Relations humaines). Left column holds the
//       three pillar marks (I. II. III.) ; right column holds the three
//       paragraphs in large editorial type. An IntersectionObserver
//       tracks which paragraph is currently the most visible and
//       highlights the matching pillar mark (active = full opacity dot
//       + bg-bg color, others = 30% opacity).
// WHEN: After Domains (S05) is mounted before Access if order asked
//       differently. Anchored at #s04.
// CHANGE COPY: edit landing.principles.* keys in fr.json / en.json.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PILLARS = ['1', '2', '3'] as const;
type PillarKey = (typeof PILLARS)[number];

/** Landing S04 — three non-negotiable principles with scroll-synced index. */
export const Principles = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<PillarKey>('1');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;
    if (!section) return;
    const paragraphs = section.querySelectorAll<HTMLElement>('[data-pillar]');
    if (paragraphs.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const pillar = entry.target.getAttribute('data-pillar');
            if (pillar === '1' || pillar === '2' || pillar === '3') {
              setActive(pillar);
            }
          }
        }
      },
      { threshold: 0.55, rootMargin: '-15% 0px -35% 0px' },
    );

    paragraphs.forEach(p => {
      observer.observe(p);
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="s04"
      ref={sectionRef}
      className="bg-fg text-bg relative overflow-hidden px-5 py-24 md:px-12 md:py-32"
    >
      {/* ─── Top meta strip ─── */}
      <div className="text-bg/70 mb-20 flex items-baseline justify-between font-mono text-[10px] tracking-widest uppercase md:mb-24">
        <span>↘ 04 / {t('landing.principles.tag')}</span>
        <span>{t('landing.principles.eyebrow')}</span>
      </div>

      {/* ─── Body : index left + manifesto right ─── */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-[1fr_8fr] md:gap-16">
        {/* Pillar index — sticky on desktop */}
        <aside
          className="md:sticky md:top-24 md:self-start"
          aria-label={t('landing.principles.tag')}
        >
          {PILLARS.map(p => {
            const isActive = p === active;
            return (
              <div
                key={p}
                className={cn(
                  'border-bg/15 flex items-center justify-between gap-3 border-t py-3 font-mono text-[11px] tracking-wider uppercase transition-colors duration-500',
                  isActive ? 'text-bg' : 'text-bg/40',
                )}
              >
                <span>{t(`landing.principles.p${p}.mark`)}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors duration-500',
                    isActive ? 'bg-bg' : 'bg-bg/30',
                  )}
                />
              </div>
            );
          })}
        </aside>

        {/* Manifesto — three paragraphs, current one highlighted */}
        <div className="flex flex-col gap-8 font-mono text-[clamp(1.25rem,2.4vw,2rem)] leading-[1.45] tracking-[-0.01em] uppercase">
          {PILLARS.map(p => {
            const isActive = p === active;
            return (
              <p
                key={p}
                data-pillar={p}
                className={cn(
                  'max-w-[68ch] transition-opacity duration-500',
                  isActive ? 'text-bg opacity-100' : 'text-bg/40 opacity-40',
                )}
              >
                {t(`landing.principles.p${p}.prefix`)}{' '}
                <span className="text-bg border-bg border-b font-semibold">
                  {t(`landing.principles.p${p}.keyword`)}
                </span>{' '}
                {t(`landing.principles.p${p}.body`)}
              </p>
            );
          })}
        </div>
      </div>

      {/* ─── Bottom strip ─── */}
      <div className="border-bg/20 text-bg/55 mt-20 flex items-center justify-between gap-4 border-t pt-6 font-mono text-[10px] tracking-widest uppercase md:mt-24">
        <span>{t('landing.principles.footer')}</span>
        <span>— {t('landing.principles.signature')}</span>
      </div>
    </section>
  );
};
