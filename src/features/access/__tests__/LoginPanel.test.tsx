import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPanel } from '../LoginPanel';

// Control the auth layer — we assert the panel calls the right method with
// the right payload and reacts to the result, not the Supabase plumbing.
const auth = vi.hoisted(() => ({
  signIn: vi.fn(),
  registerWithCode: vi.fn(),
  requestPasswordReset: vi.fn(),
}));

vi.mock('@context/AuthContext', () => ({
  useAuth: () => auth,
}));

beforeAll(async () => {
  await i18n.changeLanguage('fr');
});

beforeEach(() => {
  auth.signIn.mockReset().mockResolvedValue({ ok: true });
  auth.registerWithCode.mockReset().mockResolvedValue({ ok: true });
  auth.requestPasswordReset.mockReset().mockResolvedValue({ ok: true });
});

describe('LoginPanel — door selection', () => {
  it('offers exactly the two doors: first connection + returning', () => {
    render(<LoginPanel onRegistered={vi.fn()} onSignedIn={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Première connexion/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Email et mot de passe/i })).toBeInTheDocument();
    // The retired "magic link" door must be gone.
    expect(screen.queryByText(/lien magique/i)).not.toBeInTheDocument();
  });
});

describe('LoginPanel — first connection', () => {
  it('blocks on a password mismatch before calling the backend', async () => {
    const user = userEvent.setup();
    const onRegistered = vi.fn();
    render(
      <LoginPanel
        initialMode="first"
        initialCode="AB23C7DE"
        onRegistered={onRegistered}
        onSignedIn={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/Adresse e-mail/i), 'membre@example.com');
    await user.type(screen.getByLabelText('Nom complet'), 'Hugo Méredith');
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse1');
    await user.type(screen.getByLabelText(/Confirmer le mot de passe/i), 'autrechose9');
    await user.click(screen.getByRole('button', { name: /Créer mon compte/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/ne correspondent pas/i);
    expect(auth.registerWithCode).not.toHaveBeenCalled();
  });

  it('creates the account and signals onRegistered on success', async () => {
    const user = userEvent.setup();
    const onRegistered = vi.fn();
    render(
      <LoginPanel
        initialMode="first"
        initialCode="AB23C7DE"
        onRegistered={onRegistered}
        onSignedIn={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/Adresse e-mail/i), 'membre@example.com');
    await user.type(screen.getByLabelText('Nom complet'), 'Hugo Méredith');
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse1');
    await user.type(screen.getByLabelText(/Confirmer le mot de passe/i), 'motdepasse1');
    await user.click(screen.getByRole('button', { name: /Créer mon compte/i }));

    expect(auth.registerWithCode).toHaveBeenCalledWith({
      email: 'membre@example.com',
      code: 'AB23C7DE',
      password: 'motdepasse1',
      fullName: 'Hugo Méredith',
    });
    expect(onRegistered).toHaveBeenCalledTimes(1);
  });

  it('shows the confirm-email panel when the backend needs confirmation', async () => {
    const user = userEvent.setup();
    const onRegistered = vi.fn();
    auth.registerWithCode.mockResolvedValue({ ok: true, needsEmailConfirm: true });
    render(
      <LoginPanel
        initialMode="first"
        initialCode="AB23C7DE"
        onRegistered={onRegistered}
        onSignedIn={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/Adresse e-mail/i), 'membre@example.com');
    await user.type(screen.getByLabelText('Nom complet'), 'Hugo Méredith');
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse1');
    await user.type(screen.getByLabelText(/Confirmer le mot de passe/i), 'motdepasse1');
    await user.click(screen.getByRole('button', { name: /Créer mon compte/i }));

    expect(await screen.findByText(/Votre compte est créé/i)).toBeInTheDocument();
    expect(onRegistered).not.toHaveBeenCalled();
  });
});

describe('LoginPanel — returning member', () => {
  it('signs in and signals onSignedIn', async () => {
    const user = userEvent.setup();
    const onSignedIn = vi.fn();
    render(<LoginPanel initialMode="returning" onRegistered={vi.fn()} onSignedIn={onSignedIn} />);

    await user.type(screen.getByLabelText(/Adresse e-mail/i), 'membre@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse1');
    await user.click(screen.getByRole('button', { name: /Se connecter/i }));

    expect(auth.signIn).toHaveBeenCalledWith('membre@example.com', 'motdepasse1');
    expect(onSignedIn).toHaveBeenCalledTimes(1);
  });

  it('surfaces the backend error on a failed sign-in', async () => {
    const user = userEvent.setup();
    auth.signIn.mockResolvedValue({ ok: false, error: 'Identifiants invalides.' });
    render(<LoginPanel initialMode="returning" onRegistered={vi.fn()} onSignedIn={vi.fn()} />);

    await user.type(screen.getByLabelText(/Adresse e-mail/i), 'membre@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'mauvais');
    await user.click(screen.getByRole('button', { name: /Se connecter/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/Identifiants invalides/i);
  });
});

describe('LoginPanel — forgot password', () => {
  it('sends a reset email and shows the sent panel', async () => {
    const user = userEvent.setup();
    render(<LoginPanel initialMode="forgot" onRegistered={vi.fn()} onSignedIn={vi.fn()} />);

    await user.type(screen.getByLabelText(/Adresse e-mail/i), 'membre@example.com');
    await user.click(screen.getByRole('button', { name: /Envoyer le lien/i }));

    expect(auth.requestPasswordReset).toHaveBeenCalledWith('membre@example.com');
    expect(await screen.findByText(/lien de réinitialisation/i)).toBeInTheDocument();
  });
});
