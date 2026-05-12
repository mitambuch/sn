// ═══════════════════════════════════════════════════
// FilterBar — composable horizontal filter row for catalogue lists
//
// WHAT: A flex container that arranges <FilterChip> children horizontally with
//       wrap on mobile. Each chip is a toggle button with selected/unselected
//       states. Use FilterBar.Reset to expose a "reset all" affordance.
// WHEN: Property list (canton/type/m²), Timepiece list (brand/era), etc.
// CHANGE COLORS: tokens via design system; nothing hardcoded here.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface FilterBarProps {
  className?: string;
  children: ReactNode;
}

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onToggle: () => void;
  className?: string;
}

interface FilterResetProps {
  label: string;
  onReset: () => void;
  visible: boolean;
}

/** Horizontal filter row — proper breathing on mobile (no cramped chips).
 *  Wraps on overflow; gap-2.5 gives chips enough air to read as real boxes. */
export const FilterBar = ({ className, children }: FilterBarProps) => {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2.5 py-2', className)}
      role="toolbar"
      aria-label="Filters"
    >
      {children}
    </div>
  );
};

/** Single toggle chip — square-ish box (rounded-md), 44px tap target on
 *  mobile, generous padding so labels breathe. Premium box style, not pill. */
const FilterChip = ({ label, selected = false, onToggle, className }: FilterChipProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        'inline-flex min-h-11 items-center rounded-md border px-4 py-2 text-xs tracking-widest whitespace-nowrap uppercase',
        'duration-base transition-[color,background-color,border-color]',
        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        selected
          ? 'border-fg bg-fg text-bg'
          : 'border-border text-muted hover:text-fg hover:border-fg/40 bg-transparent',
        className,
      )}
    >
      {label}
    </button>
  );
};

/** Reset link — only rendered when filters are active. */
const FilterReset = ({ label, onReset, visible }: FilterResetProps) => {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onReset}
      className="text-muted hover:text-fg ml-auto text-xs tracking-widest uppercase underline-offset-4 hover:underline"
    >
      {label}
    </button>
  );
};

FilterBar.Chip = FilterChip;
FilterBar.Reset = FilterReset;
