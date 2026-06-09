import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { LanguageSwitcher } from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('is collapsed by default and opens a box of locales on click', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher currentLocale="en" />);

    // Collapsed: only the trigger button exists, no option rows.
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: /Español/i })).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // The active locale is marked; the others are not.
    expect(screen.getByRole('button', { name: /English/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /Français/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('delegates locale changes when controlled by the app router', async () => {
    const user = userEvent.setup();
    const onLocaleChange = vi.fn();

    render(<LanguageSwitcher currentLocale="fr" onLocaleChange={onLocaleChange} />);
    await user.click(screen.getByRole('button')); // open the box
    await user.click(screen.getByRole('button', { name: /Español/i }));

    expect(onLocaleChange).toHaveBeenCalledWith('es');
  });

  it('does not emit a change for the active locale', async () => {
    const user = userEvent.setup();
    const onLocaleChange = vi.fn();

    render(<LanguageSwitcher currentLocale="fr" onLocaleChange={onLocaleChange} />);
    await user.click(screen.getByRole('button')); // open the box
    await user.click(screen.getByRole('button', { name: /Français/i }));

    expect(onLocaleChange).not.toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LanguageSwitcher currentLocale="fr" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
