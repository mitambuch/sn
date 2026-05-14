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
import { DataTable, type DataTableColumn } from '@components/ui/DataTable';
import { SectionHeader } from '@components/ui/SectionHeader';
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

interface RawShareCodeRow {
  id: string;
  code: string;
  sanity_doc_type: string;
  sanity_doc_id: string;
  status: string;
  view_count: number;
  max_views: number | null;
  expires_at: string | null;
  created_at: string;
  created_by: string | null;
  note: string | null;
}

const mapRow = (r: RawShareCodeRow): ShareCode => ({
  id: r.id,
  code: r.code,
  sanityDocType: r.sanity_doc_type as ShareableDocType,
  sanityDocId: r.sanity_doc_id,
  status: r.status as ShareCodeStatus,
  viewCount: r.view_count,
  maxViews: r.max_views,
  expiresAt: r.expires_at,
  createdAt: r.created_at,
  createdBy: r.created_by,
  note: r.note,
});

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
  const [docType, setDocType] = useState<ShareableDocType>(initialDocType);
  const [docId, setDocId] = useState(initialDocId);
  const [expiresDays, setExpiresDays] = useState<string>('');
  const [maxViews, setMaxViews] = useState<string>('');
  const [note, setNote] = useState('');

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
    if (!docId.trim()) {
      toast({ variant: 'error', message: 'ID de la fiche Sanity requis.' });
      return;
    }
    setSubmitting(true);
    try {
      const expiresAt = expiresDays
        ? new Date(Date.now() + parseInt(expiresDays, 10) * 24 * 60 * 60 * 1000).toISOString()
        : undefined;
      const max = maxViews ? parseInt(maxViews, 10) : undefined;
      const { canonical } = await generateAndInsertShareCode(docType, docId.trim(), {
        ...(expiresAt ? { expiresAt } : {}),
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
          sanityDocType: docType,
          sanityDocId: docId.trim(),
          status: 'active',
          viewCount: 0,
          maxViews: max ?? null,
          expiresAt: expiresAt ?? null,
          createdAt: new Date().toISOString(),
          createdBy: null,
          note: note || null,
        },
        ...prev,
      ]);
      setDocId('');
      setExpiresDays('');
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
      label: 'Fiche',
      render: r => (
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
          lede="Génère un code à 8 caractères qui donne accès à UNE seule fiche sans authentification. Idéal pour partager rapidement un événement, une propriété ou un garde-temps avec un client de confiance qui ne souhaite pas s'inscrire."
          size="md"
          as="h1"
        />

        {/* Generate form */}
        <form
          onSubmit={e => {
            void handleGenerate(e);
          }}
          className="border-border bg-surface/40 grid grid-cols-1 gap-4 rounded-lg border p-6 md:grid-cols-[1fr_1fr_120px_120px_auto]"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sc-doc-type" className="text-fg text-sm font-medium">
              Type de fiche
            </label>
            <select
              id="sc-doc-type"
              value={docType}
              onChange={e => {
                setDocType(e.target.value as ShareableDocType);
              }}
              className="bg-bg/80 border-border text-fg rounded-md border px-3 py-2 text-sm"
            >
              {DOC_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sc-doc-id" className="text-fg text-sm font-medium">
              ID Sanity *
            </label>
            <input
              id="sc-doc-id"
              type="text"
              value={docId}
              onChange={e => {
                setDocId(e.target.value);
              }}
              placeholder="ex: evt-01"
              required
              className="bg-bg/80 border-border text-fg rounded-md border px-3 py-2 font-mono text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sc-expires" className="text-fg text-sm font-medium">
              Expire (j)
            </label>
            <input
              id="sc-expires"
              type="number"
              min={1}
              value={expiresDays}
              onChange={e => {
                setExpiresDays(e.target.value);
              }}
              placeholder="∞"
              className="bg-bg/80 border-border text-fg rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sc-max-views" className="text-fg text-sm font-medium">
              Vues max
            </label>
            <input
              id="sc-max-views"
              type="number"
              min={1}
              value={maxViews}
              onChange={e => {
                setMaxViews(e.target.value);
              }}
              placeholder="∞"
              className="bg-bg/80 border-border text-fg rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !hasSupabase}
            className="border-border bg-fg text-bg hover:bg-fg/90 self-end rounded-full border px-5 py-2.5 font-mono text-xs tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '…' : 'Générer'}
          </button>
          <div className="flex flex-col gap-1.5 md:col-span-5">
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
