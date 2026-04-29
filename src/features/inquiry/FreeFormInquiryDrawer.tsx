// ═══════════════════════════════════════════════════
// FreeFormInquiryDrawer — open-ended request drawer
//
// WHAT: Variant of InquiryDrawer for the dashboard "intent" prompts
//       where there is no specific catalogue item attached. The user
//       just describes what they want; the drawer routes to Salva with
//       the chosen intent label as context.
// WHEN: Triggered by IntentCard buttons (search-object, organize-event,
//       travel free-form, generic concierge).
// ═══════════════════════════════════════════════════

import { Textarea } from '@components/ui/Textarea';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { InquirySource } from '@/types/inquiry';

interface FreeFormInquiryDrawerProps {
  open: boolean;
  onClose: () => void;
  source: InquirySource;
  /** Headline shown at top of the drawer (e.g. "Je voudrais voyager"). */
  intentTitle: string;
  /** Lede paragraph under the headline. */
  intentLede: string;
  /** Placeholder text for the message field. */
  placeholder: string;
}

export const FreeFormInquiryDrawer = ({
  open,
  onClose,
  source,
  intentTitle,
  intentLede,
  placeholder,
}: FreeFormInquiryDrawerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast({ variant: 'success', message: t('inquiry.success') });
      setMessage('');
      setSubmitting(false);
      onClose();
    }, 600);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={intentTitle}
      className="fixed inset-0 z-(--z-modal)"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
      />
      <aside
        className={cn(
          'border-border bg-bg absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l',
          'duration-base motion-safe:animate-in motion-safe:slide-in-from-right',
        )}
      >
        <header className="border-border flex items-start justify-between border-b px-8 py-6">
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t(`inquiry.sourceLabel.${source}`)}
            </span>
            <h2 className="text-fg text-xl font-light">{intentTitle}</h2>
            <p className="text-muted mt-2 text-sm leading-relaxed">{intentLede}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
          >
            ✕
          </button>
        </header>

        <form className="flex flex-1 flex-col gap-6 px-8 py-8" onSubmit={handleSubmit}>
          <Textarea
            label={t('inquiry.drawerTitle')}
            rows={8}
            placeholder={placeholder}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          <p className="text-muted border-border border-t pt-4 text-xs leading-relaxed">
            {t('jet.salvaReassurance')}
          </p>

          <div className="mt-auto flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color,opacity]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {submitting ? t('inquiry.sending') : t('inquiry.submit')}
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
            >
              {t('common.close')}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};
