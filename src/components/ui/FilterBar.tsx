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

/** Horizontal filter row, scrolls on mobile, wraps on desktop. */
export const FilterBar = ({ className, children }: FilterBarProps) => {
  return (
    <div
      className={cn('border-border flex flex-wrap items-center gap-2 border-y py-3', className)}
      role="toolbar"
      aria-label="Filters"
    >
      {children}
    </div>
  );
};

/** Single toggle chip — selected = filled, unselected = outline. */
const FilterChip = ({ label, selected = false, onToggle, className }: FilterChipProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs tracking-widest uppercase',
        'duration-base transition-[color,background-color,border-color]',
        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        selected
          ? 'bg-fg text-bg border-fg border'
          : 'border-border text-muted hover:text-fg hover:border-fg/40 border bg-transparent',
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
