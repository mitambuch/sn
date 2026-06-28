import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import TheHiddenShore from '../TheHiddenShore';

describe('TheHiddenShore', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <TheHiddenShore />
      </MemoryRouter>,
    );

  it('renders the hero title', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /the odyssey/i })).toBeInTheDocument();
  });

  it('links the brand mark back to home', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /saw next home/i })).toHaveAttribute('href', '/');
  });

  it('exposes a story chapter as a tap-to-open trigger', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /the departure/i })).toBeInTheDocument();
  });

  it('exposes an included service group as a tap-to-open trigger', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /the yacht/i })).toBeInTheDocument();
  });

  it('keeps the dormant A/B schedule module hidden', () => {
    renderPage();
    // The journey ships as a single programme — the A/B toggle must not render.
    expect(screen.queryByRole('button', { name: /option b/i })).not.toBeInTheDocument();
  });
});
