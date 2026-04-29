import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { StatusPill } from '../StatusPill';

describe('StatusPill', () => {
  it('renders the label', () => {
    render(<StatusPill variant="new" label="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders all five canonical variants', () => {
    const variants = ['new', 'in_review', 'contacted', 'closed', 'cancelled'] as const;
    variants.forEach(v => {
      render(<StatusPill variant={v} label={v} />);
      expect(screen.getByText(v)).toBeInTheDocument();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StatusPill variant="contacted" label="Contacted" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
