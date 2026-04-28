import { Button } from '@components/ui/Button';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import type { ReactElement } from 'react';

import { Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

const DualCTA = () => (
  <div className="border-accent/10 bg-accent/2 w-full max-w-3xl rounded-2xl border p-8 text-center md:p-12">
    <h3 className="text-fg text-2xl font-medium md:text-3xl">Prêt à construire ?</h3>
    <p className="text-muted mx-auto mt-3 max-w-md text-sm leading-relaxed md:text-base">
      Démarre gratuitement en moins de 60 secondes ou réserve une démo personnalisée avec un expert.
    </p>
    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Button size="lg">
        Commencer gratuitement
        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="secondary" size="lg">
        Réserver une démo
      </Button>
    </div>
    <p className="text-muted/50 mt-6 font-mono text-xs">
      Essai gratuit · Aucune carte bancaire · Annulable à tout moment
    </p>
  </div>
);

const UrgencyCTA = () => (
  <div className="bg-accent text-on-accent relative w-full max-w-3xl overflow-hidden rounded-2xl p-8 md:p-12">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
        backgroundSize: '4px 4px',
      }}
    />
    <div className="relative">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 font-mono text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
        <Sparkles size={12} strokeWidth={2.5} />
        Offre limitée · 48h
      </span>
      <h3 className="mt-4 text-3xl leading-tight font-black tracking-tight md:text-4xl">
        -30% sur le pack Pro
        <br />
        jusqu'à dimanche soir.
      </h3>
      <p className="mt-3 max-w-md text-sm opacity-90 md:text-base">
        Code automatique au checkout. Annulable, remboursable 14 jours.
      </p>
      <button
        type="button"
        className="bg-bg text-fg hover:bg-bg/90 duration-base mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-tight transition-colors"
      >
        Profiter de l'offre
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  </div>
);

const NewsletterCTA = () => (
  <div className="border-border/60 bg-surface/30 w-full max-w-2xl rounded-2xl border p-6 md:p-10">
    <div className="flex items-start gap-4">
      <div className="bg-accent/15 text-accent-text inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <Mail size={16} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <h3 className="text-fg text-lg font-semibold tracking-tight md:text-xl">
          La lettre du studio
        </h3>
        <p className="text-muted mt-1 text-sm leading-relaxed">
          Un email par mois. Un projet, un apprentissage, une ressource. Zéro spam, désabonnement en
          un clic.
        </p>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="ton@email.com"
            aria-label="Adresse email"
            className="border-border/60 bg-bg text-fg focus:border-accent/50 duration-base flex-1 rounded-full border px-4 py-2 text-sm transition-colors outline-none"
          />
          <button
            type="submit"
            className="bg-fg text-bg hover:bg-fg/90 duration-base rounded-full px-5 py-2 text-sm font-semibold tracking-tight transition-colors"
          >
            S'inscrire
          </button>
        </form>
        <p className="text-muted mt-2 font-mono text-[10px] tracking-wider">
          1 842 abonnés · dernier envoi il y a 11 jours
        </p>
      </div>
    </div>
  </div>
);

const SPECIMENS: Specimen[] = [
  {
    id: 'dual-cta',
    path: 'inline · 2 CTAs center',
    tags: ['product', 'accent'],
    ethos: 'demo + gratuit · micro-copy trust en bas',
    Component: DualCTA,
  },
  {
    id: 'urgency-cta',
    path: 'inline · accent full + urgency',
    tags: ['accent', 'playful'],
    ethos: 'promo 48h · accent bg + noise · CTA white',
    Component: UrgencyCTA,
  },
  {
    id: 'newsletter-cta',
    path: 'inline · email form + stats',
    tags: ['editorial', 'product'],
    ethos: 'inscription newsletter · stats subscribers social proof',
    Component: NewsletterCTA,
  },
];

export function CTASection() {
  return (
    <Section number="21" title="call to action">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Atom simple + 3 specimens : dual CTA (démo + gratuit), urgency accent avec promo 48h,
        newsletter avec social proof.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· core atom</h3>
      <div className="border-accent/10 bg-accent/2 mb-10 rounded-2xl border p-8 text-center md:p-12">
        <h3 className="text-fg text-2xl font-medium md:text-3xl">Ready to build something?</h3>
        <p className="text-muted mx-auto mt-3 max-w-md text-sm leading-relaxed md:text-base">
          Start building today. Sign up in seconds and launch your first project in minutes.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg">
            View on GitHub <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="lg">
            Read the docs
          </Button>
        </div>
        <p className="text-muted/50 mt-6 font-mono text-xs">
          Free trial &middot; No credit card required &middot; Cancel anytime
        </p>
      </div>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· specimens</h3>
      <div className="space-y-4">
        {SPECIMENS.map(({ id, path, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={path} tags={tags} ethos={ethos}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
