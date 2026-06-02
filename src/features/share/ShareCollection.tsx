// ═══════════════════════════════════════════════════
// ShareCollection — public view for a multi-fiche share code
//
// WHAT: When one share code links to several fiches, render them as a
//       grid of compact cards (image · type · title · summary) inside the
//       same private "box" as the single-fiche view. Fetches the set from
//       Sanity by _id, with a mock fallback so demos work offline.
// WHEN: SharePage renders this when consumed.docs.length > 1.
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { Card } from '@components/ui/Card';
import { ExpiryCountdown } from '@components/ui/ExpiryCountdown';
import { Image } from '@components/ui/Image';
import { useSanityCollection } from '@hooks/useSanityCollection';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { GROQ_SHARED_FICHES } from '@/lib/sanityQueries';
import {
  getArticle,
  getArtwork,
  getConciergeService,
  getEvent,
  getJourney,
  getProperty,
  getTimepiece,
} from '@/mocks';
import type { ShareableDocType, ShareDocRef } from '@/types/share';

interface CollectionFiche {
  _id: string;
  _type: ShareableDocType;
  slug?: string;
  title?: string;
  summary?: string;
  image?: string;
}

const TYPE_LABEL: Record<ShareableDocType, string> = {
  event: 'Évènement',
  property: 'Propriété',
  timepiece: 'Garde-temps',
  artwork: 'Œuvre',
  journey: 'Voyage',
  conciergeService: 'Service',
  article: 'Actualité',
};

type MockItem =
  | { id?: string; slug?: string; title?: string; summary?: string; images?: { src: string }[] }
  | undefined;

const MOCK_LOOKUP: Record<ShareableDocType, (idOrSlug: string) => MockItem> = {
  event: getEvent,
  property: getProperty,
  timepiece: getTimepiece,
  artwork: getArtwork,
  journey: getJourney,
  conciergeService: getConciergeService,
  article: getArticle,
};

interface ShareCollectionProps {
  docs: ShareDocRef[];
  code: string;
  expiresAt: string | null;
  onExpire: () => void;
}

/** Grid of fiche cards for a one-link-many-fiches share code. */
export const ShareCollection = ({ docs, code, expiresAt, onExpire }: ShareCollectionProps) => {
  const ids = useMemo(() => docs.map(d => d.id), [docs]);

  // Mock fallback — map each ref to its seeded item so the page still
  // renders something when Sanity is unconfigured / empty.
  const fallback = useMemo<CollectionFiche[]>(
    () =>
      docs
        .map(d => {
          const m = MOCK_LOOKUP[d.type]?.(d.id);
          if (!m) return null;
          return {
            _id: m.id ?? d.id,
            _type: d.type,
            ...(m.slug ? { slug: m.slug } : {}),
            ...(m.title ? { title: m.title } : {}),
            ...(m.summary ? { summary: m.summary } : {}),
            ...(m.images?.[0]?.src ? { image: m.images[0].src } : {}),
          } satisfies CollectionFiche;
        })
        .filter((f): f is CollectionFiche => f !== null),
    [docs],
  );

  const { data: fiches } = useSanityCollection<CollectionFiche>({
    query: GROQ_SHARED_FICHES(ids),
    fallback,
  });

  // "Petit sas" — click a card to focus a fiche, ← to return to the grid.
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId !== null ? (fiches.find(f => f._id === activeId) ?? null) : null;

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-fg/10 flex items-center justify-between gap-4 border-b px-6 py-4 md:px-10">
        <Link to="/" aria-label="SAW NEXT" className="inline-flex">
          <BrandMark variant="short" className="text-fg text-base md:text-lg" />
        </Link>
        <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
          Sélection privée · Code {code}
        </span>
      </div>

      {expiresAt && <ExpiryCountdown expiresAt={expiresAt} onExpire={onExpire} />}

      <div className="flex flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        {active ? (
          // ─── Focused fiche ───
          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={() => {
                setActiveId(null);
              }}
              className="text-muted hover:text-fg duration-base inline-flex items-center gap-2 self-start font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
            >
              <span aria-hidden="true">←</span> Retour à la sélection
            </button>
            {active.image && (
              <div className="bg-surface overflow-hidden rounded-lg">
                <Image src={active.image} alt={active.title ?? ''} ratio="16/9" eager />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
                {TYPE_LABEL[active._type]}
              </span>
              <h3 className="font-mono text-2xl leading-tight font-medium tracking-tight uppercase">
                {active.title ?? 'Fiche'}
              </h3>
              {active.summary && <p className="text-muted leading-relaxed">{active.summary}</p>}
            </div>
          </div>
        ) : (
          // ─── Selection grid ───
          <>
            <header className="border-fg/10 flex flex-col gap-3 border-b pb-6">
              <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
                {fiches.length} pièce{fiches.length > 1 ? 's' : ''} sélectionnée
                {fiches.length > 1 ? 's' : ''}
              </span>
              <h2 className="font-mono text-2xl leading-tight font-medium tracking-tight uppercase md:text-3xl">
                Une sélection pour vous
              </h2>
            </header>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {fiches.map(f => (
                <button
                  key={f._id}
                  type="button"
                  onClick={() => {
                    setActiveId(f._id);
                  }}
                  className="focus-visible:ring-accent rounded-card text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Card padding="none" className="overflow-hidden">
                    {f.image ? (
                      <Card.Media src={f.image} alt={f.title ?? ''} ratio="4/3" />
                    ) : (
                      <div className="bg-surface aspect-4/3" />
                    )}
                    <Card.Body>
                      <Card.Eyebrow>{TYPE_LABEL[f._type]}</Card.Eyebrow>
                      <Card.Title>{f.title ?? 'Fiche'}</Card.Title>
                      {f.summary && (
                        <p className="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
                          {f.summary}
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
