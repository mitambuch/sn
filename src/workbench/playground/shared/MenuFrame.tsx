import type { ReactNode } from 'react';

import type { TagList } from '../tags';
import { Copyable } from './Copyable';

type Props = {
  name: string;
  path: string;
  ethos: string;
  tags?: TagList;
  children: ReactNode;
};

/** Visually isolated frame for a menu preview. Simulates a "page-top" viewport
 *  inside the playground so the menu looks contextually correct without fighting
 *  the outer page layout. Tags optional but recommended — feeds the shared
 *  vocabulary at src/workbench/playground/tags.ts. */
export function MenuFrame({ name, path, ethos, tags, children }: Props) {
  return (
    <article className="border-border/60 bg-bg overflow-hidden rounded-xl border">
      <header className="border-border/50 bg-surface/40 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b px-4 py-3 md:px-6">
        <h3 className="text-fg text-sm font-medium tracking-tight md:text-base">{name}</h3>
        {tags && tags.length > 0 && (
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
        )}
        <p className="text-muted font-mono text-[10px] tracking-[0.15em] uppercase max-md:basis-full md:ml-auto">
          {ethos}
        </p>
        <Copyable text={path} className="max-md:ml-auto md:ml-0" />
      </header>

      <div className="bg-bg">{children}</div>
    </article>
  );
}
