import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { PublicFichePanel } from '../PublicFichePanel';

// No Sanity / gate in the test env → usePublicFiche resolves from the mock
// dataset, so the fiche renders synchronously (no spinner, no network).
describe('PublicFichePanel', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('fr');
  });

  it('renders the fiche for a public catalogue item', () => {
    render(<PublicFichePanel type="event" id="evt-01" onExpressInterest={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders the full programme (steps must not be truncated)', () => {
    render(<PublicFichePanel type="event" id="evt-01" onExpressInterest={vi.fn()} />);
    // evt-01 mock has a 4-step programme — the public fiche must show them all.
    // First step's label + last step's hour (23:30, unique to the programme)
    // prove the whole list renders, not just a head slice.
    expect(screen.getByText(/cocktail — salle des pas-perdus/i)).toBeInTheDocument();
    expect(screen.getByText('23:30')).toBeInTheDocument();
  });

  it('fires onExpressInterest with the experience title from the bottom CTA', async () => {
    const onExpressInterest = vi.fn();
    render(<PublicFichePanel type="event" id="evt-01" onExpressInterest={onExpressInterest} />);
    await userEvent.click(screen.getByRole('button', { name: /manifester mon intérêt/i }));
    expect(onExpressInterest).toHaveBeenCalledOnce();
    expect(onExpressInterest).toHaveBeenCalledWith(expect.any(String));
  });

  it('shows a not-found message for an unknown item', () => {
    render(<PublicFichePanel type="event" id="does-not-exist" onExpressInterest={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /ce code n.existe pas/i })).toBeInTheDocument();
  });
});
