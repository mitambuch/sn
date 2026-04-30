// ═══════════════════════════════════════════════════
// MagneticButton — element that subtly attracts toward the cursor
//
// WHAT: Wraps any clickable in a span that translates a few pixels
//       toward the pointer when it enters a soft radius around the
//       element. Uses requestAnimationFrame + transform (GPU-only),
//       no layout thrash. Releases with a spring-back on leave.
// WHEN: Premium CTAs, contact links, anywhere the brand needs
//       a tactile "alive" cue. NOT for form fields (perturbs typing
//       precision) and NOT for primary nav (focus discipline).
// CHANGE STRENGTH: prop `strength` 0.1 (subtle) → 0.6 (loud).
// CHANGE RANGE: prop `range` in px (zone of influence around center).
// MOBILE: no-op (no hover events fire on touch); the inner element
//         keeps its hover/active CSS as fallback.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  range?: number;
}

/** Wraps children in a span that magnetises toward the pointer. */
export const MagneticButton = ({
  children,
  className,
  strength = 0.3,
  range = 120,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const apply = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        raf = window.requestAnimationFrame(apply);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.hypot(dx, dy);
      if (distance > range) {
        targetX = 0;
        targetY = 0;
      } else {
        targetX = dx * strength;
        targetY = dy * strength;
      }
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [strength, range]);

  return (
    <span ref={ref} className={cn('inline-block will-change-transform', className)}>
      {children}
    </span>
  );
};
