/** Luxe organic hero — visual backdrop (placeholder video/image) + overlay
 *  typographique. Idéal portfolios, hôtels, marques lifestyle. */
export function BackdropOverlay() {
  return (
    <section className="bg-bg relative min-h-[60vh] overflow-hidden px-6 py-16 md:min-h-[70vh] md:px-10 md:py-24">
      {/* Backdrop — imagine a video, here a gradient placeholder */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,color-mix(in_srgb,var(--color-accent)_30%,transparent)_0%,transparent_55%),linear-gradient(180deg,color-mix(in_srgb,var(--color-info)_25%,var(--color-surface))_0%,var(--color-bg)_100%)]"
      />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />

      <div className="relative mx-auto flex min-h-full max-w-400 flex-col justify-end">
        <span className="text-accent-text font-mono text-[10px] tracking-[0.3em] uppercase">
          Un lieu · Les Grangettes
        </span>
        <h2 className="text-fg mt-4 max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight md:text-6xl lg:text-7xl">
          Vivre là où
          <br />
          <span className="italic">le lac s'arrête</span> de bouger.
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="bg-fg/90 text-bg hover:bg-fg duration-base rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight backdrop-blur-sm transition-colors"
          >
            Réserver un séjour
          </button>
          <button
            type="button"
            className="text-fg hover:text-accent-text duration-base bg-bg/30 border-border/60 rounded-full border px-5 py-2.5 text-sm font-medium tracking-tight backdrop-blur-sm transition-colors"
          >
            Visite virtuelle
          </button>
        </div>
      </div>
    </section>
  );
}
