// ═══════════════════════════════════════════════════
// FilterBar — composable horizontal filter row for catalogue lists
//
// WHAT: A flex container that arranges <FilterBar.Chip> children as
//       well-defined capsule pills. Each chip is a toggle button with
//       selected/unselected states. Use FilterBar.Reset to expose a
//       "reset all" affordance. Inspired by the etoiles-aux-atomes
//       filter pattern : filled surface background (no floating
//       outline), rounded-full capsules, mono caps chrome.
// WHEN: Catalogue aggregator + every module list page (Properties,
//       Timepieces, Artworks, Events, Journeys, Concierge, News).
// CHANGE COLORS: tokens only ; selected state inverts fg/bg.
// CHANGE COMPACTNESS: pill height lives in CHIP_BASE below.
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

// WHY: shared chip chrome so every pill on every page stays in sync.
// rounded-md gives a square-ish box (owner direction 2026-05-14 15:15 —
// "des boites plus carrées, pas flottant") ; h-10 (40px) keeps the bar
// compact ; shrink-0 so chips don't compress when the row scrolls
// horizontally on mobile.
const CHIP_BASE = cn(
  'inline-flex h-10 shrink-0 items-center rounded-md border',
  'px-4 font-mono text-[11px] tracking-[0.15em] whitespace-nowrap uppercase',
  'duration-base transition-[color,background-color,border-color,box-shadow]',
  'focus-visible:ring-accent focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
);

/** Horizontal filter row.
 *
 *  Mobile : `flex-nowrap overflow-x-auto` with -mx-4 px-4 edge bleed so the
 *  row scrolls cleanly to the viewport edges (native-app feel, no awkward
 *  wrap that adds vertical noise on small screens).
 *
 *  Tablet+ : `sm:flex-wrap sm:overflow-visible` reverts to the standard
 *  multi-row layout, since there's room to fit every chip without scroll.
 */
export const FilterBar = ({ className, children }: FilterBarProps) => {
  return (
    <div
      className={cn(
        '-mx-4 flex flex-nowrap items-center gap-2 overflow-x-auto px-4 py-1',
        'sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0',
        // Hide scrollbar on webkit + Firefox ; the bleed is visual cue enough.
        '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      role="toolbar"
      aria-label="Filters"
    >
      {children}
    </div>
  );
};

/** Single toggle chip — capsule (rounded-full), filled surface background
 *  so the pill reads as a defined box even at rest. Selected state inverts
 *  to bg-fg text-bg with a soft shadow — etoiles-aux-atomes pattern. */
const FilterChip = ({ label, selected = false, onToggle, className }: FilterChipProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        CHIP_BASE,
        selected
          ? 'border-fg bg-fg text-bg shadow-sm'
          : 'border-fg/10 bg-surface/60 text-muted hover:text-fg hover:bg-surface hover:border-fg/25',
        className,
      )}
    >
      {label}
    </button>
  );
};

/** Reset link — only rendered when filters are active. Placed at the end
 *  of the row ; on tablet+ it's pushed right via sm:ml-auto. */
const FilterReset = ({ label, onReset, visible }: FilterResetProps) => {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onReset}
      className={cn(
        'shrink-0 sm:ml-auto',
        'text-muted hover:text-fg duration-base inline-flex h-10 items-center',
        'font-mono text-[11px] tracking-[0.15em] uppercase transition-colors',
        'underline-offset-4 hover:underline',
        'focus-visible:ring-accent rounded-sm focus-visible:ring-2 focus-visible:outline-none',
      )}
    >
      {label}
    </button>
  );
};

FilterBar.Chip = FilterChip;
FilterBar.Reset = FilterReset;
