// WHY: IntentCards mounts FreeFormInquiryDrawer and JetCharterDrawer on
// click. Both drawers depend on RequestDrawerShell (i18n) + useToast +
// ImageUpload (FileReader). Mocking them keeps these tests focused on
// IntentCards behaviour without pulling in their full dependency tree.

import '@config/i18n';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

vi.mock('@features/inquiry/FreeFormInquiryDrawer', () => ({
  FreeFormInquiryDrawer: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div role="dialog" aria-label="free-form-drawer">
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));

vi.mock('@features/jet/JetCharterDrawer', () => ({
  JetCharterDrawer: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div role="dialog" aria-label="jet-drawer">
        <button onClick={onClose}>close jet</button>
      </div>
    ) : null,
}));

import { IntentCards } from '../IntentCards';

describe('IntentCards', () => {
  it('renders the 4 intent cards without crash', () => {
    render(<IntentCards />);
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(4);
  });

  it('renders the section heading', () => {
    render(<IntentCards />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('opens the free-form drawer when the Travel card is clicked', async () => {
    render(<IntentCards />);
    const buttons = screen.getAllByRole('button');
    // First intent card = Travel
    const travelBtn = buttons[0];
    if (!travelBtn) throw new Error('expected at least one intent button');
    await userEvent.click(travelBtn);
    expect(screen.getByRole('dialog', { name: 'free-form-drawer' })).toBeInTheDocument();
  });

  it('opens the jet drawer when the Jet card is clicked', async () => {
    render(<IntentCards />);
    const buttons = screen.getAllByRole('button');
    // Fourth intent card = Jet
    const jetBtn = buttons[3];
    if (!jetBtn) throw new Error('expected at least four intent buttons');
    await userEvent.click(jetBtn);
    expect(screen.getByRole('dialog', { name: 'jet-drawer' })).toBeInTheDocument();
  });

  it('closes the drawer when onClose is called', async () => {
    render(<IntentCards />);
    const buttons = screen.getAllByRole('button');
    const travelBtn = buttons[0];
    if (!travelBtn) throw new Error('expected at least one intent button');
    await userEvent.click(travelBtn);
    expect(screen.getByRole('dialog', { name: 'free-form-drawer' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no accessibility violations on initial render', async () => {
    const { container } = render(<IntentCards />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
