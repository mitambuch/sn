import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AccessRequestModal } from '../AccessRequestModal';

// Isolate the modal from its provider deps — we only exercise the wizard
// navigation + validation logic here, not routing / toasts / Supabase.
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
// Stub the phone widget with a plain input — we test the modal's logic
// (validation via isValidPhoneNumber still runs on the real value), not
// react-phone-number-input's controlled formatting (flaky under jsdom).
vi.mock('@components/ui/PhoneField', () => ({
  PhoneField: ({
    label,
    value,
    onChange,
    error,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
  }) => (
    <>
      <input
        aria-label={label}
        value={value}
        onChange={e => {
          onChange(e.currentTarget.value);
        }}
      />
      {error ? <p role="alert">{error}</p> : null}
    </>
  ),
}));

// i18n.init() is async; ensure FR resources are loaded before we query
// the modal by its (translated) labels.
beforeAll(async () => {
  await i18n.changeLanguage('fr');
});

/** Drive the wizard from step 0 (Identité) to step 2 (Message). */
async function advanceToMessageStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Prénom'), 'Jean');
  await user.type(screen.getByLabelText('Nom'), 'Dupont');
  await user.type(screen.getByLabelText('Email'), 'jean@example.com');
  await user.click(screen.getByRole('button', { name: /Continuer/i }));

  const phone = await screen.findByLabelText('Téléphone direct');
  await user.type(phone, '+41791234567');
  await user.click(screen.getByRole('button', { name: /Continuer/i }));
}

describe('AccessRequestModal — request wizard navigation', () => {
  it('reaches the Message step (textarea) before any submit is possible', async () => {
    const user = userEvent.setup();
    render(<AccessRequestModal isOpen onClose={vi.fn()} />);

    // The submit button must NOT exist on step 0.
    expect(screen.queryByRole('button', { name: /Envoyer la demande/i })).not.toBeInTheDocument();

    await advanceToMessageStep(user);

    const message = await screen.findByLabelText(/Message/i);
    expect(message.tagName).toBe('TEXTAREA');
    expect(screen.queryByRole('button', { name: /Continuer/i })).not.toBeInTheDocument();
    await user.type(message, 'Bonjour, je souhaite un accès.');
    expect(message).toHaveValue('Bonjour, je souhaite un accès.');
  });

  it('blocks submit until the legal consent box is checked', async () => {
    const user = userEvent.setup();
    render(<AccessRequestModal isOpen onClose={vi.fn()} />);
    await advanceToMessageStep(user);

    const submit = screen.getByRole('button', { name: /Envoyer la demande/i });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole('checkbox'));
    expect(submit).toBeEnabled();
  });
});

describe('AccessRequestModal — field validation', () => {
  it('gates step 0 on a valid email, not just a filled one', async () => {
    const user = userEvent.setup();
    render(<AccessRequestModal isOpen onClose={vi.fn()} />);

    const next = screen.getByRole('button', { name: /Continuer/i });
    await user.type(screen.getByLabelText('Prénom'), 'Jean');
    await user.type(screen.getByLabelText('Nom'), 'Dupont');

    await user.type(screen.getByLabelText('Email'), 'pas-un-email');
    expect(next).toBeDisabled();
    expect(screen.getByText(/email invalide/i)).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'jean@example.com');
    expect(next).toBeEnabled();
  });

  it('gates step 1 on a valid phone number', async () => {
    const user = userEvent.setup();
    render(<AccessRequestModal isOpen onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Prénom'), 'Jean');
    await user.type(screen.getByLabelText('Nom'), 'Dupont');
    await user.type(screen.getByLabelText('Email'), 'jean@example.com');
    await user.click(screen.getByRole('button', { name: /Continuer/i }));

    await screen.findByLabelText('Téléphone direct');
    const next = screen.getByRole('button', { name: /Continuer/i });

    await user.type(screen.getByLabelText('Téléphone direct'), '123');
    expect(next).toBeDisabled();
    expect(screen.getByText(/téléphone invalide/i)).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Téléphone direct'));
    await user.type(screen.getByLabelText('Téléphone direct'), '+41791234567');
    expect(next).toBeEnabled();
  });
});
