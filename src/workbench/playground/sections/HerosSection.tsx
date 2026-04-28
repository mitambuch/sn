import type { ReactElement } from 'react';

import {
  AccentPunch,
  AsymmetricGrid,
  BackdropOverlay,
  BrutalistSlab,
  CenteredMinimal,
  EditorialSplit,
  MarqueeBillboard,
  PortfolioIndex,
  SplitMetrics,
} from '../heros';
import { MenuFrame, Section } from '../shared';
import type { TagList } from '../tags';

const BASE_PATH = '@workbench/playground/heros';

type HeroEntry = {
  id: string;
  file: string;
  tags: TagList;
  ethos: string;
  Component: () => ReactElement;
};

const HEROS: HeroEntry[] = [
  {
    id: 'brutalist-slab',
    file: 'BrutalistSlab',
    tags: ['brutalist', 'solid'],
    ethos: 'wordmark énorme · divider épais · 1 CTA',
    Component: BrutalistSlab,
  },
  {
    id: 'editorial-split',
    file: 'EditorialSplit',
    tags: ['editorial', 'luxe'],
    ethos: 'split 2-col · type à gauche · visuel portrait droite',
    Component: EditorialSplit,
  },
  {
    id: 'centered-minimal',
    file: 'CenteredMinimal',
    tags: ['minimal'],
    ethos: 'display centré · subline · 2 CTAs · respire',
    Component: CenteredMinimal,
  },
  {
    id: 'asymmetric-grid',
    file: 'AsymmetricGrid',
    tags: ['technical', 'product'],
    ethos: 'grille 12-col · vides intentionnels · rails numérotés',
    Component: AsymmetricGrid,
  },
  {
    id: 'portfolio-index',
    file: 'PortfolioIndex',
    tags: ['editorial', 'brutalist'],
    ethos: 'hero = liste de projets · lecture directe',
    Component: PortfolioIndex,
  },
  {
    id: 'marquee-billboard',
    file: 'MarqueeBillboard',
    tags: ['playful', 'animated'],
    ethos: 'phrase géante défilant · pause au hover · signature',
    Component: MarqueeBillboard,
  },
  {
    id: 'accent-punch',
    file: 'AccentPunch',
    tags: ['accent', 'brutalist'],
    ethos: 'accent pleine page · texte inverse · noise subtil',
    Component: AccentPunch,
  },
  {
    id: 'backdrop-overlay',
    file: 'BackdropOverlay',
    tags: ['luxe', 'organic'],
    ethos: 'backdrop radial + grain · typo par-dessus · hôtel/lifestyle',
    Component: BackdropOverlay,
  },
  {
    id: 'split-metrics',
    file: 'SplitMetrics',
    tags: ['product', 'technical'],
    ethos: 'claim + stats chiffrés · B2B / SaaS / infra',
    Component: SplitMetrics,
  },
];

export function HerosSection() {
  return (
    <Section number="16" title="heros / openers">
      <p className="text-muted mb-10 max-w-2xl text-sm leading-relaxed md:text-base">
        Neuf archétypes de hero — chacun pensé pour un type de site différent. Tags comme pour les
        menus et les boutons : dis-moi « site{' '}
        <span className="font-mono text-xs">#editorial #luxe</span> » et je pioche dans la même vibe
        cross-librairie.
      </p>

      <div className="space-y-10">
        {HEROS.map(({ id, file, tags, ethos, Component }) => (
          <MenuFrame key={id} name={id} path={`${BASE_PATH}/${file}`} tags={tags} ethos={ethos}>
            <Component />
          </MenuFrame>
        ))}
      </div>
    </Section>
  );
}
