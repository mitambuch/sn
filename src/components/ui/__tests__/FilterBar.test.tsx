import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { FilterBar } from '../FilterBar';

describe('FilterBar', () => {
  it('renders children inside a toolbar', () => {
    render(
      <FilterBar>
        <FilterBar.Chip label="Chalet" onToggle={() => {}} />
      </FilterBar>,
    );
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chalet' })).toBeInTheDocument();
  });

  it('reflects selected state via aria-pressed', () => {
    render(<FilterBar.Chip label="Penthouse" selected onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'Penthouse' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('calls onToggle on click', () => {
    const fn = vi.fn();
    render(<FilterBar.Chip label="Villa" onToggle={fn} />);
    fireEvent.click(screen.getByRole('button', { name: 'Villa' }));
    expect(fn).toHaveBeenCalledOnce();
  });

  it('renders Reset only when visible', () => {
    const { rerender } = render(
      <FilterBar.Reset label="Reset" onReset={() => {}} visible={false} />,
    );
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument();
    rerender(<FilterBar.Reset label="Reset" onReset={() => {}} visible />);
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FilterBar>
        <FilterBar.Chip label="Chalet" onToggle={() => {}} />
        <FilterBar.Chip label="Villa" selected onToggle={() => {}} />
      </FilterBar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
