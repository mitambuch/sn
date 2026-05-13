// ═══════════════════════════════════════════════════
// ShareActionRow — channel buttons for sharing a URL
//
// WHAT: A row of buttons (WhatsApp, Email, SMS, Copy URL) that all share
//       the same pre-built URL + message. Uses lib/sharing helpers for
//       deeplink construction. Designed for both the public SharePage
//       (recipient re-shares) and the AdminShareCodes table (Salva
//       quick-shares from the list).
// WHEN: Anywhere you need a one-row share menu for a known URL.
// CHANGE LAYOUT: edit the flex container className. Buttons are atoms
//       and can be reordered by reordering props.
// ═══════════════════════════════════════════════════

import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';

import { buildMailtoUrl, buildSmsUrl, buildWhatsAppUrl, copyToClipboard } from '@/lib/sharing';

interface ShareActionRowProps {
  /** Absolute URL of the resource being shared. */
  url: string;
  /** Pre-filled message body (WhatsApp / SMS / email). */
  message: string;
  /** Optional email subject — defaults to "Sawnext — Une fiche pour vous". */
  emailSubject?: string;
  /** Hide some channels if the context doesn't fit (e.g. SMS in a list). */
  channels?: ReadonlyArray<'whatsapp' | 'email' | 'sms' | 'copy'>;
  /** Visual variant — "row" (full labels) or "compact" (icons only). */
  variant?: 'row' | 'compact';
  className?: string;
}

const DEFAULT_CHANNELS: ShareActionRowProps['channels'] = ['whatsapp', 'email', 'sms', 'copy'];

const BTN_BASE =
  'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase duration-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

/**
 * Row of share-channel buttons. WhatsApp first (the primary brand channel
 * for HNW concierge), then Email / SMS / Copy. All open in a new tab.
 */
export const ShareActionRow = ({
  url,
  message,
  emailSubject = 'Sawnext — Une fiche pour vous',
  channels = DEFAULT_CHANNELS,
  variant = 'row',
  className,
}: ShareActionRowProps) => {
  const { toast } = useToast();
  const compact = variant === 'compact';

  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    toast({
      variant: ok ? 'success' : 'error',
      message: ok ? 'Lien copié.' : 'Copie du lien échouée.',
    });
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {channels.includes('whatsapp') && (
        <a
          href={buildWhatsAppUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(BTN_BASE, 'border-fg bg-fg text-bg hover:bg-fg/90')}
          aria-label="Envoyer sur WhatsApp"
        >
          <span aria-hidden="true">▸</span>
          {compact ? 'WhatsApp' : 'Envoyer sur WhatsApp'}
        </a>
      )}
      {channels.includes('email') && (
        <a
          href={buildMailtoUrl({ subject: emailSubject, body: message })}
          className={cn(BTN_BASE, 'border-border text-fg hover:border-fg/60')}
          aria-label="Envoyer par email"
        >
          {compact ? 'Email' : 'Email'}
        </a>
      )}
      {channels.includes('sms') && (
        <a
          href={buildSmsUrl(message)}
          className={cn(BTN_BASE, 'border-border text-fg hover:border-fg/60')}
          aria-label="Envoyer par SMS"
        >
          SMS
        </a>
      )}
      {channels.includes('copy') && (
        <button
          type="button"
          onClick={() => {
            void handleCopy();
          }}
          className={cn(BTN_BASE, 'border-border text-fg hover:border-fg/60')}
          aria-label="Copier le lien"
        >
          Copier le lien
        </button>
      )}
    </div>
  );
};
