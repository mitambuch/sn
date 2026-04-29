// ═══════════════════════════════════════════════════
// DataTable — minimal admin-grade table for tabular data
//
// WHAT: Renders an HTML <table> with editorial header styling and hover
//       row highlight. Generic over a row type T; columns declare label +
//       a render function returning the cell content.
// WHEN: Admin pages (invitations, users, inquiries queue).
// CHANGE DENSITY: edit the cell padding in <td>/<th> below.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  emptyLabel: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

const alignStyles = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

/** Minimal admin-grade table with editorial header styling and hoverable rows. */
export const DataTable = <T,>({
  rows,
  columns,
  rowKey,
  emptyLabel,
  onRowClick,
  className,
}: DataTableProps<T>) => {
  if (rows.length === 0) {
    return (
      <div
        className={cn(
          'border-border text-muted flex w-full items-center justify-center rounded border border-dashed py-16 text-xs tracking-widest uppercase',
          className,
        )}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-border border-b">
            {columns.map(col => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  'text-muted px-4 py-3 text-xs font-normal tracking-widest uppercase',
                  alignStyles[col.align ?? 'left'],
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const interactive = Boolean(onRowClick);
            return (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-border/50 hover:bg-surface/60 border-b transition-colors',
                  interactive && 'cursor-pointer',
                )}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={cn('text-fg px-4 py-4 text-sm', alignStyles[col.align ?? 'left'])}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
