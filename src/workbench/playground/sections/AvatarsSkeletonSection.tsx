import { Avatar } from '@components/ui/Avatar';
import { Skeleton } from '@components/ui/Skeleton';
import type { CSSProperties, ReactElement } from 'react';

import { Section, SpecimenFrame, SubLabel } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

/* ─── Avatar specimens ──────────────────────────────── */

const AvatarStack = () => (
  <div className="flex items-center">
    {['1', '2', '3'].map((u, i) => (
      <span
        key={u}
        className="border-bg relative inline-block rounded-full border-2"
        style={{ marginLeft: i === 0 ? 0 : '-0.75rem', zIndex: 3 - i }}
      >
        <Avatar src={`https://i.pravatar.cc/150?u=stack-${u}`} alt={`Team member ${u}`} size="md" />
      </span>
    ))}
    <span className="bg-surface text-fg border-bg relative -ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold">
      +7
    </span>
  </div>
);

const AvatarWithStatus = () => (
  <div className="flex items-center gap-4">
    <div className="relative">
      <Avatar src="https://i.pravatar.cc/150?u=status-1" alt="Online user" size="lg" />
      <span
        className="bg-success border-bg absolute right-0 bottom-0 h-3 w-3 rounded-full border-2"
        aria-label="En ligne"
      />
    </div>
    <div className="relative">
      <Avatar fallback="AR" alt="Busy user" size="lg" />
      <span
        className="bg-warning border-bg absolute right-0 bottom-0 h-3 w-3 rounded-full border-2"
        aria-label="Occupé"
      />
    </div>
    <div className="relative">
      <Avatar src="https://i.pravatar.cc/150?u=status-3" alt="Offline user" size="lg" />
      <span
        className="bg-muted border-bg absolute right-0 bottom-0 h-3 w-3 rounded-full border-2"
        aria-label="Hors ligne"
      />
    </div>
  </div>
);

const AvatarSquare = () => (
  <div className="flex items-center gap-3">
    {['A', 'B', 'C'].map((letter, i) => (
      <div
        key={letter}
        className="border-border/60 from-accent/30 to-bg flex h-12 w-12 items-center justify-center rounded-lg border bg-linear-to-br"
        style={{ '--tw-gradient-from-position': `${i * 20}%` } as CSSProperties}
      >
        <span className="text-fg font-mono text-sm font-bold">{letter}</span>
      </div>
    ))}
  </div>
);

/* ─── Skeleton specimens ────────────────────────────── */

const SkeletonCard = () => (
  <div className="border-border/60 w-full max-w-sm space-y-3 rounded-xl border p-4">
    <Skeleton className="aspect-video w-full rounded-lg" />
    <Skeleton variant="text" width="70%" />
    <Skeleton variant="text" />
    <Skeleton variant="text" width="50%" />
  </div>
);

const SkeletonList = () => (
  <ul className="w-full max-w-md space-y-3">
    {[0, 1, 2].map(i => (
      <li key={i} className="border-border/50 flex items-center gap-3 rounded-lg border p-3">
        <Skeleton variant="circle" width="2.5rem" height="2.5rem" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="55%" />
          <Skeleton variant="text" width="85%" />
        </div>
      </li>
    ))}
  </ul>
);

const SkeletonMessage = () => (
  <div className="w-full max-w-md space-y-4">
    {[0, 1].map(i => (
      <div key={i} className="flex items-start gap-3">
        <Skeleton variant="circle" width="2rem" height="2rem" />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width="25%" />
            <Skeleton variant="text" width="15%" />
          </div>
          <Skeleton variant="text" />
          <Skeleton variant="text" width={i === 0 ? '70%' : '40%'} />
        </div>
      </div>
    ))}
  </div>
);

const SPECIMENS: Specimen[] = [
  {
    id: 'avatar-stack',
    path: 'inline · overlapping stack + count',
    tags: ['product'],
    ethos: 'team overview · 3 avatars chevauchés + +N',
    Component: AvatarStack,
  },
  {
    id: 'avatar-with-status',
    path: 'inline · avatar + status dot',
    tags: ['product'],
    ethos: 'présence · dot success/warning/muted',
    Component: AvatarWithStatus,
  },
  {
    id: 'avatar-square',
    path: 'inline · rounded-lg initials',
    tags: ['technical', 'product'],
    ethos: 'équipe / workspace · monogramme square',
    Component: AvatarSquare,
  },
  {
    id: 'skeleton-card',
    path: 'inline · card placeholder',
    tags: ['minimal'],
    ethos: 'card feed loading · ratio image + 3 lignes',
    Component: SkeletonCard,
  },
  {
    id: 'skeleton-list',
    path: 'inline · list item placeholder',
    tags: ['minimal'],
    ethos: '3 items avatar + 2 lignes · feed / inbox',
    Component: SkeletonList,
  },
  {
    id: 'skeleton-message',
    path: 'inline · comment/message shape',
    tags: ['minimal'],
    ethos: '2 messages · avatar + nom + timestamp + texte',
    Component: SkeletonMessage,
  },
];

export function AvatarsSkeletonSection() {
  return (
    <Section number="07" title="avatars & skeleton">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Atoms Avatar + Skeleton de base, puis 6 specimens composés : stack d'équipe, présence en
        ligne, monogramme square, skeleton card/list/ message pour les états de chargement.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atoms
      </h3>
      <div className="mb-10 space-y-6">
        <div>
          <SubLabel>avatars</SubLabel>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar alt="small" size="sm" />
            <Avatar alt="medium" fallback="AB" size="md" />
            <Avatar alt="large" size="lg" />
            <Avatar src="https://i.pravatar.cc/150?u=devkit" alt="with image" size="lg" />
          </div>
        </div>

        <div>
          <SubLabel>skeleton</SubLabel>
          <div className="max-w-sm space-y-3">
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
            <div className="flex items-center gap-4">
              <Skeleton variant="circle" width="3rem" height="3rem" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" width="75%" />
              </div>
            </div>
          </div>
        </div>
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
