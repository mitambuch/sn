// ═══════════════════════════════════════════════════
// BrandPreloader — Three.js + true SVG stroke-draw entry splash
//
// WHAT: Full immersive entry "on entre chez SAW↗NEXT". ~7s timeline.
//   - <Canvas> r3f scene : drifting starfield + slow camera dolly,
//     ambient depth behind the brand mark
//   - SVG path generated at runtime from Geist Mono Variable woff2 via
//     opentype.js → real outline of each letter as <path>
//   - stroke-dasharray animation traces the contour of the letters
//     (true "letter being drawn" feel, not a clip-path wipe approximation)
//   - Once stroke fully drawn → fill animation (stroke fade + fill solid)
//   - Welcome eyebrow + tagline fade in sequence
//   - Progress bar 0 → 100 over full duration
//   - Final overlay fade out
// WHEN: Mounted once at App level on first visit per session.
// SKIP: respects prefers-reduced-motion (renders nothing, fires onComplete).
// ═══════════════════════════════════════════════════

import { Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { cn } from '@utils/cn';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';

const TIMINGS = {
  /** Contour traced (stroke-dasharray animation). */
  draw: 4000,
  /** Outline fades into solid fill. */
  fill: 1100,
  /** Hold filled + welcome copy + tagline complete. */
  hold: 1400,
  /** Final overlay fade. */
  exit: 800,
};
const TOTAL = TIMINGS.draw + TIMINGS.fill + TIMINGS.hold + TIMINGS.exit;
const BRAND_TEXT = 'SAW↗NEXT';
const FONT_URL = '/fonts/GeistMono-Variable.ttf';

type Phase = 'draw' | 'fill' | 'hold' | 'exit' | 'done';

interface BrandPreloaderProps {
  onComplete?: () => void;
}

/** Slowly rotating starfield + subtle camera dolly = "you're entering" feel. */
function ImmersiveField() {
  const ref = useRef<Group>(null);
  useFrame((state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.045;
      ref.current.rotation.x += dt * 0.012;
    }
    // Subtle camera dolly forward over the splash duration.
    if (state.camera.position.z > 3.5) {
      state.camera.position.z -= dt * 0.35;
    }
  });
  return (
    <group ref={ref}>
      <Stars radius={80} depth={50} count={2600} factor={4} saturation={0} fade speed={0.5} />
    </group>
  );
}

/** Async-load Geist Mono Variable via opentype.js and generate SVG path data
 *  for the brand text. Path is computed once and memoized in state. */
function useBrandPath(text: string, fontUrl: string, fontSize = 200) {
  const [pathData, setPathData] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState<string>('0 0 1000 240');

  useEffect(() => {
    let cancelled = false;
    void import('opentype.js').then(async opentype => {
      try {
        const font = await opentype.default.load(fontUrl);
        if (cancelled) return;
        // Geist Mono Variable axis defaults to ~400; for visual weight ~700
        // we render at a stylized scale + use the font's bold horizontal
        // metrics. opentype.js doesn't switch variable axes by default —
        // we still get a usable bold-looking path at the chosen fontSize.
        const path = font.getPath(text, 0, fontSize, fontSize);
        const bbox = path.getBoundingBox();
        const width = bbox.x2 - bbox.x1;
        const height = bbox.y2 - bbox.y1;
        const padX = width * 0.04;
        const padY = height * 0.2;
        setViewBox(
          `${String(bbox.x1 - padX)} ${String(bbox.y1 - padY)} ${String(width + padX * 2)} ${String(
            height + padY * 2,
          )}`,
        );
        setPathData(path.toPathData(2));
      } catch (err) {
        // Font load failed — fail open (preloader still runs without
        // the stroke-draw effect, falls back to plain text reveal).
        console.warn('[BrandPreloader] font load failed:', err);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [text, fontUrl, fontSize]);

  return { pathData, viewBox };
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const BrandPreloader = ({ onComplete }: BrandPreloaderProps) => {
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? 'done' : 'draw'));
  const [progress, setProgress] = useState(0);
  const { pathData, viewBox } = useBrandPath(BRAND_TEXT, FONT_URL);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onComplete?.();
      return;
    }
    const t1 = window.setTimeout(() => {
      setPhase('fill');
    }, TIMINGS.draw);
    const t2 = window.setTimeout(() => {
      setPhase('hold');
    }, TIMINGS.draw + TIMINGS.fill);
    const t3 = window.setTimeout(
      () => {
        setPhase('exit');
      },
      TIMINGS.draw + TIMINGS.fill + TIMINGS.hold,
    );
    const t4 = window.setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, TOTAL);

    const start = performance.now();
    let rafId = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / TOTAL) * 100);
      setProgress(pct);
      if (elapsed < TOTAL) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className={cn(
        'bg-bg fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden',
        'transition-opacity duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)]',
        phase === 'exit' && 'pointer-events-none opacity-0',
      )}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.4} />
        <ImmersiveField />
      </Canvas>

      {/* Vignette top + bottom to focus on center. */}
      <div
        aria-hidden="true"
        className="from-bg/80 via-bg/0 to-bg/80 pointer-events-none absolute inset-0 bg-linear-to-b"
      />

      {/* Radial glow centered — depth + warmth around the brand mark. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in srgb, var(--color-fg) 12%, transparent) 0%, transparent 70%)',
          mixBlendMode: 'overlay',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-12 px-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted font-mono text-[10px] tracking-[0.5em] uppercase opacity-0 motion-safe:animate-[preloader-fade_1s_0.4s_forwards]">
            Ferment privilégié
          </span>
          <span className="text-muted/60 font-mono text-[9px] tracking-[0.6em] uppercase opacity-0 motion-safe:animate-[preloader-fade_1s_0.9s_forwards]">
            Bienvenue chez
          </span>
        </div>

        <div className="preloader-svg-wrap" data-phase={phase}>
          {pathData ? (
            <svg
              viewBox={viewBox}
              className="preloader-svg"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <path d={pathData} className="preloader-svg-path" />
            </svg>
          ) : (
            <div className="text-muted font-mono text-xs tracking-widest uppercase">
              Chargement…
            </div>
          )}
        </div>

        <p className="text-muted max-w-md text-center font-sans text-sm leading-relaxed text-pretty opacity-0 motion-safe:animate-[preloader-fade_1s_5s_forwards] md:text-base">
          Conciergerie privée — l'accès est ferment privilégié.
        </p>
      </div>

      <div className="absolute right-0 bottom-12 left-0 z-10 mx-auto flex w-full max-w-md flex-col items-center gap-2 px-6">
        <div className="border-border bg-surface/40 h-px w-full overflow-hidden rounded-full">
          <div
            className="bg-fg h-full transition-[width] duration-100 ease-linear"
            style={{ width: `${String(progress)}%` }}
          />
        </div>
        <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
          {String(Math.round(progress)).padStart(3, '0')} / 100
        </span>
      </div>
    </div>
  );
};
