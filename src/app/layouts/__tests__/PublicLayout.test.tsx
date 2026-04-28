import { LocaleProvider } from '@app/LocaleProvider';
import { ThemeProvider } from '@context/ThemeContext';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { PublicLayout } from '../PublicLayout';

function renderLayout(route = '/fr') {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path=":locale/*" element={<LayoutWrapper />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

function LayoutWrapper() {
  return (
    <LocaleProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="*" element={<div data-testid="page">Page</div>} />
        </Route>
      </Routes>
    </LocaleProvider>
  );
}

describe('PublicLayout', () => {
  it('renders the global Header', () => {
    renderLayout();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('renders the main content region with the skip-link target id', () => {
    renderLayout();
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('renders the matched child route via Outlet', () => {
    renderLayout();
    expect(screen.getByTestId('page')).toBeInTheDocument();
  });
});
