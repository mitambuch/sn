import { Button } from '@components/ui/Button';
import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';

import {
  AccentHalo,
  ArrowForward,
  BracketAnnotated,
  BrutalistBlock,
  CornerTicks,
  DualIcon,
  GlassPill,
  IconGhostCircle,
  ItalicSerif,
  KbdShortcut,
  MagneticWipe,
  MarqueeText,
  NeonOutline,
  NumberedCTA,
  OutlineFillInvert,
  PressableStack,
  RotatingArrow,
  SplitDividerLeft,
  SplitDividerRight,
  SweepShimmer,
  UnderlineOnly,
} from '../buttons';
import { Copyable, Section, SpecimenFrame, SubLabel } from '../shared';
import type { TagList } from '../tags';

const BASE_PATH = '@workbench/playground/buttons';

type Specimen = {
  id: string;
  file: string;
  tags: TagList;
  ethos: string;
  Component: () => ReactElement;
};

const SPECIMENS: Specimen[] = [
  {
    id: 'arrow-forward',
    file: 'ArrowForward',
    tags: ['product', 'accent'],
    ethos: 'CTA solide + flèche qui glisse',
    Component: ArrowForward,
  },
  {
    id: 'brutalist-block',
    file: 'BrutalistBlock',
    tags: ['brutalist', 'solid'],
    ethos: 'bordure 2px · uppercase noir · active offset',
    Component: BrutalistBlock,
  },
  {
    id: 'outline-fill-invert',
    file: 'OutlineFillInvert',
    tags: ['brutalist', 'animated'],
    ethos: 'remplissage bas-haut · inverse la couleur',
    Component: OutlineFillInvert,
  },
  {
    id: 'accent-halo',
    file: 'AccentHalo',
    tags: ['accent', 'playful'],
    ethos: 'halo flou expand autour · signature accent',
    Component: AccentHalo,
  },
  {
    id: 'sweep-shimmer',
    file: 'SweepShimmer',
    tags: ['playful', 'animated'],
    ethos: 'bande lumineuse traverse au hover',
    Component: SweepShimmer,
  },
  {
    id: 'magnetic-wipe',
    file: 'MagneticWipe',
    tags: ['luxe', 'animated'],
    ethos: 'wipe accent gauche→droite · élégant',
    Component: MagneticWipe,
  },
  {
    id: 'pressable-stack',
    file: 'PressableStack',
    tags: ['product', 'playful'],
    ethos: 'ombre décalée · descend au clic',
    Component: PressableStack,
  },
  {
    id: 'numbered-cta',
    file: 'NumberedCTA',
    tags: ['editorial', 'accent'],
    ethos: 'marqueur "01 →" · ancré éditorial',
    Component: NumberedCTA,
  },
  {
    id: 'italic-serif',
    file: 'ItalicSerif',
    tags: ['editorial', 'luxe'],
    ethos: 'italique + filet · sobre magazine',
    Component: ItalicSerif,
  },
  {
    id: 'underline-only',
    file: 'UnderlineOnly',
    tags: ['minimal', 'editorial'],
    ethos: 'zéro chrome · underline scale-x animé',
    Component: UnderlineOnly,
  },
  {
    id: 'glass-pill',
    file: 'GlassPill',
    tags: ['minimal', 'ghost'],
    ethos: 'pill flou + bordure discrète',
    Component: GlassPill,
  },
  {
    id: 'corner-ticks',
    file: 'CornerTicks',
    tags: ['technical', 'animated'],
    ethos: 'repères de coins · hover design-tool',
    Component: CornerTicks,
  },
  {
    id: 'dual-icon',
    file: 'DualIcon',
    tags: ['product', 'icon'],
    ethos: 'icône gauche + flèche droite · download/utilitaire',
    Component: DualIcon,
  },
  {
    id: 'marquee-text',
    file: 'MarqueeText',
    tags: ['playful', 'animated'],
    ethos: 'texte qui défile au hover',
    Component: MarqueeText,
  },
  {
    id: 'icon-ghost-circle',
    file: 'IconGhostCircle',
    tags: ['minimal', 'icon'],
    ethos: 'rond ghost · flèche déplacée au hover',
    Component: IconGhostCircle,
  },
  {
    id: 'split-divider-right',
    file: 'SplitDividerRight',
    tags: ['product', 'icon'],
    ethos: 'label · divider · icone · cell accent droite',
    Component: SplitDividerRight,
  },
  {
    id: 'split-divider-left',
    file: 'SplitDividerLeft',
    tags: ['product', 'icon'],
    ethos: 'icone · divider · label · lecture action+contexte',
    Component: SplitDividerLeft,
  },
  {
    id: 'kbd-shortcut',
    file: 'KbdShortcut',
    tags: ['technical', 'product'],
    ethos: 'label + puce clavier ⌘K · pattern command',
    Component: KbdShortcut,
  },
  {
    id: 'bracket-annotated',
    file: 'BracketAnnotated',
    tags: ['editorial', 'technical'],
    ethos: "crochets typographiques qui s'écartent au hover",
    Component: BracketAnnotated,
  },
  {
    id: 'rotating-arrow',
    file: 'RotatingArrow',
    tags: ['organic', 'animated'],
    ethos: 'flèche rotate -45° · geste discret',
    Component: RotatingArrow,
  },
  {
    id: 'neon-outline',
    file: 'NeonOutline',
    tags: ['luxe', 'technical'],
    ethos: 'bordure accent · halo néon doux au hover',
    Component: NeonOutline,
  },
];

export function ButtonsSection() {
  return (
    <Section number="03" title="buttons">
      <p className="text-muted mb-6 max-w-2xl text-sm leading-relaxed md:text-base">
        Vingt-et-un boutons « signature » avec tags. Chaque specimen a une vibe déclarée ({' '}
        <span className="font-mono text-xs">#brutalist</span>,{' '}
        <span className="font-mono text-xs">#editorial</span>,{' '}
        <span className="font-mono text-xs">#minimal</span>…) — tu peux me dire{' '}
        <span className="italic">
          « prends un <span className="font-mono text-xs">#luxe</span> pour ce site »
        </span>{' '}
        et je filtre. Vocabulaire complet dans{' '}
        <span className="font-mono text-xs">src/workbench/playground/tags.ts</span>.
      </p>

      {/* ─── Specimens — 2-col grid on lg+ for visual density ───── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {SPECIMENS.map(({ id, file, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={`${BASE_PATH}/${file}`} tags={tags} ethos={ethos}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>

      {/* ─── Core atom ─────────────────────────────────── */}
      <h3 className="text-fg mt-14 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atom (src/components/ui/Button)
      </h3>
      <div className="space-y-8">
        <div>
          <SubLabel>variants</SubLabel>
          <div className="space-y-3">
            {(
              [
                ['primary', 'bg-accent, glow hover'],
                ['secondary', 'glass border, accent hover'],
                ['ghost', 'transparent, text-only'],
                ['danger', 'glass red, destructive'],
              ] as const
            ).map(([variant, desc]) => (
              <div
                key={variant}
                className="border-border/50 hover:border-accent/20 duration-base flex flex-wrap items-center gap-4 rounded-lg border p-4 transition-[border-color]"
              >
                <Button variant={variant}>{variant}</Button>
                <Copyable text={`variant="${variant}"`} />
                <span className="text-muted text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SubLabel>sizes</SubLabel>
          <div className="space-y-3">
            {(
              [
                ['sm', 'px-3 py-1.5 text-sm'],
                ['md', 'px-4 py-2 text-base'],
                ['lg', 'px-6 py-3 text-lg'],
              ] as const
            ).map(([size, classes]) => (
              <div
                key={size}
                className="border-border/50 hover:border-accent/20 duration-base flex flex-wrap items-center gap-4 rounded-lg border p-4 transition-[border-color]"
              >
                <Button size={size}>{size}</Button>
                <Copyable text={`size="${size}"`} />
                <Copyable text={classes} />
              </div>
            ))}
            <div className="border-border/50 hover:border-accent/20 duration-base flex flex-wrap items-center gap-4 rounded-lg border p-4 transition-[border-color]">
              <Button size="icon" aria-label="icon button">
                <Plus size={20} strokeWidth={1.5} aria-hidden="true" />
              </Button>
              <Copyable text='size="icon"' />
              <span className="text-muted text-xs">h-10 w-10</span>
            </div>
          </div>
        </div>

        <div>
          <SubLabel>states</SubLabel>
          <div className="flex flex-wrap gap-3">
            <Button isLoading>loading</Button>
            <Button disabled>disabled</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
