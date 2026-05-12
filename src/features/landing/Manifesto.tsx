// ═══════════════════════════════════════════════════
// Manifesto — landing S02 (typographic constellation, cinema fog)
//
// WHAT: 400vh dark section with sticky inner content. From a pool of
//       6 phrases, 3 are picked at random per session. Each phrase is
//       BROKEN into lines with its own indentation scheme (per-phrase
//       margin-left % per line) — the same phrase can re-flow into a
//       different visual rhythm on the next read. White intensity is
//       softened to feel like cinema fog. A CSS-driven fog layer
//       drifts behind the words (two slow radial-gradient blobs +
//       grain).
// WHEN: After Hero + first marquee. Anchored at #s02.
// CHANGE COPY: landing.manifesto.p{1..6} — each phrase = array of
//       1-3 lines in fr.json / en.json.
// CHANGE INDENTS: PHRASE_LAYOUTS below — N values per phrase = N
//       lines, each % drives the line's margin-left.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PhraseKey = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
const PHRASE_KEYS: readonly PhraseKey[] = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
const VISIBLE_COUNT = 3;

// Per-phrase indentation scheme. Each value is a percentage of the
// container width applied as margin-left to that line. Variation
// creates a poetic visual rhythm — same words, different spatial
// score per phrase.
const PHRASE_LAYOUTS: Record<PhraseKey, number[]> = {
  p1: [0, 22],
  p2: [12, 0],
  p3: [0, 18, 8],
  p4: [16, 0],
  p5: [0, 28, 12],
  p6: [6, 24],
};

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

/** Landing S02 — typographic constellation manifesto with cinema fog. */
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
      className="bg-ink text-on-ink/70 relative h-[400vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden px-5 pt-24 pb-8 md:px-12 md:pt-28 md:pb-10">
        {/* ─── Cinema fog (back layer) — drifts behind the words ─── */}
        <div
          aria-hidden="true"
          className="manifesto-fog pointer-events-none absolute inset-0 z-0"
        />

        {/* Top meta */}
        <div className="text-on-ink/55 z-10 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>↘ {t('landing.manifesto.eyebrow')}</span>
          <span>02 / 09</span>
        </div>

        {/* Phrases — typographic constellation with per-phrase indent score */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
          {selectedKeys.map((key, idx) => {
            const isActive = idx === active;
            const lines = t(`landing.manifesto.${key}`, { returnObjects: true }) as
              | readonly string[]
              | string as readonly string[];
            const safeLines = Array.isArray(lines) ? lines : [String(lines)];
            const layout = PHRASE_LAYOUTS[key];

            return (
              <div
                key={`${key}-${String(idx)}`}
                aria-hidden={!isActive}
                className={cn(
                  'group absolute inset-0 flex cursor-default items-center justify-center px-4 md:px-12',
                  !isActive && 'pointer-events-none',
                )}
              >
                {/* Halo : visible only when hovering an active phrase */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1000 ease-out group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(45% 45% at 50% 50%, color-mix(in srgb, var(--color-on-ink) 10%, transparent) 0%, transparent 70%)',
                  }}
                />

                <div
                  className={cn(
                    'relative mx-auto w-full max-w-5xl font-mono leading-[1.05] font-medium tracking-tight uppercase',
                    'text-[clamp(1.75rem,5vw,4.5rem)]',
                    'transition-[opacity,filter,transform] ease-out',
                    isActive
                      ? 'blur-0 translate-y-0 scale-100 opacity-100 duration-[1600ms]'
                      : 'translate-y-8 scale-[1.04] opacity-0 blur-[14px] duration-[2200ms]',
                  )}
                >
                  {safeLines.map((line, i) => (
                    <span
                      key={`${String(idx)}-${String(i)}`}
                      className="block"
                      style={{ marginLeft: `${String(layout[i] ?? 0)}%` }}
                    >
                      {line}
                    </span>
                  ))}
                </div>

                {/* ─── Cinema fog (front layer) — wisps drift ABOVE the words,
                     mix-blend-mode lighten so the text partially dissolves
                     where fog passes. Organic, animated, mobile-friendly. ─── */}
                <div
                  aria-hidden="true"
                  className="manifesto-fog-top pointer-events-none absolute inset-0 z-20"
                />
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
                  i <= active ? 'bg-on-ink/80' : 'bg-on-ink/20',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
