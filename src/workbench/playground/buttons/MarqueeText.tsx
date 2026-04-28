/** Playful — on hover, the text scrolls as a tiny marquee. */
export function MarqueeText() {
  const label = 'View the journal';
  return (
    <button
      type="button"
      className="border-border/60 bg-surface/50 text-fg hover:border-accent/40 focus-visible:ring-accent group focus-visible:ring-offset-bg relative inline-flex items-center overflow-hidden rounded-full border px-5 py-2.5 text-sm font-medium tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span className="flex whitespace-nowrap group-hover:animate-[marquee_6s_linear_infinite]">
        <span className="inline-block pr-8">{label}</span>
        <span className="inline-block pr-8" aria-hidden>
          {label}
        </span>
      </span>
    </button>
  );
}
