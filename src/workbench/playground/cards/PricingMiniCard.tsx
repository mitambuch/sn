import { Check } from 'lucide-react';

/** Pricing mini card — plan compact + 3 features + CTA. Alternative à la
 *  pricing-table grande quand il n'y a qu'un plan à mettre en avant. */
export function PricingMiniCard() {
  return (
    <article className="border-accent/40 bg-accent/5 w-full max-w-sm rounded-xl border p-5 shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_8%,transparent)] md:p-6">
      <div className="flex items-baseline justify-between">
        <h4 className="text-fg font-mono text-sm font-medium uppercase">Studio</h4>
        <span className="bg-accent text-on-accent rounded-full px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase">
          Populaire
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-fg text-3xl font-bold tracking-tight tabular-nums">€2 400</span>
        <span className="text-muted text-sm">/ mois</span>
      </div>
      <p className="text-muted mt-2 text-sm">Facturation mensuelle · annulable 30j avant</p>

      <ul className="mt-5 space-y-2">
        {['1 site livré par mois', 'Stack moderne + CMS', 'Support dédié 9-18h'].map(f => (
          <li key={f} className="text-fg flex items-center gap-2 text-sm">
            <Check size={14} strokeWidth={2} className="text-accent-text shrink-0" aria-hidden />
            {f}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="bg-fg text-bg hover:bg-fg/90 duration-base mt-6 w-full rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-colors"
      >
        Commencer
      </button>
    </article>
  );
}
