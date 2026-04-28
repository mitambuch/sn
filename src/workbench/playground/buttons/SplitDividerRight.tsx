import { ArrowRight } from 'lucide-react';

/** Split button — label left, vertical divider, icon right. Compound action
 *  feel : dropdown-like, but a single button. */
export function SplitDividerRight() {
  return (
    <button
      type="button"
      className="border-fg/30 bg-surface/60 text-fg hover:border-accent/50 hover:bg-surface focus-visible:ring-accent focus-visible:ring-offset-bg group duration-base inline-flex items-stretch overflow-hidden rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span className="px-5 py-2.5 text-sm font-semibold tracking-tight">Book a call</span>
      <span className="bg-border/80 w-px" aria-hidden />
      <span className="bg-accent/10 text-accent-text group-hover:bg-accent group-hover:text-on-accent duration-base flex items-center px-3 transition-colors">
        <ArrowRight size={14} strokeWidth={2.5} />
      </span>
    </button>
  );
}
