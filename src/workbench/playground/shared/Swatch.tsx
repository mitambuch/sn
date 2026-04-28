import { useEffect, useState } from 'react';

import { Copyable } from './Copyable';

/** Resolve the computed value of a CSS custom property (hex, rgb, hsl, …). */
function readVar(token: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${token}`).trim();
}

/** Hex `#rrggbb` (or `#rgb`) → `[r, g, b]` in 0-255. Returns null on junk. */
function parseHex(input: string): [number, number, number] | null {
  const hex = input.replace('#', '');
  if (hex.length === 3) {
    const r = parseInt(hex[0]! + hex[0]!, 16);
    const g = parseInt(hex[1]! + hex[1]!, 16);
    const b = parseInt(hex[2]! + hex[2]!, 16);
    if ([r, g, b].every(Number.isFinite)) return [r, g, b];
    return null;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if ([r, g, b].every(Number.isFinite)) return [r, g, b];
    return null;
  }
  return null;
}

function rgbStr(rgb: [number, number, number]): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function hslStr(rgb: [number, number, number]): string {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/** Large color swatch — big preview block, token name, HEX / RGB / HSL values
 *  all individually copyable, plus the Tailwind bg- / text- class chips.
 *  Single source of truth: `src/index.css` @theme — values are read live. */
export function Swatch({ name, token }: { name: string; token: string }) {
  const [hex, setHex] = useState('');

  useEffect(() => {
    const sync = () => setHex(readVar(token));
    sync();
    // Re-read on theme change (data-theme attribute flips on <html>)
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => obs.disconnect();
  }, [token]);

  const rgb = parseHex(hex);
  const rgbValue = rgb ? rgbStr(rgb) : '—';
  const hslValue = rgb ? hslStr(rgb) : '—';

  return (
    <article className="border-border/60 bg-bg overflow-hidden rounded-xl border">
      {/* Big preview block */}
      <div
        className="border-border/40 h-32 w-full border-b md:h-36"
        style={{ backgroundColor: `var(--color-${token})` }}
        aria-label={`${name} color preview`}
        role="img"
      />

      {/* Metadata */}
      <div className="px-4 py-4 md:px-5">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-fg text-base font-semibold tracking-tight md:text-lg">{name}</h4>
          <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
            --color-{token}
          </span>
        </div>

        <dl className="mt-3 space-y-1.5">
          <Row label="HEX" value={hex || '—'} />
          <Row label="RGB" value={rgbValue} />
          <Row label="HSL" value={hslValue} />
        </dl>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Copyable text={`bg-${token}`} />
          <Copyable text={`text-${token}`} />
          <Copyable text={`border-${token}`} />
        </div>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <dt className="text-muted w-10 font-mono text-[10px] tracking-[0.15em] uppercase">{label}</dt>
      <dd className="text-fg font-mono text-xs">
        <Copyable text={value} />
      </dd>
    </div>
  );
}
