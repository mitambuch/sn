import { AuthProvider } from '@context/AuthContext';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RequireAuth } from '../RequireAuth';

const DEV_SESSION_KEY = '__sn_dev_session';

function harness(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path=":locale/login" element={<p>login page</p>} />
          <Route
            path=":locale/account"
            element={
              <RequireAuth>
                <p>secret</p>
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe('RequireAuth', () => {
  it('redirects to /:locale/login when no session', () => {
    harness('/fr/account');
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  it('renders children when a dev session is present', () => {
    const stored = {
      user: {
        id: 'x',
        email: 'x@y.test',
        fullName: 'Test User',
        role: 'client',
        locale: 'fr',
        contactPreference: 'phone',
        conciergeName: 'Salvatore Montemagno',
        createdAt: new Date().toISOString(),
      },
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      accessToken: 't',
    };
    localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(stored));
    harness('/fr/account');
    expect(screen.getByText('secret')).toBeInTheDocument();
  });

  // TODO[A.5-supabase-live]: cover loading state once getSession() is async.
});
