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
    render(<PublicFichePanel type="event" id="evt-01" onRequestAccess={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('fires onRequestAccess from the bottom CTA', async () => {
    const onRequestAccess = vi.fn();
    render(<PublicFichePanel type="event" id="evt-01" onRequestAccess={onRequestAccess} />);
    await userEvent.click(screen.getByRole('button', { name: /manifester mon intérêt/i }));
    expect(onRequestAccess).toHaveBeenCalledOnce();
  });

  it('shows a not-found message for an unknown item', () => {
    render(<PublicFichePanel type="event" id="does-not-exist" onRequestAccess={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /ce code n.existe pas/i })).toBeInTheDocument();
  });
});
