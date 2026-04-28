import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { LanguageSwitcher } from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('marks the current locale as pressed', () => {
    render(<LanguageSwitcher currentLocale="de" />);

    expect(screen.getByRole('button', { name: /de/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /fr/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('delegates locale changes when controlled by the app router', async () => {
    const user = userEvent.setup();
    const onLocaleChange = vi.fn();

    render(<LanguageSwitcher currentLocale="fr" onLocaleChange={onLocaleChange} />);
    await user.click(screen.getByRole('button', { name: /de/i }));

    expect(onLocaleChange).toHaveBeenCalledWith('de');
  });

  it('does not emit a change for the active locale', async () => {
    const user = userEvent.setup();
    const onLocaleChange = vi.fn();

    render(<LanguageSwitcher currentLocale="fr" onLocaleChange={onLocaleChange} />);
    await user.click(screen.getByRole('button', { name: /fr/i }));

    expect(onLocaleChange).not.toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LanguageSwitcher currentLocale="fr" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
