// ═══════════════════════════════════════════════════
// Loader — brand intro with explicit "Entrer" gate + lift-away exit
//
// WHAT: Full-screen overlay on first paint. Light surface, the SAW
//       NEXT wordmark draws itself in (stroke-dashoffset 1→0 with
//       a dramatic ease) then the contour fills in (fill-opacity
//       0→1). Once filled, settles into a "Entrer" CTA. User clicks
//       to dismiss — the wordmark scales up, blurs and lifts away.
// WHEN: Mounted by LandingLayout above the rest of the tree. The
//       Home content is already mounted underneath; the loader's
//       lift-away reveals it.
// CHANGE TIMING: DRAW_MS, FILL_START_RATIO (overlap), FILL_MS,
//                SETTLE_MS, EXIT_MS constants.
// ═══════════════════════════════════════════════════

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { WordmarkStroke } from './WordmarkStroke';

const DRAW_MS = 4000;
// Fraction of DRAW_MS at which the liquid fill starts rising. Below 1.0,
// the stroke-draw and the liquid-fill overlap — the wordmark is still being
// traced while its bottom already starts to fill. Owner direction: "à 60%
// il faut que ça commence à remplir."
const FILL_START_RATIO = 0.6;
// Liquid rise — needs time to be read as a liquid, not as a fade. The
// turbulence-driven meniscus needs ~3-4s to register on the eye.
const FILL_MS = 4000;
// Premium breath after fill: wordmark is posed, indicator reads "PRÊT",
// but the CTA does not appear yet. Let the eye digest the mark.
const SETTLE_MS = 1500;
const EXIT_MS = 1400;

type LoaderPhase = 'animating' | 'settle' | 'settled' | 'exit' | 'done';

// Dramatic non-linear ease — fast start, slow middle, propre fin
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const Loader = () => {
  const [phase, setPhase] = useState<LoaderPhase>('animating');
  const [drawProgress, setDrawProgress] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);

  // Single RAF drives both draw and fill, with fill starting at
  // FILL_START_RATIO of the draw timeline. Both finish into 'settle'.
  useEffect(() => {
    if (phase !== 'animating') return;
    const start = performance.now();
    const fillDelay = DRAW_MS * FILL_START_RATIO;
    const totalDuration = Math.max(DRAW_MS, fillDelay + FILL_MS);
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const drawT = Math.min(elapsed / DRAW_MS, 1);
      setDrawProgress(ease(drawT));
      const fillElapsed = Math.max(0, elapsed - fillDelay);
      setFillProgress(Math.min(fillElapsed / FILL_MS, 1));
      if (elapsed < totalDuration) raf = window.requestAnimationFrame(tick);
      else setPhase('settle');
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'settle') return;
    const t = window.setTimeout(() => setPhase('settled'), SETTLE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exit') return;
    const t = window.setTimeout(() => setPhase('done'), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Esc dismisses from settled
  useEffect(() => {
    if (phase !== 'settled') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        setPhase('exit');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  if (phase === 'done') return null;

  const exiting = phase === 'exit';
  const ctaVisible = phase === 'settled' || phase === 'exit';
  const indicatorVisible = !ctaVisible;

  // Trois actes : CHARGEMENT (draw seul) → RÉVÉLATION (le fill a démarré,
  // les deux animations courent ensemble) → PRÊT (settle/settled/exit).
  const stateLabel =
    phase === 'animating' ? (fillProgress > 0 ? 'RÉVÉLATION' : 'CHARGEMENT') : 'PRÊT';

  // Compteur global : draw pèse 60% de la course, fill 40%. Pendant settle,
  // le compteur reste à 100 — le mark est posé, rien à charger en plus.
  const combinedProgress = Math.min(1, drawProgress * 0.6 + fillProgress * 0.4);
  const counterValue = Math.floor(combinedProgress * 100)
    .toString()
    .padStart(3, '0');

  const skipVisible = phase === 'animating' || phase === 'settle';

  return (
    <div
      role="status"
      aria-label="Chargement de SAW Next"
      className="bg-bg fixed inset-0 z-60 flex flex-col items-center justify-center"
      style={{
        opacity: exiting ? 0 : 1,
        transition: `opacity ${EXIT_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      {/* ─── Skip button — provisoire, top-right discret ─── */}
      <button
        type="button"
        onClick={() => {
          setPhase('exit');
        }}
        aria-hidden={!skipVisible}
        tabIndex={skipVisible ? 0 : -1}
        className="text-muted hover:text-fg focus-visible:ring-fg/30 absolute top-5 right-5 inline-flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-[10px] tracking-[0.3em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none md:top-7 md:right-7"
        style={{
          opacity: skipVisible ? 1 : 0,
          pointerEvents: skipVisible ? 'auto' : 'none',
          transition: 'opacity 320ms ease-out',
        }}
      >
        Skip
        <span aria-hidden="true">↗</span>
      </button>

      <div
        className="relative w-full max-w-[min(72vw,820px)] px-6"
        style={{
          transform: exiting ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0)',
          filter: exiting ? 'blur(10px)' : 'blur(0)',
          transition: `transform ${EXIT_MS}ms cubic-bezier(0.65, 0, 0.35, 1), filter ${EXIT_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
        }}
      >
        <WordmarkStroke progress={drawProgress} strokeWidth={1.0} className="text-fg" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 px-6">
          <FilledWordmark className="text-fg" liquidProgress={fillProgress} />
        </div>
      </div>

      <div
        className="absolute bottom-12 flex flex-col items-center gap-4 md:bottom-20"
        style={{
          opacity: exiting ? 0 : 1,
          transition: `opacity ${Math.round(EXIT_MS * 0.6)}ms ease-out`,
        }}
      >
        <div
          aria-hidden={!indicatorVisible}
          className="text-fg flex flex-col items-center gap-3"
          style={{
            opacity: indicatorVisible ? 1 : 0,
            transition: 'opacity 320ms ease-out',
            visibility: indicatorVisible ? 'visible' : 'hidden',
          }}
        >
          <div
            className="flex items-baseline gap-3 font-mono text-[26px] leading-none font-semibold tracking-[0.08em] tabular-nums sm:text-[32px]"
            aria-live="polite"
          >
            <span>{counterValue}</span>
            {combinedProgress < 1 && (
              <>
                <span aria-hidden="true">/</span>
                <span>100</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
            <span
              aria-hidden="true"
              className="bg-fg/30 block h-px"
              style={{
                width: `${(48 + 56 * combinedProgress).toFixed(2)}px`,
                transition: 'width 120ms linear',
              }}
            />
            <span>{stateLabel}</span>
            <span aria-hidden="true" className="bg-fg/30 block h-px w-12" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPhase('exit')}
          aria-hidden={!ctaVisible}
          tabIndex={ctaVisible ? 0 : -1}
          className="border-fg text-fg hover:bg-fg hover:text-bg focus-visible:ring-fg/30 group inline-flex items-center gap-3 rounded-sm border px-7 py-3.5 font-mono text-[11px] font-semibold tracking-[0.4em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 600ms ease-out 250ms, transform 600ms ease-out 250ms',
            pointerEvents: ctaVisible ? 'auto' : 'none',
            position: ctaVisible ? 'static' : 'absolute',
          }}
        >
          <span>Entrer</span>
          <ArrowUpRight
            size={15}
            strokeWidth={1.8}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </div>
  );
};

interface FilledWordmarkProps {
  className?: string;
  /** 0..1. If provided, mask the fill as a liquid rising from the bottom
   *  with an SVG turbulence-driven undulating surface. Omit for plain fill. */
  liquidProgress?: number;
}

const FilledWordmark = ({ className, liquidProgress }: FilledWordmarkProps) => {
  const useLiquidMask = typeof liquidProgress === 'number';
  const p = Math.max(0, Math.min(1, liquidProgress ?? 1));
  // Mask geometry is FIXED — the rect always has full size. The reveal is
  // driven by a `transform="translate(0 dy)"` that shifts the rect down
  // out of view at p=0 and to its natural position at p=1. Geometry-stable
  // means the filter region never changes between frames, so feTurbulence
  // + feDisplacementMap don't have to recompute on every RAF — only the
  // GPU-accelerated transform moves. Eliminates the saccaded jitter that
  // came from re-running the filter at 60Hz with shifting bbox.
  const VB_H = 95.04;
  const BUFFER = 8;
  const RECT_H = VB_H + BUFFER * 2;
  const rectShift = RECT_H * (1 - p);

  return (
    <svg
      viewBox="-3 -3 572.15 95.04"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SAW Next"
      className={className}
      fill="currentColor"
      style={{ overflow: 'visible' }}
    >
      {useLiquidMask && (
        <defs>
          <filter
            id="loader-liquid-wave"
            x="-8%"
            y="-30%"
            width="116%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.038" numOctaves="1" seed="3">
              <animate
                attributeName="baseFrequency"
                values="0.012 0.038;0.009 0.046;0.015 0.034;0.012 0.038"
                dur="6s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="7" />
          </filter>
          <mask id="loader-liquid-mask" maskUnits="userSpaceOnUse">
            <rect
              x="-3"
              y={-3 - BUFFER}
              width="572.15"
              height={RECT_H}
              fill="white"
              filter="url(#loader-liquid-wave)"
              transform={`translate(0 ${rectShift.toFixed(2)})`}
            />
          </mask>
        </defs>
      )}
      <g mask={useLiquidMask ? 'url(#loader-liquid-mask)' : undefined}>
        <path d="M93.72,1.92l-24.24,85.2h15.24l5.38-20.16h25.73l5.38,20.16h15.24L112.2,1.92h-18.48ZM93.65,53.64l9.31-34.92,9.31,34.92h-18.62Z" />
        <path d="M51.06,44.16c-3.88-2.4-9.14-4.48-15.78-6.24-4.8-1.2-8.52-2.4-11.16-3.6-2.64-1.2-4.5-2.56-5.58-4.08-1.08-1.52-1.62-3.44-1.62-5.76,0-3.28,1.2-5.94,3.6-7.98,2.4-2.04,5.64-3.06,9.72-3.06,3.04,0,5.62.64,7.74,1.92,2.12,1.28,3.8,3.06,5.04,5.34,1.24,2.28,2.06,4.98,2.46,8.1l15.24-.72c-.56-5.76-2.06-10.74-4.5-14.94-2.44-4.2-5.78-7.44-10.02-9.72-4.24-2.28-9.36-3.42-15.36-3.42s-11.3,1.04-15.66,3.12c-4.36,2.08-7.68,5.02-9.96,8.82-2.28,3.8-3.42,8.26-3.42,13.38,0,4.56.88,8.34,2.64,11.34,1.76,3,4.48,5.5,8.16,7.5,3.68,2,8.4,3.76,14.16,5.28,5.36,1.44,9.48,2.92,12.36,4.44,2.88,1.52,4.88,3.16,6,4.92,1.12,1.76,1.68,3.84,1.68,6.24,0,2.24-.56,4.16-1.68,5.76-1.12,1.6-2.74,2.8-4.86,3.6-2.12.8-4.7,1.2-7.74,1.2-3.2,0-6.02-.66-8.46-1.98-2.44-1.32-4.4-3.28-5.88-5.88-1.48-2.6-2.5-5.86-3.06-9.78l-15.12.84c.48,6.16,2.04,11.5,4.68,16.02,2.64,4.52,6.26,8.02,10.86,10.5,4.6,2.48,10.02,3.72,16.26,3.72s11.48-1,15.96-3c4.48-2,7.96-4.84,10.44-8.52,2.48-3.68,3.72-7.96,3.72-12.84,0-4.56-.84-8.52-2.52-11.88-1.68-3.36-4.46-6.24-8.34-8.64Z" />
        <polygon points="187.88 66.01 180.48 11.52 169.44 11.52 162.04 66.01 156.48 1.92 142.08 1.92 151.08 87.12 168.24 87.12 174.96 39.68 181.68 87.12 198.84 87.12 207.84 1.92 193.44 1.92 187.88 66.01" />
        <polygon points="380.16 51 416.64 51 416.64 37.8 380.16 37.8 380.16 15.6 418.08 15.6 418.08 1.92 365.28 1.92 365.28 87.12 419.04 87.12 419.04 73.44 380.16 73.44 380.16 51" />
        <polygon points="503.75 1.92 503.75 15.6 527.51 15.6 527.51 87.12 542.39 87.12 542.39 15.6 566.15 15.6 566.15 1.92 503.75 1.92" />
        <polygon points="218.64 13.08 256.06 13.08 213.96 55.08 222.36 63.48 264.26 21.58 264.36 58.92 275.52 47.76 275.52 1.92 229.92 1.92 218.64 13.08" />
        <polygon points="493.79 1.92 477.59 1.92 463.07 33.24 448.55 1.92 432.11 1.92 453.11 44.28 431.75 87.12 447.83 87.12 462.83 55.32 477.71 87.12 494.15 87.12 472.79 44.4 493.79 1.92" />
        <polygon points="332.64 63.12 306.84 1.92 290.88 1.92 290.88 87.12 305.28 87.12 305.28 25.92 331.08 87.12 347.04 87.12 347.04 1.92 332.64 1.92 332.64 63.12" />
      </g>
    </svg>
  );
};
