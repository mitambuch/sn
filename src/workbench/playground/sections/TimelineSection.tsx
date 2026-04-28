import { Timeline } from '@components/ui/Timeline';
import { Check, Circle, Clock } from 'lucide-react';
import type { ReactElement } from 'react';

import { TIMELINE_ITEMS } from '../data';
import { Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

const HorizontalRoadmap = () => {
  const steps = [
    { q: 'Q1 2026', label: 'Audit & brief', done: true },
    { q: 'Q2 2026', label: 'Direction design', done: true },
    { q: 'Q3 2026', label: 'Build & intégration', done: false, current: true },
    { q: 'Q4 2026', label: 'Lancement', done: false },
  ];
  const dotClasses = (s: (typeof steps)[number]) =>
    `flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-bg ${
      s.done
        ? 'bg-accent text-on-accent'
        : s.current
          ? 'bg-surface text-accent-text border-accent'
          : 'bg-surface text-muted'
    }`;
  const icon = (s: (typeof steps)[number]) =>
    s.done ? (
      <Check size={14} strokeWidth={2.5} />
    ) : s.current ? (
      <Clock size={14} strokeWidth={2} />
    ) : (
      <Circle size={10} strokeWidth={2} />
    );

  return (
    <div className="w-full">
      {/* Mobile — vertical stepper */}
      <ol className="space-y-0 md:hidden">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={dotClasses(s)}>{icon(s)}</span>
              {i < steps.length - 1 && (
                <span className={`min-h-6 w-0.5 flex-1 ${s.done ? 'bg-accent/70' : 'bg-border'}`} />
              )}
            </div>
            <div className="pb-6">
              <p className="text-accent-text font-mono text-[10px] tracking-wider tabular-nums">
                {s.q}
              </p>
              <p className="text-fg mt-0.5 text-sm font-semibold tracking-tight">{s.label}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Desktop — horizontal stepper */}
      <div className="hidden w-full overflow-x-auto md:block">
        <ol className="flex min-w-max items-start px-4">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start">
              <div className="flex flex-col items-center">
                <span className={dotClasses(s)}>{icon(s)}</span>
                <p className="text-accent-text mt-2 font-mono text-[10px] tracking-wider tabular-nums">
                  {s.q}
                </p>
                <p className="text-fg mt-1 w-28 text-center text-xs font-semibold tracking-tight">
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <span
                  className={`mt-4 h-0.5 w-20 lg:w-28 ${s.done ? 'bg-accent/70' : 'bg-border'}`}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const MilestoneCards = () => {
  const milestones = [
    { n: '01', title: 'Découverte', time: '1 semaine', d: 'Audit, brief, direction.' },
    { n: '02', title: 'Exploration', time: '2 semaines', d: 'Moodboards, typos, palette.' },
    { n: '03', title: 'Build', time: '4 semaines', d: 'Design system, pages, intégration.' },
    { n: '04', title: 'Livraison', time: '1 semaine', d: 'QA, handover, déploiement.' },
  ];
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      {milestones.map(m => (
        <article key={m.n} className="border-border/60 bg-surface/30 rounded-xl border p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-accent-text font-mono text-[10px] tracking-[0.3em] uppercase">
              Phase {m.n}
            </span>
            <span className="text-muted font-mono text-[10px] tracking-wider uppercase">
              {m.time}
            </span>
          </div>
          <h4 className="text-fg mt-2 text-lg font-semibold tracking-tight">{m.title}</h4>
          <p className="text-muted mt-1 text-sm leading-relaxed">{m.d}</p>
        </article>
      ))}
    </div>
  );
};

const SPECIMENS: Specimen[] = [
  {
    id: 'horizontal-roadmap',
    path: 'inline · horizontal roadmap checkpoints',
    tags: ['product', 'technical'],
    ethos: 'roadmap horizontale · status done/current/future',
    Component: HorizontalRoadmap,
  },
  {
    id: 'milestone-cards',
    path: 'inline · 2-col milestone cards',
    tags: ['editorial', 'product'],
    ethos: 'phases projet · cards avec durée + description',
    Component: MilestoneCards,
  },
];

export function TimelineSection() {
  return (
    <Section number="22" title="timeline">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Timeline vertical (atom) + 2 specimens : roadmap horizontale avec statuts, cards milestones
        pour process projet.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· core atom</h3>
      <div className="mb-10 max-w-lg">
        <Timeline items={[...TIMELINE_ITEMS]} />
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
