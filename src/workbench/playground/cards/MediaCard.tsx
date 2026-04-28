/** Media card — visuel pleine surface + overlay caption. Feel luxe / lifestyle. */
export function MediaCard() {
  return (
    <article className="group relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,color-mix(in_srgb,var(--color-accent)_45%,transparent)_0%,color-mix(in_srgb,var(--color-info)_30%,var(--color-surface))_100%)]" />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />
      {/* Dim overlay at bottom for legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-5 text-white md:p-6">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-90">
          Un lieu · 2026
        </span>

        <div>
          <h3 className="text-2xl leading-[1.05] font-medium tracking-tight md:text-3xl">
            Vivre là où
            <br />
            <span className="italic">le lac s'arrête</span> de bouger.
          </h3>
          <p className="mt-3 max-w-[26ch] text-sm leading-relaxed opacity-90">
            3 suites, 1 jardin. Ouvrant fin avril sur les rives des Grangettes.
          </p>
          <span className="mt-4 inline-block border-b border-white pb-0.5 text-xs font-semibold tracking-[0.2em] uppercase">
            Réserver un séjour
          </span>
        </div>
      </div>
    </article>
  );
}
