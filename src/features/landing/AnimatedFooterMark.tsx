// ═══════════════════════════════════════════════════
// AnimatedFooterMark — full-width SAW NEXT wordmark, infinite breathing loop
//
// WHAT: Footer monumental mark. Same stroke-draw + liquid-fill mechanics
//       as the entry Loader, but :
//         - super slow (28s cycle) and organic — never feels like a UI
//           progress, just a brand breathing
//         - no "Entrer" CTA, no exit phase — perpetually loops
//         - spans 100% of viewport width on any device (SVG with
//           preserveAspectRatio meet, height follows aspect ratio)
//         - reverse on the way down so the mark "drains" back to nothing
//           before redrawing — feels like ink + tide, not a reset hop.
// WHEN: Mounted by LandingFooter, just before the legal/nav blocks.
// CHANGE TIMING: edit the constants below (DRAW_MS / FILL_*  / HOLD_MS /
//                DRAIN_MS / REST_MS). Cycle total = DRAW_MS + HOLD_MS +
//                DRAIN_MS + REST_MS.
// ═══════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react';

import { WordmarkStroke } from './Loader/WordmarkStroke';

const DRAW_MS = 14000;
// Liquid fill starts at this fraction of DRAW_MS — same logic as Loader
// (overlap). The wordmark traces while it begins to fill from the bottom.
const FILL_START_RATIO = 0.6;
const FILL_MS = 10000;
const HOLD_MS = 10000;
const DRAIN_MS = 4000;
const REST_MS = 1000;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const AnimatedFooterMark = () => {
  const [drawProgress, setDrawProgress] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);

  // prefers-reduced-motion → static fully-drawn fully-filled mark, no animation.
  const reducedMotionRef = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotionRef.current) {
      setDrawProgress(1);
      setFillProgress(1);
    }
  }, []);

  useEffect(() => {
    if (reducedMotionRef.current) return;
    const start = performance.now();
    const fillDelay = DRAW_MS * FILL_START_RATIO;
    const drawEnd = DRAW_MS;
    const fillEnd = fillDelay + FILL_MS;
    const holdEnd = Math.max(drawEnd, fillEnd) + HOLD_MS;
    const drainEnd = holdEnd + DRAIN_MS;
    const cycleEnd = drainEnd + REST_MS;

    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - start) % cycleEnd;

      let drawT: number;
      let fillT: number;

      if (elapsed < drawEnd) {
        // Draw rising 0 → 1
        drawT = ease(Math.min(elapsed / DRAW_MS, 1));
      } else if (elapsed < drainEnd) {
        // Hold at 1, then drain 1 → 0 linearly during DRAIN_MS
        drawT = elapsed < holdEnd ? 1 : 1 - (elapsed - holdEnd) / DRAIN_MS;
      } else {
        drawT = 0;
      }

      if (elapsed < fillDelay) {
        fillT = 0;
      } else if (elapsed < fillEnd) {
        fillT = (elapsed - fillDelay) / FILL_MS;
      } else if (elapsed < drainEnd) {
        // Hold filled then drain 1 → 0
        fillT = elapsed < holdEnd ? 1 : 1 - (elapsed - holdEnd) / DRAIN_MS;
      } else {
        fillT = 0;
      }

      setDrawProgress(Math.max(0, Math.min(1, drawT)));
      setFillProgress(Math.max(0, Math.min(1, fillT)));

      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden="true" className="w-full overflow-hidden" style={{ contain: 'paint' }}>
      <div className="relative w-full">
        <WordmarkStroke
          progress={drawProgress}
          strokeWidth={0.8}
          className="text-fg block w-full"
        />
        <div className="pointer-events-none absolute inset-0" style={{ contain: 'paint' }}>
          <FooterFilledMark liquidProgress={fillProgress} />
        </div>
      </div>
    </div>
  );
};

interface FooterFilledMarkProps {
  liquidProgress: number;
}

const FooterFilledMark = ({ liquidProgress }: FooterFilledMarkProps) => {
  const p = Math.max(0, Math.min(1, liquidProgress));
  const VB_H = 95.04;
  const BUFFER = 8;
  // Rect geometry FIXED — only the translate Y changes between frames.
  // Same trick as the entry Loader for smoothness (filter region stable).
  const rectShift = (VB_H + BUFFER) * (1 - p);

  return (
    <svg
      viewBox="-3 -3 572.15 95.04"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="SAW NEXT"
      className="text-fg block h-auto w-full"
      fill="currentColor"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter
          id="footer-liquid-wave"
          x="-8%"
          y="-30%"
          width="116%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.038" numOctaves="1" seed="7">
            <animate
              attributeName="baseFrequency"
              values="0.012 0.038;0.009 0.046;0.015 0.034;0.012 0.038"
              dur="9s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="6" />
        </filter>
        <mask id="footer-liquid-mask" maskUnits="userSpaceOnUse">
          <rect
            x="-3"
            y={-3 - BUFFER}
            width="572.15"
            height={VB_H + BUFFER * 2}
            fill="white"
            filter="url(#footer-liquid-wave)"
            transform={`translate(0 ${rectShift.toFixed(2)})`}
          />
        </mask>
      </defs>
      <g mask="url(#footer-liquid-mask)">
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
