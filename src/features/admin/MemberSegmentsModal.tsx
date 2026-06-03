// ═══════════════════════════════════════════════════
// MemberSegmentsModal — assign audience segments to one member
//
// WHAT: a modal listing every segment as a checkbox; ticking decides which
//       segments the member belongs to (profiles.segments, migration 0018).
//       The body is remounted per member (key) so its draft initialises from
//       that member's current tags — no setState-in-effect needed.
// WHEN: opened from the AdminUsers segments column. Closed = member null.
// ═══════════════════════════════════════════════════

import { Checkbox } from '@components/ui/Checkbox';
import { Modal } from '@components/ui/Modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { User } from '@/types/auth';
import type { Segment } from '@/types/segment';

interface MemberSegmentsModalProps {
  /** The member being edited, or null when the modal is closed. */
  member: User | null;
  segments: readonly Segment[];
  onClose: () => void;
  /** Persist the chosen slugs; returns ok/error for toast handling. */
  onSave: (memberId: string, slugs: readonly string[]) => Promise<{ ok: boolean; error?: string }>;
  /** Called by the parent to surface success/error toasts. */
  onResult: (result: { ok: boolean; error?: string }, member: User) => void;
}

export const MemberSegmentsModal = ({
  member,
  segments,
  onClose,
  onSave,
  onResult,
}: MemberSegmentsModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={member !== null}
      onClose={onClose}
      title={t('admin.users.segmentsModalTitle', {
        name: member ? member.fullName || member.email : '',
      })}
    >
      {member ? (
        <SegmentChecklist
          key={member.id}
          member={member}
          segments={segments}
          onClose={onClose}
          onSave={onSave}
          onResult={onResult}
        />
      ) : null}
    </Modal>
  );
};

interface SegmentChecklistProps {
  member: User;
  segments: readonly Segment[];
  onClose: () => void;
  onSave: (memberId: string, slugs: readonly string[]) => Promise<{ ok: boolean; error?: string }>;
  onResult: (result: { ok: boolean; error?: string }, member: User) => void;
}

const SegmentChecklist = ({
  member,
  segments,
  onClose,
  onSave,
  onResult,
}: SegmentChecklistProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<readonly string[]>(member.segments ?? []);
  const [saving, setSaving] = useState(false);

  const toggle = (slug: string) => {
    setDraft(prev => (prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]));
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave(member.id, draft);
    setSaving(false);
    onResult(result, member);
    if (result.ok) onClose();
  };

  return (
    <div className="space-y-5">
      <p className="text-muted text-sm">{t('admin.users.segmentsModalLede')}</p>
      {segments.length === 0 ? (
        <p className="text-muted/70 text-sm">{t('admin.users.noSegmentsAvailable')}</p>
      ) : (
        <div className="space-y-2.5">
          {segments.map(seg => (
            <Checkbox
              key={seg.id}
              label={seg.label}
              checked={draft.includes(seg.slug)}
              onChange={() => {
                toggle(seg.slug);
              }}
            />
          ))}
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-fg focus-visible:ring-accent rounded-full px-4 py-2 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('common.cancel')}
        </button>
        <button
          type="button"
          disabled={saving || segments.length === 0}
          onClick={() => {
            void handleSave();
          }}
          className="bg-fg text-bg focus-visible:ring-accent rounded-full px-4 py-2 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('admin.users.save')}
        </button>
      </div>
    </div>
  );
};
