// ═══════════════════════════════════════════════════
// PriceTag — discreet price/availability indicator
//
// WHAT: Renders either a formatted price (CHF/EUR/USD), the literal
//       "sur demande" / "on request" label, or a custom availability hint.
// WHEN: Card listing footer, Detail hero metadata.
// WHY ON-REQUEST DEFAULT: HNW conciergerie convention — price is never
//       shouted in the catalogue, even when known internally.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

interface PriceTagProps {
  /** Always preferred — display "On request" / "Sur demande" via translated label. */
  onRequestLabel: string;
  /** Override only when the operator explicitly authorizes price disclosure. */
  amount?: number;
  currency?: 'CHF' | 'EUR' | 'USD';
  size?: 'sm' | 'md';
  className?: string;
}

const sizeStyles: Record<NonNullable<PriceTagProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
};

const formatAmount = (amount: number, currency: NonNullable<PriceTagProps['currency']>) => {
  const locale = currency === 'CHF' ? 'fr-CH' : currency === 'EUR' ? 'fr-FR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Discreet price label — defaults to "on request" semantics. */
export const PriceTag = ({
  onRequestLabel,
  amount,
  currency = 'CHF',
  size = 'sm',
  className,
}: PriceTagProps) => {
  const display = amount === undefined ? onRequestLabel : formatAmount(amount, currency);
  return (
    <span
      className={cn('text-muted font-mono tracking-widest uppercase', sizeStyles[size], className)}
    >
      {display}
    </span>
  );
};
