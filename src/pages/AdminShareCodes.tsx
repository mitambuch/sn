// ═══════════════════════════════════════════════════
// AdminShareCodes — /:locale/admin/share-codes
//
// WHAT: Lists all share codes Salva has generated for individual Sanity
//       fiches (events, properties, timepieces, etc.) + provides a quick
//       "Generate a new code" form (doc type + doc id + optional
//       expiration + max views). Reads share_codes table directly when
//       Supabase is configured ; falls back to an empty list with a
//       "Configure Supabase to enable" hint otherwise.
// WHEN: /:locale/admin/share-codes route. RequireRole 'admin' via
//       AdminLayout.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { Checkbox } from '@components/ui/Checkbox';
import { DataTable, type DataTableColumn } from '@components/ui/DataTable';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Stepper } from '@components/ui/Stepper';
import { useAdminCatalogue } from '@hooks/useAdminCatalogue';
import { useToast } from '@hooks/useToast';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { generateAndInsertShareCode } from '@/lib/shareCode';
import { buildShareMessage, buildWhatsAppUrl } from '@/lib/sharing';
import { hasSupabase, supabase } from '@/lib/supabase';
import {
  formatShareCode,
  type ShareableDocType,
  type ShareCode,
  type ShareCodeStatus,
  type ShareDocRef,
} from '@/types/share';

const DOC_TYPES: { value: ShareableDocType; label: string }[] = [
  { value: 'event', label: 'Évènement' },
  { value: 'property', label: 'Propriété' },
  { value: 'timepiece', label: 'Garde-temps' },
  { value: 'artwork', label: "Œuvre d'art" },
  { value: 'journey', label: 'Voyage' },
  { value: 'conciergeService', label: 'Conciergerie' },
  { value: 'article', label: 'Actualité' },
];

const DOC_TYPE_LABEL: Record<ShareableDocType, string> = Object.fromEntries(
  DOC_TYPES.map(d => [d.value, d.label]),
) as Record<ShareableDocType, string>;

interface RawShareCodeRow {
  id: string;
  code: string;
  sanity_doc_type: string;
  sanity_doc_id: string;
  sanity_docs: { type?: string; id?: string }[] | null;
  status: string;
  view_count: number;
  max_views: number | null;
  expires_at: string | null;
  created_at: string;
  created_by: string | null;
  note: string | null;
}

const mapRow = (r: RawShareCodeRow): ShareCode => {
  const multi = Array.isArray(r.sanity_docs) ? r.sanity_docs : [];
  const docs: ShareDocRef[] = multi
    .filter((d): d is { type: string; id: string } => Boolean(d?.type) && Boolean(d?.id))
    .map(d => ({ type: d.type as ShareableDocType, id: d.id }));
  return {
    id: r.id,
    code: r.code,
    sanityDocType: r.sanity_doc_type as ShareableDocType,
    sanityDocId: r.sanity_doc_id,
    docs:
      docs.length > 0
        ? docs
        : [{ type: r.sanity_doc_type as ShareableDocType, id: r.sanity_doc_id }],
    status: r.status as ShareCodeStatus,
    viewCount: r.view_count,
    maxViews: r.max_views,
    expiresAt: r.expires_at,
    createdAt: r.created_at,
    createdBy: r.created_by,
    note: r.note,
  };
};

const SHARE_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

const isValidDocType = (value: string | null): value is ShareableDocType =>
  value !== null &&
  ['event', 'property', 'timepiece', 'artwork', 'journey', 'conciergeService', 'article'].includes(
    value,
  );

// eslint-disable-next-line max-lines-per-function -- admin page with list + form + states + revoke + share
export default function AdminShareCodes() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Prefill from URL query params (deeplinked from Sanity Studio Document Action).
  const initialDocType = useMemo<ShareableDocType>(() => {
    const q = searchParams.get('docType');
    return isValidDocType(q) ? q : 'event';
  }, [searchParams]);
  const initialDocId = useMemo(() => searchParams.get('docId') ?? '', [searchParams]);

  const [rows, setRows] = useState<ShareCode[]>([]);
  const [loading, setLoading] = useState(hasSupabase);
  const [submitting, setSubmitting] = useState(false);

  // Form state for "Generate new code" — initialized from URL query
  // params on mount. If Salva re-deeplinks from Studio to a different
  // doc, the new tab gets a fresh mount with the right initial values.
  /** Selected fiches behind the code (≥ 1). Deeplink prefills the first. */
  const [selected, setSelected] = useState<ShareDocRef[]>(
    initialDocId ? [{ type: initialDocType, id: initialDocId }] : [],
  );
  /** Exact end date+time, from a datetime-local input (empty = never). */
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [maxViews, setMaxViews] = useState<string>('');
  const [note, setNote] = useState('');

  // Multi-select fiche list — every catalogue doc by title, so the operator
  // never copies a Sanity _id by hand and can bundle several in one link.
  const { rows: catalogueRows, loading: catalogueLoading } = useAdminCatalogue();
  const keyOf = (ref: ShareDocRef) => `${ref.type}:${ref.id}`;
  const selectedKeys = new Set(selected.map(keyOf));
  const toggleFiche = (ref: ShareDocRef) => {
    setSelected(prev =>
      prev.some(r => keyOf(r) === keyOf(ref))
        ? prev.filter(r => keyOf(r) !== keyOf(ref))
        : [...prev, ref],
    );
  };

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    supabase
      .from('share_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.warn('[AdminShareCodes] fetch failed:', error.message);
          toast({ variant: 'error', message: 'Lecture share_codes échouée.' });
        } else if (data) {
          setRows((data as unknown as RawShareCodeRow[]).map(mapRow));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const handleCopy = (canonical: string) => {
    void navigator.clipboard.writeText(formatShareCode(canonical));
    toast({ variant: 'success', message: 'Code copié.' });
  };

  const handleCopyUrl = (canonical: string) => {
    const url = `${SHARE_BASE_URL}/share/${formatShareCode(canonical)}`;
    void navigator.clipboard.writeText(url);
    toast({ variant: 'success', message: 'URL copiée.' });
  };

  const handleRevoke = async (id: string, displayCode: string) => {
    if (!supabase) return;
    const confirmed = window.confirm(
      `Révoquer le code ${displayCode} ? Le destinataire ne pourra plus l'utiliser (action réversible côté DB).`,
    );
    if (!confirmed) return;
    const { error } = await supabase.from('share_codes').update({ status: 'revoked' }).eq('id', id);
    if (error) {
      toast({ variant: 'error', message: `Révocation échouée : ${error.message}` });
      return;
    }
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status: 'revoked' } : r)));
    toast({ variant: 'success', message: 'Code révoqué.' });
  };

  const buildWhatsLinkFor = (r: ShareCode): string => {
    const url = `${SHARE_BASE_URL}/share/${formatShareCode(r.code)}`;
    const message = buildShareMessage({
      docType: r.sanityDocType,
      title: null,
      url,
    });
    return buildWhatsAppUrl(message);
  };

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const firstRef = selected[0];
    if (!firstRef) {
      toast({ variant: 'error', message: 'Choisis au moins une fiche à partager.' });
      return;
    }
    setSubmitting(true);
    try {
      // datetime-local is in the operator's local time → ISO (UTC) for storage.
      const expiresIso = expiresAt ? new Date(expiresAt).toISOString() : undefined;
      const max = maxViews ? parseInt(maxViews, 10) : undefined;
      const { canonical } = await generateAndInsertShareCode(selected, {
        ...(expiresIso ? { expiresAt: expiresIso } : {}),
        ...(typeof max === 'number' && !Number.isNaN(max) ? { maxViews: max } : {}),
        ...(note ? { note } : {}),
      });
      toast({
        variant: 'success',
        message: `Code généré : ${formatShareCode(canonical)}`,
      });
      // Optimistic prepend; the real row will appear on next reload
      setRows(prev => [
        {
          id: `local-${Date.now().toString()}`,
          code: canonical,
          sanityDocType: firstRef.type,
          sanityDocId: firstRef.id,
          docs: selected,
          status: 'active',
          viewCount: 0,
          maxViews: max ?? null,
          expiresAt: expiresIso ?? null,
          createdAt: new Date().toISOString(),
          createdBy: null,
          note: note || null,
        },
        ...prev,
      ]);
      setSelected([]);
      setExpiresAt('');
      setMaxViews('');
      setNote('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Génération échouée.';
      toast({ variant: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const columns: DataTableColumn<ShareCode>[] = [
    {
      key: 'code',
      label: 'Code',
      render: r => (
        <button
          type="button"
          onClick={() => {
            handleCopy(r.code);
          }}
          className="text-fg font-mono text-xs tracking-wider hover:underline"
        >
          {formatShareCode(r.code)}
        </button>
      ),
    },
    {
      key: 'doc',
      label: 'Fiche(s)',
      render: r =>
        r.docs.length > 1 ? (
          <span className="text-fg font-mono text-xs">{r.docs.length} fiches</span>
        ) : (
          <span className="text-muted font-mono text-xs">
            {r.sanityDocType} · <code>{r.sanityDocId}</code>
          </span>
        ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: r => (
        <span
          className={`text-xs tracking-widest uppercase ${
            r.status === 'active'
              ? 'text-fg'
              : r.status === 'revoked'
                ? 'text-muted line-through'
                : 'text-muted'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'views',
      label: 'Vues',
      render: r =>
        typeof r.maxViews === 'number'
          ? `${String(r.viewCount)} / ${String(r.maxViews)}`
          : String(r.viewCount),
    },
    {
      key: 'expires',
      label: 'Expire',
      render: r => (r.expiresAt ? new Date(r.expiresAt).toLocaleDateString('fr-CH') : '—'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: r => (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              handleCopyUrl(r.code);
            }}
            className="text-fg/70 hover:text-fg font-mono text-[10px] tracking-widest uppercase"
          >
            URL
          </button>
          <a
            href={buildWhatsLinkFor(r)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg/70 hover:text-fg font-mono text-[10px] tracking-widest uppercase"
          >
            WhatsApp ↗
          </a>
          <a
            href={`/share/${formatShareCode(r.code)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg/70 hover:text-fg font-mono text-[10px] tracking-widest uppercase"
          >
            Ouvrir
          </a>
          {r.status === 'active' && (
            <button
              type="button"
              onClick={() => {
                void handleRevoke(r.id, formatShareCode(r.code));
              }}
              className="text-muted hover:text-fg font-mono text-[10px] tracking-widest uppercase"
            >
              Révoquer
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Container size="xl">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('admin.eyebrow', 'Administration')}
          title="Codes de partage"
          lede="Génère un code qui donne accès à une OU plusieurs fiches sans authentification. Coche les fiches à inclure, fixe une date de fin et un nombre de vues si besoin, puis partage le lien avec un client de confiance qui ne souhaite pas s'inscrire."
          size="md"
          as="h1"
        />

        {/* Generate form */}
        <form
          onSubmit={e => {
            void handleGenerate(e);
          }}
          className="border-border bg-surface/40 flex flex-col gap-5 rounded-lg border p-6"
        >
          {/* Fiche multi-select */}
          <div className="flex flex-col gap-2">
            <span className="text-fg text-sm font-medium">
              Fiches à partager
              {selected.length > 0 && (
                <span className="text-muted"> · {selected.length} sélectionnée(s)</span>
              )}
            </span>
            <div className="border-border bg-bg/40 flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border p-2">
              {catalogueLoading ? (
                <p className="text-muted p-2 text-sm">Chargement des fiches…</p>
              ) : catalogueRows.length === 0 ? (
                <p className="text-muted p-2 text-sm">Aucune fiche dans le catalogue.</p>
              ) : (
                catalogueRows.map(r => {
                  const ref: ShareDocRef = { type: r.type, id: r.id };
                  return (
                    <Checkbox
                      key={keyOf(ref)}
                      checked={selectedKeys.has(keyOf(ref))}
                      onChange={() => {
                        toggleFiche(ref);
                      }}
                      label={`${DOC_TYPE_LABEL[r.type] ?? r.type} · ${r.title}`}
                      className="hover:bg-surface/50 rounded px-2 py-1.5"
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Options row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_160px_auto] md:items-end">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sc-expires" className="text-fg text-sm font-medium">
                Fin (date + heure)
              </label>
              <input
                id="sc-expires"
                type="datetime-local"
                value={expiresAt}
                onChange={e => {
                  setExpiresAt(e.target.value);
                }}
                className="bg-bg/80 border-border text-fg rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <Stepper
              id="sc-max-views"
              label="Vues max (0 = ∞)"
              value={maxViews ? parseInt(maxViews, 10) : 0}
              min={0}
              max={999}
              onChange={n => {
                setMaxViews(n === 0 ? '' : String(n));
              }}
            />
            <button
              type="submit"
              disabled={submitting || !hasSupabase || selected.length === 0}
              className="border-border bg-fg text-bg hover:bg-fg/90 h-12 self-end rounded-full border px-6 font-mono text-xs tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? '…' : 'Générer'}
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sc-note" className="text-fg text-sm font-medium">
              Note interne (optionnelle)
            </label>
            <input
              id="sc-note"
              type="text"
              value={note}
              onChange={e => {
                setNote(e.target.value);
              }}
              placeholder={t('admin.shareCodes.notePlaceholder')}
              className="bg-bg/80 border-border text-fg rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </form>

        {!hasSupabase && (
          <p className="text-muted border-border bg-surface/30 rounded-md border p-4 text-xs leading-relaxed">
            ⚠️ Supabase n'est pas configuré dans cet environnement. La génération de codes est
            désactivée. Configurez VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY pour activer.
          </p>
        )}

        {/* List */}
        {loading ? (
          <p className="text-muted py-12 text-center text-sm">Chargement…</p>
        ) : rows.length === 0 ? (
          <p className="text-muted py-12 text-center text-sm">{t('admin.shareCodes.empty')}</p>
        ) : (
          <DataTable<ShareCode>
            columns={columns}
            rows={rows}
            rowKey={r => r.id}
            emptyLabel={t('admin.shareCodes.empty')}
          />
        )}
      </div>
    </Container>
  );
}
