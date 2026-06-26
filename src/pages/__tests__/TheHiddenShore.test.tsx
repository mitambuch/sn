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
    // Two A/B controls can exist (inline on desktop + the pinned mobile bar);
    // either flips the same shared state — click the first match.
    const [optionB] = screen.getAllByRole('button', { name: /option b/i });
    if (!optionB) throw new Error('Option B control not found');
    await userEvent.click(optionB);
    // Switching to B swaps the morning departure times.
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.queryByText('11:00')).not.toBeInTheDocument();
  });

  it('exposes an included service group as a tap-to-open trigger', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /private yacht/i })).toBeInTheDocument();
  });
});
