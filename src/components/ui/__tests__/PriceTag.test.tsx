import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PriceTag } from '../PriceTag';

// WHY: Intl.NumberFormat picks the locale's group separator — Swiss-FR uses an
// apostrophe (12'000), Swiss-DE a NBSP (12 000), other locales NBSP/narrow-NBSP.
// Match any of these so the assertion survives Node/ICU updates.
const SEP = `['\\s\\u00A0\\u202F]?`;

describe('PriceTag', () => {
  it('shows on-request label by default', () => {
    render(<PriceTag onRequestLabel="Sur demande" />);
    expect(screen.getByText('Sur demande')).toBeInTheDocument();
  });

  it('formats CHF amount with locale', () => {
    render(<PriceTag onRequestLabel="On request" amount={12000} currency="CHF" />);
    expect(screen.getByText(new RegExp(`12${SEP}000`))).toBeInTheDocument();
  });

  it('formats EUR amount', () => {
    render(<PriceTag onRequestLabel="On request" amount={5000} currency="EUR" />);
    expect(screen.getByText(new RegExp(`5${SEP}000`))).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PriceTag onRequestLabel="Sur demande" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
