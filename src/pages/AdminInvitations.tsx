// ═══════════════════════════════════════════════════
// AdminInvitations — /:locale/admin/invitations
//
// WHAT: Mobile-first card list of every invitation_code row. Each row
//       is a tappable card : the code itself is the primary action
//       (tap-to-copy), with a quick-share-WhatsApp shortcut + revoke
//       on unused rows. Filter chips at the top scope the list to a
//       single status. A freshly-generated code briefly flashes
//       highlighted so Salva spots it. Generate button is a sticky CTA
//       at the top — single tap, code lands in clipboard immediately.
// WHEN: Admin sidebar entry "Codes d'invitation".
// EDIT COPY: src/locales/{fr,en}.json under admin.invitations.*
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { SectionHeader } from '@components/ui/SectionHeader';
import { Spinner } from '@components/ui/Spinner';
import { useInvitationsAdmin } from '@hooks/useInvitationsAdmin';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { Check, Copy, MessageCircle, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  INVITATION_CODE_PREFIX,
  type InvitationCode,
  type InvitationStatus,
} from '@/types/invitation';

const formatCode = (canonical: string) =>
  `${INVITATION_CODE_PREFIX}${canonical.slice(0, 4)}-${canonical.slice(4, 8)}`;

const STATUS_FILTERS: { value: InvitationStatus | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'admin.invitations.filterAll' },
  { value: 'unused', labelKey: 'admin.invitations.statusValues.unused' },
  { value: 'redeemed', labelKey: 'admin.invitations.statusValues.redeemed' },
  { value: 'revoked', labelKey: 'admin.invitations.statusValues.revoked' },
];

const STATUS_DOT: Record<InvitationStatus, string> = {
  unused: 'bg-success',
  redeemed: 'bg-muted',
  expired: 'bg-muted',
  revoked: 'bg-danger',
};

function buildWhatsAppUrl(displayCode: string, siteUrl: string): string {
  const message = `Voici votre code d'accès Sawnext : ${displayCode}\n${siteUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

interface InvitationCardProps {
  row: InvitationCode;
  language: string;
  isJustGenerated: boolean;
  isCopied: boolean;
  busy: string | null;
  siteUrl: string;
  onCopy: (canonical: string) => void;
  onRevoke: (id: string) => void;
}

function InvitationCard({
  row,
  language,
  isJustGenerated,
  isCopied,
  busy,
  siteUrl,
  onCopy,
  onRevoke,
}: InvitationCardProps) {
  const { t } = useTranslation();
  const displayCode = formatCode(row.code);
  const isUnused = row.status === 'unused';
  const isRevoking = busy === row.id;

  return (
    <article
      className={cn(
        'border-border bg-surface/40 flex flex-col gap-4 rounded-xl border p-4 md:p-5',
        'transition-[border-color,background-color] duration-300',
        isJustGenerated && 'border-success bg-success/5 ring-success/20 ring-2',
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <span className="text-muted inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
          <span
            aria-hidden="true"
            className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[row.status])}
          />
          {t(`admin.invitations.statusValues.${row.status}`)}
        </span>
        <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
          {new Date(row.createdAt).toLocaleDateString(language, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </header>

      {/* Code is the primary tap target */}
      <button
        type="button"
        onClick={() => {
          onCopy(row.code);
        }}
        disabled={!isUnused}
        aria-label={`${t('admin.invitations.copy')} ${displayCode}`}
        className={cn(
          'border-border bg-bg/60 hover:border-fg/40 focus-visible:ring-accent flex items-center justify-between gap-3 rounded-lg border px-4 py-3',
          'duration-base transition-[border-color,background-color] focus-visible:ring-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        <span className="text-fg text-lg font-medium tracking-wider sm:text-xl md:text-2xl">
          {displayCode}
        </span>
        <span className="text-muted flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
          {isCopied ? (
            <>
              <Check size={14} strokeWidth={2} aria-hidden="true" className="text-success" />
              <span className="text-success">{t('admin.invitations.copied')}</span>
            </>
          ) : (
            <>
              <Copy size={12} strokeWidth={1.5} aria-hidden="true" />
              {t('admin.invitations.copy')}
            </>
          )}
        </span>
      </button>

      {row.expiresAt && (
        <p className="text-muted font-mono text-[10px] tracking-widest uppercase">
          {t('admin.invitations.expiresAt')} ·{' '}
          {new Date(row.expiresAt).toLocaleDateString(language, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      )}

      <footer className="flex flex-wrap items-center gap-2">
        <a
          href={buildWhatsAppUrl(displayCode, siteUrl)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!isUnused}
          tabIndex={isUnused ? 0 : -1}
          className={cn(
            'border-border text-fg hover:bg-surface inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase',
            'duration-base transition-colors',
            !isUnused && 'pointer-events-none opacity-40',
          )}
        >
          <MessageCircle size={12} strokeWidth={1.5} aria-hidden="true" />
          WhatsApp
        </a>
        {isUnused && (
          <button
            type="button"
            onClick={() => {
              onRevoke(row.id);
            }}
            disabled={isRevoking}
            className="text-danger hover:bg-danger/5 ml-auto inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase transition-colors disabled:opacity-40"
          >
            <X size={12} strokeWidth={1.5} aria-hidden="true" />
            {isRevoking ? t('common.loading') : t('admin.invitations.revoke')}
          </button>
        )}
      </footer>
    </article>
  );
}

function useResetAfter<T>(value: T | null, ms: number, setValue: (v: T | null) => void) {
  useEffect(() => {
    if (value === null) return;
    const id = window.setTimeout(() => {
      setValue(null);
    }, ms);
    return () => {
      window.clearTimeout(id);
    };
  }, [value, ms, setValue]);
}

function FilterChips({
  active,
  counts,
  onChange,
}: {
  active: InvitationStatus | 'all';
  counts: Record<InvitationStatus | 'all', number>;
  onChange: (v: InvitationStatus | 'all') => void;
}) {
  const { t } = useTranslation();
  return (
    <nav
      aria-label="Filtrer par statut"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0"
    >
      {STATUS_FILTERS.map(f => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              onChange(f.value);
            }}
            aria-pressed={isActive}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-widest whitespace-nowrap uppercase',
              'duration-base transition-[color,background-color,border-color]',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
              isActive
                ? 'bg-fg text-bg border-fg'
                : 'border-border text-muted hover:text-fg hover:border-fg/40',
            )}
          >
            {t(f.labelKey)}
            <span className="opacity-60">({counts[f.value]})</span>
          </button>
        );
      })}
    </nav>
  );
}

function EmptyState({
  filterIsAll,
  busy,
  onGenerate,
}: {
  filterIsAll: boolean;
  busy: string | null;
  onGenerate: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="border-border bg-surface/30 rounded-lg border px-6 py-12 text-center">
      <p className="text-muted text-sm">
        {filterIsAll ? t('admin.invitations.emptyAll') : t('admin.invitations.emptyFiltered')}
      </p>
      <button
        type="button"
        onClick={onGenerate}
        disabled={busy === 'generate'}
        className="text-fg hover:text-fg/80 mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase disabled:opacity-50"
      >
        <Plus size={12} strokeWidth={1.5} aria-hidden="true" />
        {t('admin.invitations.generate')}
      </button>
    </div>
  );
}

export default function AdminInvitations() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { rows, loading, error, usingFallback, generate, revoke } = useInvitationsAdmin();
  const [busy, setBusy] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | 'all'>('all');
  const [justGeneratedId, setJustGeneratedId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useResetAfter(justGeneratedId, 2500, setJustGeneratedId);
  useResetAfter(copiedCode, 1500, setCopiedCode);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = (canonical: string) => {
    void navigator.clipboard.writeText(formatCode(canonical));
    setCopiedCode(canonical);
    toast({ variant: 'success', message: t('admin.invitations.copied') });
  };

  const handleGenerate = async () => {
    setBusy('generate');
    const result = await generate();
    setBusy(null);
    if (!result.ok) {
      toast({ variant: 'error', message: result.error ?? t('common.error') });
      return;
    }
    toast({ variant: 'success', message: t('admin.invitations.generated') });
    if (result.code) {
      setJustGeneratedId(result.code.id);
      handleCopy(result.code.code);
      // Auto-switch to "unused" filter so the new code is visible.
      if (statusFilter !== 'all' && statusFilter !== 'unused') {
        setStatusFilter('all');
      }
    }
  };

  const handleRevoke = async (id: string) => {
    setBusy(id);
    const result = await revoke(id);
    setBusy(null);
    if (!result.ok) {
      toast({ variant: 'error', message: result.error ?? t('common.error') });
      return;
    }
    toast({ variant: 'success', message: t('admin.invitations.revoked') });
  };

  const filtered = statusFilter === 'all' ? rows : rows.filter(r => r.status === statusFilter);

  const countsByStatus: Record<InvitationStatus | 'all', number> = {
    all: rows.length,
    unused: rows.filter(r => r.status === 'unused').length,
    redeemed: rows.filter(r => r.status === 'redeemed').length,
    expired: rows.filter(r => r.status === 'expired').length,
    revoked: rows.filter(r => r.status === 'revoked').length,
  };

  return (
    <Container size="xl">
      <div className="space-y-8 py-10 md:space-y-10 md:py-12">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            eyebrow={t('admin.eyebrow')}
            title={t('admin.invitations.title')}
            size="md"
            as="h1"
          />
          <button
            type="button"
            onClick={() => {
              void handleGenerate();
            }}
            disabled={busy === 'generate'}
            className={cn(
              'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
              'inline-flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-sm tracking-widest uppercase sm:w-auto',
              'duration-base transition-[border-color,background-color]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            {busy === 'generate' ? t('common.loading') : t('admin.invitations.generate')}
          </button>
        </div>

        <FilterChips active={statusFilter} counts={countsByStatus} onChange={setStatusFilter} />

        {error && (
          <p
            role="alert"
            className="border-danger/30 bg-danger/5 text-danger rounded-md border px-3 py-2 text-sm"
          >
            {error}
          </p>
        )}

        {usingFallback && (
          <p className="border-border bg-surface/40 text-muted rounded-md border px-3 py-2 font-mono text-[10px] tracking-widest uppercase">
            {t('admin.invitations.mockBanner')}
          </p>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="sm" aria-label={t('common.loading')} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            filterIsAll={statusFilter === 'all'}
            busy={busy}
            onGenerate={() => {
              void handleGenerate();
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(row => (
              <InvitationCard
                key={row.id}
                row={row}
                language={i18n.language}
                isJustGenerated={row.id === justGeneratedId}
                isCopied={copiedCode === row.code}
                busy={busy}
                siteUrl={siteUrl}
                onCopy={handleCopy}
                onRevoke={id => {
                  void handleRevoke(id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
