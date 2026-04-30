// ═══════════════════════════════════════════════════
// Logomark — S↗N monogram, the compact brand signature
//
// WHAT: Renders the SVG monogram inline (S, arrow, N as three paths)
//       with fill=currentColor. Used wherever the full <Wordmark />
//       would be too large.
// WHEN: Top-bar of immersive landing, favicon equivalents, footer
//       end-cap, invite page seal. The 3 paths are addressable by
//       the consumer (data-part="s|arrow|n") if you want to animate
//       a single letter or the arrow on its own.
// CHANGE COLOR: text-* utility on parent → currentColor cascades.
// CHANGE SIZE: width/height via className.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

interface LogomarkProps {
  className?: string;
  ariaLabel?: string;
}

/** Compact S↗N monogram. Aspect ratio ~2.28:1 (203 × 89). */
export const Logomark = ({ className, ariaLabel = 'SAW Next' }: LogomarkProps) => {
  return (
    <svg
      viewBox="0 0 203.04 89.04"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={cn('h-auto w-full fill-current', className)}
    >
      <path
        data-part="s"
        d="M51.06,44.16c-3.88-2.4-9.14-4.48-15.78-6.24-4.8-1.2-8.52-2.4-11.16-3.6-2.64-1.2-4.5-2.56-5.58-4.08-1.08-1.52-1.62-3.44-1.62-5.76,0-3.28,1.2-5.94,3.6-7.98,2.4-2.04,5.64-3.06,9.72-3.06,3.04,0,5.62.64,7.74,1.92,2.12,1.28,3.8,3.06,5.04,5.34,1.24,2.28,2.06,4.98,2.46,8.1l15.24-.72c-.56-5.76-2.06-10.74-4.5-14.94-2.44-4.2-5.78-7.44-10.02-9.72-4.24-2.28-9.36-3.42-15.36-3.42s-11.3,1.04-15.66,3.12c-4.36,2.08-7.68,5.02-9.96,8.82-2.28,3.8-3.42,8.26-3.42,13.38,0,4.56.88,8.34,2.64,11.34,1.76,3,4.48,5.5,8.16,7.5,3.68,2,8.4,3.76,14.16,5.28,5.36,1.44,9.48,2.92,12.36,4.44,2.88,1.52,4.88,3.16,6,4.92,1.12,1.76,1.68,3.84,1.68,6.24,0,2.24-.56,4.16-1.68,5.76-1.12,1.6-2.74,2.8-4.86,3.6-2.12.8-4.7,1.2-7.74,1.2-3.2,0-6.02-.66-8.46-1.98-2.44-1.32-4.4-3.28-5.88-5.88-1.48-2.6-2.5-5.86-3.06-9.78l-15.12.84c.48,6.16,2.04,11.5,4.68,16.02,2.64,4.52,6.26,8.02,10.86,10.5,4.6,2.48,10.02,3.72,16.26,3.72s11.48-1,15.96-3c4.48-2,7.96-4.84,10.44-8.52,2.48-3.68,3.72-7.96,3.72-12.84,0-4.56-.84-8.52-2.52-11.88-1.68-3.36-4.46-6.24-8.34-8.64Z"
      />
      <polygon
        data-part="arrow"
        points="74.64 13.08 112.06 13.08 69.96 55.08 78.36 63.48 120.26 21.58 120.36 58.92 131.52 47.76 131.52 1.92 85.92 1.92 74.64 13.08"
      />
      <polygon
        data-part="n"
        points="188.64 1.92 188.64 63.12 162.84 1.92 146.88 1.92 146.88 87.12 161.28 87.12 161.28 25.92 187.08 87.12 203.04 87.12 203.04 1.92 188.64 1.92"
      />
    </svg>
  );
};
