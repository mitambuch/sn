import { ShoppingBag } from 'lucide-react';

/** Product card — visual + titre + prix + CTA. E-commerce / shop / catalogue. */
export function ProductCard() {
  return (
    <article className="border-border/60 bg-surface/40 group w-full max-w-sm overflow-hidden rounded-xl border transition-shadow hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,color-mix(in_srgb,var(--color-warning)_30%,transparent)_0%,var(--color-bg)_70%)]">
        <span className="bg-bg/90 text-fg absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase">
          Nouveau
        </span>
        <span className="bg-accent text-on-accent absolute top-3 right-3 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider uppercase">
          -20%
        </span>
      </div>
      <div className="p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="text-fg min-w-0 truncate text-base font-semibold tracking-tight">
            Céramique · No. 14
          </h4>
          <p className="text-muted text-[10px] tracking-[0.15em] uppercase">Grès émaillé</p>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-fg text-lg font-bold tracking-tight">€120</span>
            <span className="text-muted text-sm line-through">€150</span>
          </div>
          <button
            type="button"
            aria-label="Ajouter au panier"
            className="bg-fg text-bg hover:bg-fg/90 duration-base inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors"
          >
            <ShoppingBag size={12} strokeWidth={2.5} />
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
