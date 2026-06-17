import '@config/i18n';

import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import QRPage from '../QRPage';

// Keep the page FR under jsdom (navigator.language is en-US).
vi.mock('@/lib/deviceLocale', () => ({ resolveDeviceLocale: () => 'fr' }));

describe('QRPage', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('fr');
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <QRPage />
      </MemoryRouter>,
    );

  it('renders the scan heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /scannez pour découvrir/i })).toBeInTheDocument();
  });

  it('renders a QR code (svg)', () => {
    const { container } = renderPage();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('shows the presentation url it encodes', () => {
    renderPage();
    // siteConfig.url is the env fallback in tests, so assert on the path.
    expect(screen.getByText(/\/presentation$/)).toBeInTheDocument();
  });
});
