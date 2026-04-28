/** Editorial hero — split 2-col : wordstack à gauche, visuel/placeholder à
 *  droite. Lecture magazine, calme et assumé. */
export function EditorialSplit() {
  return (
    <section className="bg-bg px-6 py-12 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-400 gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-12 lg:gap-20">
        {/* Text column */}
        <div>
          <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
            Vol. IX — Printemps
          </span>
          <h2 className="text-fg mt-3 text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl lg:text-6xl">
            Une maison
            <br />
            <span className="italic">pour voir plus</span> loin,
            <br />
            pour dire plus juste.
          </h2>
          <p className="text-muted mt-6 max-w-md text-lg leading-relaxed">
            Nous écrivons, nous éditons, nous publions. Depuis Lausanne, avec lenteur, pour des
            marques qui pensent encore.
          </p>
          <div className="mt-8 flex flex-wrap items-baseline gap-6">
            <button
              type="button"
              className="text-fg hover:text-accent-text duration-base border-b-2 border-current pb-1 text-sm font-semibold tracking-[0.15em] uppercase transition-colors"
            >
              Lire le numéro
            </button>
            <button
              type="button"
              className="text-muted hover:text-fg duration-base text-sm italic transition-colors"
            >
              Nous contacter →
            </button>
          </div>
        </div>

        {/* Visual column */}
        <div className="border-border/60 aspect-[4/5] overflow-hidden rounded-lg border bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--color-accent)_40%,transparent)_0%,var(--color-surface)_70%)]">
          <div className="flex h-full items-end p-6">
            <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
              Photo · J. Mercier
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
