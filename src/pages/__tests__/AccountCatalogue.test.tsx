import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import AccountCatalogue from '../AccountCatalogue';

afterEach(cleanup);

function renderCatalogue() {
  return render(
    <MemoryRouter>
      <AccountCatalogue />
    </MemoryRouter>,
  );
}

describe('AccountCatalogue', () => {
  it('renders without crashing', () => {
    expect(() => renderCatalogue()).not.toThrow();
  });

  it('renders the page heading', () => {
    renderCatalogue();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders module filter chips', () => {
    renderCatalogue();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });
});
