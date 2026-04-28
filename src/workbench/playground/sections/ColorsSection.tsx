import { cn } from '@utils/cn';

import { COLOR_TOKENS, GRADIENTS } from '../data';
import { Copyable, Section, SpecimenFrame, Swatch } from '../shared';

export function ColorsSection() {
  return (
    <Section number="02" title="colors & gradients">
      <p className="text-muted mb-6 max-w-2xl text-sm leading-relaxed md:text-base">
        Dix tokens couleur et dix gradients tous construits sur{' '}
        <span className="font-mono text-xs">var(--color-*)</span> — ils suivent le light/dark mode
        automatiquement. Le vocabulaire <span className="font-mono text-xs">#brutalist</span> /{' '}
        <span className="font-mono text-xs">#luxe</span> / etc. s'applique aussi aux gradients pour
        matcher la vibe du site.
      </p>

      {/* ─── Tokens ─────────────────────────────────── */}
      <h3 className="text-fg mt-4 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">
        · tokens
      </h3>
      <div className="grid gap-3 lg:grid-cols-2">
        {COLOR_TOKENS.map(swatch => (
          <Swatch key={swatch.token} {...swatch} />
        ))}
      </div>

      {/* ─── Gradients ─────────────────────────────────── */}
      <h3 className="text-fg mt-12 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">
        · gradients
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {GRADIENTS.map(({ id, tags, ethos, classes }) => (
          <SpecimenFrame key={id} id={id} path={classes} tags={tags} ethos={ethos} centered={false}>
            <div
              className={cn('border-border/40 h-40 w-full rounded-lg border', classes)}
              aria-label={`${id} gradient preview`}
              role="img"
            />
          </SpecimenFrame>
        ))}
      </div>

      {/* Inline tip */}
      <div className="border-border/50 bg-surface/30 mt-6 rounded-lg border px-4 py-3">
        <p className="text-muted text-xs leading-relaxed">
          <span className="text-accent-text font-mono tracking-wider uppercase">tip</span> Copie la
          classe Tailwind dans le footer du cadre et colle-la sur un conteneur. Les gradients
          utilisent{' '}
          <Copyable text="color-mix(in srgb, var(--color-X) NN%, transparent)" className="inline" />{' '}
          pour les mix — compatibles Safari 16.4+ / Chrome 111+.
        </p>
      </div>
    </Section>
  );
}
