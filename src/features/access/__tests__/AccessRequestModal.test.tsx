import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AccessRequestModal } from '../AccessRequestModal';

// i18n.init() is async; ensure FR resources are loaded before we query
// the modal by its (translated) labels.
beforeAll(async () => {
  await i18n.changeLanguage('fr');
});

// Isolate the modal from its provider deps — we only exercise the wizard
// navigation logic here, not routing / toasts / Supabase.
vi.mock('@app/LocaleProvider', () => ({
  useLocale: () => ({ localePath: (p: string) => p }),
}));
vi.mock('@hooks/useToast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));
// No Supabase in test env → modal takes the simulator submit path.
vi.mock('@/lib/supabase', () => ({ hasSupabase: false, supabase: null }));

describe('AccessRequestModal — request wizard navigation', () => {
  it('reaches the Message step (textarea) before any submit is possible', async () => {
    const user = userEvent.setup();
    render(<AccessRequestModal isOpen onClose={vi.fn()} />);

    // ─── Step 0 — Identité ───
    await user.type(screen.getByLabelText('Prénom'), 'Jean');
    await user.type(screen.getByLabelText('Nom'), 'Dupont');
    await user.type(screen.getByLabelText('Email'), 'jean@example.com');

    // The submit button must NOT exist yet — only "Continuer".
    expect(screen.queryByRole('button', { name: /Envoyer la demande/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continuer/i }));

    // ─── Step 1 — Profil ───
    const phone = await screen.findByLabelText('Téléphone direct');
    expect(phone).toBeInTheDocument();
    await user.type(phone, '+41 79 000 00 00');
    expect(screen.queryByRole('button', { name: /Envoyer la demande/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continuer/i }));

    // ─── Step 2 — Message ─── the step the client reports as skipped.
    const message = await screen.findByLabelText(/Message/i);
    expect(message.tagName).toBe('TEXTAREA');
    // Only now does the submit button appear, and "Continuer" is gone.
    expect(screen.getByRole('button', { name: /Envoyer la demande/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Continuer/i })).not.toBeInTheDocument();

    // The user can actually type a message.
    await user.type(message, 'Bonjour, je souhaite un accès.');
    expect(message).toHaveValue('Bonjour, je souhaite un accès.');
  });

  it('gates "Continuer" until required fields of the current step are filled', async () => {
    const user = userEvent.setup();
    render(<AccessRequestModal isOpen onClose={vi.fn()} />);

    // Step 0 — button disabled until firstName + lastName + email present.
    const next = screen.getByRole('button', { name: /Continuer/i });
    expect(next).toBeDisabled();
    await user.type(screen.getByLabelText('Prénom'), 'Jean');
    await user.type(screen.getByLabelText('Nom'), 'Dupont');
    expect(next).toBeDisabled();
    await user.type(screen.getByLabelText('Email'), 'jean@example.com');
    expect(next).toBeEnabled();
  });
});
