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
    className={cn('mb-12 grid grid-cols-1 gap-6 md:mb-16 md:grid-cols-[1fr_auto]', className)}
  >
    <div className="max-w-3xl">
      <div className="flex items-center gap-4">
        <p className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
          {index} / {label}
        </p>
        <span className="bg-fg/30 hidden h-px w-16 md:block" aria-hidden="true" />
      </div>
      <h2 className="text-fg mt-5 font-mono text-3xl leading-[1.04] font-semibold tracking-tight uppercase md:mt-6 md:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
    {trailing && <div className="self-end">{trailing}</div>}
  </header>
);
