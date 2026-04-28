import { Button } from '@components/ui/Button';
import { useToast } from '@hooks/useToast';
import { Check, Download, MessageCircle, RotateCw, Wifi, X } from 'lucide-react';
import type { ReactElement } from 'react';

import { Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

/* ─── Static toast preview shapes (not live, for visual reference) ─── */

const SuccessToast = () => (
  <div className="border-success/30 bg-success/10 text-success-text inline-flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-lg">
    <Check size={14} strokeWidth={2.5} />
    Projet enregistré
  </div>
);

const ErrorWithRetryToast = () => (
  <div className="border-danger/30 bg-danger/10 text-danger-text inline-flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm shadow-lg">
    <Wifi size={14} strokeWidth={2.5} />
    <span className="font-medium">Perte de connexion</span>
    <button
      type="button"
      className="bg-danger/20 hover:bg-danger/35 duration-base inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold transition-colors"
    >
      <RotateCw size={10} strokeWidth={2.5} />
      Réessayer
    </button>
  </div>
);

const ProgressToast = () => (
  <div className="border-border/60 bg-surface w-72 space-y-2 rounded-lg border p-3 shadow-lg">
    <div className="flex items-center gap-2">
      <Download size={14} strokeWidth={2} className="text-accent-text" />
      <span className="text-fg flex-1 text-sm font-medium">Upload en cours</span>
      <span className="text-muted font-mono text-xs tabular-nums">68%</span>
    </div>
    <div className="bg-bg h-1 w-full overflow-hidden rounded-full">
      <span className="bg-accent block h-full w-[68%] rounded-full" aria-hidden />
    </div>
    <p className="text-muted text-xs">maison-claire-hero.jpg · 2.4 MB restant</p>
  </div>
);

const RichToast = () => (
  <div className="border-border/60 bg-surface w-80 rounded-lg border p-3 shadow-lg">
    <div className="flex items-start gap-3">
      <div className="bg-accent/20 text-accent-text flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
        <MessageCircle size={16} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-fg text-sm font-semibold tracking-tight">Anne-Sophie</p>
          <span className="text-muted font-mono text-[10px] tracking-wider">À l'instant</span>
        </div>
        <p className="text-muted mt-0.5 truncate text-xs">
          « Super, j'ai hâte de voir ton retour sur le brief »
        </p>
        <div className="mt-2 flex gap-2">
          <button className="text-accent-text text-xs font-semibold">Répondre</button>
          <button className="text-muted text-xs">Ignorer</button>
        </div>
      </div>
      <button aria-label="Fermer" className="text-muted hover:text-fg duration-base p-0.5">
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  </div>
);

const CompactToast = () => (
  <div className="bg-fg text-bg inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-tight shadow-lg">
    <span className="bg-success h-1.5 w-1.5 rounded-full" aria-hidden />
    Lien copié
  </div>
);

/* ─── Specimens array ─── */

const SPECIMENS: Specimen[] = [
  {
    id: 'toast-success',
    path: 'shape · success + icon',
    tags: ['product'],
    ethos: 'succès concis · check + label',
    Component: SuccessToast,
  },
  {
    id: 'toast-error-retry',
    path: 'shape · error + retry action',
    tags: ['product'],
    ethos: 'erreur réseau · action retry inline',
    Component: ErrorWithRetryToast,
  },
  {
    id: 'toast-progress',
    path: 'shape · title + progress bar',
    tags: ['product', 'technical'],
    ethos: 'upload/download · progress inline · % tabulaire',
    Component: ProgressToast,
  },
  {
    id: 'toast-rich',
    path: 'shape · avatar + message + actions',
    tags: ['product', 'organic'],
    ethos: 'notification sociale · avatar + actions',
    Component: RichToast,
  },
  {
    id: 'toast-compact',
    path: 'shape · fg pill + dot',
    tags: ['minimal'],
    ethos: 'confirmation ultra-compacte · copié/enregistré',
    Component: CompactToast,
  },
];

export function ToastSection() {
  const { toast } = useToast();

  return (
    <Section number="09" title="toast">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Les 5 formes de toast ci-dessous sont des <span className="italic">previews statiques</span>{' '}
        — pour tester le vrai comportement (positioning, auto-dismiss, queue), utilise les boutons
        sous "core atom".
      </p>

      {/* Live toasts — core atom */}
      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atom — live triggers
      </h3>
      <div className="mb-10 flex flex-wrap gap-2">
        {(
          [
            ['success', 'Action validée'],
            ['error', 'Quelque chose a échoué'],
            ['warning', 'Attention à cette action'],
            ['info', 'Nouvelle version disponible'],
          ] as const
        ).map(([variant, message]) => (
          <Button
            key={variant}
            variant={variant === 'success' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => toast({ variant: variant === 'error' ? 'error' : variant, message })}
          >
            {variant}
          </Button>
        ))}
      </div>

      {/* Static specimens */}
      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · shapes (preview statique)
      </h3>
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
