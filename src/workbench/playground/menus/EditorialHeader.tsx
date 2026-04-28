import { cn } from '@utils/cn';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const LINKS = ['features', 'stories', 'journal', 'archive', 'about'] as const;

/** Editorial header — magazine-style stacked wordmark + micro-nav separators.
 *  Evokes a masthead. Desktop: two-row with hair rule. Mobile: wordmark +
 *  burger, sheet reveals full masthead. */
export function EditorialHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-bg relative">
      <div className="mx-auto max-w-400 px-4 pt-5 pb-3 md:px-8 md:pt-8 md:pb-5">
        <div className="flex items-start justify-between gap-4">
          <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase max-md:hidden">
            Vol. IX · N°32
          </span>

          <a
            href="#home"
            className="text-fg text-center font-medium tracking-tight italic max-md:flex-1 md:mx-auto"
          >
            <span className="block text-3xl md:text-5xl lg:text-6xl">Maison Claire</span>
            <span className="text-muted mt-0.5 block font-mono text-[9px] tracking-[0.3em] uppercase not-italic md:mt-1">
              Est. 2019 — Lausanne
            </span>
          </a>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="text-fg -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase max-md:hidden">
            Dim. 19 Avr.
          </span>
        </div>
      </div>

      {/* Micro-nav row — desktop only */}
      <nav aria-label="Primary" className="border-border/60 hidden border-y md:block">
        <ul className="mx-auto flex max-w-400 items-center justify-center gap-0 px-8">
          {LINKS.map((link, i) => (
            <li key={link} className="flex items-center">
              {i > 0 && <span className="text-muted/40 px-4 font-mono text-xs">/</span>}
              <a
                href={`#${link}`}
                className="text-fg hover:text-accent-text duration-base inline-block py-3 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile sheet */}
      <div
        className={cn(
          'border-border bg-bg absolute inset-x-0 top-full z-40 border-y md:hidden',
          'duration-base transition-[opacity,transform]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <ul className="px-6 py-6">
          {LINKS.map(link => (
            <li key={link} className="border-border/40 border-b last:border-b-0">
              <a
                href={`#${link}`}
                onClick={() => setOpen(false)}
                className="text-fg hover:text-accent-text block py-3 text-lg font-medium tracking-tight italic"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
