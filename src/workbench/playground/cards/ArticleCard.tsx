/** Article card — visual + titre + excerpt. Feel magazine / journal. */
export function ArticleCard() {
  return (
    <article className="group w-full max-w-sm">
      <div className="border-border/60 aspect-[4/3] overflow-hidden rounded-xl border bg-[radial-gradient(ellipse_at_30%_30%,color-mix(in_srgb,var(--color-accent)_35%,transparent)_0%,var(--color-surface)_70%)]">
        <div className="flex h-full items-end p-4">
          <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
            Photo · J. Mercier
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-accent-text font-mono text-[10px] tracking-[0.25em] uppercase">
          Essai · 8 min
        </span>
        <span className="text-muted font-mono text-[10px] tracking-[0.15em] uppercase">
          12 avr. 2026
        </span>
      </div>
      <h3 className="text-fg group-hover:text-accent-text duration-base mt-2 text-xl leading-tight font-semibold tracking-tight transition-colors md:text-2xl">
        Construire lentement, et d'autres méthodes démodées.
      </h3>
      <p className="text-muted mt-2 text-sm leading-relaxed">
        Sur la valeur de ne pas livrer vite, et ce qu'on gagne à laisser un projet décanter quelques
        semaines avant de le finir.
      </p>
    </article>
  );
}
