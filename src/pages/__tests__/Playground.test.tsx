import { ThemeProvider } from '@context/ThemeContext';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import Playground from '../Playground';

afterEach(cleanup);

// WHY: SeoHead uses useLocation() — pages need a router context in tests.
// Additionally, playground menus (SideRail, CornerDual) use ThemeToggle which
// consumes ThemeContext → must be wrapped in ThemeProvider.
function renderPlayground() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <Playground />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('Playground', () => {
  it('renders without crashing', () => {
    expect(() => renderPlayground()).not.toThrow();
  });

  it('renders the devkit heading', () => {
    renderPlayground();
    expect(screen.getByText('devkit')).toBeInTheDocument();
  });

  // WHY 30s timeout: Playground v6.4 Bible renders 166+ specimens. Under v8
  // coverage instrumentation on CI-class hardware, full render routinely hits
  // 17–22s (logged 17.5s on 2026-04-20). 15s was flaking. Bumped with margin.
  it('renders component sections', () => {
    renderPlayground();
    // Should have at least one button rendered
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  }, 30_000);
});
