// ═══════════════════════════════════════════════════
// Modal — dialog overlay
//
// WHAT: Renders an accessible modal with focus trap and backdrop
// WHEN: Use for confirmations, forms, or detail views
// CHANGE COLORS: Edit design tokens in src/index.css
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Accessible modal dialog with focus trap, backdrop, and portal rendering. */
export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements =
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  // Body lock + keydown listener — re-runs harmlessly when handleKeyDown
  // identity changes (e.g. parent renders pass a new `onClose` reference).
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-active');
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-active');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Focus management — runs ONLY on the open/close transition. Splitting
  // this from the body-lock effect above prevents the focus dance from
  // re-firing on every parent re-render. Incident 2026-05-14 13:02 : owner
  // typed one character → onClose ref changed → previous unified useEffect
  // cleanup focused the previously-focused element (body) and re-setup
  // focused the first focusable (the X close button), stealing focus from
  // the input the user was typing in. One character at a time.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const firstFocusable = dialogRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        (firstFocusable ?? dialogRef.current).focus();
      }
    }, 0);
    return () => {
      clearTimeout(timer);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="duration-base absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog — tabIndex for focus fallback when no focusable children.
          max-h + overflow-y-auto so tall content (long forms, wizards) scrolls
          inside the modal instead of pushing off-screen on mobile. The outer
          flex container above gives a 16px margin from the viewport edge
          (24px on sm+), so the panel never glues to the screen border. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          // overscroll-contain: when the dialog scrolls past its end, the scroll
          // does NOT chain to the page behind it (paired with the body lock in
          // the effect above) — the popup scrolls, the site stays put.
          'border-border bg-bg/95 relative z-10 max-h-full w-full max-w-lg overflow-y-auto overscroll-contain rounded-lg border p-6 backdrop-blur-md',
          'duration-base shadow-lg transition-[transform,opacity]',
          className,
        )}
      >
        {/* Header */}
        <div className={cn('mb-4 flex items-center', title ? 'justify-between' : 'justify-end')}>
          {title && (
            <h2 id={titleId} className="text-fg text-lg font-semibold">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="text-muted hover:text-fg focus-visible:ring-accent duration-base rounded-md p-1 transition-colors focus-visible:ring-2"
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>,
    document.body,
  );
};
