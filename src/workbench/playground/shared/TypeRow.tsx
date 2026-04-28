import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

import { Copyable } from './Copyable';

interface TypeRowProps {
  /** Stable identifier you can reference in conversation ("apply `h1` to section X"). */
  id: string;
  /** Full Tailwind class string — copyable, directly usable in code. */
  classes: string;
  /** Computed size label ("mobile → desktop"). */
  size: string;
  /** Color token the class string applies. */
  color: string;
  /** Optional line-height label ("1.2" / "leading-relaxed"). */
  lineHeight?: string;
  /** Sample content rendered with the actual classes. */
  children: ReactNode;
}

/** Full-width type-specimen row. Shows id, live preview, size, color,
 *  copyable class string. One row = one nameable style in the system. */
export function TypeRow({ id, classes, size, color, lineHeight, children }: TypeRowProps) {
  return (
    <article className="border-border/60 bg-bg rounded-lg border">
      <header className="border-border/50 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b px-4 py-3 md:px-6">
        <span className="text-accent-text font-mono text-[10px] tracking-[0.25em] uppercase">
          {id}
        </span>
        <span className="text-muted font-mono text-[10px] tracking-wider">{size}</span>
        {lineHeight && (
          <span className="text-muted font-mono text-[10px] tracking-wider">lh {lineHeight}</span>
        )}
        <span className="text-muted font-mono text-[10px] tracking-wider">{color}</span>
        <Copyable text={classes} className="ml-auto" />
      </header>

      <div className="px-4 py-6 md:px-6 md:py-8">
        <p className={cn(classes)}>{children}</p>
      </div>
    </article>
  );
}
