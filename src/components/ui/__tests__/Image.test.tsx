import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Image } from '../Image';

describe('Image', () => {
  it('renders an img with alt text', () => {
    render(<Image src="/foo.jpg" alt="Foo" />);
    expect(screen.getByAltText('Foo')).toBeInTheDocument();
  });

  it('applies default lazy loading', () => {
    render(<Image src="/foo.jpg" alt="Foo" />);
    expect(screen.getByAltText('Foo')).toHaveAttribute('loading', 'lazy');
  });

  it('uses eager loading when eager prop is true', () => {
    render(<Image src="/foo.jpg" alt="Foo" eager />);
    expect(screen.getByAltText('Foo')).toHaveAttribute('loading', 'eager');
  });

  it('applies aspect ratio class to wrapper', () => {
    const { container } = render(<Image src="/foo.jpg" alt="Foo" ratio="1/1" />);
    expect(container.firstChild).toHaveClass('aspect-square');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Image src="/foo.jpg" alt="Foo" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
