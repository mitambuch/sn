// ═══════════════════════════════════════════════════
// WipeButton — solid CTA with hover wipe (GAFHA-pattern)
//
// WHAT: rounded-full button, fg/bg solid, with a muted overlay that
//       wipes left → right on hover. ArrowUpRight icon translates
//       diagonally on hover. Ghost variant for secondary actions.
// WHEN: All landing CTAs (PRENDRE CONTACT, APPELER MAINTENANT,
//       ÉCRIRE UN EMAIL, etc.). Replace ad-hoc <a> buttons.
// CHANGE COLORS: edit the bg-fg / bg-muted tokens. Wipe = -translate-x-full → translate-x-0.
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
          'border-border text-fg hover:bg-fg hover:text-bg hover:border-fg group inline-flex h-12 items-center justify-center gap-2 rounded-full border bg-transparent px-6 font-mono text-[11px] font-semibold tracking-[0.3em] uppercase transition-colors duration-300',
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
        'bg-fg text-bg group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 font-mono text-[11px] font-semibold tracking-[0.3em] uppercase transition-colors duration-300',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="bg-muted absolute inset-0 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ArrowUpRight
          size={14}
          strokeWidth={2}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </a>
  );
};
