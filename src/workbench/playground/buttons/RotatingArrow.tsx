import { ArrowRight } from 'lucide-react';

/** Organic — arrow rotates 45° on hover, subtle gesture. */
export function RotatingArrow() {
  return (
    <button
      type="button"
      className="bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent focus-visible:ring-offset-bg group duration-base inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Explorer
      <ArrowRight
        size={14}
        strokeWidth={2.5}
        className="duration-base transition-transform group-hover:rotate-[-45deg]"
      />
    </button>
  );
}
