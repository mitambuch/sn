import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Stepper } from '../Stepper';

describe('Stepper', () => {
  it('renders without crashing', () => {
    render(<Stepper label="Guests" value={0} onChange={vi.fn()} />);
    expect(screen.getByText('Guests')).toBeInTheDocument();
  });

  it('renders the label', () => {
    render(<Stepper label="Passengers" value={2} onChange={vi.fn()} />);
    expect(screen.getByText('Passengers')).toBeInTheDocument();
  });

  it('shows emptyLabel when value is 0 and min is 0', () => {
    render(<Stepper label="Guests" value={0} onChange={vi.fn()} emptyLabel="None" />);
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('shows the numeric value with unit when value is non-zero', () => {
    render(<Stepper label="Rooms" value={3} onChange={vi.fn()} unit="p." />);
    // fr-CH locale formats integers without separators below 1000
    expect(screen.getByText(/3 p\./)).toBeInTheDocument();
  });

  it('calls onChange with incremented value when + button is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Stepper label="Guests" value={2} onChange={onChange} />);
    const incButton = screen.getByRole('button', { name: /Guests.*\+/ });
    await user.click(incButton);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onChange with decremented value when - button is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Stepper label="Guests" value={2} onChange={onChange} />);
    const decButton = screen.getByRole('button', { name: /Guests.*−/ });
    await user.click(decButton);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('disables decrement button at min boundary', () => {
    render(<Stepper label="Guests" value={0} onChange={vi.fn()} min={0} />);
    const decButton = screen.getByRole('button', { name: /Guests.*−/ });
    expect(decButton).toBeDisabled();
  });

  it('disables increment button at max boundary', () => {
    render(<Stepper label="Guests" value={10} onChange={vi.fn()} max={10} />);
    const incButton = screen.getByRole('button', { name: /Guests.*\+/ });
    expect(incButton).toBeDisabled();
  });

  it('does not fire onChange when decrement button is disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Stepper label="Guests" value={0} onChange={onChange} min={0} />);
    const decButton = screen.getByRole('button', { name: /Guests.*−/ });
    await user.click(decButton);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Stepper label="Guests" value={1} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
