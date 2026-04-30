// ═══════════════════════════════════════════════════
// FilmGrain — film-grain texture, warm-tinted, full-bleed
//
// WHAT: Renders an offscreen <canvas> that paints stochastic
//       film-grain particles (random positions, varying sizes,
//       warm/cold mix). Refreshes on a discretised tick (~80ms by
//       default) so it flickers like a real reel rather than
//       looking digitally noisy.
// WHEN: Hero backdrop, invite seal, any premium ambient surface.
// HOW IT WORKS: stochastic particle generation per tick (no grid),
//       devicePixelRatio-aware, ResizeObserver, prefers-reduced-motion
//       paints once and freezes.
// CHANGE WARMTH: WARM_TINT below — pulls the dominant colour toward
//       brown/sepia. Set to '#1a1a1a' for pure cold grain.
// CHANGE DENSITY: prop `density` (particles per 10000px²). Default 14.
// CHANGE FLICKER: prop `tickMs` (ms between refresh). Default 80.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useRef } from 'react';

interface FilmGrainProps {
  className?: string;
  /** 0–1, master alpha multiplier on every particle. Default 1. */
  intensity?: number;
  /** Particles per 10000 px² (≈ a 100×100 patch). Default 14. */
  density?: number;
  /** Milliseconds between full repaints — gives the flicker cadence. */
  tickMs?: number;
}

const COLD_TINT: [number, number, number] = [22, 22, 22]; // #161616 — base shadow
const WARM_TINT: [number, number, number] = [62, 44, 30]; // #3e2c1e — slight sepia
const HIGHLIGHT: [number, number, number] = [148, 138, 128]; // warm grey speck

/** Animated film-grain canvas, decorative. aria-hidden, never reads to AT. */
export const FilmGrain = ({
  className,
  intensity = 1,
  density = 14,
  tickMs = 80,
}: FilmGrainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let lastTick = 0;
    let width = 0;
    let height = 0;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      const area = width * height;
      const count = Math.floor((area / 10000) * density);

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random();

        // 65% deep cold grain, 25% warm sepia speck, 10% bright warm-grey highlight.
        let rgb: [number, number, number];
        let alpha: number;
        let size: number;
        if (r < 0.65) {
          rgb = COLD_TINT;
          alpha = (0.18 + Math.random() * 0.22) * intensity;
          size = Math.random() < 0.85 ? 1 : 1.6;
        } else if (r < 0.9) {
          rgb = WARM_TINT;
          alpha = (0.1 + Math.random() * 0.18) * intensity;
          size = Math.random() < 0.7 ? 1.2 : 2;
        } else {
          rgb = HIGHLIGHT;
          alpha = (0.04 + Math.random() * 0.08) * intensity;
          size = Math.random() < 0.5 ? 1.5 : 2.4;
        }

        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
        ctx.fillRect(x, y, size, size);
      }
    };

    const tick = (now: number) => {
      if (now - lastTick >= tickMs) {
        paint();
        lastTick = now;
      }
      raf = window.requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      setSize();
      paint();
    });

    setSize();
    paint();
    if (!reduced) {
      raf = window.requestAnimationFrame(tick);
    }
    ro.observe(canvas);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [intensity, density, tickMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
};
