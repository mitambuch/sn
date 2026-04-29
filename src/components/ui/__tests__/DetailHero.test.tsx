import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { DetailHero } from '../DetailHero';

describe('DetailHero', () => {
  it('renders title as h1', () => {
    render(<DetailHero imageSrc="/a.jpg" imageAlt="Hero" title="Chalet Verbier" />);
    expect(screen.getByRole('heading', { name: 'Chalet Verbier', level: 1 })).toBeInTheDocument();
  });

  it('renders eyebrow + caption when provided', () => {
    render(
      <DetailHero
        imageSrc="/a.jpg"
        imageAlt="Hero"
        eyebrow="Property"
        title="Chalet Verbier"
        caption="Vaud · 420 m²"
      />,
    );
    expect(screen.getByText('Property')).toBeInTheDocument();
    expect(screen.getByText('Vaud · 420 m²')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <DetailHero
        imageSrc="/a.jpg"
        imageAlt="Hero"
        title="Chalet"
        actions={<button type="button">Express interest</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Express interest' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DetailHero imageSrc="/a.jpg" imageAlt="Hero" title="Chalet" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
