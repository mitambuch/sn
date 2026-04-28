/** Editorial — typographic brackets flank the label, spread open on hover.
 *  Very magazine / code-editor inspired. */
export function BracketAnnotated() {
  return (
    <button
      type="button"
      className="text-fg hover:text-accent-text focus-visible:ring-accent focus-visible:ring-offset-bg group inline-flex items-baseline gap-1 font-mono text-sm font-semibold tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span className="text-accent-text duration-base inline-block transition-transform group-hover:-translate-x-1">
        [
      </span>
      <span>voir les projets</span>
      <span className="text-accent-text duration-base inline-block transition-transform group-hover:translate-x-1">
        ]
      </span>
    </button>
  );
}
