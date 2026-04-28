/** Editorial — italic, minimal, thin baseline underline for elegance. */
export function ItalicSerif() {
  return (
    <button
      type="button"
      className="text-fg hover:text-accent-text focus-visible:ring-accent group focus-visible:ring-offset-bg inline-flex items-baseline gap-1 border-b border-current pb-0.5 text-lg font-medium tracking-tight italic transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Lire la suite
      <span
        aria-hidden
        className="not-italic transition-transform duration-300 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </button>
  );
}
