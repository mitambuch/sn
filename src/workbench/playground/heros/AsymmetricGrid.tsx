/** Technical hero — grid 12-col avec vide intentionnel, repère de composition
 *  visible. Lecture type "design-studio" ou "architecture". */
export function AsymmetricGrid() {
  return (
    <section className="bg-bg relative px-6 py-16 md:px-10 md:py-24">
      {/* Faint grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-fg) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      <div className="relative mx-auto grid max-w-400 grid-cols-12 gap-4 md:gap-6">
        <span className="text-accent-text col-span-12 font-mono text-[10px] tracking-[0.3em] uppercase md:col-span-3">
          01 · Identité
        </span>
        <h2 className="text-fg col-span-12 text-4xl leading-[1.05] font-semibold tracking-tight md:col-span-9 md:col-start-4 md:text-6xl lg:text-7xl">
          Sémantique
          <br />
          <span className="text-muted">des systèmes</span>
          <br />
          de marque.
        </h2>

        <div className="col-span-12 mt-12 md:col-span-5 md:col-start-4 md:mt-16">
          <p className="text-muted text-base leading-relaxed md:text-lg">
            Nous travaillons à la racine — taxonomie, naming, règles de composition. Le visible
            vient après.
          </p>
        </div>

        <div className="col-span-12 mt-6 md:col-span-3 md:col-start-10 md:mt-16">
          <ul className="text-muted space-y-2 font-mono text-xs tracking-wide uppercase">
            <li className="border-border/50 border-t pt-2">
              <span className="text-accent-text">/01</span> Recherche
            </li>
            <li className="border-border/50 border-t pt-2">
              <span className="text-accent-text">/02</span> Nomenclature
            </li>
            <li className="border-border/50 border-t pt-2">
              <span className="text-accent-text">/03</span> Composition
            </li>
            <li className="border-border/50 border-t border-b pt-2 pb-2">
              <span className="text-accent-text">/04</span> Cadrage
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
