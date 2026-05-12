// ═══════════════════════════════════════════════════
// Manifesto — landing S02 (sticky scroll statement)
//
// WHAT: 300vh tall black section with sticky inner content. Three big
//       phrases sit in the same centered slot; only one is visible at a
//       time. Active phrase index is driven by the user's scroll
//       progress within the section (0 → 1, divided into N steps).
//       Cross-fade + blur clear at each transition keeps the swap
//       cinematic instead of abrupt.
// WHEN: After Hero + first marquee. Anchored at #s02.
// CHANGE PHRASES: edit landing.manifesto.p{1..3}.{line1,line2[,line3,em]}
//       in fr.json / en.json. The number of phrases drives the steps.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PHRASES = ['1', '2', '3'] as const;

/** Landing S02 — 300vh sticky manifesto, scroll-driven phrase progression. */
export const Manifesto = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const step = Math.min(PHRASES.length - 1, Math.floor(progress * PHRASES.length));
      setActive(step);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="s02"
      ref={sectionRef}
      data-landing-dark="true"
      className="bg-fg text-bg relative h-[300vh] md:h-[300vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden px-5 py-8 md:px-12 md:py-10">
        {/* Top meta */}
        <div className="text-bg/50 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>↘ {t('landing.manifesto.eyebrow')}</span>
          <span>02 / 09</span>
        </div>

        {/* Phrases — same slot, only active visible */}
        <div className="relative flex flex-1 items-center justify-center">
          {PHRASES.map((p, i) => {
            const isActive = i === active;
            return (
              <div
                key={p}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 flex flex-col items-center justify-center text-center font-mono leading-[1] font-medium tracking-tight uppercase',
                  'text-[clamp(1.75rem,6vw,6rem)]',
                  'transition-[opacity,transform,filter] duration-700 ease-out',
                  isActive
                    ? 'blur-0 translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-3 opacity-0 blur-[6px]',
                )}
              >
                <span className="block">{t(`landing.manifesto.p${p}.line1`)}</span>
                <span className="block">{t(`landing.manifesto.p${p}.line2`)}</span>
                {/* Optional emphasis line (italic) — falls back to empty if not set. */}
                <span className="block font-light italic">
                  {t(`landing.manifesto.p${p}.line3`)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom : hint + progress */}
        <div className="text-bg/55 flex items-end justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>{t('landing.manifesto.hint')}&nbsp;↓</span>
          <div className="flex items-center gap-1.5">
            {PHRASES.map((p, i) => (
              <span
                key={p}
                aria-hidden="true"
                className={cn(
                  'h-px w-7 transition-colors duration-500',
                  i <= active ? 'bg-bg' : 'bg-bg/25',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
