// ═══════════════════════════════════════════════════
// useMagneticHover — element pulls slightly toward cursor
//
// WHAT: Attaches a ref that translates the element by `strength` of the
//       cursor offset when the cursor is within `radius` pixels. Subtle
//       luxe-feel (Bottega / Aman vibe). RAF-throttled. Respects
//       prefers-reduced-motion AND (hover: none) — desktop only.
// WHEN: Use via <MagneticHover /> wrapper on critical CTAs (primary
//       submit buttons, "Une demande personnalisée", floating dock).
// COST: ~50 LOC, 0 dep. Per-instance pointermove listener (lifecycle
//       cleaned on unmount). Affordable for ≤ 10 magnetic elements
//       on a page.
// ═══════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

interface UseMagneticHoverOptions {
  /** Radius in px around element where pull starts. Default 100. */
  radius?: number;
  /** Pull strength fraction of cursor offset (0-1). Default 0.25. */
  strength?: number;
}

export function useMagneticHover<T extends HTMLElement = HTMLDivElement>(
  options: UseMagneticHoverOptions = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const el = ref.current;
    if (!el) return;

    const radius = options.radius ?? 100;
    const strength = options.strength ?? 0.25;

    let rafId: number | null = null;
    let active = false;

    const apply = (tx: number, ty: number) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${String(tx)}px, ${String(ty)}px, 0)`;
      });
    };

    const reset = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = '';
      });
    };

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        reset();
        return;
      }
      apply(dx * strength, dy * strength);
    };

    const onEnter = () => {
      active = true;
      window.addEventListener('pointermove', onMove, { passive: true });
    };
    const onLeave = () => {
      active = false;
      window.removeEventListener('pointermove', onMove);
      reset();
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointermove', onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.style.transform = '';
    };
  }, [options.radius, options.strength]);

  return ref;
}
