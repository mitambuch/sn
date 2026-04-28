import { LocaleProvider } from '@app/LocaleProvider';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AdminLayout } from '../AdminLayout';

const DEV_SESSION_KEY = '__sn_dev_session';

function seedSession(role: 'client' | 'admin') {
  const session = {
    user: {
      id: `dev-${role}`,
      email: `dev+${role}@sawnext.local`,
      role,
      createdAt: new Date().toISOString(),
    },
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    accessToken: 'dev-stub-token',
  };
  localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(session));
}

function renderLayout(route = '/fr/admin') {
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
      <Route index element={<p>locale home</p>} />
      <Route path="login" element={<p>login page</p>} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<div data-testid="admin-page">admin home</div>} />
      </Route>
    </Routes>
  );
}

describe('AdminLayout', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('redirects to /:locale/login when no session', () => {
    renderLayout();
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('redirects clients (wrong role) to locale HOME', () => {
    seedSession('client');
    renderLayout();
    expect(screen.getByText('locale home')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-page')).not.toBeInTheDocument();
  });

  it('renders sidebar nav + admin page when role=admin', () => {
    seedSession('admin');
    renderLayout();
    expect(screen.getByRole('navigation', { name: /admin modules/i })).toBeInTheDocument();
    // FR is the default locale → labels render as French strings.
    expect(screen.getByRole('link', { name: 'Invitations' })).toHaveAttribute(
      'href',
      '/fr/admin/invitations',
    );
    expect(screen.getByRole('link', { name: 'Demandes' })).toHaveAttribute(
      'href',
      '/fr/admin/inquiries',
    );
    expect(screen.getByTestId('admin-page')).toBeInTheDocument();
  });
});
