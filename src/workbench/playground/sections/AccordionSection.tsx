import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/Accordion';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { Section, SpecimenFrame, SubLabel } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

const NumberedFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    {
      q: 'Combien de temps prend un site ?',
      a: 'Entre 4 et 8 semaines selon le scope. Compte 2 semaines pour la direction, 4-6 pour le build.',
    },
    {
      q: 'Travaillez-vous sur du refactoring ?',
      a: 'Oui quand le code existant est récupérable. Un audit préalable est obligatoire — 2-3 jours.',
    },
    {
      q: 'Quelles langues sont supportées ?',
      a: 'FR par défaut, DE et EN en option. i18next gère nativement les 3 locales.',
    },
  ];
  return (
    <div className="w-full max-w-2xl">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-border/60 border-b">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="text-fg hover:text-accent-text duration-base flex w-full items-center gap-4 py-5 text-left transition-colors"
            >
              <span className="text-accent-text font-mono text-xs tracking-wider tabular-nums">
                0{i + 1}
              </span>
              <span className="flex-1 text-lg font-semibold tracking-tight md:text-xl">
                {item.q}
              </span>
              {isOpen ? <Minus size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
            </button>
            {isOpen && (
              <p className="text-muted pb-5 pl-10 text-sm leading-relaxed md:text-base">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SidebarAccordion = () => {
  const [open, setOpen] = useState<string | null>('design');
  const sections = [
    { key: 'design', label: 'Design', items: ['Tokens', 'Composants', 'Pages'] },
    { key: 'dev', label: 'Développement', items: ['Setup', 'Déploiement', 'CI/CD'] },
    { key: 'content', label: 'Contenu', items: ['CMS', 'Traductions', 'SEO'] },
  ];
  return (
    <nav className="border-border/60 w-full max-w-xs space-y-0.5 rounded-lg border p-2">
      {sections.map(s => {
        const isOpen = open === s.key;
        return (
          <div key={s.key}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : s.key)}
              className="text-fg hover:bg-surface duration-base flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold tracking-tight transition-colors"
            >
              {s.label}
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`duration-base transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <ul className="mt-0.5 ml-3 space-y-0.5">
                {s.items.map(i => (
                  <li key={i}>
                    <button
                      type="button"
                      className="text-muted hover:text-fg hover:bg-surface/50 duration-base w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors"
                    >
                      {i}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
};

const SPECIMENS: Specimen[] = [
  {
    id: 'numbered-faq',
    path: 'inline · editorial FAQ',
    tags: ['editorial'],
    ethos: '01/02/03 · titre large · +/− indicator',
    Component: NumberedFAQ,
  },
  {
    id: 'sidebar-accordion',
    path: 'inline · product sidebar',
    tags: ['product'],
    ethos: 'nav sections collapsibles · chevron rotate',
    Component: SidebarAccordion,
  },
];

export function AccordionSection() {
  return (
    <Section number="17" title="accordion / faq">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Atom Accordion (single/multiple) + 2 specimens : FAQ numérotée éditoriale, accordion sidebar
        product.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· core atom</h3>
      <div className="mb-10 space-y-8">
        <div>
          <SubLabel>single mode (one open at a time)</SubLabel>
          <div className="border-border/50 rounded-lg border px-5">
            <Accordion type="single" defaultOpen="faq-1">
              <AccordionItem value="faq-1">
                <AccordionTrigger>Comment marche l'accordion ?</AccordionTrigger>
                <AccordionContent>
                  En mode single, un seul item ouvert à la fois. Parfait pour les FAQ.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>Est-ce accessible ?</AccordionTrigger>
                <AccordionContent>
                  Oui. aria-expanded, aria-controls, navigation clavier complète.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div>
          <SubLabel>multiple mode (many open)</SubLabel>
          <div className="border-border/50 rounded-lg border px-5">
            <Accordion type="multiple" defaultOpen={['multi-1']}>
              <AccordionItem value="multi-1">
                <AccordionTrigger>Première section</AccordionTrigger>
                <AccordionContent>Plusieurs items ouverts simultanément.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="multi-2">
                <AccordionTrigger>Deuxième section</AccordionTrigger>
                <AccordionContent>Indépendante des autres.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
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
