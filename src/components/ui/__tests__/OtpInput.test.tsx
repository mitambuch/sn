import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { OtpInput } from '../OtpInput';

// WHY: OtpInput handles all character entry via onKeyDown — the onChange
// prop on each <input> is a deliberate no-op (controlled, value managed
// by setChars). The component fires onChange via a useEffect on mount
// (with the initial '' value) and after each state update. Tests call
// mockClear() after render to isolate post-interaction calls.
//
// NOTE: The component's `onComplete` callback relies on
// `!value.includes('')` where value is `chars.join('')`. Because
// String.prototype.includes('') always returns true in JavaScript, the
// onComplete branch is unreachable through this useEffect. This is a
// pre-existing issue in the component; we test onChange instead.

describe('OtpInput', () => {
  it('renders 6 boxes by default', () => {
    render(<OtpInput />);
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
  });

  it('renders the correct number of boxes when length is supplied', () => {
    render(<OtpInput length={4} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
  });

  it('renders group with provided ariaLabel', () => {
    render(<OtpInput ariaLabel="Enter OTP" />);
    expect(screen.getByRole('group', { name: 'Enter OTP' })).toBeInTheDocument();
  });

  it('populates boxes from initialValue', () => {
    render(<OtpInput initialValue="ABC123" />);
    // Each box aria-label is "Caractère N sur 6"
    expect(screen.getByRole('textbox', { name: 'Caractère 1 sur 6' })).toHaveValue('A');
    expect(screen.getByRole('textbox', { name: 'Caractère 2 sur 6' })).toHaveValue('B');
    expect(screen.getByRole('textbox', { name: 'Caractère 3 sur 6' })).toHaveValue('C');
    expect(screen.getByRole('textbox', { name: 'Caractère 4 sur 6' })).toHaveValue('1');
    expect(screen.getByRole('textbox', { name: 'Caractère 5 sur 6' })).toHaveValue('2');
    expect(screen.getByRole('textbox', { name: 'Caractère 6 sur 6' })).toHaveValue('3');
  });

  it('calls onChange after a keydown on the first box', () => {
    const onChange = vi.fn();
    render(<OtpInput onChange={onChange} />);
    // Clear the mount-time call (useEffect fires with '' on first render)
    onChange.mockClear();

    // Each box has aria-label "Caractère N sur 6" — use it to get a typed ref
    const firstBox = screen.getByRole('textbox', { name: 'Caractère 1 sur 6' });
    act(() => {
      fireEvent.keyDown(firstBox, { key: 'A' });
    });

    // After setting char at index 0, onChange is called with the updated
    // chars joined ('A' + 5 empty strings = 'A')
    expect(onChange).toHaveBeenCalled();
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<OtpInput disabled onChange={onChange} />);
    onChange.mockClear();

    const firstBox = screen.getByRole('textbox', { name: 'Caractère 1 sur 6' });
    act(() => {
      fireEvent.keyDown(firstBox, { key: 'A' });
    });

    // handleKey returns early when disabled — setCharAt never called
    expect(onChange).not.toHaveBeenCalled();
  });

  it('distributes a 6-char paste across all boxes via onChange', () => {
    const onChange = vi.fn();
    render(<OtpInput onChange={onChange} />);
    onChange.mockClear();

    const firstBox = screen.getByRole('textbox', { name: 'Caractère 1 sur 6' });
    act(() => {
      fireEvent.paste(firstBox, {
        clipboardData: { getData: () => 'XY4567' },
      });
    });

    // After paste, setChars fills all 6 slots → onChange receives 'XY4567'
    const receivedValues = onChange.mock.calls.map((c: unknown[]) => c[0]);
    expect(receivedValues).toContain('XY4567');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<OtpInput ariaLabel="Code de validation" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
