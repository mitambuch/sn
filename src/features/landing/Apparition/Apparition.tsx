// ═══════════════════════════════════════════════════
// Apparition — acte 1, the brand emerges through effort
//
// WHAT: A 3-viewport-tall scroll region. The wordmark is rendered as
//       outline strokes that draw progressively as the user scrolls
//       through the region. At the apex (~70% of the act) the stroke
//       finishes and a sub-mark fades in, followed by 3 pillar words
//       that relay one after the other on a glitch-in.
// WHEN: Right after Threshold. Pinned content via sticky inside the
//       tall outer wrapper. Scroll-resistive feel comes from the tall
//       multiplier (3 → 300vh of scroll for 1 viewport of content).
// CHANGE THE 3 PILLAR WORDS: PILLARS array — owner-locked to "Suisse.
//       Indépendant. Bespoke." (decision 2026-04-30).
// ═══════════════════════════════════════════════════

import { GlitchType } from '@components/effects/GlitchType';
import { ActStage } from '@components/orchestration/ActStage';
import { useEffect, useRef, useState } from 'react';

import { WordmarkStroke } from './WordmarkStroke';

const PILLARS = ['Suisse.', 'Indépendant.', 'Bespoke.'];

export const Apparition = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Track scroll within this section (0→1)
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
      raf = window.requestAnimationFrame(compute);
    };
    raf = window.requestAnimationFrame(compute);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  // Drawn = first 60% of scroll. Sub-mark: 60→70%. Pillars: 70→100% relay.
  const drawProgress = Math.min(progress / 0.6, 1);
  const subMarkVisible = progress > 0.62;
  const tail = Math.max(0, (progress - 0.7) / 0.3); // 0..1 across last 30%
  const pillarIndex =
    tail > 0 ? Math.min(Math.floor(tail * PILLARS.length), PILLARS.length - 1) : -1;

  return (
    <ActStage name="Apparition" tall={3} sticky={false}>
      <div ref={wrapRef} className="relative h-[300vh] w-full">
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6 md:px-12">
          {/* Wordmark stroke — draws as we scroll */}
          <div className="w-full max-w-5xl">
            <WordmarkStroke progress={drawProgress} className="text-fg" />
          </div>

          {/* Sub-mark — fade in when wordmark is drawn */}
          <p
            aria-hidden={!subMarkVisible}
            className="text-fg/70 mt-10 font-mono text-xs tracking-[0.5em] uppercase transition-opacity duration-700 md:text-sm"
            style={{ opacity: subMarkVisible ? 1 : 0 }}
          >
            Bespoke Client Services Platform
          </p>

          {/* Pillar relay — only one at a time, glitch-in on each */}
          <div className="relative mt-16 h-12 w-full max-w-md text-center">
            {PILLARS.map((word, i) => (
              <span
                key={word}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: pillarIndex === i ? 1 : 0,
                  transition: 'opacity 240ms ease',
                }}
              >
                {pillarIndex === i && (
                  <span className="text-fg font-mono text-2xl font-semibold tracking-[0.3em] uppercase md:text-3xl">
                    <GlitchType key={`${i}-${pillarIndex}`} text={word} pace={42} />
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ActStage>
  );
};
