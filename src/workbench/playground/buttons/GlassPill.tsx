/** Minimal — backdrop blur pill with subtle border. */
export function GlassPill() {
  return (
    <button
      type="button"
      className="border-border/60 bg-surface/70 text-fg hover:bg-surface/90 hover:border-accent/40 focus-visible:ring-accent duration-base focus-visible:ring-offset-bg inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium tracking-tight backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Discover
    </button>
  );
}
