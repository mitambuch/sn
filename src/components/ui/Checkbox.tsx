// ═══════════════════════════════════════════════════
// Checkbox — monochrome custom checkbox
//
// WHAT: A checkbox styled to the site tokens (no white system box). The
//       box fills with the fg colour and shows a check when ticked.
// WHEN: Any consent / opt-in / boolean choice in a form.
// CHANGE LOOK: edit the box classes below (border-border / bg-fg).
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { Check } from 'lucide-react';
import { type InputHTMLAttributes, useId } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label, sits to the right of the box. */
  label: string;
  className?: string;
}

/** Token-styled checkbox with an associated label. */
export const Checkbox = ({ label, className, id, ...rest }: CheckboxProps) => {
  const autoId = useId();
  const inputId = id ?? autoId;

  // Sibling label + input (not wrapped) — keeps a11y association via
  // htmlFor and avoids the jsx-a11y label-has-associated-control crash.
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <span className="relative mt-0.5 inline-flex shrink-0 items-center justify-center">
        <input
          id={inputId}
          type="checkbox"
          className={cn(
            'border-border bg-surface peer h-4 w-4 cursor-pointer appearance-none rounded border',
            'checked:border-fg checked:bg-fg',
            'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none',
            'duration-base transition-[background-color,border-color]',
          )}
          {...rest}
        />
        <Check
          className="text-bg pointer-events-none absolute h-3 w-3 opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden="true"
        />
      </span>
      <label htmlFor={inputId} className="text-muted cursor-pointer text-xs leading-relaxed">
        {label}
      </label>
    </div>
  );
};
