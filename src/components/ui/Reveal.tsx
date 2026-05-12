// ═══════════════════════════════════════════════════
// Reveal — wrapper component for scroll-in reveal animations
//
// WHAT: Wraps any element/component with the useReveal hook. The wrapped
//       element fades + slides up when entering the viewport. Pass an
//       `index` prop to stagger reveals inside a grid (each child delays
//       by --stagger-base × index, capped at maxStagger ms).
// WHEN: Wrap individual cards inside a listing grid, section openers,
//       editorial text blocks. Anywhere the "appears on scroll" feel
//       is desired.
// CHANGE CADENCE: edit --stagger-base in src/index.css :root.
// PERF: each Reveal mounts one IntersectionObserver. Cheap (<1ms each)
//       and observers auto-disconnect after first reveal (once=true).
// ═══════════════════════════════════════════════════

import { useReveal } from '@hooks/useReveal';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface RevealProps {
  /** Position in a grid / list. Used to stagger via --stagger-base. Default 0. */
  index?: number;
  /** Max total stagger delay (ms) — clamp so 20-item lists don't wait forever. Default 600. */
  maxStagger?: number;
  /** Per-item stagger step in ms. Default 60 (matches --stagger-base). */
  step?: number;
  /** Wrapper className passthrough. */
  className?: string;
  /** Re-reveal on every entry (false by default = one-shot). */
  rewind?: boolean;
  children: ReactNode;
}

/** Wrap any element to fade + slide it in when it enters the viewport. */
export const Reveal = ({
  index = 0,
  maxStagger = 600,
  step = 60,
  className,
  rewind = false,
  children,
}: RevealProps) => {
  const delay = Math.min(index * step, maxStagger);
  const ref = useReveal<HTMLDivElement>({ delay, once: !rewind });
  return (
    <div ref={ref} className={cn('reveal', className)}>
      {children}
    </div>
  );
};
