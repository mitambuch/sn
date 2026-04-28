/** Product — stacked layers give a 3D tactile feel, retracts on active. */
export function PressableStack() {
  return (
    <button
      type="button"
      className="text-on-accent focus-visible:ring-accent focus-visible:ring-offset-bg group relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-1"
    >
      <span
        aria-hidden
        className="bg-accent/40 absolute inset-0 translate-y-1.5 rounded-full blur-[2px] transition-transform duration-150 group-active:translate-y-0"
      />
      <span className="bg-accent absolute inset-0 rounded-full" aria-hidden />
      <span className="relative z-10">Ship it</span>
    </button>
  );
}
