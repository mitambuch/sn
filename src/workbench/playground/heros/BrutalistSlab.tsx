import { ArrowRight } from 'lucide-react';

/** Brutalist hero — oversized wordmark + thick divider + single CTA.
 *  Impact direct, zéro bruit, tout se joue sur l'échelle du type. */
export function BrutalistSlab() {
  return (
    <section className="bg-bg border-border border-b-2 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-400">
        <span className="text-accent-text font-mono text-[10px] tracking-[0.3em] uppercase">
          Studio · 2026
        </span>
        <h2 className="text-fg mt-4 text-5xl leading-[0.9] font-bold tracking-tighter uppercase md:text-7xl lg:text-8xl">
          On construit
          <br />
          pour durer.
        </h2>
        <div className="bg-fg mt-8 h-1 w-24" />
        <p className="text-muted mt-6 max-w-lg text-base leading-relaxed md:text-lg">
          Identité visuelle, sites sur-mesure, systèmes de design. Une pratique lente, une approche
          brute, des résultats tenus.
        </p>
        <button
          type="button"
          className="bg-fg text-bg hover:bg-fg/90 duration-base mt-8 inline-flex items-center gap-2 px-6 py-4 text-sm font-black tracking-widest uppercase transition-colors"
        >
          Commencer un projet
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}
