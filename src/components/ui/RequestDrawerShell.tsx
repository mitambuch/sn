// ═══════════════════════════════════════════════════
// RequestDrawerShell — canonical chrome for right-side request drawers
//
// WHAT: Extracts the polished drawer shell (backdrop blur, slide-in from
//       right, header with eyebrow + title + lede + close button, scroll-y
//       body slot, optional sticky footer slot) used by every "open a
//       form in a drawer" interaction across the app. Pattern source =
//       the original BespokeRequestDrawer (owner-validated "magnifique").
// WHEN: Wrap any inquiry / request / call-scheduling drawer. Replaces
//       the hand-rolled chrome that previously duplicated across each
//       drawer file.
// CHANGE WIDTH: pass `widthClass` (default max-w-2xl). max-w-xl for narrow
//   forms, max-w-3xl for richer ones.
// CHANGE TONE: tweak the header padding / typography here once → all
//   drawers across the app shift in lockstep.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RequestDrawerShellProps {
  open: boolean;
  onClose: () => void;
  /** Small uppercase label above the title (eyebrow). */
  eyebrow?: string;
  /** Drawer title — rendered as <h2>, auto Geist Mono bold uppercase via @layer base. */
  title: string;
  /** Subtitle / context paragraph below the title. */
  lede?: string;
  /** Tailwind max-width class. Defaults to max-w-2xl. */
  widthClass?: string;
  /** Drawer body (scroll-y). Usually the form + fieldsets. */
  children: ReactNode;
  /** Optional sticky footer (submit + secondary action). */
  footer?: ReactNode;
}

/** Canonical right-side drawer shell — use everywhere a form lives. */
export const RequestDrawerShell = ({
  open,
  onClose,
  eyebrow,
  title,
  lede,
  widthClass = 'max-w-2xl',
  children,
  footer,
}: RequestDrawerShellProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-(--z-modal)">
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
      />
      <aside
        className={cn(
          'border-border bg-bg absolute inset-y-0 right-0 flex w-full flex-col border-l',
          widthClass,
          'duration-base motion-safe:animate-in motion-safe:slide-in-from-right',
        )}
      >
        <header className="border-border flex items-start justify-between gap-4 border-b px-8 py-6">
          <div className="flex min-w-0 flex-col gap-1">
            {eyebrow && (
              <span className="text-muted text-xs tracking-widest uppercase">{eyebrow}</span>
            )}
            <h2 className="text-fg text-xl tracking-tight">{title}</h2>
            {lede && <p className="text-muted mt-2 text-sm leading-relaxed">{lede}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="text-muted hover:text-fg duration-base focus-visible:ring-accent inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-8">{children}</div>

        {footer && (
          <footer className="border-border bg-bg sticky bottom-0 border-t px-8 py-5">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );
};
