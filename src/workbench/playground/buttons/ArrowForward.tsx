import { ArrowRight } from 'lucide-react';

/** Product CTA — arrow slides forward on hover. Solid accent bg. */
export function ArrowForward() {
  return (
    <button
      type="button"
      className="bg-accent text-on-accent hover:bg-accent/90 focus-visible:ring-accent group duration-base focus-visible:ring-offset-bg inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Start a project
      <ArrowRight
        size={16}
        strokeWidth={2.5}
        className="duration-base transition-transform group-hover:translate-x-1"
      />
    </button>
  );
}
