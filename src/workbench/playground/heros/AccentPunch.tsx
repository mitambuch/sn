import { ArrowRight } from 'lucide-react';

/** Accent hero — full accent background, texte inverse. Agressif, CTA single.
 *  Pour sites de lancement, promo, manifeste. */
export function AccentPunch() {
  return (
    <section className="bg-accent text-on-accent relative overflow-hidden px-6 py-16 md:px-10 md:py-24">
      {/* Texture — subtle noise via radial gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      />

      <div className="relative mx-auto max-w-400">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-80">
          / Manifeste
        </span>
        <h2 className="mt-4 text-5xl leading-[0.95] font-black tracking-tighter md:text-7xl lg:text-8xl">
          Construire
          <br />
          moins.
          <br />
          <span className="italic opacity-75">Mais construire.</span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button
            type="button"
            className="bg-bg text-fg hover:bg-bg/90 duration-base inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-bold tracking-tight transition-colors"
          >
            Rejoindre le studio
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <span className="font-mono text-xs tracking-wider uppercase opacity-80">
            12 places par an · 2026
          </span>
        </div>
      </div>
    </section>
  );
}
