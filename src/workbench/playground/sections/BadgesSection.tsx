import { Badge } from '@components/ui/Badge';
import { cn } from '@utils/cn';
import { Check, Sparkles, Zap } from 'lucide-react';
import type { ReactElement } from 'react';

import { Copyable, Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

const DotBadge = () => (
  <span className="bg-surface/60 text-fg border-border/60 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight">
    <span className="bg-success relative flex h-1.5 w-1.5 rounded-full" aria-hidden>
      <span className="bg-success/60 absolute inset-0 rounded-full motion-safe:animate-ping" />
    </span>
    En ligne
  </span>
);

const IconPrefixBadge = () => (
  <span className="bg-accent/15 text-accent-text inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase">
    <Sparkles size={12} strokeWidth={2} />
    Nouveau
  </span>
);

const NumberBadge = () => (
  <span className="bg-accent text-on-accent inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[10px] font-bold tabular-nums">
    42
  </span>
);

const DashedDraftBadge = () => (
  <span className="border-border text-muted inline-flex items-center gap-1.5 rounded border border-dashed px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] uppercase">
    Brouillon
  </span>
);

const GradientPillBadge = () => (
  <span className="text-on-accent inline-flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,var(--color-accent)_0%,color-mix(in_srgb,var(--color-accent)_60%,var(--color-info))_100%)] px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
    <Zap size={10} strokeWidth={2.5} />
    Pro
  </span>
);

const PairBadge = () => (
  <span className="border-border/70 inline-flex items-stretch overflow-hidden rounded-full border">
    <span className="bg-surface text-muted px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
      Version
    </span>
    <span className="bg-accent text-on-accent px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums">
      v2.3.0
    </span>
  </span>
);

const CheckmarkBadge = () => (
  <span className="bg-success/15 text-success-text inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold">
    <Check size={12} strokeWidth={2.5} />
    Vérifié
  </span>
);

const SPECIMENS: Specimen[] = [
  {
    id: 'dot-live',
    path: 'inline · dot + label',
    tags: ['product'],
    ethos: 'status live · dot qui ping',
    Component: DotBadge,
  },
  {
    id: 'icon-prefix',
    path: 'inline · icon + label',
    tags: ['product', 'accent'],
    ethos: 'nouveauté / featured · icon accent',
    Component: IconPrefixBadge,
  },
  {
    id: 'number-count',
    path: 'inline · count circle',
    tags: ['product'],
    ethos: 'notification count · tabular-nums',
    Component: NumberBadge,
  },
  {
    id: 'dashed-draft',
    path: 'inline · dashed outline',
    tags: ['editorial', 'minimal'],
    ethos: 'brouillon / preview · bordure dashed',
    Component: DashedDraftBadge,
  },
  {
    id: 'gradient-pill',
    path: 'inline · gradient pill',
    tags: ['playful', 'accent'],
    ethos: 'plan premium · gradient accent→info',
    Component: GradientPillBadge,
  },
  {
    id: 'pair-split',
    path: 'inline · 2-segment',
    tags: ['technical'],
    ethos: 'label + valeur · version/tag/metric',
    Component: PairBadge,
  },
  {
    id: 'checkmark-verified',
    path: 'inline · check + label',
    tags: ['product'],
    ethos: 'vérifié / success · fond success doux',
    Component: CheckmarkBadge,
  },
];

export function BadgesSection() {
  return (
    <Section number="04" title="badges">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        L'atom <span className="font-mono text-xs">Badge</span> couvre les variants de base (success
        / warning / danger / info / outline). Ci-dessous, sept specimens "signature" à copier-coller
        pour des usages précis.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· core atom</h3>
      <div className="mb-10 space-y-3">
        {(
          [
            ['default', 'bg-accent text-on-accent'],
            ['outline', 'border border-border'],
            ['success', 'bg-success/15 text-success-text'],
            ['warning', 'bg-warning/15 text-warning-text'],
            ['danger', 'bg-danger/15 text-danger-text'],
            ['info', 'bg-info/15 text-info-text'],
          ] as const
        ).map(([variant, classes]) => (
          <div
            key={variant}
            className={cn(
              'border-border/50 hover:border-accent/20 duration-base flex flex-wrap items-center gap-4 rounded-lg border p-3 transition-[border-color]',
            )}
          >
            <Badge variant={variant}>{variant}</Badge>
            <Copyable text={`variant="${variant}"`} />
            <span className="text-muted font-mono text-[10px]">{classes}</span>
          </div>
        ))}
      </div>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· specimens</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {SPECIMENS.map(({ id, path, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={path} tags={tags} ethos={ethos}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
