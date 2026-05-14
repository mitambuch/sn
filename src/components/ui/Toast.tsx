// ═══════════════════════════════════════════════════
// Toast — temporary notification popup
//
// WHAT: Displays stacked notifications with auto-dismiss and manual close
// WHEN: Use after actions (form submit, error, success) to give feedback
// CHANGE COLORS: Edit status tokens (success, danger, warning, info) in src/index.css
// CHANGE POSITION: Modify the position classes in ToastContainer below
// CHANGE DURATION: Edit DEFAULT_DURATION in src/hooks/useToast.ts
// ═══════════════════════════════════════════════════

import type { ToastData } from '@hooks/useToast';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { AlertTriangle, Check, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';

// WHY: Owner direction 2026-05-14 16:13 — "le bouton qui affiche que ça
// a bien été envoyé il faut pas qu'il ai d'effet de glass aussi marqué
// parce on arrive pas à lire le texte dedans". The toast now sits on a
// solid bg-bg surface with the variant colour shown via a left accent
// strip + icon only — readable against any underlying page.
const variantStyles: Record<ToastData['variant'], string> = {
  success:
    'border-success/40 [&_[data-variant-strip]]:bg-success [&_[data-variant-icon]]:text-success',
  error: 'border-danger/40 [&_[data-variant-strip]]:bg-danger [&_[data-variant-icon]]:text-danger',
  warning:
    'border-warning/40 [&_[data-variant-strip]]:bg-warning [&_[data-variant-icon]]:text-warning',
  info: 'border-info/40 [&_[data-variant-strip]]:bg-info [&_[data-variant-icon]]:text-info',
};

// WHY: strokeWidth 1.5 matches the lighter icon weight used across the system
const variantIcons: Record<ToastData['variant'], ReactNode> = {
  success: <Check size={16} strokeWidth={1.75} />,
  error: <X size={16} strokeWidth={1.75} />,
  warning: <AlertTriangle size={16} strokeWidth={1.75} />,
  info: <Info size={16} strokeWidth={1.75} />,
};

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  return (
    <div
      role="alert"
      className={cn(
        // WHY max-w-[calc(100vw-2rem)]: on 320px viewports, w-80 (320px) + the
        // right-4 positioning (~16px gutter) overflowed horizontally. Desktop
        // keeps the 320px target; mobile clips to fit.
        // Solid bg-bg + variant accent strip — no glass blur (text would be
        // unreadable against busy backgrounds).
        'bg-bg text-fg pointer-events-auto relative flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg',
        'animate-toast-in',
        variantStyles[toast.variant],
      )}
    >
      <span aria-hidden="true" data-variant-strip className="absolute inset-y-0 left-0 w-1" />
      <span data-variant-icon className="mt-0.5 shrink-0 pl-1" aria-hidden="true">
        {toast.icon ?? variantIcons[toast.variant]}
      </span>
      <div className="min-w-0 flex-1">
        {toast.title && <p className="text-fg text-sm font-semibold">{toast.title}</p>}
        <p className={cn('text-fg text-sm', toast.title && 'text-muted mt-0.5')}>{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-muted hover:text-fg focus-visible:ring-accent mt-0.5 shrink-0 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Dismiss notification"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}

/** Renders all active toasts. Place once in your app layout. */
export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed right-4 bottom-4 z-[var(--z-toast)] flex flex-col gap-2"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
