// ═══════════════════════════════════════════════════
// WipeButton — corporate CTA, rectangular, no light hover
//
// WHAT: rounded-sm (light corner radius) button. Solid = bg-fg /
//       text-bg with a subtle 85% alpha on hover (NOT lighter, never
//       lighter — owner-locked direction). Ghost = border, hover
//       fills to fg/bg inverted. ArrowUpRight icon translates
//       diagonally on hover. One single style across the whole site.
// WHEN: All landing CTAs. No more rounded-full pills, no more wipe
//       to a paler color.
// CHANGE STYLE: edit here, propagates everywhere.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { ArrowUpRight } from 'lucide-react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface WipeButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'solid' | 'ghost';
  children: ReactNode;
}

export const WipeButton = ({
  variant = 'solid',
  className,
  children,
  ...rest
}: WipeButtonProps) => {
  if (variant === 'ghost') {
    return (
      <a
        {...rest}
        className={cn(
          'border-fg/40 text-fg hover:bg-fg hover:text-bg hover:border-fg group inline-flex h-12 items-center justify-center gap-2.5 rounded-sm border bg-transparent px-6 font-mono text-[11px] font-semibold tracking-[0.3em] uppercase transition-colors duration-200',
          className,
        )}
      >
        <span>{children}</span>
        <ArrowUpRight
          size={14}
          strokeWidth={2}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    );
  }
  return (
    <a
      {...rest}
      className={cn(
        'bg-fg text-bg hover:bg-fg/90 group inline-flex h-12 items-center justify-center gap-2.5 rounded-sm px-6 font-mono text-[11px] font-semibold tracking-[0.3em] uppercase transition-colors duration-200',
        className,
      )}
    >
      <span>{children}</span>
      <ArrowUpRight
        size={14}
        strokeWidth={2}
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
};
