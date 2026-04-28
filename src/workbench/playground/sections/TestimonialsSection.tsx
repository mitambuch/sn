import { Avatar } from '@components/ui/Avatar';
import { Card } from '@components/ui/Card';
import { Quote, Star } from 'lucide-react';
import type { ReactElement } from 'react';

import { TESTIMONIALS } from '../data';
import { Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

const PullQuoteHero = () => (
  <figure className="border-border/60 from-surface/40 to-bg w-full max-w-2xl rounded-xl border bg-linear-to-br p-6 md:p-10">
    <Quote size={32} strokeWidth={1.5} className="text-accent-text" aria-hidden />
    <blockquote className="text-fg mt-4 text-xl leading-snug font-medium tracking-tight italic md:text-2xl lg:text-3xl">
      On a cessé de chercher des clients. Ils viennent parce que nos sites tiennent la distance — et
      parce que le studio livre ce qu'il promet.
    </blockquote>
    <figcaption className="mt-6 flex items-center gap-3">
      <Avatar fallback="AR" size="md" alt="Anne-Sophie Reymond" />
      <div>
        <p className="text-fg text-sm font-semibold tracking-tight">Anne-Sophie Reymond</p>
        <p className="text-muted font-mono text-[10px] tracking-wider uppercase">
          Fondatrice · Atelier Grise
        </p>
      </div>
    </figcaption>
  </figure>
);

const LogoWall = () => {
  const logos = ['HDVA', 'MAISON·R', 'GRISE', 'NORD/OUEST', 'PLUME(S)', 'STUDIO/44'];
  return (
    <div className="w-full max-w-3xl">
      <p className="text-muted mb-5 text-center font-mono text-[10px] tracking-[0.3em] uppercase">
        Ils nous ont fait confiance
      </p>
      <div className="border-border/60 border-y py-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map(name => (
            <li
              key={name}
              className="text-muted hover:text-fg duration-base font-mono text-sm font-bold tracking-widest opacity-80 transition-colors hover:opacity-100"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RatingCard = () => (
  <Card padding="lg" className="w-full max-w-sm">
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill="var(--color-accent)"
          strokeWidth={0}
          className="text-accent"
        />
      ))}
      <span className="text-muted ml-2 font-mono text-[10px] tracking-wider">5.0 · 142 avis</span>
    </div>
    <blockquote className="text-fg mt-4 text-sm leading-relaxed">
      « Réactivité exemplaire. Le studio a livré un site qui a directement doublé mes réservations
      le premier mois. »
    </blockquote>
    <footer className="mt-4 flex items-center gap-3">
      <Avatar src="https://i.pravatar.cc/150?u=rating" alt="Client" size="sm" />
      <div>
        <p className="text-fg text-xs font-semibold tracking-tight">Marc Dubois</p>
        <p className="text-muted font-mono text-[9px] tracking-wider uppercase">
          Restaurateur · HDVA
        </p>
      </div>
    </footer>
  </Card>
);

const SPECIMENS: Specimen[] = [
  {
    id: 'pull-quote-hero',
    path: 'inline · oversized quote + attribution',
    tags: ['editorial', 'luxe'],
    ethos: 'citation hero · 3xl italique · figure/figcaption',
    Component: PullQuoteHero,
  },
  {
    id: 'logo-wall',
    path: 'inline · client logos strip',
    tags: ['product', 'technical'],
    ethos: 'mur de logos · bordures h + wrap · social proof',
    Component: LogoWall,
  },
  {
    id: 'rating-card',
    path: 'inline · 5-star review card',
    tags: ['product'],
    ethos: '5 étoiles + count · avis compact',
    Component: RatingCard,
  },
];

export function TestimonialsSection() {
  return (
    <Section number="19" title="testimonials">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Grille 3-cards (atom) + 3 specimens : pull-quote hero éditorial, logo wall social proof,
        rating card avec étoiles.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atom (3-card grid)
      </h3>
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map(t => (
          <Card key={t.name} padding="lg">
            <div className="flex h-full flex-col">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="var(--color-accent)"
                    strokeWidth={0}
                    className="text-accent"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-muted flex-1 text-sm leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="border-border/50 mt-4 flex items-center gap-3 border-t pt-4">
                <Avatar src={t.avatar} alt={t.name} size="sm" />
                <div>
                  <p className="text-fg text-sm font-medium">{t.name}</p>
                  <p className="text-muted text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· specimens</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {SPECIMENS.map(({ id, path, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={path} tags={tags} ethos={ethos}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
