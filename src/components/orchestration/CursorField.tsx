// ═══════════════════════════════════════════════════
// CursorField — custom cursor: hollow circle + center dot
//
// WHAT: Replaces the system cursor with a 28×28px hollow circle
//       that follows the pointer with smooth lerp + a 4×4px center
//       dot that follows instantly (shutter feel). `mix-blend-
//       difference` keeps it visible on every surface (light grey,
//       black, photos).
// WHEN: Mounted once at the SceneDirector root.
// CHANGE FEEL: LERP_RING (0.18 brisk, 0.08 heavy).
// MOBILE: bails on hover:none + reduced-motion.
// ═══════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

const LERP_RING = 0.18;

export const CursorField = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.style.cursor = 'none';

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      // Dot follows instantly (shutter)
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    };

    const tick = () => {
      ringX += (targetX - ringX) * LERP_RING;
      ringY += (targetY - ringY) * LERP_RING;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.cancelAnimationFrame(raf);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* Ring — 28px hollow, lerp follow */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-9999 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#1a1a1a] mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      {/* Dot — 4px solid, instant follow */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-9999 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a1a] mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};
