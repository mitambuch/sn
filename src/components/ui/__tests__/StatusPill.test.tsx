import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { StatusPill } from '../StatusPill';

describe('StatusPill', () => {
  it('renders the label', () => {
    render(<StatusPill variant="pending" label="Pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders all five canonical variants', () => {
    const variants = ['pending', 'in-review', 'responded', 'closed', 'cancelled'] as const;
    variants.forEach(v => {
      render(<StatusPill variant={v} label={v} />);
      expect(screen.getByText(v)).toBeInTheDocument();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StatusPill variant="responded" label="Responded" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
