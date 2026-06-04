import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import type { ReactNode } from 'react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import ResetPassword from '../ResetPassword';

const auth = vi.hoisted(() => ({ updatePassword: vi.fn() }));
const nav = vi.hoisted(() => ({ navigate: vi.fn() }));
const toastFn = vi.hoisted(() => ({ toast: vi.fn() }));

vi.mock('@context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('@app/LocaleProvider', () => ({ useLocale: () => ({ localePath: (p: string) => p }) }));
vi.mock('@hooks/useToast', () => ({ useToast: () => toastFn }));
vi.mock('react-router-dom', () => ({
  useNavigate: () => nav.navigate,
  Link: ({ children, ...rest }: { children: ReactNode }) => <a {...rest}>{children}</a>,
}));

beforeAll(async () => {
  await i18n.changeLanguage('fr');
});

beforeEach(() => {
  auth.updatePassword.mockReset().mockResolvedValue({ ok: true });
  nav.navigate.mockReset();
  toastFn.toast.mockReset();
});

describe('ResetPassword', () => {
  it('renders the new-password form', () => {
    render(<ResetPassword />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/nouveau mot de passe/i);
    expect(screen.getByRole('button', { name: /Mettre à jour/i })).toBeInTheDocument();
  });

  it('blocks on a mismatch and never calls the backend', async () => {
    const user = userEvent.setup();
    render(<ResetPassword />);
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse1');
    await user.type(screen.getByLabelText(/Confirmer le mot de passe/i), 'autrechose9');
    await user.click(screen.getByRole('button', { name: /Mettre à jour/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/ne correspondent pas/i);
    expect(auth.updatePassword).not.toHaveBeenCalled();
  });

  it('updates the password and navigates to the account on success', async () => {
    const user = userEvent.setup();
    render(<ResetPassword />);
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse1');
    await user.type(screen.getByLabelText(/Confirmer le mot de passe/i), 'motdepasse1');
    await user.click(screen.getByRole('button', { name: /Mettre à jour/i }));
    expect(auth.updatePassword).toHaveBeenCalledWith('motdepasse1');
    await vi.waitFor(() => expect(nav.navigate).toHaveBeenCalled());
  });

  it('surfaces an expired-link error when the recovery session is missing', async () => {
    const user = userEvent.setup();
    auth.updatePassword.mockResolvedValue({ ok: false, error: 'Auth session missing!' });
    render(<ResetPassword />);
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse1');
    await user.type(screen.getByLabelText(/Confirmer le mot de passe/i), 'motdepasse1');
    await user.click(screen.getByRole('button', { name: /Mettre à jour/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Auth session missing/i);
  });
});
