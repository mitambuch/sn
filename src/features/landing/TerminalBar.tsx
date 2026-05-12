// ═══════════════════════════════════════════════════
// TerminalBar — terminal-style page footer
//
// WHAT: Black footer band at the bottom of the landing. Holds the
//       SAW↗NEXT wordmark, live Europe/Zurich time (refreshing every 1s),
//       a "cooptation ouverte" status dot, an infinite ticker, and the
//       two conversion CTAs. Position : plain flow (relative), placed
//       as the LAST child of `main`. Sits at the end of the page, never
//       floats over content.
// WHEN: Mounted once by the landing root inside `<main>`. Hides cleanly
//       on mobile by collapsing the ticker and status (CTAs always
//       remain visible — conversion path is sacred).
// CHANGE HEIGHT: h-14 (56px desktop) / h-13 (52px mobile via responsive).
// CHANGE TIMEZONE: 'Europe/Zurich' in updateTime() — leave as CH/CET.
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { cn } from '@utils/cn';
import { useEffect, useMemo, useState } from 'react';

interface TerminalBarProps {
  /** Ticker items rotating in the center band. Duplicated 2× for the loop. */
  tickerItems: readonly string[];
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

/** Fixed terminal bar — wordmark + live time + status + ticker + CTAs. */
export const TerminalBar = ({
  tickerItems,
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

  const stream = useMemo(() => [...tickerItems, ...tickerItems], [tickerItems]);

  return (
    <div
      role="contentinfo"
      className="bg-fg text-bg relative grid h-13 grid-cols-[auto_1fr_auto] items-center font-mono text-[11px] tracking-wider md:h-14"
    >
      {/* ─── Left : brand + time + status ─── */}
      <div className="border-bg/15 flex h-full items-center gap-3 px-4 md:gap-6 md:border-r md:pr-12 md:pl-6">
        <BrandMark className="text-bg text-xs" />

        <div className="text-bg/60 hidden flex-col gap-px text-[9px] leading-tight tracking-[0.08em] uppercase md:flex">
          <span className="text-bg text-[11px] font-medium tracking-[0.02em]">{time}</span>
          <span>{tzLabel}</span>
        </div>

        <div className="text-bg/70 hidden items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase md:flex">
          <span
            aria-hidden="true"
            className="bg-success h-1.5 w-1.5 rounded-full"
            style={{ animation: 'terminal-pulse 1.4s ease-in-out infinite' }}
          />
          {statusLabel}
        </div>
      </div>

      {/* ─── Center : ticker (desktop only) ─── */}
      <div className="hidden h-full overflow-hidden md:flex md:items-center">
        <div
          className="text-bg/85 flex text-[10px] tracking-[0.15em] whitespace-nowrap uppercase"
          style={{ animation: 'marquee 50s linear infinite' }}
        >
          {stream.map((item, i) => (
            <span key={`${item}-${String(i)}`} className="inline-flex items-center gap-3 px-6">
              {item}
              <span aria-hidden="true" className="text-bg/30">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── Right : CTAs (always visible) ─── */}
      <div className="border-bg/15 flex h-full md:border-l">
        <a
          href={secondaryCtaHref}
          className="border-bg/15 hover:bg-bg/10 text-bg flex items-center gap-2 px-3.5 text-[10px] tracking-[0.12em] uppercase transition-colors first:border-l-0 md:border-l md:px-6"
        >
          <span className="hidden sm:inline">{secondaryCtaLabel}</span>
          <span className="sm:hidden" aria-label={secondaryCtaLabel}>
            ↗
          </span>
        </a>
        <a
          href={primaryCtaHref}
          className={cn(
            'bg-bg text-fg flex items-center gap-2 px-3.5 text-[10px] tracking-[0.12em] uppercase transition-colors md:px-6',
            'hover:bg-bg/85',
          )}
        >
          <span className="hidden sm:inline">{primaryCtaLabel}</span>
          <span className="font-bold sm:hidden" aria-label={primaryCtaLabel}>
            ↗
          </span>
        </a>
      </div>
    </div>
  );
};
