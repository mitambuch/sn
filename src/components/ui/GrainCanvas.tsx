// ═══════════════════════════════════════════════════
// GrainCanvas — animated organic grain texture, full-bleed
//
// WHAT: Renders a <canvas> that paints a slowly-evolving Perlin noise
//       field as low-alpha dots. Gives the "living paper" feel of the
//       brand presentation PDF without the weight of a video bg.
// WHEN: Hero backdrop, invite page seal, any premium section that
//       needs ambient matter. Set `intensity` per surface.
// HOW IT WORKS: simplex-noise 2D + slow time axis. ResizeObserver +
//       devicePixelRatio for crispness. requestAnimationFrame loop with
//       throttle. Bails on prefers-reduced-motion (paints once, static).
// CHANGE DENSITY: tweak GRID_PX (smaller = denser grain, heavier CPU).
// CHANGE TINT: edit the rgba in fillStyle below.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

interface GrainCanvasProps {
  className?: string;
  /** 0–1, scales the dot opacity. Default 1 (full). */
  intensity?: number;
  /** px between dots. Smaller = denser grain. Default 7. */
  gridPx?: number;
  /** Hex tint for dots. Default '#1a1a1a' (brand fg in light mode). */
  tint?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

/** Animated Perlin grain, decorative. aria-hidden, never reads to AT. */
export const GrainCanvas = ({
  className,
  intensity = 1,
  gridPx = 7,
  tint = '#1a1a1a',
}: GrainCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const noise = createNoise3D();
    const [r, g, b] = hexToRgb(tint);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let t = 0;
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
      const cols = Math.ceil(width / gridPx);
      const rows = Math.ceil(height / gridPx);
      const NOISE_SCALE = 0.06;
      const TIME_SCALE = 0.6;

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const n = noise(x * NOISE_SCALE, y * NOISE_SCALE, t * TIME_SCALE);
          // Map noise [-1, 1] → opacity. Bias dark to give a velvety feel.
          const a = Math.max(0, n) * 0.18 * intensity;
          if (a < 0.01) continue;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillRect(x * gridPx, y * gridPx, 1.5, 1.5);
        }
      }
    };

    const tick = () => {
      t += 0.004;
      paint();
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
  }, [intensity, gridPx, tint]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
};
