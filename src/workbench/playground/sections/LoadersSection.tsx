import type { ReactElement } from 'react';

import {
  ArcSpinner,
  BarsEqualizer,
  DotsBounce,
  NumericPercent,
  OrbitOrbs,
  ProgressBar,
  PulseRing,
  SkeletonPulse,
} from '../loaders';
import { Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

const BASE_PATH = '@workbench/playground/loaders';

type LoaderEntry = {
  id: string;
  file: string;
  tags: TagList;
  ethos: string;
  Component: () => ReactElement;
};

const LOADERS: LoaderEntry[] = [
  {
    id: 'arc-spinner',
    file: 'ArcSpinner',
    tags: ['product', 'minimal'],
    ethos: 'arc accent qui tourne · atom Spinner',
    Component: ArcSpinner,
  },
  {
    id: 'dots-bounce',
    file: 'DotsBounce',
    tags: ['playful', 'animated'],
    ethos: '3 points rebondissent en séquence',
    Component: DotsBounce,
  },
  {
    id: 'bars-equalizer',
    file: 'BarsEqualizer',
    tags: ['technical', 'animated'],
    ethos: '5 barres verticales · VU-mètre',
    Component: BarsEqualizer,
  },
  {
    id: 'pulse-ring',
    file: 'PulseRing',
    tags: ['minimal', 'animated'],
    ethos: 'point + halo qui expand',
    Component: PulseRing,
  },
  {
    id: 'progress-bar',
    file: 'ProgressBar',
    tags: ['product'],
    ethos: 'barre horizontale indeterminate · sweep loop',
    Component: ProgressBar,
  },
  {
    id: 'numeric-percent',
    file: 'NumericPercent',
    tags: ['technical'],
    ethos: 'gros chiffre 00-99% · tabular-nums',
    Component: NumericPercent,
  },
  {
    id: 'skeleton-pulse',
    file: 'SkeletonPulse',
    tags: ['minimal'],
    ethos: '3 lignes placeholder qui pulsent',
    Component: SkeletonPulse,
  },
  {
    id: 'orbit-orbs',
    file: 'OrbitOrbs',
    tags: ['playful', 'animated'],
    ethos: '2 orbes qui orbitent · signature',
    Component: OrbitOrbs,
  },
];

export function LoadersSection() {
  return (
    <Section number="12" title="loaders / progress">
      <p className="text-muted mb-10 max-w-2xl text-sm leading-relaxed md:text-base">
        Huit indicateurs de chargement — roues, barres, numériques, skeletons. Choisis selon la vibe
        : <span className="font-mono text-xs">#minimal</span> pour un chargement discret,{' '}
        <span className="font-mono text-xs">#playful</span> pour du feedback vivant,{' '}
        <span className="font-mono text-xs">#technical</span> pour un affichage précis. Tous
        respectent <span className="font-mono text-xs">motion-safe:animate-*</span> — arrêtés si
        l'user a <span className="font-mono text-xs">prefers-reduced-motion</span>.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {LOADERS.map(({ id, file, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={`${BASE_PATH}/${file}`} tags={tags} ethos={ethos}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
