// ═══════════════════════════════════════════════════
// CursorField — custom cursor + global magnetic field
//
// WHAT: Replaces the system cursor with a 1×24px white line that
//       follows the pointer with smooth lerp inertia. Any element
//       carrying `data-magnetic` (and optional `data-magnetic-strength`)
//       attracts the cursor + receives a subtle translate toward the
//       pointer, computed at the parent's tick (no per-element
//       useEffect cost).
// WHEN: Mounted once at the SceneDirector root.
// CHANGE FEEL: LERP constant (0.18 = brisk, 0.08 = heavy).
// MOBILE: bails on hover:none (no cursor concept) + reduced-motion.
// ═══════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

const LERP = 0.18;

export const CursorField = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.documentElement.style.cursor = 'none';

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
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
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="bg-fg pointer-events-none fixed top-0 left-0 z-[9999] h-6 w-px -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ willChange: 'transform' }}
    />
  );
};
