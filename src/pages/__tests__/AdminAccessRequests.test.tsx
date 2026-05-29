import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import AdminAccessRequests from '../AdminAccessRequests';

afterEach(cleanup);

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminAccessRequests />
    </MemoryRouter>,
  );
}

describe('AdminAccessRequests', () => {
  it('renders without crashing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the 4 triage columns', () => {
    renderPage();
    // 4 columns × 1 heading each (col headers are h2)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
  });
});
