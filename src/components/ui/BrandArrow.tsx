// ═══════════════════════════════════════════════════
// BrandArrow — the SAW↗Next signature arrow as a standalone glyph
//
// WHAT: SVG inline arrow extracted from the Logomark — the same shape
//       Geist's display family uses, but as an explicit drawing so it
//       never falls back to a system glyph (Unicode U+2197 renders
//       differently across OS/browser font fallbacks).
// WHEN: Anywhere we need the brand ↗ inline (CTAs, accent in titles,
//       domain hover indicator, end-of-line marker on contact buttons).
//       Always pair with `aria-hidden` since it's decorative; conveying
//       semantics is the surrounding text's job.
// CHANGE COLOR: text-* on parent — SVG inherits via fill=currentColor.
// CHANGE SIZE: width/height via className (h-[1em] keeps it inline-baseline).
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

interface BrandArrowProps {
  className?: string;
}

/** Inline SVG glyph of the SAW Next arrow — same vector as the Logomark middle path. */
export const BrandArrow = ({ className }: BrandArrowProps) => {
  return (
    <svg
      viewBox="0 0 61.56 61.56"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={cn('inline-block h-[0.9em] w-auto fill-current align-[-0.1em]', className)}
    >
      {/* Re-anchored polygon from Logomark (originally 70→132, 2→64 in 203x89 viewBox).
          Translate (-69.96, -1.92) to get 0-anchored coords inside a 62×62 box. */}
      <polygon points="4.68 11.16 42.10 11.16 0 53.16 8.40 61.56 50.30 19.66 50.40 57.00 61.56 45.84 61.56 0 15.96 0 4.68 11.16" />
    </svg>
  );
};
