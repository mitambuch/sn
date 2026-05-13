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
    b: '#1f1f1f',
    c: '#080808',
  },
  light: {
    a: '#f4f4f4',
    b: '#cfcfcf',
    c: '#ededed',
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
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
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
          <feDisplacementMap in="SourceGraphic" scale="32" />
        </filter>
      </defs>
      <rect
        x="0"
        y="0"
        width="400"
        height="240"
        fill={`url(#${gradId})`}
        filter={`url(#${filterId})`}
      />
    </svg>
  );
};
