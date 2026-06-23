import '@config/i18n';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExperienceInterestModal } from '../ExperienceInterestModal';

vi.mock('@hooks/useToast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

// A stubbed Supabase that records the insert payload — lets us assert the
// lead carries the experience context without a real backend.
const { insertMock } = vi.hoisted(() => ({ insertMock: vi.fn() }));
vi.mock('@/lib/supabase', () => ({
  hasSupabase: true,
  supabase: { from: () => ({ insert: insertMock }) },
}));

// react-phone-number-input is flaky under jsdom — stub with a plain input
// (the real isValidPhoneNumber still runs on the value; phone is optional).
vi.mock('@components/ui/PhoneField', () => ({
  PhoneField: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      aria-label={label}
      value={value}
      onChange={e => {
        onChange(e.currentTarget.value);
      }}
    />
  ),
}));

beforeAll(async () => {
  await i18n.changeLanguage('fr');
});

beforeEach(() => {
  insertMock.mockReset();
  insertMock.mockResolvedValue({ error: null });
});

describe('ExperienceInterestModal', () => {
  it('stays closed when experienceTitle is null', () => {
    render(<ExperienceInterestModal experienceTitle={null} onClose={vi.fn()} />);
    expect(
      screen.queryByRole('heading', { name: /manifester mon intérêt/i }),
    ).not.toBeInTheDocument();
  });

  it('shows the experience as context and disables submit until valid', () => {
    render(<ExperienceInterestModal experienceTitle="Jaquet Droz" onClose={vi.fn()} />);
    // The dialog must carry an accessible name even though it renders its own
    // heading (Modal ariaLabel path).
    expect(screen.getByRole('dialog', { name: /manifester mon intérêt/i })).toBeInTheDocument();
    expect(screen.getByText(/jaquet droz/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeDisabled();
  });

  it('keeps submit disabled on an invalid email', async () => {
    const user = userEvent.setup();
    render(<ExperienceInterestModal experienceTitle="Jaquet Droz" onClose={vi.fn()} />);
    await user.type(screen.getByLabelText('Prénom'), 'Jean');
    await user.type(screen.getByLabelText('Nom'), 'Dupont');
    await user.type(screen.getByLabelText('Email'), 'pas-un-email');
    await user.type(screen.getByLabelText('Votre message'), 'Bonjour.');
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeDisabled();
  });

  it('sends a lead carrying the experience context, then closes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ExperienceInterestModal experienceTitle="Jaquet Droz" onClose={onClose} />);

    await user.type(screen.getByLabelText('Prénom'), 'Jean');
    await user.type(screen.getByLabelText('Nom'), 'Dupont');
    await user.type(screen.getByLabelText('Email'), 'jean@example.com');
    await user.type(screen.getByLabelText('Votre message'), 'Je suis intéressé.');

    const submit = screen.getByRole('button', { name: /envoyer/i });
    expect(submit).toBeEnabled();
    await user.click(submit);

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledTimes(1);
    });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean@example.com',
        message: expect.stringContaining('Jaquet Droz'),
      }),
    );
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
