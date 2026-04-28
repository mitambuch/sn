import { TrendingUp } from 'lucide-react';

/** Stat card — grosse métrique + trend. Pour dashboards / landings produit. */
export function StatCard() {
  return (
    <article className="border-border/60 bg-surface/40 w-full max-w-sm overflow-hidden rounded-xl border">
      <div className="px-5 pt-5 md:px-6 md:pt-6">
        <div className="flex items-start justify-between gap-4">
          <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
            MRR · avril 2026
          </span>
          <span className="bg-success/15 text-success-text inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold">
            <TrendingUp size={10} strokeWidth={2.5} />
            +14.2%
          </span>
        </div>
        <p className="text-fg mt-3 text-4xl leading-none font-bold tracking-tight tabular-nums md:text-5xl">
          €48 217
        </p>
        <p className="text-muted mt-2 text-xs">+ €5 990 vs mars · sur 2 845 clients</p>
      </div>
      {/* Sparkline placeholder */}
      <div className="bg-bg border-border/40 mt-5 flex h-12 items-end gap-0.5 border-t px-5 pt-3 md:px-6">
        {[30, 45, 38, 52, 48, 64, 58, 72, 68, 80, 75, 92].map((h, i) => (
          <span
            key={i}
            className="bg-accent/60 flex-1 rounded-sm"
            style={{ height: `${h}%` }}
            aria-hidden
          />
        ))}
      </div>
    </article>
  );
}
