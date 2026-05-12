// ═══════════════════════════════════════════════════
// SectionTag — terminal-style section label
//
// WHAT: Renders the "↘ 05 / Domaines" eyebrow seen above each landing
//       section heading. Composed of a num token + a dot bullet + a label.
// WHEN: Use at the top of every landing section, before the <h2>.
// CHANGE COLOR: text-muted / text-fg tokens (no local override).
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

interface SectionTagProps {
  /** Section number (e.g. "03"). */
  num: string;
  /** Short label (e.g. "Présentation"). */
  label: string;
  className?: string;
}

/** Section eyebrow tag — terminal-style number + dot + label. */
export const SectionTag = ({ num, label, className }: SectionTagProps) => (
  <span
    className={cn(
      'text-muted inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.12em] uppercase',
      className,
    )}
  >
    <span className="text-fg font-medium">↘ {num}</span>
    <span aria-hidden="true" className="bg-fg inline-block h-[3px] w-[3px] rounded-full" />
    <span>{label}</span>
  </span>
);
