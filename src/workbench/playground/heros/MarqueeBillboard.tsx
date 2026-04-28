/** Playful hero — un marquee géant traverse le hero. Stoppe au hover.
 *  Impact immédiat, signature. */
export function MarqueeBillboard() {
  const phrase = 'On dessine des choses qui tiennent · ';
  return (
    <section className="bg-bg py-12 md:py-16">
      <div className="group border-border overflow-hidden border-y">
        <div className="flex animate-[marquee_30s_linear_infinite] py-6 whitespace-nowrap group-hover:[animation-play-state:paused] md:py-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={`text-fg inline-block pr-10 text-5xl leading-none font-bold tracking-tighter uppercase md:text-7xl lg:text-8xl ${
                i % 2 === 1 ? 'italic opacity-60' : ''
              }`}
            >
              {phrase}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-400 flex-wrap items-baseline justify-between gap-4 px-6 md:px-10">
        <p className="text-muted max-w-md text-base leading-relaxed">
          Sites sur-mesure pour restaurants, éditeurs, artisans. Studio d'une personne, œuvre
          lentement.
        </p>
        <button
          type="button"
          className="bg-accent text-on-accent hover:bg-accent/90 duration-base rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-colors"
        >
          Prendre rendez-vous →
        </button>
      </div>
    </section>
  );
}
