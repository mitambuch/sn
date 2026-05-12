// ═══════════════════════════════════════════════════
// Manifesto — landing S02 (luxe random-grid statement)
//
// WHAT: 400vh black section with sticky inner content. Each phrase is
//       a constellation of words placed on a 12×8 grid — words sit at
//       different rows/columns so the line is read across the canvas
//       rather than centered on a single axis. On phrase activation,
//       each word reveals individually with a slow stagger (180ms
//       between words, 1.2s per word transition) — fade + translate +
//       blur clear. Owner direction 2026-05-13 : "lent, ça doit puer
//       le luxe ça donne envie". Section flagged `data-landing-dark`
//       so the grain overlay (screen blend) lifts texture out of the
//       deep ink black.
// WHEN: After Hero + first marquee. Anchored at #s02.
// CHANGE WORD PLACEMENT: edit PHRASES below — `cls` controls grid
//       position + size + emphasis per word.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Each word in a phrase has its own grid placement + typographic
// emphasis. The grid is 12 cols × 8 rows ; words orchestrate the
// visual rhythm of the phrase across the canvas.
interface ManifestoWord {
  /** i18n key suffix under `landing.manifesto.p{phrase}.words.{key}`. */
  key: string;
  /** Tailwind classes for grid placement + size + emphasis (italic / muted). */
  cls: string;
}

const PHRASES: readonly ManifestoWord[][] = [
  // Phrase 1 : "Pas d'agence. Pas de conciergerie."
  [
    { key: 'w1', cls: 'col-start-2 col-span-4 row-start-2 self-start text-[clamp(2rem,7vw,7rem)]' },
    {
      key: 'w2',
      cls: 'col-start-7 col-span-5 row-start-3 self-center justify-self-end text-right text-[clamp(1.5rem,5vw,5rem)] italic font-light',
    },
    {
      key: 'w3',
      cls: 'col-start-1 col-span-4 row-start-5 self-center text-[clamp(1.25rem,3.5vw,3.5rem)] text-on-ink/70',
    },
    {
      key: 'w4',
      cls: 'col-start-4 col-span-9 row-start-6 self-end justify-self-end text-right text-[clamp(2rem,6vw,6rem)]',
    },
  ],
  // Phrase 2 : "Une structure. Un interlocuteur."
  [
    {
      key: 'w1',
      cls: 'col-start-2 col-span-3 row-start-2 text-[clamp(1.5rem,4vw,4rem)] text-on-ink/70',
    },
    {
      key: 'w2',
      cls: 'col-start-3 col-span-9 row-start-3 self-center text-[clamp(2.5rem,8vw,8rem)]',
    },
    {
      key: 'w3',
      cls: 'col-start-1 col-span-3 row-start-6 text-[clamp(1.5rem,4vw,4rem)] text-on-ink/70',
    },
    {
      key: 'w4',
      cls: 'col-start-3 col-span-10 row-start-7 self-end justify-self-end text-right text-[clamp(2.5rem,8vw,8rem)] italic font-light',
    },
  ],
  // Phrase 3 : "Le luxe ne se mesure pas à ce qu'on possède."
  [
    {
      key: 'w1',
      cls: 'col-start-2 col-span-7 row-start-2 self-start text-[clamp(2rem,7vw,7rem)]',
    },
    {
      key: 'w2',
      cls: 'col-start-1 col-span-7 row-start-4 self-center text-[clamp(1.5rem,4.5vw,4.5rem)] text-on-ink/75',
    },
    {
      key: 'w3',
      cls: 'col-start-7 col-span-6 row-start-5 self-center justify-self-end text-right text-[clamp(1.5rem,4.5vw,4.5rem)] text-on-ink/75',
    },
    {
      key: 'w4',
      cls: 'col-start-4 col-span-8 row-start-7 self-end text-[clamp(2.5rem,8vw,8rem)] italic font-light',
    },
  ],
];

/** Landing S02 — 400vh sticky manifesto with random-grid word constellation. */
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
      className="bg-ink text-on-ink relative h-[400vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden px-5 pt-24 pb-8 md:px-12 md:pt-28 md:pb-10">
        {/* Top meta (in-section eyebrow, pushed below the fixed top chrome) */}
        <div className="text-on-ink/55 z-10 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>↘ {t('landing.manifesto.eyebrow')}</span>
          <span>02 / 09</span>
        </div>

        {/* Random-grid word constellation — each phrase is its own grid layer */}
        <div className="relative z-10 flex-1">
          {PHRASES.map((words, idx) => {
            const isActive = idx === active;
            return (
              <div
                key={idx}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 grid grid-cols-12 grid-rows-8 gap-x-3 gap-y-1',
                  !isActive && 'pointer-events-none',
                )}
              >
                {words.map((word, i) => (
                  <span
                    key={word.key}
                    className={cn(
                      word.cls,
                      'font-mono leading-[0.95] font-medium tracking-tight uppercase',
                      'transition-[opacity,transform,filter] duration-[1200ms] ease-out',
                      isActive
                        ? 'blur-0 translate-y-0 opacity-100'
                        : 'translate-y-6 opacity-0 blur-[10px]',
                    )}
                    style={{
                      transitionDelay: isActive
                        ? `${String(i * 180)}ms`
                        : `${String((words.length - i) * 60)}ms`,
                    }}
                  >
                    {t(`landing.manifesto.p${String(idx + 1)}.words.${word.key}`)}
                  </span>
                ))}
              </div>
            );
          })}
        </div>

        {/* Bottom : hint + progress */}
        <div className="text-on-ink/55 z-10 flex items-end justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>{t('landing.manifesto.hint')}&nbsp;↓</span>
          <div className="flex items-center gap-1.5">
            {PHRASES.map((_, i) => (
              <span
                key={i}
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
