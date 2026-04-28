interface ZoneBannerProps {
  label: string;
  title: string;
  description: string;
}

/** Large visual separator marking the two zones of the playground :
 *  CORE (atoms, primitives, foundation to install on every site) vs GRAPHIC
 *  (assembled composition — menus, heros, sections). */
export function ZoneBanner({ label, title, description }: ZoneBannerProps) {
  return (
    <div className="border-accent bg-surface/30 relative overflow-hidden rounded-2xl border-2 px-6 py-10 md:px-10 md:py-14">
      <span className="text-accent-text font-mono text-[11px] tracking-[0.3em] uppercase">
        {label}
      </span>
      <h2 className="text-fg mt-3 text-4xl leading-none font-black tracking-tighter uppercase md:text-6xl lg:text-7xl">
        {title}
      </h2>
      <p className="text-muted mt-4 max-w-xl text-sm leading-relaxed md:text-base">{description}</p>
      <div className="bg-accent mt-6 h-1 w-16" />
    </div>
  );
}
