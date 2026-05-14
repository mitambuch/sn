// ═══════════════════════════════════════════════════
// Stepper — numeric input with +/- buttons, no manual typing
//
// WHAT: Integer-only control with decrement / increment buttons flanking
//       a centred value. Zero keyboard entry — the user always taps the
//       buttons. Disabled state on the boundary buttons when value hits
//       min or max. Designed to read as one continuous h-12 box so it
//       aligns with the rest of the wizard inputs.
// WHEN: Wizard forms — passengers count, bedrooms, guests, art
//       dimensions, anything where a small bounded integer makes sense.
// CHANGE BOUNDS: pass `min` and `max` per use ; defaults 0 / 99.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { Minus, Plus } from 'lucide-react';
import { useId } from 'react';

interface StepperProps {
  id?: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Suffix appended to the displayed value (e.g. "cm", "p."). */
  unit?: string;
  /** Placeholder for the empty / zero state (default "—"). */
  emptyLabel?: string;
  className?: string;
}

export const Stepper = ({
  id: providedId,
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  unit,
  emptyLabel = '—',
  className,
}: StepperProps) => {
  const autoId = useId();
  const id = providedId ?? autoId;

  const canDec = value > min;
  const canInc = value < max;

  const decrement = () => {
    if (!canDec) return;
    onChange(Math.max(min, value - step));
  };
  const increment = () => {
    if (!canInc) return;
    onChange(Math.min(max, value + step));
  };

  // WHY: when value equals min and min is 0, treat as "unset" and show
  // the emptyLabel instead of "0 cm" — matches the rest of the wizard's
  // "all fields optional" UX.
  const display =
    value === 0 && min === 0
      ? emptyLabel
      : unit
        ? `${value.toLocaleString('fr-CH')} ${unit}`
        : value.toLocaleString('fr-CH');

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={id}
        className="text-muted font-mono text-[10px] font-medium tracking-[0.18em] uppercase"
      >
        {label}
      </label>
      <div className="border-fg/15 bg-bg flex h-12 items-stretch overflow-hidden rounded-md border">
        <button
          type="button"
          onClick={decrement}
          disabled={!canDec}
          aria-label={`${label} : −${step}`}
          className={cn(
            'text-fg flex w-12 shrink-0 items-center justify-center transition-colors',
            'hover:bg-surface focus-visible:bg-surface focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
            'disabled:cursor-not-allowed disabled:opacity-30',
          )}
        >
          <Minus size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <span
          id={id}
          aria-live="polite"
          className="text-fg flex-1 self-center text-center font-mono text-sm tabular-nums"
        >
          {display}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={!canInc}
          aria-label={`${label} : +${step}`}
          className={cn(
            'text-fg flex w-12 shrink-0 items-center justify-center transition-colors',
            'hover:bg-surface focus-visible:bg-surface focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
            'disabled:cursor-not-allowed disabled:opacity-30',
          )}
        >
          <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
