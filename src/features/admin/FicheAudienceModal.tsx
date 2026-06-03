// ═══════════════════════════════════════════════════
// FicheAudienceModal — per-fiche audience rules editor
//
// WHAT: sets who can see one catalogue fiche (migration 0018 fiche_audience).
//       Mode "all" = every member; mode "segments" = only members tagged
//       with a ticked segment. Either way, listed members are excluded.
//       Keyed inner editor fetches the current rule on open and upserts it.
// WHEN: opened from the Audience button on each AdminCatalogue card.
// NOTE: this is the admin authoring surface only. Real enforcement is the
//       Phase 2 server gate — never trust this client decision as a barrier.
// ═══════════════════════════════════════════════════

import { Modal } from '@components/ui/Modal';
import { Spinner } from '@components/ui/Spinner';
import { Textarea } from '@components/ui/Textarea';
import { cn } from '@utils/cn';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getFicheAudience, upsertFicheAudience } from '@/lib/segments';
import type { User } from '@/types/auth';
import type { Segment } from '@/types/segment';
import { type AudienceMode, type FicheAudience } from '@/types/segment';

export interface AudienceFicheRef {
  id: string;
  type: string;
  title: string;
}

interface FicheAudienceModalProps {
  fiche: AudienceFicheRef | null;
  segments: readonly Segment[];
  members: readonly User[];
  onClose: () => void;
  onResult: (result: { ok: boolean; error?: string }) => void;
}

export const FicheAudienceModal = ({
  fiche,
  segments,
  members,
  onClose,
  onResult,
}: FicheAudienceModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={fiche !== null}
      onClose={onClose}
      title={t('admin.catalogue.audience.title', { title: fiche?.title ?? '' })}
    >
      {fiche ? (
        <AudienceEditor
          key={fiche.id}
          fiche={fiche}
          segments={segments}
          members={members}
          onClose={onClose}
          onResult={onResult}
        />
      ) : null}
    </Modal>
  );
};

interface AudienceEditorProps {
  fiche: AudienceFicheRef;
  segments: readonly Segment[];
  members: readonly User[];
  onClose: () => void;
  onResult: (result: { ok: boolean; error?: string }) => void;
}

const AudienceEditor = ({ fiche, segments, members, onClose, onResult }: AudienceEditorProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<FicheAudience | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rule = await getFicheAudience(fiche.id, fiche.type);
        if (!cancelled) setDraft(rule);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fiche.id, fiche.type]);

  if (loadError) {
    return <p className="text-danger-text text-sm">{t('admin.catalogue.audience.loadError')}</p>;
  }
  if (!draft) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="sm" aria-label={t('common.loading')} />
      </div>
    );
  }

  const setMode = (mode: AudienceMode) => {
    setDraft({ ...draft, mode });
  };
  const toggleSegment = (slug: string) => {
    const has = draft.segments.includes(slug);
    setDraft({
      ...draft,
      segments: has ? draft.segments.filter(s => s !== slug) : [...draft.segments, slug],
    });
  };
  const setExcluded = (ids: string[]) => {
    setDraft({ ...draft, excludedMemberIds: ids });
  };

  const handleSave = async () => {
    setSaving(true);
    let result: { ok: boolean; error?: string };
    try {
      await upsertFicheAudience(draft);
      result = { ok: true };
    } catch (err) {
      result = { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
    setSaving(false);
    onResult(result);
    if (result.ok) onClose();
  };

  return (
    <div className="space-y-6">
      <p className="text-muted text-sm">{t('admin.catalogue.audience.lede')}</p>

      <fieldset className="space-y-2">
        <ModeRadio
          checked={draft.mode === 'all'}
          onSelect={() => {
            setMode('all');
          }}
          title={t('admin.catalogue.audience.modeAll')}
          hint={t('admin.catalogue.audience.modeAllHint')}
        />
        <ModeRadio
          checked={draft.mode === 'segments'}
          onSelect={() => {
            setMode('segments');
          }}
          title={t('admin.catalogue.audience.modeSegments')}
          hint={t('admin.catalogue.audience.modeSegmentsHint')}
        />
      </fieldset>

      {draft.mode === 'segments' &&
        (segments.length === 0 ? (
          <p className="text-muted/70 text-sm">{t('admin.catalogue.audience.noSegments')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {segments.map(seg => {
              const on = draft.segments.includes(seg.slug);
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => {
                    toggleSegment(seg.slug);
                  }}
                  aria-pressed={on}
                  className={cn(
                    'focus-visible:ring-accent rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none',
                    on
                      ? 'bg-fg text-bg border-fg'
                      : 'border-border text-muted hover:text-fg hover:border-fg/40',
                  )}
                >
                  {seg.label}
                </button>
              );
            })}
          </div>
        ))}

      <ExclusionPicker
        members={members}
        excludedIds={draft.excludedMemberIds}
        onChange={setExcluded}
      />

      <Textarea
        label={t('admin.catalogue.audience.noteLabel')}
        value={draft.note ?? ''}
        onChange={e => {
          setDraft({ ...draft, note: e.target.value || null });
        }}
        placeholder={t('admin.catalogue.audience.notePlaceholder')}
        rows={2}
      />

      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-fg focus-visible:ring-accent rounded-full px-4 py-2 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('common.cancel')}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            void handleSave();
          }}
          className="bg-fg text-bg focus-visible:ring-accent rounded-full px-4 py-2 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('admin.catalogue.audience.save')}
        </button>
      </div>
    </div>
  );
};

const ModeRadio = ({
  checked,
  onSelect,
  title,
  hint,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  hint: string;
}) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={checked}
    className={cn(
      'focus-visible:ring-accent flex w-full items-start gap-3 rounded-lg border p-3 text-left focus-visible:ring-2 focus-visible:outline-none',
      checked ? 'border-fg/40 bg-surface' : 'border-border hover:border-fg/30',
    )}
  >
    <span
      className={cn(
        'mt-0.5 h-4 w-4 shrink-0 rounded-full border',
        checked ? 'border-fg bg-fg' : 'border-muted',
      )}
      aria-hidden="true"
    />
    <span className="flex flex-col gap-0.5">
      <span className="text-fg text-sm">{title}</span>
      <span className="text-muted text-xs">{hint}</span>
    </span>
  </button>
);

const ExclusionPicker = ({
  members,
  excludedIds,
  onChange,
}: {
  members: readonly User[];
  excludedIds: readonly string[];
  onChange: (ids: string[]) => void;
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const name = (m: User) => m.fullName || m.email;
  const excluded = members.filter(m => excludedIds.includes(m.id));
  const q = query.trim().toLowerCase();
  const candidates =
    q === ''
      ? []
      : members
          .filter(m => !excludedIds.includes(m.id))
          .filter(m => name(m).toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
          .slice(0, 6);

  return (
    <div className="space-y-2.5">
      <div className="space-y-0.5">
        <p className="text-fg font-mono text-xs tracking-widest uppercase">
          {t('admin.catalogue.audience.exclusionsTitle')}
        </p>
        <p className="text-muted text-xs">{t('admin.catalogue.audience.exclusionsHint')}</p>
      </div>
      {excluded.length === 0 ? (
        <p className="text-muted/60 text-xs">{t('admin.catalogue.audience.excludedNone')}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {excluded.map(m => (
            <span
              key={m.id}
              className="border-border bg-surface text-fg inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs"
            >
              {name(m)}
              <button
                type="button"
                onClick={() => {
                  onChange(excludedIds.filter(id => id !== m.id));
                }}
                title={t('admin.catalogue.audience.remove')}
                className="text-muted hover:text-fg"
              >
                <X size={12} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="search"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
        }}
        placeholder={t('admin.catalogue.audience.searchMembers')}
        className="border-border bg-bg/60 text-fg placeholder:text-muted/60 focus:border-accent focus:ring-accent w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
      />
      {candidates.length > 0 && (
        <ul className="border-border divide-border bg-bg/40 divide-y rounded-md border">
          {candidates.map(m => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  onChange([...excludedIds, m.id]);
                  setQuery('');
                }}
                className="hover:bg-surface flex w-full flex-col gap-0.5 px-3 py-2 text-left"
              >
                <span className="text-fg text-sm">{name(m)}</span>
                <span className="text-muted text-xs">{m.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
