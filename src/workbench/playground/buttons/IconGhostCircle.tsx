import { ArrowUpRight } from 'lucide-react';

/** Minimal icon button — round, ghost border, accent on hover. */
export function IconGhostCircle() {
  return (
    <button
      type="button"
      aria-label="Open link"
      className="border-border/70 text-fg hover:border-accent hover:text-accent-text focus-visible:ring-accent group duration-base focus-visible:ring-offset-bg inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <ArrowUpRight
        size={18}
        strokeWidth={1.75}
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
