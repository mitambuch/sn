// ═══════════════════════════════════════════════════
// RangeSlider — dual-thumb range picker with bucketed steps
//
// WHAT: Two-thumb numeric range, driven by a discrete `steps` array.
//       The thumbs snap between predefined values (e.g. surface buckets
//       0/50/100/200/500 m², CHF 0/100K/500K/1M/5M/10M+) — zero manual
//       typing, premium feel. Value formatting is delegated to a caller-
//       provided `format` function so the same atom works for prices,
//       surfaces, years, percentages, etc.
// WHEN: Wizard forms (Concierge request), filter sidebars, search refines.
// CHANGE STEPS: pass a different `steps` array per use ; the atom never
//       hardcodes a domain.
// CHANGE THUMB SIZE: edit THUMB_TW below ; both webkit + moz variants
//       are kept in sync via shared utility classes.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { useId } from 'react';

interface RangeSliderProps {
  /** Optional id ; auto-generated if omitted (for label htmlFor wiring). */
  id?: string;
  /** Section label (rendered above the track). */
  label: string;
  /** Discrete bucketed values, ascending. Slider snaps to these. */
  steps: readonly number[];
  /** Current [min, max] selection — values from the `steps` array. */
  value: readonly [number, number];
  /** Fires whenever either thumb is dragged. */
  onChange: (next: [number, number]) => void;
  /** Format a numeric step for display (price, m², year…). */
  format: (n: number) => string;
  /** Suffix appended to the displayed max when the last step is reached
   *  (e.g. "+" for "10 M CHF+"). Defaults to empty. */
  maxSuffix?: string;
  className?: string;
}

// Tailwind utilities applied to both webkit + moz pseudo-thumbs so the
// thumb chrome stays cross-browser consistent. `pointer-events-auto`
// re-enables interaction on the thumb itself after the parent <input>
// got `pointer-events-none` (so the underlying track stays clickable
// for both thumbs without one input shadowing the other).
// h-6 w-6 (24px) thumb — owner direction 2026-05-14 16:13 "le module de
// prix est super mais il faut qu'il soit plus haut, on risque de la
// manquer". Combined with the h-2 track and 32px wrapper area below,
// the slider now reads as a substantial control, not a thin line.
const THUMB_TW = cn(
  '[&::-webkit-slider-thumb]:pointer-events-auto',
  '[&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:h-6',
  '[&::-webkit-slider-thumb]:w-6',
  '[&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:bg-fg',
  '[&::-webkit-slider-thumb]:border-2',
  '[&::-webkit-slider-thumb]:border-bg',
  '[&::-webkit-slider-thumb]:shadow-md',
  '[&::-webkit-slider-thumb]:cursor-grab',
  '[&:active::-webkit-slider-thumb]:cursor-grabbing',
  '[&::-moz-range-thumb]:appearance-none',
  '[&::-moz-range-thumb]:h-6',
  '[&::-moz-range-thumb]:w-6',
  '[&::-moz-range-thumb]:rounded-full',
  '[&::-moz-range-thumb]:bg-fg',
  '[&::-moz-range-thumb]:border-2',
  '[&::-moz-range-thumb]:border-bg',
  '[&::-moz-range-thumb]:shadow-md',
  '[&::-moz-range-thumb]:cursor-grab',
);

/** Dual-thumb discrete range slider. The thumbs always snap to a value
 *  from `steps` — no fractional state. */
export const RangeSlider = ({
  id: providedId,
  label,
  steps,
  value,
  onChange,
  format,
  maxSuffix = '',
  className,
}: RangeSliderProps) => {
  const autoId = useId();
  const id = providedId ?? autoId;
  const maxIdx = steps.length - 1;

  // Clamp the incoming selection to the steps array — defensive against
  // a stale value (e.g. step array changed at runtime).
  const minIdx = Math.max(0, Math.min(maxIdx, steps.indexOf(value[0])));
  const maxThumbIdx = Math.max(0, Math.min(maxIdx, steps.indexOf(value[1])));

  const pctMin = (minIdx / maxIdx) * 100;
  const pctMax = (maxThumbIdx / maxIdx) * 100;

  const minVal = steps[minIdx] ?? steps[0]!;
  const maxVal = steps[maxThumbIdx] ?? steps[maxIdx]!;
  const isAtMax = maxThumbIdx === maxIdx;

  const handleMin = (raw: number) => {
    const next = Math.min(raw, maxThumbIdx);
    const newMin = steps[next];
    if (newMin === undefined) return;
    onChange([newMin, maxVal]);
  };
  const handleMax = (raw: number) => {
    const next = Math.max(raw, minIdx);
    const newMax = steps[next];
    if (newMax === undefined) return;
    onChange([minVal, newMax]);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={`${id}-min`}
          className="text-muted font-mono text-[10px] font-medium tracking-[0.18em] uppercase"
        >
          {label}
        </label>
        <span className="text-fg font-mono text-sm font-medium tabular-nums">
          {format(minVal)} <span className="text-muted">—</span> {format(maxVal)}
          {isAtMax ? maxSuffix : ''}
        </span>
      </div>

      {/* h-8 wrapper gives the slider a substantial vertical footprint
          (was h-5 = 20px → 32px). Track is h-2 (8px, was 4px), thumb is
          24px (was 20px) — easier to grab, harder to miss visually. */}
      <div className="relative h-8 py-1">
        {/* Track background */}
        <div
          aria-hidden="true"
          className="bg-fg/10 absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
        />
        {/* Selected range fill */}
        <div
          aria-hidden="true"
          className="bg-fg absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />
        {/* Min thumb input */}
        <input
          id={`${id}-min`}
          type="range"
          min={0}
          max={maxIdx}
          step={1}
          value={minIdx}
          onChange={e => handleMin(parseInt(e.target.value, 10))}
          aria-label={`${label} minimum`}
          aria-valuemin={steps[0]}
          aria-valuemax={steps[maxIdx]}
          aria-valuenow={minVal}
          aria-valuetext={format(minVal)}
          className={cn(
            'pointer-events-none absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2 appearance-none bg-transparent',
            'focus-visible:outline-none',
            '[&::-webkit-slider-thumb]:focus-visible:ring-accent [&::-webkit-slider-thumb]:focus-visible:ring-2',
            THUMB_TW,
          )}
        />
        {/* Max thumb input */}
        <input
          id={`${id}-max`}
          type="range"
          min={0}
          max={maxIdx}
          step={1}
          value={maxThumbIdx}
          onChange={e => handleMax(parseInt(e.target.value, 10))}
          aria-label={`${label} maximum`}
          aria-valuemin={steps[0]}
          aria-valuemax={steps[maxIdx]}
          aria-valuenow={maxVal}
          aria-valuetext={`${format(maxVal)}${isAtMax ? maxSuffix : ''}`}
          className={cn(
            'pointer-events-none absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2 appearance-none bg-transparent',
            'focus-visible:outline-none',
            '[&::-webkit-slider-thumb]:focus-visible:ring-accent [&::-webkit-slider-thumb]:focus-visible:ring-2',
            THUMB_TW,
          )}
        />
      </div>
    </div>
  );
};
