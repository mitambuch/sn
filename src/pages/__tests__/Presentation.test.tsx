import '@config/i18n';

import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import Presentation from '../Presentation';

// Force the device-locale resolver to FR so the page stays French under jsdom
// (whose navigator.language is en-US).
vi.mock('@/lib/deviceLocale', () => ({ resolveDeviceLocale: () => 'fr' }));

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

  it('redirects to the site (no membership form) via the see-site CTA', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /voir le site/i })).toHaveAttribute('href', '/fr');
  });

  it('offers a PDF download button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /télécharger le pdf/i })).toBeInTheDocument();
  });

  it('closes on the experience statement', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: /tout devient une expérience/i }),
    ).toBeInTheDocument();
  });
});
