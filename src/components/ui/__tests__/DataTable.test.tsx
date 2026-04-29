import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DataTable, type DataTableColumn } from '../DataTable';

interface Row {
  id: string;
  name: string;
  status: string;
}

const rows: Row[] = [
  { id: '1', name: 'Alice', status: 'active' },
  { id: '2', name: 'Bob', status: 'archived' },
];

const columns: DataTableColumn<Row>[] = [
  { key: 'name', label: 'Name', render: r => r.name },
  { key: 'status', label: 'Status', render: r => r.status, align: 'right' },
];

describe('DataTable', () => {
  it('renders headers and rows', () => {
    render(<DataTable rows={rows} columns={columns} rowKey={r => r.id} emptyLabel="No data" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('archived')).toBeInTheDocument();
  });

  it('renders empty label when rows are empty', () => {
    render(<DataTable rows={[]} columns={columns} rowKey={r => r.id} emptyLabel="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('calls onRowClick when row clicked', () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={r => r.id}
        emptyLabel="No data"
        onRowClick={onRowClick}
      />,
    );
    fireEvent.click(screen.getByText('Alice'));
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <DataTable rows={rows} columns={columns} rowKey={r => r.id} emptyLabel="No data" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
