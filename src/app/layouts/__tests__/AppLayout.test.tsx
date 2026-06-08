import { LocaleProvider } from '@app/LocaleProvider';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AppLayout } from '../AppLayout';

const DEV_SESSION_KEY = '__sn_dev_session';

function seedClientSession() {
  const session = {
    user: {
      id: 'dev-client',
      email: 'dev+client@sawnext.local',
      role: 'client',
      createdAt: new Date().toISOString(),
    },
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    accessToken: 'dev-stub-token',
  };
  localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(session));
}

function renderLayout(route = '/fr/account') {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <Routes>
            <Route
              path=":locale/*"
              element={
                <LocaleProvider>
                  <Inner />
                </LocaleProvider>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

function Inner() {
  return (
    <Routes>
      <Route path="login" element={<p>login page</p>} />
      <Route path="account" element={<AppLayout />}>
        <Route index element={<div data-testid="account-page">account home</div>} />
      </Route>
    </Routes>
  );
}

describe('AppLayout', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('redirects to /:locale/login when no session is present', () => {
    renderLayout();
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByTestId('account-page')).not.toBeInTheDocument();
  });

  it('renders sidebar nav + matched child page when authenticated', () => {
    seedClientSession();
    renderLayout();
    const sidebar = screen.getByRole('navigation', { name: /account modules/i });
    expect(sidebar).toBeInTheDocument();
    // Holding state (FEATURES.catalogueLive false) : the dashboard link is
    // present but the mock-backed module surfaces are stripped from the nav.
    expect(within(sidebar).getByRole('link', { name: 'Accueil' })).toHaveAttribute(
      'href',
      '/fr/account',
    );
    expect(within(sidebar).queryByRole('link', { name: 'Propriétés' })).not.toBeInTheDocument();
    expect(within(sidebar).queryByRole('link', { name: 'Événements' })).not.toBeInTheDocument();
    expect(within(sidebar).queryByRole('link', { name: 'Ma collection' })).not.toBeInTheDocument();
    expect(screen.getByTestId('account-page')).toBeInTheDocument();
  });

  it('clicking sign-out clears the dev session', async () => {
    seedClientSession();
    const user = userEvent.setup();
    renderLayout();

    // WHY: layout now renders multiple sign-out buttons (desktop sidebar + mobile
    // header). They all wire the same handler — clicking the first proves the
    // session-clear path regardless of which surface the user taps.
    const buttons = screen.getAllByRole('button', { name: /se déconnecter/i });
    const signOut = buttons[0];
    if (!signOut) throw new Error('expected at least one sign-out button');
    await user.click(signOut);

    expect(localStorage.getItem(DEV_SESSION_KEY)).toBeNull();
    expect(screen.queryByTestId('account-page')).not.toBeInTheDocument();
  });
});
