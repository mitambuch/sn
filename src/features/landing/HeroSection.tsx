import { MaskedReveal } from '@components/ui/MaskedReveal';
import { WipeButton } from '@components/ui/WipeButton';
import { cn } from '@utils/cn';

const PILLARS = ['SUISSE', 'INDÉPENDANT', 'BESPOKE'];

const SIGNALS = [
  { label: 'Cadre', value: 'Confidentiel' },
  { label: 'Réseau', value: 'International' },
  { label: 'Mode', value: 'Sur mesure' },
];

const CASE_LINES = [
  'Haute horlogerie',
  'Off-market',
  'Immobilier',
  'Art & collection',
  'Expériences',
  'Lifestyle',
];

export const HeroSection = () => (
  <section
    id="hero"
    className="border-border relative isolate flex min-h-[100svh] w-full scroll-mt-24 overflow-hidden border-b md:scroll-mt-28"
  >
    <div className="landing-grid absolute inset-0 opacity-65" aria-hidden="true" />
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,var(--color-bg),transparent)]" />

    <div className="mx-auto grid w-full max-w-400 grid-cols-1 gap-8 px-5 pt-28 pb-6 md:px-6 md:pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:gap-12">
      <div className="flex min-h-[calc(100svh-8.5rem)] flex-col">
        <div className="text-muted flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
          <span>BESPOKE CLIENT SERVICES PLATFORM</span>
          <span className="hidden md:inline">CONCIERGERIE PRIVÉE — SUISSE</span>
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

      <aside className="relative flex min-h-[34rem] items-end lg:min-h-[calc(100svh-8.5rem)]">
        <div className="border-fg/15 bg-bg/45 relative w-full overflow-hidden border p-3 shadow-[0_24px_80px_rgb(0_0_0/0.12)] backdrop-blur-sm">
          <div className="landing-diagonal absolute inset-0 opacity-55" aria-hidden="true" />
          <div className="border-fg/10 bg-fg/[0.035] relative min-h-[31rem] overflow-hidden border lg:min-h-[calc(100svh-11rem)]">
            <div className="absolute inset-0">
              <div className="grid h-full grid-cols-6 grid-rows-6">
                {Array.from({ length: 36 }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      'border-fg/10 border-r border-b',
                      index % 7 === 0 && 'bg-fg/[0.045]',
                      index % 11 === 0 && 'bg-bg/45',
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="absolute inset-5 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-6">
                <p className="text-fg/70 max-w-56 font-mono text-[10px] leading-relaxed font-semibold tracking-[0.35em] uppercase">
                  Private access desk
                  <br />
                  Structured intake
                </p>
                <span className="border-fg/20 text-fg border px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.3em] uppercase">
                  Live
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {SIGNALS.map((signal, index) => (
                  <div
                    key={signal.label}
                    className="group border-fg/15 bg-bg/70 relative overflow-hidden border p-4 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span className="bg-fg absolute top-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
                        0{index + 1}
                      </span>
                      <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.25em] uppercase">
                        {signal.label}
                      </span>
                    </div>
                    <p className="text-fg mt-5 font-mono text-lg leading-none font-semibold tracking-tight uppercase md:text-2xl">
                      {signal.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="bg-fg/25 pointer-events-none absolute top-0 bottom-0 left-1/2 w-px animate-[landing-scan-y_7s_ease-in-out_infinite]"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="border-fg/15 bg-bg/90 absolute right-6 bottom-8 left-6 overflow-hidden border backdrop-blur-sm md:left-auto md:w-80">
          <div className="border-fg/10 flex items-center justify-between border-b px-4 py-3">
            <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
              Domaines
            </span>
            <span className="text-fg font-mono text-[10px] font-semibold tracking-[0.35em] uppercase">
              06 actifs
            </span>
          </div>
          <div className="grid grid-cols-1">
            {CASE_LINES.map((line, index) => (
              <span
                key={line}
                className="border-fg/10 text-fg/80 flex items-center justify-between border-b px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.22em] uppercase last:border-b-0"
              >
                {line}
                <span className="text-muted tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  </section>
);
