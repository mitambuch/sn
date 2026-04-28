/** Minimal hero — display centered, subline, 1-2 CTAs. Respire. */
export function CenteredMinimal() {
  return (
    <section className="bg-bg px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="bg-surface/60 border-border/50 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-wider uppercase">
          <span className="bg-success h-1.5 w-1.5 rounded-full" aria-hidden />
          Disponible en mai
        </span>
        <h2 className="text-fg mt-6 text-4xl leading-[1.1] font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Faire moins,
          <br />
          faire mieux.
        </h2>
        <p className="text-muted mt-5 max-w-md text-base leading-relaxed md:text-lg">
          Un studio d'une seule personne. Huit à douze projets par an. Des sites pensés comme des
          objets, conçus pour tenir.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="bg-fg text-bg hover:bg-fg/90 duration-base rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-colors"
          >
            Voir les projets
          </button>
          <button
            type="button"
            className="text-fg hover:text-accent-text duration-base px-4 py-3 text-sm font-medium tracking-tight transition-colors"
          >
            En savoir plus →
          </button>
        </div>
      </div>
    </section>
  );
}
