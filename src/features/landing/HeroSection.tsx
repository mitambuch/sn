import { MaskedReveal } from '@components/ui/MaskedReveal';
import { WipeButton } from '@components/ui/WipeButton';

const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];

export const HeroSection = () => (
  <section
    id="hero"
    className="border-border relative isolate flex min-h-svh w-full scroll-mt-24 overflow-hidden border-b md:scroll-mt-28"
  >
    <div className="mx-auto flex w-full max-w-400 flex-col px-5 pt-28 pb-6 md:px-6 md:pt-32">
      <div className="flex min-h-[calc(100svh-8.5rem)] flex-col">
        <div className="text-muted flex items-center gap-4 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
          <span>CONCIERGERIE PRIVÉE — SUISSE</span>
          <span className="bg-fg/20 hidden h-px flex-1 md:block" aria-hidden="true" />
        </div>

        <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
          <MaskedReveal immediate>
            <h1
              className="text-fg font-mono font-semibold tracking-tight uppercase"
              style={{ fontSize: 'clamp(3.2rem, 12vw, 10.5rem)', lineHeight: '0.82' }}
            >
              SAW
              <br />
              NEXT
            </h1>
          </MaskedReveal>

          <div className="mt-9 max-w-5xl md:mt-12">
            {[
              'Le véritable luxe ne se mesure pas',
              'uniquement à ce que l’on possède,',
              'mais à ce que l’on vit.',
            ].map((line, index) => (
              <MaskedReveal key={line} immediate delay={140 + index * 90}>
                <p
                  className="text-fg/80 font-mono font-semibold tracking-tight uppercase"
                  style={{ fontSize: 'clamp(1.2rem, 2.65vw, 2.85rem)', lineHeight: '1.06' }}
                >
                  {line}
                </p>
              </MaskedReveal>
            ))}
          </div>

          <MaskedReveal immediate delay={480}>
            <div className="mt-10 flex flex-wrap items-center gap-3 md:mt-12">
              <WipeButton href="#contact" variant="solid">
                Prendre contact
              </WipeButton>
              <WipeButton href="#positionnement" variant="ghost">
                Découvrir la structure
              </WipeButton>
            </div>
          </MaskedReveal>
        </div>

        <div className="border-fg/15 grid grid-cols-1 gap-3 border-t pt-5 md:grid-cols-3 md:gap-8 md:pt-6">
          {PILLARS.map((p, i) => (
            <span
              key={p}
              className="text-fg flex items-baseline gap-4 font-mono text-xs font-semibold tracking-[0.45em] uppercase md:text-sm"
            >
              <span className="text-muted tabular-nums">0{i + 1}</span>
              <span>{p}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
