// ═══════════════════════════════════════════════════
// StatusPill — inquiry/order workflow status indicator
//
// WHAT: Renders a small pill with a status dot + label. Five canonical
//       states aligned to the inquiry lifecycle: new, in_review, contacted,
//       closed, cancelled. Variant slugs mirror src/types/inquiry.ts
//       InquiryStatus union exactly so mapping is identity.
// WHEN: Inquiry list rows, admin kanban columns, account history.
// CHANGE STATES: edit variantStyles below AND src/types/inquiry.ts together.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

import type { InquiryStatus } from '@/types/inquiry';

export type StatusPillVariant = InquiryStatus;

interface StatusPillProps {
  variant: StatusPillVariant;
  label: string;
  className?: string;
}

const variantStyles: Record<StatusPillVariant, { dot: string; text: string }> = {
  new: { dot: 'bg-muted', text: 'text-muted' },
  in_review: { dot: 'bg-info', text: 'text-info-text' },
  contacted: { dot: 'bg-success', text: 'text-success-text' },
  closed: { dot: 'bg-fg/40', text: 'text-fg/60' },
  cancelled: { dot: 'bg-danger', text: 'text-danger-text' },
};

/** Small pill with a status dot and label, aligned to InquiryStatus union. */
export const StatusPill = ({ variant, label, className }: StatusPillProps) => {
  const style = variantStyles[variant];
  return (
    <span
      className={cn(
        'border-border inline-flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs tracking-widest whitespace-nowrap uppercase',
        style.text,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {label}
    </span>
  );
};
