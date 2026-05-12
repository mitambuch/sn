// ═══════════════════════════════════════════════════
// Manifesto — landing S02 (random pool, centred reveal)
//
// WHAT: 400vh dark section with sticky inner content. From a pool of 6
//       brand-voice phrases, 3 are picked at random when the page is
//       mounted (so each visitor reads a different rotation). Phrases
//       are CENTRED, same typography across all three, no hierarchy
//       game. Active phrase : opacity 1 + blur 0. Inactive : opacity
//       0 + blur 8px. Cursor over the active phrase lights a soft
//       radial glow behind the words. Scroll position drives the
//       active index (slow 400vh pace).
// WHEN: After Hero + first marquee. Anchored at #s02.
// CHANGE COPY: landing.manifesto.p{1..6} in fr.json / en.json. Add
//       more phrases to the pool by adding pN keys — PHRASE_KEYS
//       below picks them up.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PHRASE_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const;
const VISIBLE_COUNT = 3;

/** Fisher-Yates shuffle — small array, allocates a copy. */
function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j] as T;
    out[j] = tmp as T;
  }
  return out;
}

/** Landing S02 — centred manifesto, 3 of 6 phrases per session. */
export const Manifesto = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Pick 3 random phrases at mount, stable across re-renders.
  const selectedKeys = useMemo(() => shuffle(PHRASE_KEYS).slice(0, VISIBLE_COUNT), []);

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
      const step = Math.min(VISIBLE_COUNT - 1, Math.floor(progress * VISIBLE_COUNT));
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
      className="bg-ink text-on-ink relative h-[400vh] overflow-hidden"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden px-5 pt-24 pb-8 md:px-12 md:pt-28 md:pb-10">
        {/* Top meta */}
        <div className="text-on-ink/55 z-10 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>↘ {t('landing.manifesto.eyebrow')}</span>
          <span>02 / 09</span>
        </div>

        {/* Centred phrases — same typography across all, glow halo on hover */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
          {selectedKeys.map((key, idx) => {
            const isActive = idx === active;
            return (
              <div
                key={`${key}-${String(idx)}`}
                aria-hidden={!isActive}
                className={cn(
                  'group absolute inset-0 flex cursor-default items-center justify-center px-6',
                  !isActive && 'pointer-events-none',
                )}
              >
                {/* Soft radial glow halo — visible only when cursor hovers the active phrase. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1000 ease-out group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--color-on-ink) 6%, transparent) 0%, transparent 75%)',
                  }}
                />
                <p
                  className={cn(
                    'relative max-w-5xl text-center font-mono leading-[1.15] font-medium tracking-tight uppercase',
                    'text-[clamp(1.75rem,5vw,4.5rem)]',
                    'transition-[opacity,filter,transform] duration-[1500ms] ease-out',
                    isActive
                      ? 'blur-0 translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0 blur-[8px]',
                  )}
                >
                  {t(`landing.manifesto.${key}`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom : hint + progress (3 segments since 3 visible phrases) */}
        <div className="text-on-ink/55 z-10 flex items-end justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>{t('landing.manifesto.hint')}&nbsp;↓</span>
          <div className="flex items-center gap-1.5">
            {selectedKeys.map((key, i) => (
              <span
                key={key}
                aria-hidden="true"
                className={cn(
                  'h-px w-7 transition-colors duration-500',
                  i <= active ? 'bg-on-ink' : 'bg-on-ink/25',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
