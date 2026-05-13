// ═══════════════════════════════════════════════════
// MonoGradientPlaceholder — organic monochrome image stand-in
//
// WHAT: Animated SVG to use in place of a missing image inside a Card.
//       Renders a slow-moving organic gradient driven by feTurbulence +
//       feDisplacementMap on a linear gradient. Two tones :
//         - "dark"  → black → graphite → near-black, lives on dark sections
//         - "light" → white → near-white → faint grey, lives on light cards
//       Always monochrome (no chromatic noise) — coherent with the
//       brand identity rule "absence of colour is the identity".
// WHEN: Catalogue teaser cards in Access section, anywhere a real image
//       isn't seeded yet. Decorative — aria-hidden when no alt is given.
// CHANGE TONE: pass tone prop. CHANGE SPEED: edit dur on <animate> below.
// ═══════════════════════════════════════════════════

import { useId } from 'react';

type Tone = 'dark' | 'light';

interface MonoGradientPlaceholderProps {
  tone?: Tone;
  className?: string;
  /** Optional decorative label. Omit to hide from AT (default decorative). */
  alt?: string;
}

const STOPS: Record<Tone, { a: string; b: string; c: string }> = {
  dark: {
    a: '#0a0a0a',
    b: '#222222',
    c: '#080808',
  },
  light: {
    // Light surface placeholder: a noticeable grey shadow zone in the
    // middle reads as an interior depth, not a flat tint. Owner wanted
    // "une ombre grise dedans" pour les box blanches.
    a: '#ededed',
    b: '#8a8a8a',
    c: '#dedede',
  },
};

export const MonoGradientPlaceholder = ({
  tone = 'dark',
  className,
  alt,
}: MonoGradientPlaceholderProps) => {
  const uid = useId().replace(/:/g, '');
  const filterId = `mono-grad-wave-${uid}`;
  const gradId = `mono-grad-stops-${uid}`;
  const stops = STOPS[tone];
  const decorative = alt === undefined;

  return (
    <svg
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={alt}
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={stops.a} />
          <stop offset="55%" stopColor={stops.b} />
          <stop offset="100%" stopColor={stops.c} />
        </linearGradient>
        <filter
          id={filterId}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="1" seed="3">
            <animate
              attributeName="baseFrequency"
              values="0.012 0.018;0.010 0.024;0.016 0.014;0.012 0.018"
              dur="14s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="24" />
        </filter>
      </defs>
      {/* Rect is oversized vs viewBox so the displacement filter never
          pulls pixels from outside the source — kills the black band at
          the bottom that showed up when the gradient stopped exactly at
          the visible edge. SVG's overflow:hidden on the parent clips the
          overhang cleanly. */}
      <rect
        x="-40"
        y="-30"
        width="480"
        height="300"
        fill={`url(#${gradId})`}
        filter={`url(#${filterId})`}
      />
    </svg>
  );
};
