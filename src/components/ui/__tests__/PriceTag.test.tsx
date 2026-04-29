import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PriceTag } from '../PriceTag';

// WHY: Intl.NumberFormat uses non-breaking space variants as group separator
// depending on locale (NBSP U+00A0 or narrow NBSP U+202F). Match both.
const SPACE = '[\\s\\u00A0\\u202F]?';

describe('PriceTag', () => {
  it('shows on-request label by default', () => {
    render(<PriceTag onRequestLabel="Sur demande" />);
    expect(screen.getByText('Sur demande')).toBeInTheDocument();
  });

  it('formats CHF amount with locale', () => {
    render(<PriceTag onRequestLabel="On request" amount={12000} currency="CHF" />);
    expect(screen.getByText(new RegExp(`12${SPACE}000`))).toBeInTheDocument();
  });

  it('formats EUR amount', () => {
    render(<PriceTag onRequestLabel="On request" amount={5000} currency="EUR" />);
    expect(screen.getByText(new RegExp(`5${SPACE}000`))).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PriceTag onRequestLabel="Sur demande" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
