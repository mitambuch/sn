import { cn } from '@utils/cn';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const LINKS = ['work', 'studio', 'journal', 'contact'] as const;

/** Brutalist header — raw wordmark + thick divider. No decoration, no nesting.
 *  Desktop: inline uppercase-mono links. Mobile: burger → top sheet. */
export function BrutalistNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border relative border-b-2">
      <div className="mx-auto flex max-w-400 items-center justify-between px-4 py-4 md:px-8 md:py-6 lg:px-12">
        {/* Wordmark — the loud one */}
        <a
          href="#home"
          className="text-fg text-3xl leading-none font-bold tracking-tighter uppercase sm:text-4xl md:text-5xl lg:text-6xl"
        >
          studio/44
        </a>

        {/* Desktop inline nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-10">
            {LINKS.map(link => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  className="text-fg hover:text-accent-text duration-base font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="text-fg hover:text-accent-text -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        >
          {open ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Mobile sheet — slides from top, full overlay */}
      <div
        className={cn(
          'border-border bg-bg absolute inset-x-0 top-full z-40 border-b-2 md:hidden',
          'duration-base origin-top transition-[opacity,transform]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <ul className="px-6 py-6">
          {LINKS.map(link => (
            <li key={link} className="border-border/50 border-b last:border-b-0">
              <a
                href={`#${link}`}
                onClick={() => setOpen(false)}
                className="text-fg hover:text-accent-text block py-4 text-2xl font-medium tracking-tight uppercase"
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
