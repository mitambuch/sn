import { ArrowUpRight, Download } from 'lucide-react';

/** Product — double icon flanking the label, both react on hover. */
export function DualIcon() {
  return (
    <button
      type="button"
      className="border-border/60 bg-surface/50 text-fg hover:border-accent/40 hover:bg-surface hover:text-accent-text focus-visible:ring-accent group focus-visible:ring-offset-bg inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <Download size={14} strokeWidth={2} />
      Download guide
      <ArrowUpRight
        size={14}
        strokeWidth={2}
        className="text-muted group-hover:text-accent-text duration-base transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
