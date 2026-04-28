/** Playful — light sweep animation across the button on hover. */
export function SweepShimmer() {
  return (
    <button
      type="button"
      className="bg-accent text-on-accent focus-visible:ring-accent group focus-visible:ring-offset-bg relative overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span className="relative z-10">Reveal value</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
      />
    </button>
  );
}
