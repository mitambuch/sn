// WHY: ShareActionRow uses useToast (external store, no Provider needed)
// and @/lib/sharing pure helpers. navigator.clipboard is stubbed below
// because jsdom does not implement it.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ShareActionRow } from '../ShareActionRow';

describe('ShareActionRow', () => {
  beforeEach(() => {
    // Stub clipboard API — jsdom doesn't implement it
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('renders all four default channel buttons', () => {
    render(<ShareActionRow url="https://example.com" message="Test message" />);
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copier/i })).toBeInTheDocument();
  });

  it('renders only specified channels when channels prop is restricted', () => {
    render(
      <ShareActionRow url="https://example.com" message="msg" channels={['whatsapp', 'copy']} />,
    );
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copier/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /email/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /sms/i })).not.toBeInTheDocument();
  });

  it('WhatsApp link contains the encoded message in href', () => {
    render(<ShareActionRow url="https://example.com" message="Hello world" />);
    const wa = screen.getByRole('link', { name: /whatsapp/i });
    expect(wa).toHaveAttribute('href', expect.stringContaining('wa.me'));
    expect(wa).toHaveAttribute('href', expect.stringContaining('Hello%20world'));
  });

  it('copies URL to clipboard when copy button is clicked', async () => {
    render(<ShareActionRow url="https://example.com/test" message="msg" channels={['copy']} />);
    await userEvent.click(screen.getByRole('button', { name: /copier/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/test');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ShareActionRow url="https://example.com" message="A share message" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
