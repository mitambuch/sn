import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ShareCollection } from '../ShareCollection';

// No Sanity in test env → useSanityCollection serves the mock fallback,
// which ShareCollection builds from the seeded getEvent/getProperty data.
vi.mock('@hooks/useSanityCollection', () => ({
  useSanityCollection: <T,>({ fallback }: { fallback: readonly T[] }) => ({
    data: fallback,
    loading: false,
    usingFallback: true,
  }),
}));

// Keep Link happy without pulling the whole router.
vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

const DOCS = [
  { type: 'event' as const, id: 'evt-01' },
  { type: 'event' as const, id: 'evt-02' },
];

describe('ShareCollection — multi-fiche share view', () => {
  it('renders one card per fiche in the selection', () => {
    render(<ShareCollection docs={DOCS} code="ABC234" expiresAt={null} onExpire={vi.fn()} />);
    expect(screen.getByText(/2 pièces sélectionnées/i)).toBeInTheDocument();
    // Both seeded event titles render as cards.
    expect(screen.getByText(/Gala de bienfaisance/i)).toBeInTheDocument();
    expect(screen.getByText(/Collectors Preview/i)).toBeInTheDocument();
  });

  it('focuses a fiche on click and returns to the selection (petit sas)', async () => {
    const user = userEvent.setup();
    render(<ShareCollection docs={DOCS} code="ABC234" expiresAt={null} onExpire={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /Gala de bienfaisance/i }));

    // Focused view : back link appears, the grid header is gone.
    const back = screen.getByRole('button', { name: /Retour à la sélection/i });
    expect(back).toBeInTheDocument();
    expect(screen.queryByText(/2 pièces sélectionnées/i)).not.toBeInTheDocument();

    await user.click(back);
    // Back to the grid.
    expect(screen.getByText(/2 pièces sélectionnées/i)).toBeInTheDocument();
  });

  it('shows the countdown only when an expiry is set', () => {
    const { rerender } = render(
      <ShareCollection docs={DOCS} code="ABC234" expiresAt={null} onExpire={vi.fn()} />,
    );
    expect(screen.queryByText(/Disponible encore/i)).not.toBeInTheDocument();

    const future = new Date(Date.now() + 3_600_000).toISOString();
    rerender(<ShareCollection docs={DOCS} code="ABC234" expiresAt={future} onExpire={vi.fn()} />);
    expect(screen.getByText(/Disponible encore/i)).toBeInTheDocument();
  });
});
