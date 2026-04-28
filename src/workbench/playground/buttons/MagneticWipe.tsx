/** Luxe — accent color wipes left-to-right on hover, elegant fill. */
export function MagneticWipe() {
  return (
    <button
      type="button"
      className="border-fg text-fg hover:text-on-accent focus-visible:ring-accent group focus-visible:ring-offset-bg relative inline-flex items-center justify-center overflow-hidden rounded-full border px-7 py-3 text-sm font-semibold tracking-tight transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span
        aria-hidden
        className="bg-accent absolute inset-0 -translate-x-full transition-transform duration-500 group-hover:translate-x-0"
      />
      <span className="relative z-10">Commencer</span>
    </button>
  );
}
