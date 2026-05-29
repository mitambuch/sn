import { AuthProvider } from '@context/AuthContext';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import AdminUsers from '../AdminUsers';

afterEach(cleanup);

function renderPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AdminUsers />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminUsers', () => {
  it('renders without crashing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the 3 role filter tabs', () => {
    renderPage();
    // tabs are buttons with aria-pressed
    const tabs = screen.getAllByRole('button').filter(btn => btn.hasAttribute('aria-pressed'));
    expect(tabs).toHaveLength(3);
  });

  it('renders the search input', () => {
    renderPage();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
