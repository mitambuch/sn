/** Technical — 4 corner marks appear on hover, design-tool aesthetic. */
export function CornerTicks() {
  const tick = 'border-accent absolute h-3 w-3 opacity-0 transition-opacity duration-300';
  return (
    <button
      type="button"
      className="text-fg focus-visible:ring-accent group focus-visible:ring-offset-bg relative inline-flex items-center justify-center px-8 py-3 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span
        aria-hidden
        className={`${tick} top-0 left-0 border-t-2 border-l-2 group-hover:opacity-100`}
      />
      <span
        aria-hidden
        className={`${tick} top-0 right-0 border-t-2 border-r-2 group-hover:opacity-100`}
      />
      <span
        aria-hidden
        className={`${tick} bottom-0 left-0 border-b-2 border-l-2 group-hover:opacity-100`}
      />
      <span
        aria-hidden
        className={`${tick} right-0 bottom-0 border-r-2 border-b-2 group-hover:opacity-100`}
      />
      Run query
    </button>
  );
}
