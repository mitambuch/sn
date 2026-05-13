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

import { Card } from '@components/ui/Card';
import { Image } from '@components/ui/Image';
import { MonoGradientPlaceholder } from '@components/ui/MonoGradientPlaceholder';
import { ShareActionRow } from '@components/ui/ShareActionRow';
import { siteConfig } from '@config/site';
import { AccessRequestModal } from '@features/access/AccessRequestModal';
import { useSanityItem } from '@hooks/useSanityItem';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { GROQ_SHARED_FICHE } from '@/lib/sanityQueries';
import { consumeShareCode } from '@/lib/shareCode';
import { buildShareMessage } from '@/lib/sharing';
import {
  type ConsumedShareCode,
  formatShareCode,
  normalizeShareCode,
  SHARE_CODE_DISPLAY_PATTERN,
  type ShareableDocType,
} from '@/types/share';

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
}

// eslint-disable-next-line max-lines-per-function -- public share page with multi-state machine + Sanity fetch + share actions
export default function SharePage() {
  const { code: rawCode } = useParams<{ code: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [consumed, setConsumed] = useState<ConsumedShareCode | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
        setStatus('valid');
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

  // Fetch the Sanity doc once the code is resolved. Falls back gracefully
  // when Sanity is unconfigured (then we show the labelled placeholder).
  const ficheQuery = useMemo(() => {
    if (status !== 'valid') return '';
    if (!consumed?.sanityDocType || !consumed.sanityDocId) return '';
    return GROQ_SHARED_FICHE(consumed.sanityDocType, consumed.sanityDocId);
  }, [status, consumed]);

  const { data: fiche, loading: ficheLoading } = useSanityItem<SharedFiche>({
    query: ficheQuery,
    fallback: null,
  });

  const displayCode = rawCode ? formatShareCode(normalizeShareCode(rawCode)) : '—';
  const heroSrc = fiche?.heroImage?.src ?? fiche?.images?.[0]?.src ?? undefined;
  const heroAlt =
    fiche?.heroImage?.alt ?? fiche?.images?.[0]?.alt ?? fiche?.title ?? 'Fiche partagée';

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : `${siteConfig.url}/share/${displayCode}`;
  const shareMessage = buildShareMessage({
    docType: fiche?._type ?? consumed?.sanityDocType ?? null,
    title: fiche?.title ?? null,
    url: shareUrl,
  });

  return (
    <main
      data-theme="dark"
      className="bg-bg text-fg relative min-h-screen overflow-hidden px-5 py-16 md:px-12 md:py-24"
    >
      {/* Minimal OG metadata — React 19 hoists these into <head> */}
      <title>{fiche?.title ? `${fiche.title} — Sawnext` : 'Sawnext — Partage privé'}</title>
      {fiche?.summary && <meta name="description" content={fiche.summary} />}
      <meta name="robots" content="noindex, nofollow" />
      <meta
        property="og:title"
        content={fiche?.title ? `${fiche.title} — Sawnext` : 'Sawnext — Partage privé'}
      />
      {fiche?.summary && <meta property="og:description" content={fiche.summary} />}
      {heroSrc && <meta property="og:image" content={heroSrc} />}
      <meta property="og:type" content="website" />

      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        {/* Header strip */}
        <header className="border-fg/15 flex flex-col gap-3 border-b pb-6">
          <span className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            Partage privé · SAW NEXT
          </span>
          <h1 className="font-mono text-2xl leading-tight font-medium tracking-tight uppercase md:text-3xl">
            {status === 'loading' && 'Vérification du code…'}
            {status === 'invalid-format' && 'Format de code invalide.'}
            {status === 'not-found' && "Ce code n'existe pas."}
            {status === 'expired' && "Ce code n'est plus valide."}
            {status === 'revoked' && 'Ce code a été révoqué.'}
            {status === 'valid' && (fiche?.title ?? 'Une fiche partagée pour vous.')}
          </h1>
          <p className="text-muted font-mono text-[11px] tracking-[0.18em] uppercase">
            Code : {displayCode}
          </p>
        </header>

        {/* Body */}
        {status === 'loading' && (
          <div className="text-muted py-12 text-center text-sm">Chargement…</div>
        )}

        {(status === 'invalid-format' ||
          status === 'not-found' ||
          status === 'expired' ||
          status === 'revoked') && (
          <Card padding="lg" className="flex flex-col gap-5">
            <p className="text-fg text-base leading-relaxed">
              {status === 'invalid-format' &&
                'Le code attendu suit le format SAW-XXXX-XXXX. Vérifiez la saisie ou contactez Salvatore.'}
              {status === 'not-found' &&
                "Aucune fiche n'est associée à ce code. Le code est peut-être faux, ou la fiche a été retirée."}
              {status === 'expired' &&
                "Ce code a atteint sa date d'expiration ou son nombre de vues maximum. Salvatore peut en générer un nouveau."}
              {status === 'revoked' &&
                "Salvatore a révoqué ce code. Aucun accès n'est possible avec ce lien."}
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Pour obtenir un accès, demandez à Salvatore ou utilisez le formulaire d&apos;accès.
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

        {status === 'valid' && consumed && (
          <>
            {/* Hero image */}
            {heroSrc ? (
              <div className="rounded-card border-border bg-surface relative overflow-hidden border">
                <Image src={heroSrc} alt={heroAlt} ratio="16/9" eager />
              </div>
            ) : ficheLoading ? (
              <div className="rounded-card border-border bg-surface relative aspect-video overflow-hidden border">
                <MonoGradientPlaceholder tone="dark" className="absolute inset-0 h-full w-full" />
              </div>
            ) : null}

            {/* Body */}
            {fiche ? (
              <article className="flex flex-col gap-6">
                {fiche.summary && (
                  <p className="text-fg text-lg leading-relaxed text-pretty">{fiche.summary}</p>
                )}
                {fiche.description && (
                  <p className="text-muted leading-relaxed whitespace-pre-line">
                    {fiche.description}
                  </p>
                )}

                <div className="border-fg/15 mt-2 flex flex-col gap-4 border-t pt-6">
                  <span className="text-muted text-[10px] tracking-[0.3em] uppercase">
                    Partager cette fiche
                  </span>
                  <ShareActionRow url={shareUrl} message={shareMessage} variant="compact" />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                    className="border-fg bg-fg text-bg hover:bg-fg/90 inline-flex items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
                  >
                    Demander cette fiche
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>

                <p className="text-muted text-[11px] tracking-wider">
                  Vue {String(consumed.viewCount)}
                  {typeof consumed.maxViews === 'number' ? ` / ${String(consumed.maxViews)}` : ''}
                  {consumed.expiresAt && (
                    <> · expire le {new Date(consumed.expiresAt).toLocaleDateString('fr-CH')}</>
                  )}
                </p>
              </article>
            ) : (
              // Fallback placeholder when Sanity returns nothing
              <Card padding="lg" className="flex flex-col gap-5">
                <p className="text-muted text-xs tracking-widest uppercase">
                  Référence interne :{' '}
                  <code className="font-mono">{consumed.sanityDocId ?? '—'}</code>
                </p>
                <p className="text-fg leading-relaxed">
                  Le contenu détaillé de cette fiche est en cours de préparation par Salvatore. En
                  attendant, contactez-le directement pour les informations complètes.
                </p>
                <ShareActionRow url={shareUrl} message={shareMessage} variant="compact" />
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  className="border-fg bg-fg text-bg hover:bg-fg/90 inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase transition-colors"
                >
                  Demander cette fiche
                  <span aria-hidden="true">↗</span>
                </button>
              </Card>
            )}
          </>
        )}
      </div>

      <AccessRequestModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        initialMode="request"
      />

      {/* Placeholder ambient — monochrome organic, behind everything */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <MonoGradientPlaceholder tone="dark" className="h-full w-full" />
      </div>
    </main>
  );
}
