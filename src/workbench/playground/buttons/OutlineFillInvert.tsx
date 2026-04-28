/** Brutalist — outline button whose background fills from bottom on hover,
 *  inverting text color. */
export function OutlineFillInvert() {
  return (
    <button
      type="button"
      className="border-fg text-fg hover:text-bg focus-visible:ring-accent group focus-visible:ring-offset-bg relative inline-flex items-center justify-center overflow-hidden border-2 px-6 py-3 text-sm font-black tracking-widest uppercase transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <span
        aria-hidden
        className="bg-fg absolute inset-x-0 bottom-0 z-0 h-0 transition-[height] duration-300 group-hover:h-full"
      />
      <span className="relative z-10">Declare</span>
    </button>
  );
}
