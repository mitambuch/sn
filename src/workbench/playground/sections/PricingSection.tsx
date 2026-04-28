import { Button } from '@components/ui/Button';
import { cn } from '@utils/cn';
import { Check, Minus } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { PRICING_PLANS } from '../data';
import { Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

const ToggleBillingPricing = () => {
  const [yearly, setYearly] = useState(true);
  const plans = [
    { name: 'Starter', monthly: 29, yearly: 290, features: ['5 projets', 'Support email'] },
    {
      name: 'Pro',
      monthly: 99,
      yearly: 990,
      features: ['Projets illimités', 'Support prioritaire', 'Analytics'],
      highlighted: true,
    },
    {
      name: 'Studio',
      monthly: 299,
      yearly: 2990,
      features: ['Tout Pro', 'SLA 99.99%', 'Compte dédié'],
    },
  ];
  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={cn(
            'duration-base rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-colors',
            !yearly ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
          )}
        >
          Mensuel
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={cn(
            'duration-base inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-colors',
            yearly ? 'bg-fg text-bg' : 'text-muted hover:text-fg',
          )}
        >
          Annuel
          <span className="bg-accent text-on-accent rounded-full px-1.5 py-0.5 font-mono text-[9px]">
            -20%
          </span>
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {plans.map(p => (
          <div
            key={p.name}
            className={cn(
              'duration-base rounded-xl border p-5 transition-[border-color]',
              p.highlighted
                ? 'border-accent/50 bg-accent/5'
                : 'border-border/60 hover:border-accent/30',
            )}
          >
            <h4 className="text-fg font-mono text-xs font-medium tracking-wider uppercase">
              {p.name}
            </h4>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-fg text-3xl font-bold tracking-tight tabular-nums">
                €{yearly ? Math.floor(p.yearly / 12) : p.monthly}
              </span>
              <span className="text-muted text-sm">/ mois</span>
            </div>
            {yearly && (
              <p className="text-muted mt-1 font-mono text-[10px] tracking-wider">
                €{p.yearly} / an
              </p>
            )}
            <ul className="mt-4 space-y-1.5">
              {p.features.map(f => (
                <li key={f} className="text-muted flex items-center gap-2 text-xs">
                  <Check size={12} strokeWidth={2} className="text-accent-text shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={p.highlighted ? 'primary' : 'secondary'}
              className="mt-4 w-full"
              size="sm"
            >
              Choisir
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComparisonTable = () => {
  const rows = [
    ['Projets', '5', 'Illimités', 'Illimités'],
    ['Membres', '1', '5', '20'],
    ['Stockage', '10 GB', '200 GB', '2 TB'],
    ['Support email', true, true, true],
    ['Support prioritaire', false, true, true],
    ['SLA 99.99%', false, false, true],
    ['Compte dédié', false, false, true],
  ] as const;
  return (
    <div className="w-full max-w-3xl overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-muted font-mono text-[10px] tracking-wider uppercase">
            <th className="border-border/60 border-b py-3 text-left font-medium">Feature</th>
            <th className="border-border/60 border-b py-3 text-right font-medium">Starter</th>
            <th className="border-accent/50 bg-accent/5 border-b py-3 text-right font-medium">
              Pro
            </th>
            <th className="border-border/60 border-b py-3 text-right font-medium">Studio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border-border/40 border-b py-3 text-sm">{row[0]}</td>
              {[row[1], row[2], row[3]].map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    'border-border/40 border-b py-3 text-right text-sm tabular-nums',
                    j === 1 && 'bg-accent/5',
                  )}
                >
                  {typeof cell === 'boolean' ? (
                    cell ? (
                      <Check size={14} strokeWidth={2.5} className="text-success-text inline" />
                    ) : (
                      <Minus size={14} strokeWidth={2} className="text-muted inline" />
                    )
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SPECIMENS: Specimen[] = [
  {
    id: 'toggle-billing-pricing',
    path: 'inline · monthly/yearly toggle + 3 plans',
    tags: ['product', 'accent'],
    ethos: 'toggle facturation · -20% annuel · 3 plans',
    Component: ToggleBillingPricing,
  },
  {
    id: 'comparison-table',
    path: 'inline · feature comparison table',
    tags: ['product', 'technical'],
    ethos: 'tableau de comparaison · pro column highlighted',
    Component: ComparisonTable,
  },
];

export function PricingSection() {
  return (
    <Section number="18" title="pricing table">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Atom pricing (3 plans) + 2 specimens : toggle mensuel/annuel, tableau de comparaison feature
        par feature.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· core atom</h3>
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {PRICING_PLANS.map(plan => (
          <div
            key={plan.name}
            className={cn(
              'border-border duration-base relative flex flex-col rounded-lg border p-6 transition-[border-color,background-color,box-shadow]',
              plan.highlighted
                ? 'border-accent/40 bg-accent/3 shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_5%,transparent)]'
                : 'hover:border-accent/15 bg-transparent',
            )}
          >
            {plan.badge && (
              <span className="bg-accent text-bg absolute -top-3 right-4 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                {plan.badge}
              </span>
            )}
            <h3 className="text-fg font-mono text-sm font-medium uppercase">{plan.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-fg text-3xl font-bold">{plan.price}</span>
              <span className="text-fg/60 text-sm">{plan.period}</span>
            </div>
            <p className="text-fg/70 mt-2 text-sm">{plan.description}</p>
            <ul className="mt-6 flex-1 space-y-2">
              {plan.features.map(f => (
                <li key={f} className="text-fg/70 flex items-center gap-2 text-sm">
                  <Check
                    size={14}
                    strokeWidth={2}
                    className="text-success shrink-0"
                    aria-hidden="true"
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.highlighted ? 'primary' : 'secondary'}
              className="mt-6 w-full"
              size="md"
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· specimens</h3>
      <div className="space-y-4">
        {SPECIMENS.map(({ id, path, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={path} tags={tags} ethos={ethos}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
