// ═══════════════════════════════════════════════════
// MaskedReveal — text/image revealed by a clip-path that lifts
//
// WHAT: Wraps children in an overflow-hidden frame; on enter
//       (in-view or on-mount) the inner content slides up + opacity
//       fades from 110% offset to 0. CSS animation, no JS lib.
// WHEN: Headlines, paragraph chunks, image cards. Compose multiple
//       with stagger via the `delay` prop for line-by-line reveals.
// HOW IT WORKS: IntersectionObserver attaches the .animate-veil-rise
//       utility once, threshold 15%. Reduced-motion = paints directly.
// CHANGE DURATION/EASING: edit @keyframes veil-rise in animations.css.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';

interface MaskedRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal triggers. */
  delay?: number;
  /** Trigger on mount instead of in-view. Use for above-the-fold. */
  immediate?: boolean;
  /** as= 'div' | 'span' — default 'div'. */
  as?: 'div' | 'span';
}

/** Reveals children with a vertical clip-path lift on enter. */
export const MaskedReveal = ({
  children,
  className,
  delay = 0,
  immediate = false,
  as = 'div',
}: MaskedRevealProps) => {
  const ref = useRef<HTMLDivElement | HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [immediate]);

  const Tag = as;
  const innerStyle = revealed
    ? {
        animationDelay: `${delay}ms`,
      }
    : { transform: 'translateY(110%)', opacity: 0 };

  return (
    <Tag
      ref={ref as Ref<HTMLDivElement & HTMLSpanElement>}
      className={cn('block overflow-hidden', className)}
    >
      <Tag
        className={cn('block', revealed && 'animate-veil-rise')}
        style={innerStyle as CSSProperties}
      >
        {children}
      </Tag>
    </Tag>
  );
};
