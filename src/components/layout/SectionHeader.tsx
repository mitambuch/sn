// ═══════════════════════════════════════════════════
// SectionHeader — uniform section header (GAFHA-pattern)
//
// WHAT: Standard label + title pair used at the top of every landing
//       section. Optional right-aligned link slot for "voir tout"
//       style affordances. Built to enforce a single rhythm across
//       all sections — no more bespoke headers per section.
// WHEN: Every <section> on the landing : hero, positionnement,
//       expertise, méthode, équipe, footer.
// CHANGE PATTERN: edit here, propagates everywhere.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ index, label, title, trailing, className }: SectionHeaderProps) => (
  <header
    className={cn('mb-10 flex flex-wrap items-baseline justify-between gap-4 md:mb-14', className)}
  >
    <div className="max-w-3xl">
      <p className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
        <span className="text-fg/30">{index} / </span>
        {label}
      </p>
      <h2 className="text-fg mt-4 font-mono text-2xl leading-[1.1] font-semibold tracking-tight uppercase md:mt-5 md:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
    {trailing && <div>{trailing}</div>}
  </header>
);
