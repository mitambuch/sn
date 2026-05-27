// ═══════════════════════════════════════════════════
// FreeFormInquiryDrawer — open-ended request drawer
//
// WHAT: Variant of InquiryDrawer for the dashboard "intent" prompts
//       where there is no specific catalogue item attached. The user
//       just describes what they want; the drawer routes to Salva with
//       the chosen intent label as context.
// WHEN: Triggered by IntentCard buttons (search-object, organize-event,
//       travel free-form, generic concierge).
// CHROME: <RequestDrawerShell /> canonical.
// ═══════════════════════════════════════════════════

import { ImageUpload } from '@components/ui/ImageUpload';
import { RequestDrawerShell } from '@components/ui/RequestDrawerShell';
import { Textarea } from '@components/ui/Textarea';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { submitInquiry } from '@/lib/inquiry';
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
  const { session } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await submitInquiry({
      source,
      message,
      userId: session?.user?.id,
    });
    setSubmitting(false);
    if (!result.ok) {
      toast({ variant: 'error', message: result.error ?? t('inquiry.error') });
      return;
    }
    toast({ variant: 'success', message: t('inquiry.success') });
    setMessage('');
    onClose();
  };

  return (
    <RequestDrawerShell
      open={open}
      onClose={onClose}
      eyebrow={t(`inquiry.sourceLabel.${source}`)}
      title={intentTitle}
      lede={intentLede}
      widthClass="max-w-lg"
    >
      <form
        className="flex flex-col gap-6"
        onSubmit={e => {
          void handleSubmit(e);
        }}
      >
        <Textarea
          label={t('inquiry.drawerTitle')}
          rows={6}
          placeholder={placeholder}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <ImageUpload label={t('inquiry.attachLabel')} hint={t('inquiry.attachHint')} maxFiles={3} />

        <p className="text-muted border-border border-t pt-4 text-xs leading-relaxed">
          {t('jet.focalReassurance')}
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
            <span aria-hidden="true">↗</span>
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
    </RequestDrawerShell>
  );
};
