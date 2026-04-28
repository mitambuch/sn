import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

interface BlockProps {
  /** Optional small label at the top-left of the block. */
  label?: string;
  /** Optional meta string at the top-right (e.g. path or variant name). */
  meta?: string;
  children: ReactNode;
  className?: string;
}

/** Lightweight bordered box for wrapping core atom showcases inside a section.
 *  Matches the visual language of SpecimenFrame but without the tags/ethos
 *  header — use when the content is the atom itself (not a tagged variant).
 *  Ensures every part of the playground page is contained in a box. */
export function Block({ label, meta, children, className }: BlockProps) {
  return (
    <article className={cn('border-border/60 bg-bg overflow-hidden rounded-xl border', className)}>
      {(label || meta) && (
        <header className="border-border/50 bg-surface/40 flex flex-wrap items-baseline justify-between gap-3 border-b px-4 py-2.5 md:px-6">
          {label && (
            <span className="text-accent-text font-mono text-[10px] tracking-[0.25em] uppercase">
              {label}
            </span>
          )}
          {meta && (
            <span className="text-muted font-mono text-[10px] tracking-[0.15em]">{meta}</span>
          )}
        </header>
      )}
      <div className="px-4 py-5 md:px-6 md:py-6">{children}</div>
    </article>
  );
}
