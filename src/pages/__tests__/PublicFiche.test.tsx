import '@config/i18n';

import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeAll, describe, expect, it } from 'vitest';

import PublicFiche from '../PublicFiche';

// No Sanity / gate in the test env → usePublicFiche resolves from the mock
// dataset, so the fiche renders synchronously (no spinner, no network).
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/c/:type/:id" element={<PublicFiche />} />
      </Routes>
    </MemoryRouter>,
  );

describe('PublicFiche', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('fr');
  });

  it('renders the fiche for a public catalogue item', () => {
    renderAt('/c/event/evt-01');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    // The interest CTA funnels into the access tunnel from the fiche.
    expect(screen.getByRole('button', { name: /manifester mon intérêt/i })).toBeInTheDocument();
  });

  it('shows a not-found card for an unknown type', () => {
    renderAt('/c/not-a-type/whatever');
    expect(screen.getByRole('heading', { name: /ce code n.existe pas/i })).toBeInTheDocument();
  });
});
