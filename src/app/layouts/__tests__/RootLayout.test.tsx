import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import RootLayout from '../RootLayout';

// WHY: post-lot-A, RootLayout is the thin OUTER shell — skip-link + banner
// + Outlet. Header / main / page transitions live in the per-surface
// sub-layouts (PublicLayout, AppLayout, AdminLayout). Tests here cover the
// concerns RootLayout still owns; sub-layouts have their own specs.

function renderLayout(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="*" element={<div data-testid="page-content">Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('RootLayout', () => {
  it('renders the skip-to-content link', () => {
    renderLayout();
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders page content via Outlet', () => {
    renderLayout();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });
});
