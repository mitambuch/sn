import { LocaleProvider } from '@app/LocaleProvider';
import { AccountRequestModalProvider } from '@context/AccountRequestModalContext';
import { AuthProvider } from '@context/AuthContext';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import AccountDashboard from '../AccountDashboard';

afterEach(cleanup);

// Render through a `:locale/*` route so LocaleProvider pins the active locale
// to FR (deterministic strings) — same harness as AppLayout.test.
function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/fr/account']}>
      <Routes>
        <Route
          path=":locale/*"
          element={
            <LocaleProvider>
              <AuthProvider>
                <AccountRequestModalProvider>
                  <AccountDashboard />
                </AccountRequestModalProvider>
              </AuthProvider>
            </LocaleProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

// FEATURES.catalogueLive is false in this build — the dashboard renders its
// holding state. These tests pin that behaviour : a real client must see the
// preparation notice and the live request channel, never the mock vitrine.
describe('AccountDashboard — holding state', () => {
  it('renders the greeting heading', () => {
    renderDashboard();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('shows the preparation notice instead of the exclusive-offers vitrine', () => {
    renderDashboard();
    expect(
      screen.getByRole('heading', { name: /votre sélection est en cours de préparation/i }),
    ).toBeInTheDocument();
    // The fake "exclusive offers" CTA is dropped in holding mode.
    expect(screen.queryByText(/découvrir vos opportunités du moment/i)).not.toBeInTheDocument();
  });

  it('keeps the live concierge request channel available', () => {
    renderDashboard();
    expect(screen.getByText(/dites-nous ce que vous cherchez/i)).toBeInTheDocument();
  });
});
