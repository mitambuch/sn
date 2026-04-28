import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Tooltip } from '@components/ui/Tooltip';
import { cn } from '@utils/cn';
import { AlertTriangle, ChevronDown, Settings, Trash2, User, X } from 'lucide-react';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import { Section, SpecimenFrame, SubLabel } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

/* ─── Confirm dialog (destructive action) ────────────── */
const ConfirmDialog = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
        <Trash2 size={14} strokeWidth={2} />
        Supprimer…
      </Button>
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={() => setOpen(false)}
          className="bg-bg/80 absolute inset-0 cursor-default backdrop-blur"
        />
        <div className="border-border/60 bg-surface relative w-[min(92vw,420px)] rounded-xl border p-5 shadow-2xl md:p-6">
          <div className="bg-danger/15 text-danger-text inline-flex h-10 w-10 items-center justify-center rounded-full">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
          <h4 className="text-fg mt-4 text-lg font-semibold tracking-tight">
            Supprimer ce projet ?
          </h4>
          <p className="text-muted mt-1.5 text-sm leading-relaxed">
            Cette action est irréversible. Tous les fichiers seront détruits.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button variant="danger" size="sm" onClick={() => setOpen(false)}>
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Drawer (slide from right) ──────────────────────── */
const RightDrawer = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Settings size={14} strokeWidth={2} />
        Paramètres
      </Button>
      <div
        className={cn(
          'fixed inset-0 z-50',
          'transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={() => setOpen(false)}
          className="bg-bg/60 absolute inset-0 cursor-default backdrop-blur"
        />
        <aside
          className={cn(
            'border-border/60 bg-surface absolute top-0 right-0 bottom-0 w-[min(92vw,400px)] border-l shadow-2xl',
            'duration-base transition-transform',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
          role="dialog"
          aria-modal="true"
        >
          <header className="border-border/60 flex items-center justify-between border-b px-5 py-4">
            <h4 className="text-fg font-semibold tracking-tight">Paramètres</h4>
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
              className="text-muted hover:text-fg duration-base transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </header>
          <div className="space-y-4 p-5">
            <p className="text-muted text-sm leading-relaxed">
              Drawer latéral classique. Largeur capped à 400px, glisse depuis la droite, backdrop
              cliquable pour fermer.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};

/* ─── Bottom sheet (mobile-first) ────────────────────── */
const BottomSheet = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <ChevronDown size={14} strokeWidth={2} />
        Bottom sheet
      </Button>
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-end justify-center',
          'transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={() => setOpen(false)}
          className="bg-bg/60 absolute inset-0 cursor-default backdrop-blur"
        />
        <div
          className={cn(
            'border-border/60 bg-surface relative w-full max-w-lg rounded-t-2xl border-x border-t p-5 shadow-2xl',
            'duration-base transition-transform',
            open ? 'translate-y-0' : 'translate-y-full',
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-border/80 mx-auto mb-4 h-1 w-10 rounded-full" aria-hidden />
          <h4 className="text-fg font-semibold tracking-tight">Actions</h4>
          <ul className="mt-3 space-y-1">
            {['Partager', 'Exporter en PDF', 'Dupliquer', 'Archiver'].map(a => (
              <li key={a}>
                <button
                  type="button"
                  className="text-fg hover:bg-bg duration-base w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
                >
                  {a}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

/* ─── Popover menu (anchored below trigger) ─────────── */
const PopoverMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="border-border/60 bg-surface/50 text-fg hover:border-accent/40 duration-base inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium tracking-tight transition-colors"
      >
        <User size={14} strokeWidth={2} />
        Mon compte
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={cn('duration-base transition-transform', open && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'border-border/60 bg-surface absolute top-full left-0 z-30 mt-1 w-52 overflow-hidden rounded-lg border shadow-xl',
          'duration-base origin-top transition-[opacity,transform]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0',
        )}
        role="menu"
      >
        <ul>
          {['Profil', 'Préférences', 'Facturation'].map(a => (
            <li key={a}>
              <button
                type="button"
                className="text-fg hover:bg-bg/60 duration-base w-full px-3 py-2 text-left text-sm transition-colors"
              >
                {a}
              </button>
            </li>
          ))}
          <li className="border-border/50 border-t">
            <button
              type="button"
              className="text-danger-text hover:bg-danger/10 duration-base w-full px-3 py-2 text-left text-sm transition-colors"
            >
              Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

/* ─── Specimens array ────────────────────────────────── */

const SPECIMENS: Specimen[] = [
  {
    id: 'confirm-dialog',
    path: 'inline · destructive modal',
    tags: ['product'],
    ethos: 'confirmation suppression · icon danger + 2 CTAs',
    Component: ConfirmDialog,
  },
  {
    id: 'right-drawer',
    path: 'inline · side drawer right',
    tags: ['product'],
    ethos: 'settings / details · slide from right',
    Component: RightDrawer,
  },
  {
    id: 'bottom-sheet',
    path: 'inline · mobile-first sheet',
    tags: ['product', 'organic'],
    ethos: 'actions mobile · handle + liste',
    Component: BottomSheet,
  },
  {
    id: 'popover-menu',
    path: 'inline · anchored menu',
    tags: ['product', 'minimal'],
    ethos: 'menu utilisateur · anchored trigger',
    Component: PopoverMenu,
  },
];

export function OverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Section number="08" title="overlays">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Tooltips + Modal de base (atoms), puis 4 specimens composés : confirm dialog destructif,
        side drawer droit, bottom sheet mobile, popover menu anchored. Tous respectent ESC pour
        fermer + backdrop cliquable.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atoms
      </h3>
      <div className="mb-10 space-y-6">
        <div>
          <SubLabel>tooltip</SubLabel>
          <div className="flex flex-wrap gap-3">
            {(['top', 'bottom', 'left', 'right'] as const).map(position => (
              <Tooltip key={position} content={`${position} tooltip`} position={position}>
                <Button variant="secondary" size="sm">
                  {position}
                </Button>
              </Tooltip>
            ))}
          </div>
        </div>

        <div>
          <SubLabel>modal</SubLabel>
          <Button onClick={() => setModalOpen(true)}>open modal</Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="example modal">
            <p className="text-muted text-sm">focus trap, escape to close, backdrop click.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                cancel
              </Button>
              <Button size="sm" onClick={() => setModalOpen(false)}>
                confirm
              </Button>
            </div>
          </Modal>
        </div>
      </div>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· specimens</h3>
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
