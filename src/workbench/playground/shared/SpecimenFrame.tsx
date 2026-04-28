import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

import type { TagList } from '../tags';
import { Copyable } from './Copyable';

interface SpecimenFrameProps {
  /** Stable identifier — you can cite it in conversation. */
  id: string;
  /** Import path (copyable). */
  path: string;
  /** 1-3 tags describing the specimen's style/behavior. */
  tags: TagList;
  /** Human-readable one-liner describing the specimen. */
  ethos: string;
  children: ReactNode;
  /** Center the preview area (default true). */
  centered?: boolean;
  /** Make the preview area have generous height for hover interactions. */
  tall?: boolean;
}

/** Labeled frame for a component specimen. Header shows id + tags +
 *  copyable path. Body renders the live component. Used by buttons,
 *  menus, sections, etc. */
export function SpecimenFrame({
  id,
  path,
  tags,
  ethos,
  children,
  centered = true,
  tall = false,
}: SpecimenFrameProps) {
  return (
    <article className="border-border/60 bg-bg overflow-hidden rounded-xl border">
      <header className="border-border/50 bg-surface/40 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b px-4 py-3 md:px-6">
        <span className="text-accent-text font-mono text-[11px] tracking-[0.25em] uppercase">
          {id}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-surface text-muted border-border/50 inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-muted font-mono text-[10px] tracking-[0.15em] max-md:basis-full md:ml-auto">
          {ethos}
        </p>
      </header>

      <div
        className={cn(
          'bg-bg flex px-4 py-8 md:px-6 md:py-10',
          centered && 'items-center justify-center',
          tall && 'min-h-40',
        )}
      >
        {children}
      </div>

      <footer className="border-border/50 bg-surface/20 flex items-center justify-end border-t px-4 py-2 md:px-6">
        <Copyable text={path} />
      </footer>
    </article>
  );
}
