// ═══════════════════════════════════════════════════
// TerminalBar — landing bottom band (v2 : status + clock + Hero-style CTAs)
//
// WHAT: Last band of the page. Holds the small SAW NEXT mark, the live
//       Europe/Zurich clock (refreshing every 1s), the "cooptation
//       ouverte" status dot, and the two Hero-style CTAs (Button variant
//       primary / secondary, mono uppercase, ↗ arrow). The center ticker
//       and the per-section tagline cycling were dropped in v2 — they
//       added noise without adding info.
// WHEN: Mounted once by the landing root inside `<main>`. Sits naturally
//       at the end of the document.
// CHANGE TIMEZONE: 'Europe/Zurich' in formatCHTime — leave as CH/CET.
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { Button } from '@components/ui/Button';
import { useEffect, useState } from 'react';

interface TerminalBarProps {
  /** Status label (e.g. "Cooptation ouverte"). */
  statusLabel: string;
  /** Timezone display label (e.g. "CH / CET"). */
  tzLabel: string;
  /** Primary CTA label (e.g. "Demander un accès"). */
  primaryCtaLabel: string;
  /** Primary CTA href / anchor. */
  primaryCtaHref: string;
  /** Secondary CTA label (e.g. "Espace privé"). */
  secondaryCtaLabel: string;
  /** Secondary CTA href. */
  secondaryCtaHref: string;
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

/** Footer band — small mark + live time + status + Hero-style CTAs. */
export const TerminalBar = ({
  statusLabel,
  tzLabel,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: TerminalBarProps) => {
  const [time, setTime] = useState<string>(() => formatCHTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(formatCHTime(new Date()));
    }, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  const goToHref = (href: string) => () => {
    if (href.startsWith('#')) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  };

  return (
    <div
      role="contentinfo"
      className="bg-ink text-on-ink relative flex flex-col gap-3 px-5 py-5 font-mono text-[11px] tracking-wider md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-6"
    >
      {/* ─── Left : status dot + brand mark + local time ─── */}
      <div className="flex items-center gap-5 md:gap-7">
        <div className="text-bg/85 flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase">
          <span
            aria-hidden="true"
            className="bg-success h-1.5 w-1.5 rounded-full"
            style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
          />
          {statusLabel}
        </div>

        <BrandMark className="text-bg hidden text-xs sm:inline-flex" />

        <div className="text-bg/70 hidden flex-col gap-px text-[9px] leading-tight tracking-widest uppercase sm:flex">
          <span className="text-bg text-[11px] font-medium tracking-[0.04em]">{time}</span>
          <span>{tzLabel}</span>
        </div>
      </div>

      {/* ─── Right : Hero-style CTAs ─── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={goToHref(primaryCtaHref)}
          className="font-mono text-xs tracking-widest uppercase"
        >
          {primaryCtaLabel}
          <span aria-hidden="true">↗</span>
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={goToHref(secondaryCtaHref)}
          className="font-mono text-xs tracking-widest uppercase"
        >
          {secondaryCtaLabel}
          <span aria-hidden="true">↗</span>
        </Button>
      </div>
    </div>
  );
};
