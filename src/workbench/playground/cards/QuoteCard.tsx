/** Quote card — citation en exergue + attribution. Éditorial. */
export function QuoteCard() {
  return (
    <article className="border-border/60 from-surface/60 to-bg w-full max-w-sm rounded-xl border bg-gradient-to-br p-6 md:p-8">
      <span className="text-accent-text font-mono text-5xl leading-none">“</span>
      <blockquote className="text-fg mt-2 text-lg leading-snug font-medium tracking-tight italic md:text-xl">
        On a cessé de chercher des clients. Ils viennent parce que nos sites tiennent la distance.
      </blockquote>
      <footer className="border-border/60 mt-5 flex items-center gap-3 border-t pt-4">
        <div className="bg-accent/30 h-8 w-8 shrink-0 rounded-full" aria-hidden />
        <div>
          <p className="text-fg text-sm font-semibold tracking-tight">Anne-Sophie Reymond</p>
          <p className="text-muted font-mono text-[10px] tracking-wider uppercase">
            Fondatrice · Atelier Grise
          </p>
        </div>
      </footer>
    </article>
  );
}
