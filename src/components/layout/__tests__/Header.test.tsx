import '@config/i18n';

import { ThemeProvider } from '@context/ThemeContext';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Header } from '../Header';

function renderHeader(props: Partial<Parameters<typeof Header>[0]> = {}) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <Header {...props} />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.setItem('locale', 'fr');
  });

  it('renders the project name as home link', () => {
    renderHeader();
    const homeLink = screen.getAllByRole('link')[0];
    expect(homeLink).toHaveAttribute('href', '/fr');
    expect(homeLink).toHaveTextContent(/./);
  });

  it('shows Playground link', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /playground/i })).toBeInTheDocument();
  });

  it('has navigation landmark', () => {
    renderHeader();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('has navigation aria-label', () => {
    renderHeader();
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });

  it('shows theme toggle', () => {
    renderHeader();
    expect(screen.getByLabelText(/switch to (light|dark) mode/i)).toBeInTheDocument();
  });

  it('shows the language switcher', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /change language/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderHeader({ className: 'custom-class' });
    expect(screen.getByRole('navigation')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderHeader();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the logo link to home', () => {
    renderHeader();
    const homeLink = screen.getAllByRole('link')[0];
    expect(homeLink).toHaveAttribute('href', '/fr');
  });

  it('Playground link has correct route', () => {
    renderHeader();
    const playgroundLink = screen.getByRole('link', { name: /playground/i });
    expect(playgroundLink).toHaveAttribute('href', '/fr/playground');
  });
});
