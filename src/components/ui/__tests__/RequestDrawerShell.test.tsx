import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { RequestDrawerShell } from '../RequestDrawerShell';

describe('RequestDrawerShell', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(
      <RequestDrawerShell open={false} onClose={vi.fn()} title="Test Drawer">
        <p>Body content</p>
      </RequestDrawerShell>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog with title and children when open', () => {
    render(
      <RequestDrawerShell open onClose={vi.fn()} title="Reservation">
        <p>Form content</p>
      </RequestDrawerShell>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Reservation')).toBeInTheDocument();
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('renders eyebrow and lede when provided', () => {
    render(
      <RequestDrawerShell
        open
        onClose={vi.fn()}
        title="My Drawer"
        eyebrow="Eyebrow label"
        lede="A helpful description."
      >
        <span>child</span>
      </RequestDrawerShell>,
    );
    expect(screen.getByText('Eyebrow label')).toBeInTheDocument();
    expect(screen.getByText('A helpful description.')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <RequestDrawerShell open onClose={onClose} title="Closeable">
        <span>child</span>
      </RequestDrawerShell>,
    );
    // The header X button has aria-label mapped to common.close translation
    const closeButtons = screen.getAllByRole('button');
    const lastButton = closeButtons[closeButtons.length - 1];
    if (!lastButton) throw new Error('expected at least one button to close');
    await userEvent.click(lastButton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    render(
      <RequestDrawerShell open onClose={onClose} title="Escape test">
        <span>child</span>
      </RequestDrawerShell>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders optional sticky footer when provided', () => {
    render(
      <RequestDrawerShell
        open
        onClose={vi.fn()}
        title="With footer"
        footer={<button>Submit</button>}
      >
        <span>child</span>
      </RequestDrawerShell>,
    );
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('has no accessibility violations when open', async () => {
    const { container } = render(
      <RequestDrawerShell open onClose={vi.fn()} title="Accessible Drawer">
        <p>Content</p>
      </RequestDrawerShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
