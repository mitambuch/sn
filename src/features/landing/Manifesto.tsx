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

// Visible-band scroll progress windows per phrase. Between bands, NO
// phrase is active — only the fog drifts. Owner direction 2026-05-13 :
// "quand le texte disparait l'autre ne réapparaisse pas tout de suite".
const VISIBLE_BANDS: readonly [number, number][] = [
  [0.04, 0.26],
  [0.4, 0.62],
  [0.76, 0.96],
];

function computeActive(progress: number): number {
  for (let i = 0; i < VISIBLE_BANDS.length; i++) {
    const band = VISIBLE_BANDS[i];
    if (!band) continue;
    const [start, end] = band;
    if (progress >= start && progress <= end) return i;
  }
  return -1;
}

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

interface FogFieldProps {
  id: string;
  className: string;
  seed: number;
  frequency: string;
  alphaBias: number;
}

const FogField = ({ id, className, seed, frequency, alphaBias }: FogFieldProps) => {
  const filterId = `manifesto-fog-${id}`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
      viewBox="0 0 1600 1000"
    >
      <defs>
        <filter
          id={filterId}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={frequency}
            numOctaves="3"
            seed={seed}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="42" result="softNoise" />
          <feColorMatrix
            in="softNoise"
            type="matrix"
            values={`0 0 0 0 1
                     0 0 0 0 1
                     0 0 0 0 1
                     .52 .52 .52 0 ${alphaBias}`}
          />
        </filter>
      </defs>
      <rect
        x="-15%"
        y="-15%"
        width="130%"
        height="130%"
        fill="currentColor"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
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
      setActive(computeActive(progress));
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
        <div aria-hidden="true" className="manifesto-fog pointer-events-none absolute inset-0 z-0">
          <FogField
            id="back-a"
            className="manifesto-fog-field manifesto-fog-field-a"
            seed={13}
            frequency="0.004 0.011"
            alphaBias={-0.5}
          />
          <FogField
            id="back-b"
            className="manifesto-fog-field manifesto-fog-field-b"
            seed={29}
            frequency="0.0035 0.009"
            alphaBias={-0.54}
          />
        </div>

        <div
          aria-hidden="true"
          className="manifesto-fog-top pointer-events-none absolute inset-0 z-20"
        >
          <FogField
            id="top-a"
            className="manifesto-fog-field manifesto-fog-field-top-a"
            seed={47}
            frequency="0.005 0.013"
            alphaBias={-0.58}
          />
          <FogField
            id="top-b"
            className="manifesto-fog-field manifesto-fog-field-top-b"
            seed={71}
            frequency="0.003 0.008"
            alphaBias={-0.62}
          />
        </div>

        {/* Top meta */}
        <div className="text-on-ink/55 z-30 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
          <span>↘ {t('landing.manifesto.eyebrow')}</span>
          <span>02 / 07</span>
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
                    'transition-[opacity,filter,transform,text-shadow] ease-out',
                    isActive
                      ? 'manifesto-phrase-lit blur-0 translate-y-0 scale-100 opacity-100 duration-[1800ms]'
                      : 'translate-y-8 scale-[1.04] opacity-0 blur-[16px] duration-[2400ms]',
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
              </div>
            );
          })}
        </div>

        {/* Bottom : hint + progress (3 segments since 3 visible phrases) */}
        <div className="text-on-ink/55 z-30 flex items-end justify-between font-mono text-[10px] tracking-widest uppercase">
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
