import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { RangeSlider } from '../RangeSlider';

// WHY: RangeSlider inputs have pointer-events-none (CSS, so thumbs don't
// occlude each other). jsdom also does not update input[type=range].value
// on arrow key presses. We use fireEvent.change with an explicit target
// value (the new index) to trigger the onChange handler directly.

const steps = [0, 100, 200, 500, 1000] as const;
const format = (n: number) => `${n} m²`;

describe('RangeSlider', () => {
  it('renders without crashing', () => {
    render(
      <RangeSlider
        label="Surface"
        steps={steps}
        value={[0, 1000]}
        onChange={vi.fn()}
        format={format}
      />,
    );
    expect(screen.getByText('Surface')).toBeInTheDocument();
  });

  it('renders the label', () => {
    render(
      <RangeSlider
        label="Budget"
        steps={steps}
        value={[0, 500]}
        onChange={vi.fn()}
        format={format}
      />,
    );
    expect(screen.getByText('Budget')).toBeInTheDocument();
  });

  it('renders formatted current values', () => {
    render(
      <RangeSlider
        label="Surface"
        steps={steps}
        value={[100, 500]}
        onChange={vi.fn()}
        format={format}
      />,
    );
    expect(screen.getByText(/100 m²/)).toBeInTheDocument();
    expect(screen.getByText(/500 m²/)).toBeInTheDocument();
  });

  it('appends maxSuffix when max thumb is at last step', () => {
    render(
      <RangeSlider
        label="Surface"
        steps={steps}
        value={[0, 1000]}
        onChange={vi.fn()}
        format={format}
        maxSuffix="+"
      />,
    );
    // The span with max value gets the suffix appended
    expect(screen.getByText(/1000 m²\+/)).toBeInTheDocument();
  });

  it('calls onChange with incremented min value when min thumb index increases', () => {
    const onChange = vi.fn();
    render(
      <RangeSlider
        label="Surface"
        steps={steps}
        value={[0, 1000]}
        onChange={onChange}
        format={format}
      />,
    );
    // Min thumb is the first range input (id ends in "-min")
    // Simulate moving from index 0 → 1 (steps[1] = 100)
    const minThumb = screen.getByRole('slider', { name: 'Surface minimum' });
    fireEvent.change(minThumb, { target: { value: '1' } });
    expect(onChange).toHaveBeenCalledWith([100, 1000]);
  });

  it('calls onChange with decremented max value when max thumb index decreases', () => {
    const onChange = vi.fn();
    render(
      <RangeSlider
        label="Surface"
        steps={steps}
        value={[0, 1000]}
        onChange={onChange}
        format={format}
      />,
    );
    // Max thumb is the second range input — simulate moving from index 4 → 3
    const maxThumb = screen.getByRole('slider', { name: 'Surface maximum' });
    fireEvent.change(maxThumb, { target: { value: '3' } });
    // steps[3] = 500
    expect(onChange).toHaveBeenCalledWith([0, 500]);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RangeSlider
        label="Surface"
        steps={steps}
        value={[0, 1000]}
        onChange={vi.fn()}
        format={format}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
