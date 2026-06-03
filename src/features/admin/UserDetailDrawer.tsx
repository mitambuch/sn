// ═══════════════════════════════════════════════════
// UserDetailDrawer — manage one member from /admin/users
//
// WHAT: right-side drawer opened by clicking a member row. Edit name + phone,
//       toggle audience segments (what the member sees), and run the strong
//       actions: suspend/reactivate (reversible), promote/demote operator
//       (small), delete (permanent). Body remounts per member (key) so its
//       drafts initialise cleanly — no setState-in-effect.
// WHEN: AdminUsers row click. Admin-only (RequireRole 'admin' + RLS).
// ═══════════════════════════════════════════════════

import { Checkbox } from '@components/ui/Checkbox';
import { Input } from '@components/ui/Input';
import { RequestDrawerShell } from '@components/ui/RequestDrawerShell';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { Ban, ShieldCheck, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Role, User } from '@/types/auth';
import type { Segment } from '@/types/segment';

type Result = Promise<{ ok: boolean; error?: string }>;

export interface UserDrawerActions {
  updateProfile: (id: string, patch: { fullName: string; phone: string | null }) => Result;
  updateSegments: (id: string, slugs: readonly string[]) => Result;
  updateBlocked: (id: string, next: boolean) => Result;
  updateRole: (id: string, next: Role) => Result;
  removeUser: (id: string) => Result;
}

interface UserDetailDrawerProps {
  member: User | null;
  segments: readonly Segment[];
  currentUserId: string | undefined;
  actions: UserDrawerActions;
  onClose: () => void;
}

export const UserDetailDrawer = ({
  member,
  segments,
  currentUserId,
  actions,
  onClose,
}: UserDetailDrawerProps) => {
  const { t } = useTranslation();
  return (
    <RequestDrawerShell
      open={member !== null}
      onClose={onClose}
      eyebrow={t('admin.users.drawer.eyebrow')}
      title={member ? member.fullName || member.email : ''}
      lede={member?.email ?? ''}
      widthClass="max-w-xl"
    >
      {member ? (
        <UserEditor
          key={member.id}
          member={member}
          segments={segments}
          isSelf={currentUserId === member.id}
          actions={actions}
          onClose={onClose}
        />
      ) : null}
    </RequestDrawerShell>
  );
};

interface UserEditorProps {
  member: User;
  segments: readonly Segment[];
  isSelf: boolean;
  actions: UserDrawerActions;
  onClose: () => void;
}

const UserEditor = ({ member, segments, isSelf, actions, onClose }: UserEditorProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(member.fullName);
  const [phone, setPhone] = useState(member.phone ?? '');
  const [draftSegments, setDraftSegments] = useState<readonly string[]>(member.segments ?? []);
  const [blocked, setBlocked] = useState(member.blocked ?? false);
  const [isAdmin, setIsAdmin] = useState(member.role === 'admin');
  const [busy, setBusy] = useState(false);

  const name = member.fullName || member.email;
  const ok = (msg: string) => toast({ variant: 'success', message: msg });
  const fail = (e?: string) => toast({ variant: 'error', message: e ?? t('common.error') });

  const run = async (fn: () => Result, onOk: () => void): Promise<void> => {
    setBusy(true);
    const r = await fn();
    setBusy(false);
    if (r.ok) onOk();
    else fail(r.error);
  };

  const handleSave = () =>
    run(
      async () => {
        const a = await actions.updateProfile(member.id, {
          fullName: fullName.trim(),
          phone: phone.trim() || null,
        });
        if (!a.ok) return a;
        return actions.updateSegments(member.id, draftSegments);
      },
      () => {
        ok(t('admin.users.drawer.saved'));
      },
    );

  const handleSuspend = () => {
    const next = !blocked;
    if (next && !window.confirm(t('admin.users.drawer.confirmSuspend', { name }))) return;
    void run(
      () => actions.updateBlocked(member.id, next),
      () => {
        setBlocked(next);
        ok(t(next ? 'admin.users.drawer.suspended' : 'admin.users.drawer.reactivated', { name }));
      },
    );
  };

  const handleRole = () => {
    const next: Role = isAdmin ? 'client' : 'admin';
    if (!window.confirm(t('admin.users.drawer.confirmRole', { name }))) return;
    void run(
      () => actions.updateRole(member.id, next),
      () => {
        setIsAdmin(next === 'admin');
        ok(t('admin.users.drawer.roleChanged', { name }));
      },
    );
  };

  const handleDelete = () => {
    if (!window.confirm(t('admin.users.drawer.confirmDelete', { name }))) return;
    void run(
      () => actions.removeUser(member.id),
      () => {
        ok(t('admin.users.drawer.deleted', { name }));
        onClose();
      },
    );
  };

  const toggleSeg = (slug: string) =>
    setDraftSegments(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug],
    );

  return (
    <div className="flex flex-col gap-8">
      {blocked && (
        <p className="border-danger/30 bg-danger/5 text-danger-text rounded-md border px-3 py-2 text-sm">
          {t('admin.users.drawer.suspendedNotice')}
        </p>
      )}

      {/* Coordonnées éditables */}
      <section className="flex flex-col gap-4">
        <h3 className="text-fg font-mono text-xs tracking-widest uppercase">
          {t('admin.users.drawer.infoSection')}
        </h3>
        <Input
          label={t('common.fullName')}
          value={fullName}
          onChange={e => {
            setFullName(e.target.value);
          }}
        />
        <Input
          label={t('admin.users.drawer.phoneLabel')}
          value={phone}
          onChange={e => {
            setPhone(e.target.value);
          }}
        />
      </section>

      {/* Segments (ce qu'il voit) */}
      <section className="flex flex-col gap-3">
        <h3 className="text-fg font-mono text-xs tracking-widest uppercase">
          {t('admin.users.drawer.segmentsSection')}
        </h3>
        <p className="text-muted text-xs">{t('admin.users.segmentsModalLede')}</p>
        {segments.length === 0 ? (
          <p className="text-muted/70 text-sm">{t('admin.users.noSegmentsAvailable')}</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {segments.map(s => (
              <Checkbox
                key={s.id}
                label={s.label}
                checked={draftSegments.includes(s.slug)}
                onChange={() => {
                  toggleSeg(s.slug);
                }}
              />
            ))}
          </div>
        )}
      </section>

      <UserDrawerActionsRow
        isSelf={isSelf}
        isAdmin={isAdmin}
        blocked={blocked}
        busy={busy}
        onSuspend={handleSuspend}
        onRole={handleRole}
        onDelete={handleDelete}
        onSave={() => {
          void handleSave();
        }}
      />
    </div>
  );
};

const UserDrawerActionsRow = ({
  isSelf,
  isAdmin,
  blocked,
  busy,
  onSuspend,
  onRole,
  onDelete,
  onSave,
}: {
  isSelf: boolean;
  isAdmin: boolean;
  blocked: boolean;
  busy: boolean;
  onSuspend: () => void;
  onRole: () => void;
  onDelete: () => void;
  onSave: () => void;
}) => {
  const { t } = useTranslation();
  const smallBtn =
    'text-muted hover:text-fg focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40';
  return (
    <section className="border-border flex flex-col gap-4 border-t pt-6">
      {/* Strong actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          disabled={busy || isSelf}
          onClick={onSuspend}
          className={cn(
            'focus-visible:ring-accent inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
            blocked ? 'bg-fg text-bg' : 'border-border text-fg border',
          )}
        >
          {blocked ? (
            <UserCheck size={13} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Ban size={13} strokeWidth={1.5} aria-hidden="true" />
          )}
          {t(blocked ? 'admin.users.drawer.reactivate' : 'admin.users.drawer.suspend')}
        </button>

        <button
          type="button"
          disabled={busy || isSelf}
          onClick={onDelete}
          className="border-danger/30 text-danger-text hover:bg-danger/10 focus-visible:ring-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={13} strokeWidth={1.5} aria-hidden="true" />
          {t('admin.users.drawer.delete')}
        </button>

        {/* Promote/demote — small, secondary, pushed right */}
        <button
          type="button"
          disabled={busy || isSelf}
          onClick={onRole}
          className={cn(smallBtn, 'ml-auto')}
        >
          <ShieldCheck size={12} strokeWidth={1.5} aria-hidden="true" />
          {t(isAdmin ? 'admin.users.drawer.demote' : 'admin.users.drawer.promote')}
        </button>
      </div>

      {isSelf && <p className="text-muted/70 text-xs">{t('admin.users.cannotChangeSelf')}</p>}

      {/* Save edits (name/phone/segments) */}
      <button
        type="button"
        disabled={busy}
        onClick={onSave}
        className="bg-fg text-bg focus-visible:ring-accent w-full rounded-full px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
      >
        {t('admin.users.drawer.save')}
      </button>
    </section>
  );
};
