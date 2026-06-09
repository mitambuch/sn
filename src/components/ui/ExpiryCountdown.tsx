// ═══════════════════════════════════════════════════
// ExpiryCountdown — live "available for Xj Xh Xm Xs" banner
//
// WHAT: Counts down to a deadline, ticking every second. When the
//       deadline passes it calls onExpire() (so the parent can hide
//       whatever the countdown guards) and renders nothing.
// WHEN: Share pages / limited-time content. Pass an ISO date string.
// CHANGE LOOK: edit the banner classes below.
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ExpiryCountdownProps {
  /** ISO date-time the content stops being available. */
  expiresAt: string;
  /** Fired once the deadline passes. */
  onExpire: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Live j-h-m-s countdown banner; calls onExpire() at zero. */
export const ExpiryCountdown = ({ expiresAt, onExpire }: ExpiryCountdownProps) => {
  const { t } = useTranslation();
  const target = new Date(expiresAt).getTime();
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    const tick = () => {
      const r = target - Date.now();
      setRemaining(r);
      if (r <= 0) onExpire();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target, onExpire]);

  if (remaining <= 0) return null;
  const totalSec = Math.floor(remaining / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  return (
    <div className="border-fg/10 bg-surface/60 flex items-center justify-center gap-2 border-b px-6 py-3 text-center font-mono text-[11px] tracking-[0.2em] uppercase md:px-10">
      <span className="text-muted">{t('share.countdown.available')}</span>
      <span className="text-fg tabular-nums">
        {days > 0 ? `${String(days)}${t('share.countdown.dayUnit')} ` : ''}
        {pad(hours)}h {pad(mins)}m {pad(secs)}s
      </span>
    </div>
  );
};
