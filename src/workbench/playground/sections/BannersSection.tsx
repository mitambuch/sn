import { Banner } from '@components/ui/Banner';
import { AlertTriangle, ArrowRight, Copy as CopyIcon, Info, Sparkles } from 'lucide-react';
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

const IconBanner = () => (
  <div
    role="status"
    className="border-info/20 bg-info/10 text-info-text flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm"
  >
    <Info size={16} strokeWidth={2} className="shrink-0" />
    <p className="flex-1 font-medium">
      Nouvelle version disponible — <span className="underline">installer la mise à jour</span>
    </p>
  </div>
);

const ActionBanner = () => (
  <div
    role="status"
    className="border-warning/25 bg-warning/10 text-warning-text flex w-full flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm"
  >
    <AlertTriangle size={16} strokeWidth={2} className="shrink-0" />
    <p className="min-w-0 flex-1 font-medium">Clé API expire dans 3 jours.</p>
    <button
      type="button"
      className="bg-warning/25 hover:bg-warning/40 duration-base inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-colors"
    >
      Renouveler
      <ArrowRight size={12} strokeWidth={2.5} />
    </button>
  </div>
);

const AccentFullBleedBanner = () => (
  <div
    role="status"
    className="bg-accent text-on-accent flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold"
  >
    <Sparkles size={14} strokeWidth={2.5} className="shrink-0" />
    <p className="text-center">v3.0 vient de sortir — 8 nouvelles features + perfs améliorées</p>
    <ArrowRight size={14} strokeWidth={2.5} className="shrink-0" />
  </div>
);

const PromoCodeBanner = () => (
  <div
    role="status"
    className="border-accent/40 bg-accent/5 text-fg flex w-full flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm"
  >
    <span className="bg-accent text-on-accent rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase">
      -20%
    </span>
    <p className="min-w-0 flex-1">
      Code promo actif : <span className="font-mono text-xs font-bold">STEAK26</span> · jusqu'au 30
      avril
    </p>
    <button
      type="button"
      aria-label="Copier le code"
      className="text-muted hover:text-accent-text duration-base inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors"
    >
      <CopyIcon size={12} strokeWidth={2} />
      copier
    </button>
  </div>
);

const StackedThreeBanner = () => (
  <div className="w-full space-y-2">
    <Banner variant="accent" dismissable={false}>
      Annonce produit principale
    </Banner>
    <Banner variant="info" dismissable={false}>
      Info secondaire
    </Banner>
    <Banner variant="success" dismissable={false}>
      Déploiement réussi
    </Banner>
  </div>
);

const SPECIMENS: Specimen[] = [
  {
    id: 'banner-info-icon',
    path: 'inline · border + icon + link',
    tags: ['product'],
    ethos: 'annonce de mise à jour · icon + lien inline',
    Component: IconBanner,
  },
  {
    id: 'banner-action',
    path: 'inline · border + icon + CTA',
    tags: ['product'],
    ethos: 'avertissement · CTA inline · renouvellement',
    Component: ActionBanner,
  },
  {
    id: 'banner-accent-bleed',
    path: 'inline · full accent bg',
    tags: ['accent', 'playful'],
    ethos: 'lancement produit · accent full · center',
    Component: AccentFullBleedBanner,
  },
  {
    id: 'banner-promo-code',
    path: 'inline · code + copy',
    tags: ['accent', 'product'],
    ethos: 'promo · code mono + copy inline',
    Component: PromoCodeBanner,
  },
  {
    id: 'banner-stacked-three',
    path: 'atom · stacked Banner variants',
    tags: ['product'],
    ethos: '3 banners empilés · priorités décroissantes',
    Component: StackedThreeBanner,
  },
];

export function BannersSection() {
  return (
    <Section number="13" title="banners & alerts">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        L'atom <span className="font-mono text-xs">Banner</span> couvre 5 variants de base
        (info/success/warning/danger/accent + dismiss). Ci-dessous, 5 specimens assemblés pour des
        usages concrets : mise à jour, avertissement avec action, lancement accent, code promo,
        stack.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· core atom</h3>
      <div className="mb-10 space-y-2">
        <Banner variant="info">Mise à jour disponible</Banner>
        <Banner variant="success">Déploiement réussi</Banner>
        <Banner variant="warning">Clé API expire dans 3 jours</Banner>
        <Banner variant="danger">Build failed — check logs</Banner>
        <Banner variant="accent">v3.0 disponible</Banner>
      </div>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· specimens</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {SPECIMENS.map(({ id, path, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={path} tags={tags} ethos={ethos} centered={false}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
