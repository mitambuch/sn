// ═══════════════════════════════════════════════════
// MetaList — label/value rows for specsheets
//
// WHAT: Renders a definition list (<dl>) with editorial typography —
//       small uppercase labels, larger values, hairline dividers between rows.
// WHEN: Property/Timepiece/Artwork detail specsheets, profile read-only sections.
// CHANGE DENSITY: pass `density="compact" | "comfortable"` (default comfortable).
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

export interface MetaListItem {
  label: string;
  value: ReactNode;
}

interface MetaListProps {
  items: MetaListItem[];
  density?: 'compact' | 'comfortable';
  className?: string;
}

const densityStyles: Record<NonNullable<MetaListProps['density']>, string> = {
  compact: 'py-2',
  comfortable: 'py-4',
};

/** Definition list with editorial label/value rows for specsheets. */
export const MetaList = ({ items, density = 'comfortable', className }: MetaListProps) => {
  return (
    <dl className={cn('divide-border w-full divide-y', className)}>
      {items.map(item => (
        <div
          key={item.label}
          className={cn('flex items-baseline justify-between gap-6', densityStyles[density])}
        >
          <dt className="text-muted text-xs tracking-widest uppercase">{item.label}</dt>
          <dd className="text-fg text-right text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};
