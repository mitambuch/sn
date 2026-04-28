/** Minimal — no chrome, animated underline reveals right-to-left on hover. */
export function UnderlineOnly() {
  return (
    <button
      type="button"
      className="text-fg focus-visible:ring-accent group focus-visible:ring-offset-bg relative inline-flex items-center py-1 text-sm font-medium tracking-tight focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Read the story
      <span
        aria-hidden
        className="bg-fg absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
      />
    </button>
  );
}
