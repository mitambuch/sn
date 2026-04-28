import {
  ArrowRight,
  Bell,
  Check,
  Copy,
  Download,
  Heart,
  Moon,
  Search,
  Sun,
  Zap,
} from 'lucide-react';
import type { ReactElement } from 'react';

import { Copyable, IconItem, Section, SpecimenFrame, SubLabel } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

/* ─── Icon specimens ─────────────────────────────────── */

const SolidIconButton = () => (
  <button
    type="button"
    aria-label="Télécharger"
    className="bg-accent text-on-accent hover:bg-accent/90 duration-base inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
  >
    <Download size={16} strokeWidth={2} />
  </button>
);

const GhostIconButton = () => (
  <button
    type="button"
    aria-label="Favoris"
    className="border-border/60 text-fg hover:border-accent hover:text-accent-text duration-base inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
  >
    <Heart size={16} strokeWidth={1.75} />
  </button>
);

const IconWithNotificationBadge = () => (
  <button
    type="button"
    aria-label="Notifications"
    className="text-fg hover:bg-surface duration-base relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
  >
    <Bell size={18} strokeWidth={1.75} />
    <span className="bg-accent text-on-accent absolute top-1.5 right-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-[9px] font-bold tabular-nums">
      3
    </span>
  </button>
);

const IconWithLabel = () => (
  <div className="flex items-center gap-3">
    {[
      { Icon: Zap, label: 'Actions' },
      { Icon: Heart, label: 'Favoris' },
      { Icon: Download, label: 'Export' },
    ].map(({ Icon, label }) => (
      <div
        key={label}
        className="border-border/60 bg-surface/40 flex flex-col items-center gap-1 rounded-lg border px-3 py-2"
      >
        <Icon size={16} strokeWidth={1.75} className="text-fg" />
        <span className="text-muted font-mono text-[10px] tracking-wider uppercase">{label}</span>
      </div>
    ))}
  </div>
);

const IconGrid = () => (
  <div className="grid grid-cols-4 gap-1.5">
    {[Search, ArrowRight, Check, Copy, Zap, Heart, Sun, Moon, Bell, Download].map((Icon, i) => (
      <button
        key={i}
        type="button"
        aria-label={Icon.displayName ?? `Icône ${i}`}
        className="border-border/40 bg-surface/20 hover:border-accent/40 hover:bg-surface text-fg duration-base flex h-10 w-10 items-center justify-center rounded-lg border transition-colors"
      >
        <Icon size={14} strokeWidth={1.75} />
      </button>
    ))}
  </div>
);

const SPECIMENS: Specimen[] = [
  {
    id: 'icon-solid',
    path: 'inline · bg-accent circle',
    tags: ['product', 'accent'],
    ethos: 'CTA primary · accent rond · 10×10',
    Component: SolidIconButton,
  },
  {
    id: 'icon-ghost',
    path: 'inline · bordered ghost',
    tags: ['minimal', 'ghost'],
    ethos: 'action secondaire · bordure subtile',
    Component: GhostIconButton,
  },
  {
    id: 'icon-with-badge',
    path: 'inline · icon + notification count',
    tags: ['product'],
    ethos: 'notifications · badge count top-right',
    Component: IconWithNotificationBadge,
  },
  {
    id: 'icon-with-label',
    path: 'inline · stacked icon + label',
    tags: ['product', 'technical'],
    ethos: 'action toolbar · icon + label dessous',
    Component: IconWithLabel,
  },
  {
    id: 'icon-grid',
    path: 'inline · 4-col icon grid',
    tags: ['technical'],
    ethos: 'picker / palette · grille boutons uniformes',
    Component: IconGrid,
  },
];

export function IconsSection() {
  return (
    <Section number="10" title="icons">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Icônes via <span className="font-mono text-xs">lucide-react</span>. Tokens only, strokeWidth
        cohérent (1.5 pour texte, 2 pour CTAs). Ci-dessous les atoms de base puis 5 specimens
        composés.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atoms
      </h3>
      <div className="mb-10 space-y-6">
        <div>
          <SubLabel>common icons — lucide react</SubLabel>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Search', Icon: Search },
              { name: 'ArrowRight', Icon: ArrowRight },
              { name: 'Check', Icon: Check },
              { name: 'Copy', Icon: Copy },
              { name: 'Zap', Icon: Zap },
              { name: 'Heart', Icon: Heart },
              { name: 'Sun', Icon: Sun },
              { name: 'Moon', Icon: Moon },
            ].map(({ name, Icon }) => (
              <IconItem key={name} name={name}>
                <Icon size={18} strokeWidth={1.5} />
              </IconItem>
            ))}
          </div>
        </div>

        <div>
          <SubLabel>sizes</SubLabel>
          <div className="flex flex-wrap gap-3">
            {[
              { size: 14, label: 'inline' },
              { size: 18, label: 'standard' },
              { size: 24, label: 'large' },
            ].map(({ size, label }) => (
              <div
                key={size}
                className="border-border/50 hover:border-accent/20 duration-base flex items-center gap-3 rounded-lg border px-3 py-2 transition-[border-color]"
              >
                <Zap size={size} strokeWidth={1.5} />
                <Copyable text={`size={${size}}`} />
                <span className="text-muted text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SubLabel>stroke weight</SubLabel>
          <div className="flex flex-wrap gap-3">
            <div className="border-border/50 duration-base flex items-center gap-3 rounded-lg border px-3 py-2 transition-[border-color]">
              <Heart size={20} strokeWidth={2} />
              <span className="text-muted font-mono text-[10px]">2 default</span>
            </div>
            <div className="border-accent/30 duration-base flex items-center gap-3 rounded-lg border px-3 py-2 transition-[border-color]">
              <Heart size={20} strokeWidth={1.5} className="text-accent" />
              <span className="text-accent font-mono text-[10px]">1.5 classe2</span>
            </div>
            <div className="border-border/50 duration-base flex items-center gap-3 rounded-lg border px-3 py-2 transition-[border-color]">
              <Heart size={20} strokeWidth={1} />
              <span className="text-muted font-mono text-[10px]">1 thin</span>
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
