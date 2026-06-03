// ═══════════════════════════════════════════════════
// SharePage — Public route /share/:code, single Sanity doc viewer
//
// WHAT: Validates the share code via Supabase RPC and renders the linked
//       Sanity document — without any authentication. The recipient sees
//       ONLY this one fiche, no catalogue navigation. When the doc is
//       available in Sanity, the body uses Image + SectionHeader + meta
//       lines for a real premium feel ; when Sanity is offline / empty,
//       falls back to a clean labelled placeholder card.
// WHEN: /share/:code (outside locale tree, no PublicLayout chrome).
// ═══════════════════════════════════════════════════

/* eslint-disable max-lines -- public share page: 7-state machine
   (loading/invalid/not-found/expired/revoked/valid-single/valid-multi) +
   Sanity fetch + mock fallback + share actions. Extracting the single-fiche
   render into its own component is tracked as tech-debt. */

import { BrandMark } from '@components/brand/BrandMark';
import { Card } from '@components/ui/Card';
import { ExpiryCountdown } from '@components/ui/ExpiryCountdown';
import { GalleryGrid } from '@components/ui/GalleryGrid';
import { Image } from '@components/ui/Image';
import { AccessRequestModal } from '@features/access/AccessRequestModal';
import { type CollectionFiche, ShareCollection } from '@features/share/ShareCollection';
import { useSanityItem } from '@hooks/useSanityItem';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { gateEnabled, gateShared } from '@/lib/sanityGate';
import { GROQ_SHARED_FICHE } from '@/lib/sanityQueries';
import { consumeShareCode } from '@/lib/shareCode';
import {
  getArticle,
  getArtwork,
  getConciergeService,
  getEvent,
  getJourney,
  getProperty,
  getTimepiece,
} from '@/mocks';
import type { Article } from '@/types/article';
import type { Artwork } from '@/types/artwork';
import type { ConciergeService } from '@/types/concierge';
import type { Event } from '@/types/event';
import type { Journey } from '@/types/journey';
import type { Property } from '@/types/property';
import {
  type ConsumedShareCode,
  formatShareCode,
  normalizeShareCode,
  SHARE_CODE_DISPLAY_PATTERN,
  type ShareableDocType,
} from '@/types/share';
import type { Timepiece } from '@/types/timepiece';
import { localeStr } from '@/utils/localeString';

type Status = 'loading' | 'valid' | 'invalid-format' | 'not-found' | 'expired' | 'revoked';

interface SharedFiche {
  _type: ShareableDocType;
  _id: string;
  slug?: string;
  title?: string;
  summary?: string;
  description?: string;
  images?: { src: string; alt?: string }[];
  heroImage?: { src?: string; alt?: string };
  // Event specsheet + programme (from Sanity), so the full fiche renders.
  dateMode?: string;
  startsAt?: string;
  dateLabel?: string;
  venue?: string;
  city?: string;
  countryCode?: string;
  capacity?: number;
  allocatedSeats?: number;
  dressCode?: string;
  programme?: { time: string; label: string; description?: string }[];
}

// eslint-disable-next-line max-lines-per-function -- public share page with multi-state machine + Sanity fetch + share actions
export default function SharePage() {
  const { code: rawCode } = useParams<{ code: string }>();
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en' : 'fr';
  const [status, setStatus] = useState<Status>('loading');
  const [consumed, setConsumed] = useState<ConsumedShareCode | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Gate mode: the fiche content is fetched server-side (private dataset)
  // via the validated share code, never directly from Sanity in the browser.
  const [gateFiche, setGateFiche] = useState<SharedFiche | null>(null);
  const [gateCollection, setGateCollection] = useState<CollectionFiche[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!rawCode) {
        if (!cancelled) setStatus('invalid-format');
        return;
      }

      const normalized = normalizeShareCode(rawCode);
      const displayFmt = formatShareCode(normalized);
      if (!SHARE_CODE_DISPLAY_PATTERN.test(displayFmt)) {
        if (!cancelled) setStatus('invalid-format');
        return;
      }

      const result = await consumeShareCode(normalized);
      if (cancelled) return;

      if (!result) {
        setStatus('not-found');
        return;
      }
      setConsumed(result);
      if (result.isValid) {
        // Valid but no resolvable fiche = misconfig → not-found, not a blank page.
        setStatus(result.docs.length > 0 || result.sanityDocId ? 'valid' : 'not-found');
      } else if (result.status === 'revoked') {
        setStatus('revoked');
      } else {
        setStatus('expired');
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [rawCode]);

  // Fetch the Sanity doc once the code is resolved. Falls back to a rich
  // mock dataset (same data the rest of the app uses) when Sanity is
  // empty or unconfigured — keeps the demo flow working even before the
  // owner has run `pnpm sanity:seed:sawnext`.
  const ficheQuery = useMemo(() => {
    if (gateEnabled) return ''; // gate mode resolves the fiche server-side
    if (status !== 'valid') return '';
    if (!consumed?.sanityDocType || !consumed.sanityDocId) return '';
    return GROQ_SHARED_FICHE(consumed.sanityDocType, consumed.sanityDocId);
  }, [status, consumed]);

  // Gate mode: once the code is valid, resolve the fiche(s) server-side.
  useEffect(() => {
    if (!gateEnabled || status !== 'valid' || !rawCode) return;
    let cancelled = false;
    void gateShared<SharedFiche, CollectionFiche>(normalizeShareCode(rawCode), locale).then(res => {
      if (cancelled || !res) return;
      setGateFiche(res.single);
      setGateCollection(res.collection);
    });
    return () => {
      cancelled = true;
    };
  }, [status, rawCode, locale]);

  // Adapt a matching mock item to the SharedFiche shape so the existing
  // render logic stays unchanged. Lookup is by id OR slug (getX helpers
  // tolerate both, see src/mocks/index.ts).
  const mockFallback = useMemo<SharedFiche | null>(() => {
    if (!consumed?.sanityDocType || !consumed.sanityDocId) return null;
    const { sanityDocType, sanityDocId } = consumed;
    const lookup: Record<
      ShareableDocType,
      (slugOrId: string) =>
        | {
            id?: string;
            slug?: string;
            title?: string;
            summary?: string;
            description?: string;
            images?: { src: string; alt?: string }[];
          }
        | undefined
    > = {
      event: getEvent,
      property: getProperty,
      timepiece: getTimepiece,
      artwork: getArtwork,
      journey: getJourney,
      conciergeService: getConciergeService,
      article: getArticle,
    };
    const item = lookup[sanityDocType]?.(sanityDocId);
    if (!item) return null;
    return {
      _type: sanityDocType,
      _id: item.id ?? sanityDocId,
      ...(item.slug ? { slug: item.slug } : {}),
      ...(item.title ? { title: item.title } : {}),
      ...(item.summary ? { summary: item.summary } : {}),
      ...(item.description ? { description: item.description } : {}),
      ...(item.images ? { images: item.images } : {}),
    };
  }, [consumed]);

  const { data: sanityFiche } = useSanityItem<SharedFiche>({
    query: ficheQuery,
    fallback: mockFallback,
  });
  // In gate mode the fiche comes from the server; otherwise from the direct
  // Sanity fetch above (with mock fallback before the dataset is seeded).
  const fiche = gateEnabled ? (gateFiche ?? mockFallback) : sanityFiche;

  // Full raw mock — preserves type-specific fields stripped from
  // SharedFiche (date, capacity, bedrooms, brand, programme, …). Used
  // to build the categorised MetaList + Timeline below.
  type RichMock =
    | ({ _type: 'event' } & Event)
    | ({ _type: 'property' } & Property)
    | ({ _type: 'timepiece' } & Timepiece)
    | ({ _type: 'artwork' } & Artwork)
    | ({ _type: 'journey' } & Journey)
    | ({ _type: 'conciergeService' } & ConciergeService)
    | ({ _type: 'article' } & Article);

  const richMock = useMemo<RichMock | null>(() => {
    if (!consumed?.sanityDocType || !consumed.sanityDocId) return null;
    const { sanityDocType, sanityDocId } = consumed;
    switch (sanityDocType) {
      case 'event': {
        const m = getEvent(sanityDocId);
        return m ? { _type: 'event', ...m } : null;
      }
      case 'property': {
        const m = getProperty(sanityDocId);
        return m ? { _type: 'property', ...m } : null;
      }
      case 'timepiece': {
        const m = getTimepiece(sanityDocId);
        return m ? { _type: 'timepiece', ...m } : null;
      }
      case 'artwork': {
        const m = getArtwork(sanityDocId);
        return m ? { _type: 'artwork', ...m } : null;
      }
      case 'journey': {
        const m = getJourney(sanityDocId);
        return m ? { _type: 'journey', ...m } : null;
      }
      case 'conciergeService': {
        const m = getConciergeService(sanityDocId);
        return m ? { _type: 'conciergeService', ...m } : null;
      }
      case 'article': {
        const m = getArticle(sanityDocId);
        return m ? { _type: 'article', ...m } : null;
      }
      default:
        return null;
    }
  }, [consumed]);

  // Type-aware specsheet — feeds the MetaList. Each entry is a label/
  // value pair displayed in a clean 2-column table on desktop.
  const metaItems = useMemo<{ label: string; value: string }[]>(() => {
    const fmtDate = (iso: string) =>
      new Date(iso).toLocaleDateString('fr-CH', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    const fmtTime = (iso: string) =>
      new Date(iso).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });

    // Real Sanity event → build the specsheet from the fetched fiche
    // (richMock only covers the seeded demo data, never live fiches).
    if (
      consumed?.sanityDocType === 'event' &&
      fiche &&
      (fiche.venue || fiche.startsAt || fiche.dateMode)
    ) {
      const mode = fiche.dateMode ?? 'exact';
      // Coerce every field defensively — a query that didn't flatten a
      // localeString must never reach render as an object (React #31).
      const venue = localeStr(fiche.venue);
      const city = localeStr(fiche.city);
      const countryCode = localeStr(fiche.countryCode);
      const dressCode = localeStr(fiche.dressCode);
      const dateLabel = localeStr(fiche.dateLabel);
      const dateRows =
        mode === 'exact' && fiche.startsAt
          ? [
              { label: 'Date', value: fmtDate(fiche.startsAt) },
              { label: 'Horaire', value: fmtTime(fiche.startsAt) },
            ]
          : [
              {
                label: 'Date',
                value: mode === 'allYear' ? 'Toute l’année' : dateLabel || 'Sur demande',
              },
            ];
      return [
        ...dateRows,
        ...(venue ? [{ label: 'Lieu', value: venue }] : []),
        ...(city
          ? [{ label: 'Ville', value: `${city}${countryCode ? ` · ${countryCode}` : ''}` }]
          : []),
        ...(typeof fiche.capacity === 'number'
          ? [{ label: 'Capacité', value: String(fiche.capacity) }]
          : []),
        ...(typeof fiche.allocatedSeats === 'number'
          ? [{ label: 'Places SAW NEXT', value: String(fiche.allocatedSeats) }]
          : []),
        ...(dressCode ? [{ label: 'Dress code', value: dressCode.replace(/-/g, ' ') }] : []),
      ];
    }

    if (!richMock) return [];

    switch (richMock._type) {
      case 'event': {
        // WHY: year-round / free-text events have no calendar date — show the
        // label instead of "Invalid Date" from a missing startsAt.
        const mode = richMock.dateMode ?? 'exact';
        const dateRows =
          mode === 'exact' && richMock.startsAt
            ? [
                { label: 'Date', value: fmtDate(richMock.startsAt) },
                { label: 'Horaire', value: fmtTime(richMock.startsAt) },
              ]
            : [
                {
                  label: 'Date',
                  value:
                    mode === 'allYear' ? 'Toute l’année' : (richMock.dateLabel ?? 'Sur demande'),
                },
              ];
        return [
          ...dateRows,
          { label: 'Lieu', value: richMock.venue ?? '—' },
          { label: 'Ville', value: `${richMock.city} · ${richMock.countryCode}` },
          { label: 'Capacité', value: String(richMock.capacity) },
          { label: 'Places SAW NEXT', value: String(richMock.allocatedSeats) },
          { label: 'Dress code', value: richMock.dressCode.replace(/-/g, ' ') },
        ];
      }
      case 'property':
        return [
          { label: 'Type', value: richMock.kind.replace(/-/g, ' ') },
          { label: 'Mode', value: richMock.availability.replace(/-/g, ' ') },
          { label: 'Surface', value: `${String(richMock.surfaceSqm)} m²` },
          { label: 'Chambres', value: String(richMock.bedrooms) },
          { label: 'SDB', value: String(richMock.bathrooms) },
          ...(richMock.plotSqm
            ? [{ label: 'Terrain', value: `${String(richMock.plotSqm)} m²` }]
            : []),
          { label: 'Région', value: `${richMock.region} · ${richMock.countryCode}` },
        ];
      case 'timepiece':
        return [
          { label: 'Marque', value: richMock.brand },
          { label: 'Modèle', value: richMock.model },
          { label: 'Référence', value: richMock.reference },
          { label: 'Année', value: String(richMock.year) },
          ...(richMock.caseDiameterMm
            ? [{ label: 'Boîtier', value: `${String(richMock.caseDiameterMm)} mm` }]
            : []),
          { label: 'Matériau', value: richMock.material },
          { label: 'État', value: richMock.condition },
          { label: 'Full set', value: richMock.fullSet ? 'Oui' : 'Non' },
        ];
      case 'artwork': {
        const dims = richMock.dimensions;
        const dimStr = dims
          ? `${String(dims.heightCm)} × ${String(dims.widthCm)}${dims.depthCm ? ` × ${String(dims.depthCm)}` : ''} cm`
          : '';
        return [
          { label: 'Artiste', value: richMock.artistName },
          { label: 'Année', value: String(richMock.year) },
          { label: 'Technique', value: richMock.medium },
          ...(dimStr ? [{ label: 'Dimensions', value: dimStr }] : []),
        ];
      }
      case 'journey':
        return [
          { label: 'Type', value: richMock.kind.replace(/-/g, ' ') },
          { label: 'Destinations', value: richMock.destinations },
          { label: 'Durée', value: `${String(richMock.durationDays)} jours` },
          { label: 'Départ', value: richMock.origin },
        ];
      case 'conciergeService':
        return [
          { label: 'Catégorie', value: richMock.category.replace(/-/g, ' ') },
          ...(richMock.leadTime ? [{ label: 'Délai', value: richMock.leadTime }] : []),
        ];
      case 'article':
        return [
          { label: 'Type', value: richMock.kind.replace(/-/g, ' ') },
          { label: 'Publié le', value: fmtDate(richMock.publishedAt) },
          ...(richMock.readMinutes
            ? [{ label: 'Lecture', value: `${String(richMock.readMinutes)} min` }]
            : []),
        ];
      default:
        return [];
    }
  }, [fiche, richMock, consumed]);

  // Programme : real Sanity fiche first, then the seeded demo mock.
  const programme =
    consumed?.sanityDocType === 'event' && fiche?.programme && fiche.programme.length > 0
      ? fiche.programme
      : richMock?._type === 'event'
        ? richMock.programme
        : null;

  const displayCode = rawCode ? formatShareCode(normalizeShareCode(rawCode)) : '—';
  const heroSrc = fiche?.heroImage?.src ?? fiche?.images?.[0]?.src ?? undefined;
  // Defensive: a fiche field may arrive as a localeString object {fr,en}
  // if a query didn't flatten it — coerce to a plain string everywhere.
  const ficheTitle = localeStr(fiche?.title);
  const ficheSummary = localeStr(fiche?.summary);
  const ficheDescription = localeStr(fiche?.description);

  // Prominent date + place line (events), shown big above the description.
  const isEvent = consumed?.sanityDocType === 'event';
  const heroDate = (() => {
    if (!isEvent) return '';
    const mode = fiche?.dateMode ?? 'exact';
    if (mode === 'exact' && fiche?.startsAt) {
      return new Date(fiche.startsAt).toLocaleDateString('fr-CH', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (mode === 'allYear') return 'Toute l’année';
    return localeStr(fiche?.dateLabel) || 'Sur demande';
  })();
  const heroVenue = isEvent
    ? [localeStr(fiche?.venue), localeStr(fiche?.city)].filter(Boolean).join(' · ')
    : '';

  const heroAlt =
    fiche?.heroImage?.alt ?? fiche?.images?.[0]?.alt ?? (ficheTitle || 'Fiche partagée');

  return (
    <main
      data-theme="light"
      data-landing-dark="false"
      className="bg-bg text-fg relative min-h-screen overflow-hidden px-5 py-16 md:px-12 md:py-24"
    >
      {/* Minimal OG metadata — React 19 hoists these into <head> */}
      <title>{ficheTitle ? `${ficheTitle} — Sawnext` : 'Sawnext — Partage privé'}</title>
      {ficheSummary && <meta name="description" content={ficheSummary} />}
      <meta name="robots" content="noindex, nofollow" />
      <meta
        property="og:title"
        content={ficheTitle ? `${ficheTitle} — Sawnext` : 'Sawnext — Partage privé'}
      />
      {ficheSummary && <meta property="og:description" content={ficheSummary} />}
      {heroSrc && <meta property="og:image" content={heroSrc} />}
      <meta property="og:type" content="website" />

      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {/* ─── Loading state ─── */}
        {status === 'loading' && (
          <div className="text-muted py-12 text-center font-mono text-xs tracking-widest uppercase">
            Vérification du code…
          </div>
        )}

        {/* ─── Error / invalid / expired / revoked — single self-contained Card ─── */}
        {(status === 'invalid-format' ||
          status === 'not-found' ||
          status === 'expired' ||
          status === 'revoked') && (
          <Card padding="lg" className="flex flex-col gap-6">
            <div className="border-fg/10 flex items-center justify-between gap-4 border-b pb-5">
              <Link to="/" aria-label="SAW NEXT" className="inline-flex">
                <BrandMark variant="short" className="text-fg text-base md:text-lg" />
              </Link>
              <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
                Partage privé · Code {displayCode}
              </span>
            </div>
            <h1 className="font-mono text-2xl leading-tight font-medium tracking-tight uppercase md:text-3xl">
              {status === 'invalid-format' && 'Format de code invalide.'}
              {status === 'not-found' && "Ce code n'existe pas."}
              {status === 'expired' && "Ce code n'est plus valide."}
              {status === 'revoked' && 'Ce code a été révoqué.'}
            </h1>
            <p className="text-muted leading-relaxed">
              {status === 'invalid-format' &&
                'Le code attendu fait 6 caractères, sans préfixe ni espace. Vérifiez la saisie ou contactez Valmont.'}
              {status === 'not-found' &&
                "Aucune fiche n'est associée à ce code. Le code est peut-être faux, ou la fiche a été retirée."}
              {status === 'expired' &&
                "Ce code a atteint sa date d'expiration ou son nombre de vues maximum. Valmont peut en générer un nouveau."}
              {status === 'revoked' &&
                "Valmont a révoqué ce code. Aucun accès n'est possible avec ce lien."}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(true);
                }}
                className="border-fg bg-fg text-bg hover:bg-fg/90 inline-flex items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
              >
                Demander un accès
                <span aria-hidden="true">↗</span>
              </button>
              <Link
                to="/"
                className="border-fg/40 text-fg hover:border-fg inline-flex items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
              >
                Retour à l&apos;accueil
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </Card>
        )}

        {status === 'valid' && consumed && consumed.docs.length > 1 && (
          <ShareCollection
            docs={consumed.docs}
            code={displayCode}
            expiresAt={consumed.expiresAt}
            items={gateCollection}
            onExpire={() => {
              setStatus('expired');
            }}
          />
        )}

        {status === 'valid' && consumed && consumed.docs.length <= 1 && (
          // Single bordered "box" — owner direction "je veux pas que ça flotte,
          // catégorise bien tout." Hero on top, then categorised body inside
          // the same card so the whole fiche reads as one premium artefact.
          <Card padding="none" className="overflow-hidden">
            {/* ─── Top bar : SN logo + privé label + code ─── */}
            <div className="border-fg/10 flex items-center justify-between gap-4 border-b px-6 py-4 md:px-10">
              <Link to="/" aria-label="SAW NEXT" className="inline-flex">
                <BrandMark variant="short" className="text-fg text-base md:text-lg" />
              </Link>
              <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
                Partage privé · Code {displayCode}
              </span>
            </div>

            {/* Live countdown — when the code has an end date+time, show
                j-h-m-s remaining; flip to "expired" at zero so the fiche
                disappears without a reload. */}
            {consumed.expiresAt && (
              <ExpiryCountdown
                expiresAt={consumed.expiresAt}
                onExpire={() => {
                  setStatus('expired');
                }}
              />
            )}

            {/* Hero — image when present, else a branded placeholder so the
                fiche always opens on a visual. */}
            {heroSrc ? (
              <div className="bg-surface relative overflow-hidden">
                <Image src={heroSrc} alt={heroAlt} ratio="16/9" eager />
              </div>
            ) : (
              <div className="bg-surface border-fg/10 flex aspect-video items-center justify-center overflow-hidden border-b">
                <BrandMark variant="short" className="text-fg/10 text-6xl md:text-7xl" />
              </div>
            )}

            <div className="flex flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
              {/* ─── Title block ─── */}
              <header className="border-fg/10 flex flex-col gap-3 border-b pb-6">
                <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
                  {consumed.sanityDocType === 'event' && 'Évènement'}
                  {consumed.sanityDocType === 'property' && 'Propriété'}
                  {consumed.sanityDocType === 'timepiece' && 'Garde-temps'}
                  {consumed.sanityDocType === 'artwork' && 'Œuvre'}
                  {consumed.sanityDocType === 'journey' && 'Voyage'}
                  {consumed.sanityDocType === 'conciergeService' && 'Service'}
                  {consumed.sanityDocType === 'article' && 'Actualité'}
                </span>
                <h2 className="font-mono text-2xl leading-tight font-medium tracking-tight uppercase md:text-3xl">
                  {ficheTitle || 'Fiche partagée'}
                </h2>
                {(heroDate || heroVenue) && (
                  <div className="flex flex-col gap-1 pt-1 font-sans normal-case">
                    {heroDate && (
                      <p className="text-fg text-xl leading-tight font-medium first-letter:uppercase">
                        {heroDate}
                      </p>
                    )}
                    {heroVenue && <p className="text-muted text-base">{heroVenue}</p>}
                  </div>
                )}
                {ficheSummary && (
                  <p className="text-fg/85 max-w-2xl pt-2 font-sans text-base leading-relaxed text-pretty normal-case">
                    {ficheSummary}
                  </p>
                )}
              </header>

              {/* ─── Description (full width, readable sans) ─── */}
              {ficheDescription && (
                <section className="flex flex-col gap-3">
                  <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                    Description
                  </span>
                  <p className="text-muted max-w-3xl font-sans leading-relaxed whitespace-pre-line normal-case">
                    {ficheDescription}
                  </p>
                </section>
              )}

              {/* ─── Informations (full-width responsive grid) ─── */}
              {metaItems.length > 0 && (
                <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
                  <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                    Informations
                  </span>
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {metaItems.map(m => (
                      <div
                        key={m.label}
                        className="border-fg/10 bg-surface/40 flex flex-col gap-1.5 rounded-lg border p-4"
                      >
                        <dt className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
                          {m.label}
                        </dt>
                        <dd className="text-fg font-sans text-sm leading-snug normal-case">
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* ─── Programme — light list (mono only for the hour) ─── */}
              {programme && programme.length > 0 && (
                <section className="border-fg/10 flex flex-col gap-5 border-t pt-6">
                  <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                    Programme
                  </span>
                  <ol className="flex flex-col gap-6">
                    {programme.map((p, i) => {
                      const desc = localeStr(p.description);
                      return (
                        <li
                          key={i}
                          className="border-fg/15 flex flex-col gap-1.5 border-l-2 pl-4 sm:pl-5"
                        >
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-fg font-mono text-xs tracking-wider tabular-nums">
                              {localeStr(p.time)}
                            </span>
                            <span className="text-fg font-sans text-sm font-medium normal-case">
                              {localeStr(p.label)}
                            </span>
                          </div>
                          {desc && (
                            <p className="text-muted max-w-2xl font-sans text-sm leading-relaxed normal-case">
                              {desc}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              )}

              {/* ─── Gallery (photos beyond the hero) ─── */}
              {fiche?.images && fiche.images.length > 1 && (
                <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
                  <span className="text-muted text-[10px] tracking-[0.3em] uppercase">Galerie</span>
                  <GalleryGrid
                    images={fiche.images.slice(1).map(i => ({ src: i.src, alt: localeStr(i.alt) }))}
                  />
                </section>
              )}

              {/* ─── Interest CTA — a non-member can enter the sales tunnel
                  (request access) straight from a shared fiche. ─── */}
              <section className="border-fg/10 flex flex-col gap-4 border-t pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                    Cette fiche vous intéresse ?
                  </span>
                  <p className="text-muted max-w-xl font-sans text-sm leading-relaxed normal-case">
                    Manifestez votre intérêt : nous vous recontactons et, si vous le souhaitez, vous
                    ouvrons un accès privé — même sans compte.
                  </p>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                    className="border-fg bg-fg text-bg hover:bg-fg/90 inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
                  >
                    Manifester mon intérêt
                    <span aria-hidden="true">↗</span>
                  </button>
                  <p className="text-muted font-mono text-[11px] tracking-wider">
                    Vue {String(consumed.viewCount)}
                    {typeof consumed.maxViews === 'number' ? ` / ${String(consumed.maxViews)}` : ''}
                    {consumed.expiresAt && (
                      <> · expire le {new Date(consumed.expiresAt).toLocaleDateString('fr-CH')}</>
                    )}
                  </p>
                </div>
              </section>
            </div>
          </Card>
        )}
      </div>

      <AccessRequestModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        initialMode="request"
      />
    </main>
  );
}
