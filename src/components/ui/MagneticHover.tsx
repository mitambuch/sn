// ═══════════════════════════════════════════════════
// MagneticHover — wrap anything to make it magnetic
//
// WHAT: Wraps children in a div that uses useMagneticHover. The wrapped
//       element pulls subtly toward the cursor when nearby. Transition
//       smoothed via --duration-fast + --ease-luxe so the snap-back
//       feels luxe, not whippy.
// WHEN: Wrap primary CTAs ("Une demande personnalisée"), submit buttons,
//       hero buttons, anything that should feel "alive" under the cursor.
// PERF: 1 ref + per-instance pointer listeners (auto-cleaned). Bypassed
//       on touch + reduced-motion (hook does the gating).
// ═══════════════════════════════════════════════════

import { useMagneticHover } from '@hooks/useMagneticHover';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface MagneticHoverProps {
  /** Pull radius (px). Default 100. */
  radius?: number;
  /** Pull strength fraction (0-1). Default 0.25. */
  strength?: number;
  className?: string;
  children: ReactNode;
}

export const MagneticHover = ({ radius, strength, className, children }: MagneticHoverProps) => {
  const ref = useMagneticHover<HTMLDivElement>({
    ...(radius !== undefined && { radius }),
    ...(strength !== undefined && { strength }),
  });
  return (
    <div
      ref={ref}
      className={cn(
        'duration-fast ease-luxe inline-block transition-transform motion-reduce:transition-none',
        className,
      )}
    >
      {children}
    </div>
  );
};
