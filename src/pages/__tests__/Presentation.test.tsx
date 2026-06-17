import '@config/i18n';

import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import Presentation from '../Presentation';

// No Supabase in test env → the bespoke form takes the simulator submit path.
vi.mock('@/lib/supabase', () => ({ hasSupabase: false, supabase: null }));

describe('Presentation', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('fr');
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Presentation />
      </MemoryRouter>,
    );

  it('renders the hero heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the bespoke lead form submit button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /envoyer la demande/i })).toBeInTheDocument();
  });

  it('points the "see the site" CTA at the active-locale home', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /voir le site/i })).toHaveAttribute('href', '/fr');
  });

  it('exposes the form anchor targeted by the become-member CTA', () => {
    const { container } = renderPage();
    expect(container.querySelector('#presentation-form')).not.toBeNull();
  });
});
