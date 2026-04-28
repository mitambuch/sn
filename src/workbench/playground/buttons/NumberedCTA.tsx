import { ArrowRight } from 'lucide-react';

/** Editorial — numbered marker + arrow, large & anchored. */
export function NumberedCTA() {
  return (
    <button
      type="button"
      className="text-fg hover:text-accent-text focus-visible:ring-accent group focus-visible:ring-offset-bg inline-flex items-baseline gap-3 border-b-2 border-current pb-1 font-mono text-sm tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span className="text-accent-text font-mono text-[10px] tracking-[0.3em] uppercase">01</span>
      <span className="font-semibold">Nous contacter</span>
      <ArrowRight
        size={14}
        strokeWidth={2}
        className="duration-base transition-transform group-hover:translate-x-1"
      />
    </button>
  );
}
