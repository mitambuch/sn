import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { MetaList } from '../MetaList';

describe('MetaList', () => {
  const items = [
    { label: 'Surface', value: '420 m²' },
    { label: 'Bedrooms', value: '6' },
  ];

  it('renders all label/value pairs', () => {
    render(<MetaList items={items} />);
    expect(screen.getByText('Surface')).toBeInTheDocument();
    expect(screen.getByText('420 m²')).toBeInTheDocument();
    expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('uses comfortable density by default', () => {
    const { container } = render(<MetaList items={items} />);
    expect(container.querySelector('.py-4')).toBeInTheDocument();
  });

  it('applies compact density when requested', () => {
    const { container } = render(<MetaList items={items} density="compact" />);
    expect(container.querySelector('.py-2')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MetaList items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
