import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';
import type { ReactElement } from 'react';

import {
  ArticleCard,
  FeatureCard,
  MediaCard,
  PricingMiniCard,
  ProductCard,
  ProfileCard,
  QuoteCard,
  StatCard,
} from '../cards';
import { Copyable, Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

const BASE_PATH = '@workbench/playground/cards';

type CardEntry = {
  id: string;
  file: string;
  tags: TagList;
  ethos: string;
  Component: () => ReactElement;
};

const CARDS: CardEntry[] = [
  {
    id: 'profile-card',
    file: 'ProfileCard',
    tags: ['product'],
    ethos: 'avatar + name + role + CTA · team/contact',
    Component: ProfileCard,
  },
  {
    id: 'stat-card',
    file: 'StatCard',
    tags: ['technical', 'product'],
    ethos: 'métrique + trend + sparkline · dashboard',
    Component: StatCard,
  },
  {
    id: 'article-card',
    file: 'ArticleCard',
    tags: ['editorial'],
    ethos: 'visuel + titre + excerpt · magazine',
    Component: ArticleCard,
  },
  {
    id: 'product-card',
    file: 'ProductCard',
    tags: ['product'],
    ethos: 'visuel + prix + CTA · e-commerce',
    Component: ProductCard,
  },
  {
    id: 'feature-card',
    file: 'FeatureCard',
    tags: ['product'],
    ethos: 'icône + bénéfice + bullets · landing features',
    Component: FeatureCard,
  },
  {
    id: 'quote-card',
    file: 'QuoteCard',
    tags: ['editorial', 'luxe'],
    ethos: 'citation en exergue + attribution',
    Component: QuoteCard,
  },
  {
    id: 'pricing-mini-card',
    file: 'PricingMiniCard',
    tags: ['product', 'accent'],
    ethos: 'plan solo compact · halo accent signature',
    Component: PricingMiniCard,
  },
  {
    id: 'media-card',
    file: 'MediaCard',
    tags: ['luxe', 'organic'],
    ethos: 'visuel plein + overlay caption · lifestyle/hôtel',
    Component: MediaCard,
  },
];

export function CardsSection() {
  return (
    <Section number="06" title="cards & widgets">
      <p className="text-muted mb-10 max-w-2xl text-sm leading-relaxed md:text-base">
        Huit cards signature + l'atom de base. Chaque card est autonome, tokens-only, responsive.
        Choisis par tag selon le site — product grid, magazine, hôtel, portfolio, dashboard.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {CARDS.map(({ id, file, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={`${BASE_PATH}/${file}`} tags={tags} ethos={ethos}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>

      <h3 className="text-fg mt-14 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atom (src/components/ui/Card)
      </h3>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card hover padding="lg">
            <p className="text-fg text-sm font-medium">hover card</p>
            <p className="text-muted mt-1 text-xs">scale + glow on hover</p>
            <Copyable text="hover padding='lg'" className="mt-3" />
          </Card>
          <Card padding="md">
            <p className="text-fg text-sm font-medium">default card</p>
            <p className="text-muted mt-1 text-xs">glass + backdrop-blur</p>
            <Copyable text="padding='md'" className="mt-3" />
          </Card>
          <Card padding="sm">
            <p className="text-fg text-sm font-medium">compact card</p>
            <p className="text-muted mt-1 text-xs">small padding</p>
            <Copyable text="padding='sm'" className="mt-3" />
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card hover padding="lg">
            <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
              total users
            </span>
            <p className="text-fg mt-2 text-3xl font-bold">12,847</p>
            <p className="text-success-text mt-1 text-xs font-medium">+14.2% from last month</p>
          </Card>
          <Card hover padding="lg">
            <div className="flex items-center gap-4">
              <Avatar src="https://i.pravatar.cc/150?u=profile" alt="profile" size="lg" />
              <div>
                <p className="text-fg font-medium">jane doe</p>
                <p className="text-muted text-sm">product designer</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge>design</Badge>
              <Badge variant="outline">figma</Badge>
              <Badge variant="outline">css</Badge>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
