// ═══════════════════════════════════════════════════
// PulseDot — heartbeat point with halo, GPU-only
//
// WHAT: A small high-luminance dot wrapped in a soft halo, both
//       scaling on a 60bpm-feel cadence (~1s loop). Pure CSS keyframes
//       on transform + opacity (GPU-only). The dot itself is the
//       interactive target — the halo is `pointer-events: none`.
// WHEN: Threshold (acte 0) as the only interactable element on the
//       page; the user must hold-click to advance.
// CHANGE BPM: tweak `--pulse-duration` (default 1s ≈ 60 bpm).
// CHANGE COLOR: text-* on parent — currentColor cascades.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import type { ButtonHTMLAttributes } from 'react';

interface PulseDotProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
  haloSize?: number;
}

export const PulseDot = ({ size = 6, haloSize = 80, className, ...rest }: PulseDotProps) => {
  return (
    <button
      type="button"
      aria-label="Entrer dans l'expérience"
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-transparent p-0',
        'focus-visible:outline-none',
        className,
      )}
      style={{ width: haloSize, height: haloSize }}
      {...rest}
    >
      {/* Halo — soft radial glow, pulses with the dot */}
      <span
        aria-hidden="true"
        className="animate-pulse-halo absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 35%, rgba(255,255,255,0) 70%)',
          filter: 'blur(8px)',
        }}
      />
      {/* The dot itself */}
      <span
        aria-hidden="true"
        className="bg-fg animate-pulse-dot relative block rounded-full"
        style={{ width: size, height: size }}
      />
    </button>
  );
};
