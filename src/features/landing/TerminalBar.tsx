// ═══════════════════════════════════════════════════
// TerminalBar — landing bottom band (v3 : status + clock + 3 CTAs)
//
// WHAT: Last band of the page. Holds the small SAW NEXT mark, the live
//       Europe/Zurich clock on a single line, the "cooptation ouverte"
//       status dot, and three CTAs in the dark-inverted Hero style :
//         - "Appeler" (tel:) raccourci, white-border ghost
//         - "Demander un accès" white-solid (primary on a dark bar)
//         - "Espace privé" white-border (secondary on a dark bar)
// WHEN: Mounted once by the landing root inside `<main>`. Sits naturally
//       at the end of the document.
// CHANGE TIMEZONE: 'Europe/Zurich' in formatCHTime — leave as CH/CET.
// CHANGE PHONE: PHONE constant below (mirrored from Interlocutor).
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PHONE_TEL = '+41787498170';

interface TerminalBarProps {
  /** Status label (e.g. "Cooptation ouverte"). */
  statusLabel: string;
  /** Timezone display label (e.g. "CH / CET"). */
  tzLabel: string;
  /** Primary CTA label (e.g. "Demander un accès"). */
  primaryCtaLabel: string;
  /** Primary CTA — invoked on click (opens the access request modal). */
  onPrimaryCta: () => void;
  /** Secondary CTA label (e.g. "Espace privé"). Omit to hide the
   *  button entirely (vitrine launch mode). */
  secondaryCtaLabel?: string | undefined;
  /** Secondary CTA — invoked on click (e.g. opens the global LoginModal).
   *  Omit alongside the label to hide the button. */
  onSecondaryCta?: (() => void) | undefined;
  /** Call CTA label (e.g. "Appeler"). */
  callCtaLabel: string;
}

function formatCHTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-CH', {
    timeZone: 'Europe/Zurich',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

/** Footer band — small mark + single-line clock + status + 3 CTAs. */
export const TerminalBar = ({
  statusLabel,
  tzLabel,
  primaryCtaLabel,
  onPrimaryCta,
  secondaryCtaLabel,
  onSecondaryCta,
  callCtaLabel,
}: TerminalBarProps) => {
  const { t } = useTranslation();
  const [time, setTime] = useState<string>(() => formatCHTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(formatCHTime(new Date()));
    }, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  return (
    <div
      role="contentinfo"
      className="bg-ink text-on-ink flex items-center justify-between gap-3 px-5 py-4 font-mono text-[11px] tracking-wider md:gap-8 md:px-10 md:py-6"
    >
      {/* ─── Left : status dot + brand + single-line clock ───
           On mobile, the status label wraps onto 2 lines (max-w cap) so
           the 3 CTAs on the right can stay on the same row. The dot stays
           vertically centred next to the 2-line block. */}
      <div className="flex min-w-0 items-center gap-x-5 md:flex-nowrap md:gap-x-7">
        <div className="text-bg/90 flex items-center gap-2 text-[9px] leading-[1.15] tracking-[0.18em] uppercase sm:text-[10px]">
          <span
            aria-hidden="true"
            className="bg-success h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
          />
          <span className="max-w-22 sm:max-w-none">{statusLabel}</span>
        </div>

        <BrandMark className="text-bg hidden text-xs sm:inline-flex" />

        <div className="text-bg/85 hidden items-baseline gap-2 text-[11px] tracking-widest uppercase sm:flex">
          <span className="text-bg font-medium tabular-nums">{time}</span>
          <span aria-hidden="true" className="text-bg/40">
            ·
          </span>
          <span className="text-bg/65 text-[10px]">{tzLabel}</span>
        </div>
      </div>

      {/* ─── Right : 3 CTAs (Appeler · Demander · Espace) ───
           On mobile : compressed labels, no-wrap, smaller padding so the
           3 buttons fit on a single line at 320px. On sm+ : full labels. */}
      <div className="flex shrink-0 flex-nowrap items-center justify-end gap-1.5 sm:gap-3">
        {/* Call — outline ghost, icon-first (label hidden on mobile) */}
        <a
          href={`tel:${PHONE_TEL}`}
          className="border-bg/40 text-bg hover:border-bg hover:bg-bg/10 focus-visible:ring-bg/40 inline-flex items-center gap-1.5 rounded-full border px-3 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none sm:gap-2 sm:px-4 sm:text-xs"
        >
          <Phone size={12} strokeWidth={2} aria-hidden="true" />
          <span className="hidden sm:inline">{callCtaLabel}</span>
        </a>

        {/* Primary — Demander — white solid (short label on mobile) */}
        <button
          type="button"
          onClick={onPrimaryCta}
          className="bg-bg text-fg hover:bg-bg/90 focus-visible:ring-bg/40 inline-flex items-center gap-1 rounded-full px-3 py-2 font-mono text-[10px] tracking-widest whitespace-nowrap uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none sm:gap-2 sm:px-5 sm:text-xs"
        >
          <span className="sm:hidden">{t('landing.terminal.requestShort')}</span>
          <span className="hidden sm:inline">{primaryCtaLabel}</span>
          <span aria-hidden="true">↗</span>
        </button>

        {/* Secondary — Espace — white border (short label on mobile).
            Hidden when secondaryCtaLabel/onSecondaryCta omitted (vitrine
            launch mode where member access is gated). */}
        {secondaryCtaLabel && onSecondaryCta ? (
          <button
            type="button"
            onClick={onSecondaryCta}
            className="border-bg/50 text-bg hover:border-bg hover:bg-bg/10 focus-visible:ring-bg/40 inline-flex items-center gap-1 rounded-full border px-3 py-2 font-mono text-[10px] tracking-widest whitespace-nowrap uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none sm:gap-2 sm:px-5 sm:text-xs"
          >
            <span className="sm:hidden">{t('landing.terminal.privateShort')}</span>
            <span className="hidden sm:inline">{secondaryCtaLabel}</span>
            <span aria-hidden="true">↗</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
