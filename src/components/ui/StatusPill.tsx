// ═══════════════════════════════════════════════════
// StatusPill — inquiry/order workflow status indicator
//
// WHAT: Renders a small pill with a status dot + label. Five canonical
//       states aligned to the inquiry lifecycle: pending, in-review,
//       responded, closed, cancelled.
// WHEN: Inquiry list rows, admin kanban columns, account history.
// CHANGE STATES: edit the variantStyles map below — keep keys in sync
//        with src/types/inquiry.ts InquiryStatus union.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

export type StatusPillVariant = 'pending' | 'in-review' | 'responded' | 'closed' | 'cancelled';

interface StatusPillProps {
  variant: StatusPillVariant;
  label: string;
  className?: string;
}

const variantStyles: Record<StatusPillVariant, { dot: string; text: string }> = {
  pending: { dot: 'bg-muted', text: 'text-muted' },
  'in-review': { dot: 'bg-info', text: 'text-info-text' },
  responded: { dot: 'bg-success', text: 'text-success-text' },
  closed: { dot: 'bg-fg/40', text: 'text-fg/60' },
  cancelled: { dot: 'bg-danger', text: 'text-danger-text' },
};

/** Small pill with a status dot and label, aligned to InquiryStatus union. */
export const StatusPill = ({ variant, label, className }: StatusPillProps) => {
  const style = variantStyles[variant];
  return (
    <span
      className={cn(
        'border-border inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs tracking-widest uppercase',
        style.text,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {label}
    </span>
  );
};
