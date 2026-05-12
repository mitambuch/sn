// ═══════════════════════════════════════════════════
// BrandMark — SAW↗NEXT canonical logo render
//
// WHAT: Single source of truth for the SAW↗NEXT brand logo. Renders the
//       wordmark in Geist Mono Variable bold caps with the ↗ glyph vertical
//       offset so the arrow aligns with the cap-height (visually "collée
//       en haut" of the word, not centered at em-middle which is the
//       Geist Mono natural rendering for U+2197).
// WHEN: Use everywhere the logo appears — Header, Footer, Login splash,
//       /logo preview, emails, etc. NEVER write `SAW↗NEXT` inline in JSX.
// CHANGE SIZE: pass `className` with a text-* utility (text-9xl, text-3xl...)
// CHANGE ARROW OFFSET: edit `--brand-arrow-offset` constant below.
//   Default -0.22em pushes ↗ from em-middle to cap-height top (Geist Mono).
// RULE: .claude/memory/decisions/2026-05-12-brand-identity-saw-next.md
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

interface BrandMarkProps {
  /** 'full' renders SAW↗NEXT, 'short' renders S↗N. Default 'full'. */
  variant?: 'full' | 'short';
  className?: string;
}

const ARROW_OFFSET = '-0.09em';

const Arrow = () => (
  <span
    aria-hidden="true"
    className="inline-block font-semibold"
    style={{ transform: `translateY(${ARROW_OFFSET})` }}
  >
    ↗
  </span>
);

/** Canonical SAW↗NEXT logo — never hand-roll the string elsewhere. */
export const BrandMark = ({ variant = 'full', className }: BrandMarkProps) => {
  const ariaLabel = variant === 'full' ? 'SAW NEXT' : 'SN';

  return (
    <span
      aria-label={ariaLabel}
      className={cn('font-mono font-semibold tracking-tight', className)}
    >
      {variant === 'full' ? (
        <>
          SAW
          <Arrow />
          NEXT
        </>
      ) : (
        <>
          S
          <Arrow />N
        </>
      )}
    </span>
  );
};
