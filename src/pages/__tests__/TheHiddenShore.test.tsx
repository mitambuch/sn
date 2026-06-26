import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(
      screen.getByRole('heading', { level: 1, name: /the hidden shore/i }),
    ).toBeInTheDocument();
  });

  it('links the brand mark back to home', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /saw next home/i })).toHaveAttribute('href', '/');
  });

  it('defaults to Option A (midday) and switches to Option B (afternoon) times', async () => {
    renderPage();
    // Option A is the default → 11:00 departure is shown.
    expect(screen.getByText('11:00')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /option b/i }));
    // Switching to B swaps the morning departure times.
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('lists an included service group', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /private yacht/i })).toBeInTheDocument();
  });
});
