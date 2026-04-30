// ═══════════════════════════════════════════════════
// Threshold — acte 0, the LOADER (auto temporel)
//
// WHAT: Light surface with the SAW NEXT wordmark drawing itself in
//       (stroke-dashoffset 1→0 with dramatic ease) then the contour
//       fills in (fill-opacity 0→1). Total ~4s. Once filled, the
//       loader fades out and reveals the rest of the timeline.
// WHEN: First act. No interaction needed — automatic. The user sees
//       the brand emerge then the page is ready.
// CHANGE TIMING: DRAW_MS / FILL_MS / EXIT_MS constants below.
// ═══════════════════════════════════════════════════

import { TechFrame } from '@components/orchestration/TechFrame';
import { useScene } from '@components/orchestration/useScene';
import { useEffect, useState } from 'react';

import { WordmarkStroke } from '../Apparition/WordmarkStroke';

const DRAW_MS = 3400;
const HOLD_MS = 350;
const FILL_MS = 1800;
const EXIT_MS = 800;

type LoaderPhase = 'draw' | 'hold' | 'fill' | 'exit' | 'done';

// Dramatic non-linear easing — fast start, slow middle, propre fin
const ease = (t: number) => {
  // cubic-bezier-ish (0.65, 0.04, 0.35, 1) approximation
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const Threshold = () => {
  const { hasCrossedThreshold, crossThreshold } = useScene();
  const [phase, setPhase] = useState<LoaderPhase>('draw');
  const [drawProgress, setDrawProgress] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);

  // Phase: draw
  useEffect(() => {
    if (phase !== 'draw') return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / DRAW_MS, 1);
      setDrawProgress(ease(t));
      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setPhase('hold');
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [phase]);

  // Phase: hold (brief pause between draw and fill)
  useEffect(() => {
    if (phase !== 'hold') return;
    const t = window.setTimeout(() => setPhase('fill'), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Phase: fill
  useEffect(() => {
    if (phase !== 'fill') return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / FILL_MS, 1);
      setFillProgress(t);
      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setPhase('exit');
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [phase]);

  // Phase: exit (fade-out, then unmount)
  useEffect(() => {
    if (phase !== 'exit') return;
    const t = window.setTimeout(() => {
      setPhase('done');
      crossThreshold();
    }, EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase, crossThreshold]);

  if (hasCrossedThreshold || phase === 'done') return null;

  const exiting = phase === 'exit';

  return (
    <div
      role="status"
      aria-label="Chargement de SAW Next"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#d8dcda] transition-opacity"
      style={{
        opacity: exiting ? 0 : 1,
        transitionDuration: `${EXIT_MS}ms`,
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      <TechFrame index="000" label="LOADER" scope="SUISSE" />

      <div className="relative w-full max-w-6xl px-6 md:px-12">
        {/* Wordmark stroke (always rendered) */}
        <WordmarkStroke progress={drawProgress} strokeWidth={1.0} className="text-[#1a1a1a]" />
        {/* Wordmark fill — superimposed at the same position, opacity rising */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 px-6 md:px-12"
          style={{ opacity: fillProgress }}
        >
          <FilledWordmark className="text-[#1a1a1a]" />
        </div>
      </div>

      {/* Progress label below */}
      <div className="absolute bottom-12 flex items-center gap-3 font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/60 uppercase md:bottom-20">
        <span>
          {Math.floor(drawProgress * 100)
            .toString()
            .padStart(3, '0')}
        </span>
        <span className="block h-px w-12 bg-[#1a1a1a]/30" />
        <span>{phase === 'fill' || phase === 'exit' ? 'PRÊT' : 'CHARGEMENT'}</span>
      </div>
    </div>
  );
};

/* Inline filled wordmark — duplicates the SAWNEXT.svg paths so we can
   tween fill independently. Same viewBox as WordmarkStroke. */
const FilledWordmark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 566.15 89.04"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="SAW Next"
    className={className}
    fill="currentColor"
  >
    <path d="M93.72,1.92l-24.24,85.2h15.24l5.38-20.16h25.73l5.38,20.16h15.24L112.2,1.92h-18.48ZM93.65,53.64l9.31-34.92,9.31,34.92h-18.62Z" />
    <path d="M51.06,44.16c-3.88-2.4-9.14-4.48-15.78-6.24-4.8-1.2-8.52-2.4-11.16-3.6-2.64-1.2-4.5-2.56-5.58-4.08-1.08-1.52-1.62-3.44-1.62-5.76,0-3.28,1.2-5.94,3.6-7.98,2.4-2.04,5.64-3.06,9.72-3.06,3.04,0,5.62.64,7.74,1.92,2.12,1.28,3.8,3.06,5.04,5.34,1.24,2.28,2.06,4.98,2.46,8.1l15.24-.72c-.56-5.76-2.06-10.74-4.5-14.94-2.44-4.2-5.78-7.44-10.02-9.72-4.24-2.28-9.36-3.42-15.36-3.42s-11.3,1.04-15.66,3.12c-4.36,2.08-7.68,5.02-9.96,8.82-2.28,3.8-3.42,8.26-3.42,13.38,0,4.56.88,8.34,2.64,11.34,1.76,3,4.48,5.5,8.16,7.5,3.68,2,8.4,3.76,14.16,5.28,5.36,1.44,9.48,2.92,12.36,4.44,2.88,1.52,4.88,3.16,6,4.92,1.12,1.76,1.68,3.84,1.68,6.24,0,2.24-.56,4.16-1.68,5.76-1.12,1.6-2.74,2.8-4.86,3.6-2.12.8-4.7,1.2-7.74,1.2-3.2,0-6.02-.66-8.46-1.98-2.44-1.32-4.4-3.28-5.88-5.88-1.48-2.6-2.5-5.86-3.06-9.78l-15.12.84c.48,6.16,2.04,11.5,4.68,16.02,2.64,4.52,6.26,8.02,10.86,10.5,4.6,2.48,10.02,3.72,16.26,3.72s11.48-1,15.96-3c4.48-2,7.96-4.84,10.44-8.52,2.48-3.68,3.72-7.96,3.72-12.84,0-4.56-.84-8.52-2.52-11.88-1.68-3.36-4.46-6.24-8.34-8.64Z" />
    <polygon points="187.88 66.01 180.48 11.52 169.44 11.52 162.04 66.01 156.48 1.92 142.08 1.92 151.08 87.12 168.24 87.12 174.96 39.68 181.68 87.12 198.84 87.12 207.84 1.92 193.44 1.92 187.88 66.01" />
    <polygon points="380.16 51 416.64 51 416.64 37.8 380.16 37.8 380.16 15.6 418.08 15.6 418.08 1.92 365.28 1.92 365.28 87.12 419.04 87.12 419.04 73.44 380.16 73.44 380.16 51" />
    <polygon points="503.75 1.92 503.75 15.6 527.51 15.6 527.51 87.12 542.39 87.12 542.39 15.6 566.15 15.6 566.15 1.92 503.75 1.92" />
    <polygon points="218.64 13.08 256.06 13.08 213.96 55.08 222.36 63.48 264.26 21.58 264.36 58.92 275.52 47.76 275.52 1.92 229.92 1.92 218.64 13.08" />
    <polygon points="493.79 1.92 477.59 1.92 463.07 33.24 448.55 1.92 432.11 1.92 453.11 44.28 431.75 87.12 447.83 87.12 462.83 55.32 477.71 87.12 494.15 87.12 472.79 44.4 493.79 1.92" />
    <polygon points="332.64 63.12 306.84 1.92 290.88 1.92 290.88 87.12 305.28 87.12 305.28 25.92 331.08 87.12 347.04 87.12 347.04 1.92 332.64 1.92 332.64 63.12" />
  </svg>
);
