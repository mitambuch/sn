import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { GalleryGrid } from '../GalleryGrid';

describe('GalleryGrid', () => {
  const images = [
    { src: '/a.jpg', alt: 'Alpha' },
    { src: '/b.jpg', alt: 'Beta' },
    { src: '/c.jpg', alt: 'Gamma' },
  ];

  it('renders one button per image', () => {
    render(<GalleryGrid images={images} />);
    expect(screen.getAllByRole('button')).toHaveLength(images.length);
  });

  it('opens lightbox when an image is clicked', () => {
    render(<GalleryGrid images={images} />);
    fireEvent.click(screen.getAllByRole('button')[0]!);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes lightbox on Escape', () => {
    render(<GalleryGrid images={images} />);
    fireEvent.click(screen.getAllByRole('button')[0]!);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('returns null when given an empty array', () => {
    const { container } = render(<GalleryGrid images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<GalleryGrid images={images} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
