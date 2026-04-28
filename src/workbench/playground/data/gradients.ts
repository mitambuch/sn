import type { TagList } from '../tags';

export type GradientEntry = {
  id: string;
  tags: TagList;
  ethos: string;
  /** Tailwind arbitrary-value bg class string (copyable, ready to paste). */
  classes: string;
};

/** All gradients use design tokens via `var(--color-*)` so they follow
 *  dark / light theme changes automatically. */
export const GRADIENTS: readonly GradientEntry[] = [
  {
    id: 'accent-fade-br',
    tags: ['product', 'accent'],
    ethos: 'accent → bg diagonal · signature CTA',
    classes: 'bg-[linear-gradient(135deg,var(--color-accent)_0%,var(--color-bg)_100%)]',
  },
  {
    id: 'warm-glow',
    tags: ['luxe', 'accent'],
    ethos: 'radial accent doux · hero discret',
    classes:
      'bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--color-accent)_55%,transparent)_0%,var(--color-bg)_70%)]',
  },
  {
    id: 'cool-night',
    tags: ['technical', 'organic'],
    ethos: 'info → bg · mood nocturne',
    classes:
      'bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-info)_40%,var(--color-bg))_0%,var(--color-bg)_100%)]',
  },
  {
    id: 'editorial-warmth',
    tags: ['editorial'],
    ethos: 'warning → danger · palette chaude',
    classes:
      'bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-warning)_70%,var(--color-bg))_0%,color-mix(in_srgb,var(--color-danger)_70%,var(--color-bg))_100%)]',
  },
  {
    id: 'soft-mono',
    tags: ['minimal'],
    ethos: 'fg/5 → transparent · surélévation sobre',
    classes:
      'bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-fg)_8%,transparent)_0%,transparent_100%)]',
  },
  {
    id: 'neon-rim',
    tags: ['technical', 'playful'],
    ethos: 'accent + info · trois-stops horizontal',
    classes:
      'bg-[linear-gradient(90deg,var(--color-accent)_0%,var(--color-bg)_50%,var(--color-info)_100%)]',
  },
  {
    id: 'surface-stack',
    tags: ['minimal', 'product'],
    ethos: 'surface → bg · carte élevée',
    classes: 'bg-[linear-gradient(180deg,var(--color-surface)_0%,var(--color-bg)_100%)]',
  },
  {
    id: 'radial-spot',
    tags: ['luxe'],
    ethos: 'halo accent top-left · lumineux',
    classes:
      'bg-[radial-gradient(circle_at_15%_15%,color-mix(in_srgb,var(--color-accent)_40%,transparent)_0%,transparent_40%),linear-gradient(180deg,var(--color-surface)_0%,var(--color-bg)_100%)]',
  },
  {
    id: 'accent-mesh',
    tags: ['playful', 'accent'],
    ethos: 'mesh multi-radial · décor énergique',
    classes:
      'bg-[radial-gradient(at_20%_20%,color-mix(in_srgb,var(--color-accent)_35%,transparent)_0%,transparent_50%),radial-gradient(at_80%_30%,color-mix(in_srgb,var(--color-info)_30%,transparent)_0%,transparent_50%),radial-gradient(at_50%_80%,color-mix(in_srgb,var(--color-success)_25%,transparent)_0%,transparent_50%),var(--color-bg)]',
  },
  {
    id: 'conic-spectrum',
    tags: ['playful', 'technical'],
    ethos: 'conic accent · éditorial ludique',
    classes:
      'bg-[conic-gradient(from_0deg_at_50%_50%,var(--color-accent),var(--color-info),var(--color-success),var(--color-warning),var(--color-accent))]',
  },
];
