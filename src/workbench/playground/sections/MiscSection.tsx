import { AvatarGroup } from '@components/ui/AvatarGroup';
import { Divider } from '@components/ui/Divider';
import { Kbd } from '@components/ui/Kbd';
import { Switch } from '@components/ui/Switch';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { Section, SpecimenFrame, SubLabel } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

function SwitchDemo() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  return (
    <div className="space-y-3">
      <Switch label="Enable notifications" checked={notifications} onChange={setNotifications} />
      <Switch label="Dark mode" checked={darkMode} onChange={setDarkMode} />
      <Switch label="Send analytics" checked={analytics} onChange={setAnalytics} />
      <Switch label="Disabled option" checked={false} disabled />
    </div>
  );
}

/* ─── Specimens ──────────────────────────────────────── */

const SettingsSwitchGroup = () => {
  const [state, setState] = useState({ email: true, push: true, sms: false, weekly: true });
  const items = [
    { key: 'email', label: 'Notifications email', desc: 'Alertes importantes et résumés' },
    { key: 'push', label: 'Notifications push', desc: 'Sur ton appareil en temps réel' },
    { key: 'sms', label: 'Notifications SMS', desc: 'Uniquement les urgences' },
    { key: 'weekly', label: 'Digest hebdo', desc: 'Récap le lundi matin' },
  ] as const;
  return (
    <div className="border-border/60 bg-surface/30 divide-border/40 w-full max-w-md divide-y rounded-xl border">
      {items.map(i => (
        <div key={i.key} className="flex items-start justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="text-fg text-sm font-medium tracking-tight">{i.label}</p>
            <p className="text-muted mt-0.5 text-xs">{i.desc}</p>
          </div>
          <Switch
            checked={state[i.key]}
            onChange={v => setState(s => ({ ...s, [i.key]: v }))}
            label={i.label}
            className="shrink-0"
          />
        </div>
      ))}
    </div>
  );
};

const KbdCombos = () => {
  const combos = [
    { keys: ['⌘', 'K'], label: 'Command palette' },
    { keys: ['⌘', '⇧', 'P'], label: 'Quick switcher' },
    { keys: ['⌘', 'S'], label: 'Enregistrer' },
    { keys: ['⌘', '/'], label: 'Toggle commentaire' },
    { keys: ['Esc'], label: 'Annuler / Fermer' },
    { keys: ['↑', '↓'], label: 'Navigation listes' },
    { keys: ['⌃', '⏎'], label: 'Valider' },
    { keys: ['⌥', '⇥'], label: 'Switch tab' },
  ];
  return (
    <ul className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
      {combos.map((c, i) => (
        <li
          key={i}
          className="border-border/60 bg-surface/20 flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
        >
          <span className="flex items-center gap-1">
            {c.keys.map((k, j) => (
              <span key={j} className="inline-flex items-center gap-1">
                {j > 0 && <span className="text-muted text-[10px]">+</span>}
                <Kbd>{k}</Kbd>
              </span>
            ))}
          </span>
          <span className="text-muted text-xs tracking-tight">{c.label}</span>
        </li>
      ))}
    </ul>
  );
};

const DividerShowcase = () => (
  <div className="w-full max-w-md space-y-5">
    <div>
      <p className="text-muted text-xs">Simple horizontal</p>
      <Divider />
    </div>
    <div>
      <p className="text-muted text-xs">Avec label centré</p>
      <Divider label="ou" />
    </div>
    <div>
      <p className="text-muted text-xs">Label plus long</p>
      <Divider label="Section break" />
    </div>
    <div>
      <p className="text-muted mb-2 text-xs">Vertical (inline)</p>
      <div className="flex h-6 items-center gap-3 text-sm">
        <span className="text-fg">Navigation</span>
        <span className="bg-border h-full w-px" aria-hidden />
        <span className="text-fg">Détails</span>
        <span className="bg-border h-full w-px" aria-hidden />
        <span className="text-muted">Paramètres</span>
      </div>
    </div>
    <div>
      <p className="text-muted mb-2 text-xs">Dashed</p>
      <hr className="border-border border-dashed" />
    </div>
  </div>
);

const AvatarGroupSizes = () => {
  const avatars = [
    { src: 'https://i.pravatar.cc/150?u=a', alt: 'Alice' },
    { src: 'https://i.pravatar.cc/150?u=b', alt: 'Bob' },
    { src: 'https://i.pravatar.cc/150?u=c', alt: 'Charlie' },
    { src: 'https://i.pravatar.cc/150?u=d', alt: 'Diana' },
    { src: 'https://i.pravatar.cc/150?u=e', alt: 'Eve' },
    { src: 'https://i.pravatar.cc/150?u=f', alt: 'Frank' },
    { src: 'https://i.pravatar.cc/150?u=g', alt: 'Grace' },
  ];
  return (
    <div className="w-full space-y-5">
      <div>
        <p className="text-muted mb-2 font-mono text-[10px] tracking-wider uppercase">max=3</p>
        <AvatarGroup avatars={avatars} max={3} />
      </div>
      <div>
        <p className="text-muted mb-2 font-mono text-[10px] tracking-wider uppercase">max=5</p>
        <AvatarGroup avatars={avatars} max={5} />
      </div>
      <div>
        <p className="text-muted mb-2 font-mono text-[10px] tracking-wider uppercase">
          max=7 (tous)
        </p>
        <AvatarGroup avatars={avatars} max={7} />
      </div>
    </div>
  );
};

const SPECIMENS: Specimen[] = [
  {
    id: 'settings-switch-group',
    path: 'inline · switches empilés avec description',
    tags: ['product'],
    ethos: 'panneau settings · label + desc + switch par ligne',
    Component: SettingsSwitchGroup,
  },
  {
    id: 'kbd-combos',
    path: 'inline · grille raccourcis clavier',
    tags: ['technical', 'product'],
    ethos: '8 combos · ⌘/⇧/⌃/⌥/esc/arrows',
    Component: KbdCombos,
  },
  {
    id: 'divider-showcase',
    path: 'inline · variantes divider',
    tags: ['minimal'],
    ethos: 'horizontal / labelled / vertical inline / dashed',
    Component: DividerShowcase,
  },
  {
    id: 'avatar-group-sizes',
    path: 'inline · max=3/5/7 AvatarGroup',
    tags: ['product'],
    ethos: '3 niveaux de condensation · overflow +N',
    Component: AvatarGroupSizes,
  },
];

export function MiscSection() {
  return (
    <Section number="24" title="misc components">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Composants utilitaires souvent réutilisés sur tous les sites — switches, raccourcis clavier,
        dividers, groupes d'avatars. Atoms + 4 specimens composés.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atoms
      </h3>
      <div className="mb-10 space-y-8">
        <div>
          <SubLabel>switch</SubLabel>
          <SwitchDemo />
        </div>

        <div>
          <SubLabel>avatar group</SubLabel>
          <div className="flex flex-wrap items-center gap-6">
            <AvatarGroup
              avatars={[
                { src: 'https://i.pravatar.cc/150?u=a', alt: 'Alice' },
                { src: 'https://i.pravatar.cc/150?u=b', alt: 'Bob' },
                { src: 'https://i.pravatar.cc/150?u=c', alt: 'Charlie' },
                { src: 'https://i.pravatar.cc/150?u=d', alt: 'Diana' },
                { src: 'https://i.pravatar.cc/150?u=e', alt: 'Eve' },
                { src: 'https://i.pravatar.cc/150?u=f', alt: 'Frank' },
              ]}
              max={4}
            />
            <span className="text-muted text-xs">max=4 — 6 avatars</span>
          </div>
        </div>

        <div>
          <SubLabel>keyboard shortcuts</SubLabel>
          <div className="flex flex-wrap gap-3">
            <div className="border-border/50 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Kbd>⌘</Kbd>
              <span className="text-muted text-xs">+</span>
              <Kbd>K</Kbd>
              <span className="text-muted ml-2 text-xs">command palette</span>
            </div>
            <div className="border-border/50 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Kbd>⌘</Kbd>
              <span className="text-muted text-xs">+</span>
              <Kbd>S</Kbd>
              <span className="text-muted ml-2 text-xs">save</span>
            </div>
            <div className="border-border/50 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Kbd>Esc</Kbd>
              <span className="text-muted ml-2 text-xs">close</span>
            </div>
            <div className="border-border/50 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span className="text-muted ml-2 text-xs">navigate</span>
            </div>
          </div>
        </div>

        <div>
          <SubLabel>dividers</SubLabel>
          <div className="max-w-md space-y-0">
            <p className="text-muted text-sm">Content above the divider.</p>
            <Divider />
            <p className="text-muted text-sm">Simple horizontal rule.</p>
            <Divider label="or" />
            <p className="text-muted text-sm">With a centered label.</p>
            <Divider label="section break" />
            <p className="text-muted text-sm">Content below.</p>
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
