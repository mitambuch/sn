import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { SectionHeader } from '../SectionHeader';

describe('SectionHeader', () => {
  it('renders title only when minimal props given', () => {
    render(<SectionHeader title="Properties" />);
    expect(screen.getByRole('heading', { name: 'Properties', level: 2 })).toBeInTheDocument();
  });

  it('renders eyebrow + lede when provided', () => {
    render(<SectionHeader eyebrow="Catalogue" title="Properties" lede="Curated residences." />);
    expect(screen.getByText('Catalogue')).toBeInTheDocument();
    expect(screen.getByText('Curated residences.')).toBeInTheDocument();
  });

  it('renders as h1 when as="h1"', () => {
    render(<SectionHeader title="Sawnext" as="h1" />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SectionHeader eyebrow="Catalogue" title="Properties" lede="Lede." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
