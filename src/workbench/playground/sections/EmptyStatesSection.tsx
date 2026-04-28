import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { EmptyState } from '@components/ui/EmptyState';
import { CloudOff, FileX, Heart, Inbox, SearchX, Sparkles } from 'lucide-react';
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

/* ─── Specimens ──────────────────────────────────────── */

const NoResults = () => (
  <Card padding="md" className="w-full max-w-sm">
    <EmptyState
      icon={<SearchX size={40} strokeWidth={1} />}
      title="Aucun résultat"
      description="Essaie d'ajuster tes filtres ou ta recherche pour trouver ce que tu cherches."
      action={
        <Button variant="secondary" size="sm">
          Effacer les filtres
        </Button>
      }
    />
  </Card>
);

const EmptyInbox = () => (
  <Card padding="md" className="w-full max-w-sm">
    <EmptyState
      icon={<Inbox size={40} strokeWidth={1} />}
      title="Aucun projet"
      description="Commence par créer ton premier projet. Ça prend moins d'une minute."
      action={<Button size="sm">Créer un projet</Button>}
    />
  </Card>
);

const NetworkError = () => (
  <Card padding="md" className="w-full max-w-sm">
    <EmptyState
      icon={<CloudOff size={40} strokeWidth={1} />}
      title="Connexion perdue"
      description="Vérifie ta connexion internet. On reprendra automatiquement quand tu seras de nouveau en ligne."
      action={
        <Button variant="secondary" size="sm">
          Réessayer
        </Button>
      }
    />
  </Card>
);

const LoadError = () => (
  <Card padding="md" className="w-full max-w-sm">
    <EmptyState
      icon={<FileX size={40} strokeWidth={1} />}
      title="Quelque chose a échoué"
      description="Impossible de charger ce contenu. Réessaie ou contacte le support."
      action={
        <Button variant="danger" size="sm">
          Réessayer
        </Button>
      }
    />
  </Card>
);

const Onboarding = () => (
  <div className="border-accent/40 bg-accent/5 w-full max-w-sm rounded-xl border p-5 md:p-6">
    <div className="bg-accent/20 text-accent-text inline-flex h-10 w-10 items-center justify-center rounded-full">
      <Sparkles size={18} strokeWidth={2} />
    </div>
    <h4 className="text-fg mt-4 text-base font-semibold tracking-tight">Prêt à commencer ?</h4>
    <p className="text-muted mt-1.5 text-sm leading-relaxed">
      Le tutoriel de 3 minutes t'explique les bases. Tu pourras toujours y revenir depuis les
      paramètres.
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      <Button size="sm">Lancer le tutoriel</Button>
      <Button variant="ghost" size="sm">
        Passer
      </Button>
    </div>
  </div>
);

const Favorites = () => (
  <Card padding="md" className="w-full max-w-sm">
    <EmptyState
      icon={<Heart size={40} strokeWidth={1} />}
      title="Rien en favoris"
      description="Clique sur le cœur pour épingler les éléments que tu veux retrouver facilement."
    />
  </Card>
);

const SPECIMENS: Specimen[] = [
  {
    id: 'empty-no-results',
    path: 'inline · search filters',
    tags: ['product'],
    ethos: 'aucun résultat de recherche · CTA clear filters',
    Component: NoResults,
  },
  {
    id: 'empty-inbox',
    path: 'inline · first-time',
    tags: ['product'],
    ethos: 'premier projet · CTA primary création',
    Component: EmptyInbox,
  },
  {
    id: 'empty-network-error',
    path: 'inline · offline',
    tags: ['product'],
    ethos: 'connexion perdue · retry secondary',
    Component: NetworkError,
  },
  {
    id: 'empty-load-error',
    path: 'inline · load failure',
    tags: ['product'],
    ethos: 'chargement échoué · retry danger',
    Component: LoadError,
  },
  {
    id: 'empty-onboarding',
    path: 'inline · first-run tutorial',
    tags: ['product', 'accent'],
    ethos: 'onboarding · halo accent + 2 CTAs',
    Component: Onboarding,
  },
  {
    id: 'empty-favorites',
    path: 'inline · no CTA',
    tags: ['minimal'],
    ethos: "simple message · pas d'action (passive)",
    Component: Favorites,
  },
];

export function EmptyStatesSection() {
  return (
    <Section number="14" title="empty states">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Six états vides pour couvrir les cas courants : aucun résultat, inbox vide première visite,
        connexion perdue, erreur de chargement, onboarding, favoris. Chacun avec son icône + message
        + CTA approprié.
      </p>

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
