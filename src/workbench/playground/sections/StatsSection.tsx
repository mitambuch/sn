import { Card } from '@components/ui/Card';
import { ProgressBar } from '@components/ui/ProgressBar';
import { Stat } from '@components/ui/Stat';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { ReactElement } from 'react';

import { Section, SpecimenFrame, SubLabel } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

const HeroMetrics = () => {
  const metrics = [
    { value: '12k', label: 'Sites livrés' },
    { value: '4.9', label: 'Note moyenne' },
    { value: '99.99%', label: 'Uptime SLA' },
  ];
  return (
    <div className="grid w-full gap-4 md:grid-cols-3 md:gap-10">
      {metrics.map(m => (
        <div key={m.label} className="border-border/40 border-l pl-4 md:pl-6">
          <p className="text-fg text-4xl leading-none font-bold tracking-tight tabular-nums md:text-5xl lg:text-6xl">
            {m.value}
          </p>
          <p className="text-muted mt-2 font-mono text-[10px] tracking-[0.25em] uppercase">
            {m.label}
          </p>
        </div>
      ))}
    </div>
  );
};

const PeriodCompare = () => {
  const rows = [
    { label: 'Revenue', current: '€48.2k', prev: '€44.9k', delta: '+7.3%', up: true },
    { label: 'Active users', current: '12 847', prev: '11 250', delta: '+14.2%', up: true },
    { label: 'Bounce rate', current: '24.3%', prev: '27.5%', delta: '-3.2%', up: false },
    { label: 'Avg. session', current: '4m 32s', prev: '4m 20s', delta: '+12s', up: true },
  ];
  return (
    <table className="w-full max-w-2xl">
      <thead>
        <tr className="text-muted font-mono text-[10px] tracking-wider uppercase">
          <th className="border-border/60 border-b py-3 text-left font-medium">Metric</th>
          <th className="border-border/60 border-b py-3 text-right font-medium">Ce mois</th>
          <th className="border-border/60 border-b py-3 text-right font-medium">Précédent</th>
          <th className="border-border/60 border-b py-3 text-right font-medium">Δ</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.label}>
            <td className="border-border/40 border-b py-3 text-sm">{r.label}</td>
            <td className="border-border/40 border-b py-3 text-right text-sm font-semibold tabular-nums">
              {r.current}
            </td>
            <td className="border-border/40 text-muted border-b py-3 text-right text-sm tabular-nums">
              {r.prev}
            </td>
            <td className="border-border/40 border-b py-3 text-right">
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${
                  r.up ? 'text-success-text' : 'text-danger-text'
                }`}
              >
                {r.up ? (
                  <TrendingUp size={12} strokeWidth={2.5} />
                ) : (
                  <TrendingDown size={12} strokeWidth={2.5} />
                )}
                {r.delta}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SPECIMENS: Specimen[] = [
  {
    id: 'hero-metrics',
    path: 'inline · 3 big numbers borderless',
    tags: ['editorial', 'luxe'],
    ethos: 'gros chiffres hero · separator border-l · mono label',
    Component: HeroMetrics,
  },
  {
    id: 'period-compare',
    path: 'inline · metrics comparison table',
    tags: ['product', 'technical'],
    ethos: 'comparaison période · Δ coloré + trend icon',
    Component: PeriodCompare,
  },
];

export function StatsSection() {
  return (
    <Section number="23" title="stats">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Atom Stat + ProgressBar + 2 specimens : hero metrics (3 gros chiffres pour about/landing) et
        period-compare (dashboard admin).
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atoms
      </h3>
      <div className="mb-10 space-y-8">
        <div>
          <SubLabel>inline stats</SubLabel>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card padding="md">
              <Stat label="Total users" value="12,847" trend={{ value: '14.2%', positive: true }} />
            </Card>
            <Card padding="md">
              <Stat label="Revenue" value="$48.2k" trend={{ value: '7.1%', positive: true }} />
            </Card>
            <Card padding="md">
              <Stat label="Bounce rate" value="24.3%" trend={{ value: '3.2%', positive: false }} />
            </Card>
            <Card padding="md">
              <Stat label="Avg. session" value="4m 32s" trend={{ value: '12s', positive: true }} />
            </Card>
          </div>
        </div>

        <div>
          <SubLabel>progress bars</SubLabel>
          <div className="max-w-md space-y-4">
            <ProgressBar value={78} variant="accent" label="Overall progress" showLabel />
            <ProgressBar value={92} variant="success" label="Tasks completed" showLabel />
            <ProgressBar value={45} variant="warning" label="Storage used" showLabel />
            <ProgressBar value={15} variant="danger" label="Error rate" showLabel />
          </div>
        </div>
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
