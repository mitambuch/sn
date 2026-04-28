import { ArrowRight } from 'lucide-react';

/** Product hero — claim + stats alignés. Pour SaaS / B2B / agences qui
 *  veulent montrer la traction en premier. */
export function SplitMetrics() {
  return (
    <section className="bg-bg px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-400 gap-10 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
        <div>
          <span className="text-accent-text font-mono text-[10px] tracking-[0.3em] uppercase">
            Plateforme · 2026
          </span>
          <h2 className="text-fg mt-3 text-3xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl">
            L'infra qui sert
            <br />
            vraiment les équipes
            <br />
            <span className="text-accent-text">qui construisent.</span>
          </h2>
          <p className="text-muted mt-5 max-w-lg text-base leading-relaxed md:text-lg">
            Observability + feature flags + data sans le marketing. Auto-hébergé, open-source,
            payable quand on est prêt.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              className="bg-fg text-bg hover:bg-fg/90 duration-base inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold tracking-tight transition-colors"
            >
              Installer en local
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="border-border/70 text-fg hover:border-accent/50 duration-base rounded-lg border px-5 py-3 text-sm font-medium tracking-tight transition-colors"
            >
              Voir les docs
            </button>
          </div>
        </div>

        {/* Metrics column */}
        <dl className="border-border/60 bg-surface/40 grid grid-cols-2 gap-x-6 gap-y-6 rounded-xl border p-6 md:grid-cols-1 md:gap-x-0 md:p-8">
          <Metric value="12k" label="devs actifs" />
          <Metric value="99.99%" label="uptime SLA" />
          <Metric value="€0" label="jusqu'à 5 devs" />
          <Metric value="6 ans" label="d'archive" />
        </dl>
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-fg text-3xl leading-none font-bold tracking-tight md:text-4xl">
        {value}
      </dt>
      <dd className="text-muted mt-1 font-mono text-[10px] tracking-[0.2em] uppercase">{label}</dd>
    </div>
  );
}
