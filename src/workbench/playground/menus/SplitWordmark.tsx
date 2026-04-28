import { cn } from '@utils/cn';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const LINKS = ['projects', 'process', 'people', 'notes'] as const;

/** Split wordmark — brand name broken across the header, menu nested
 *  between the two halves. Maximally typographic; design-studio signature. */
export function SplitWordmark() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border bg-bg relative border-b-2">
      {/* Desktop — split wordmark + inline nav between */}
      <div className="mx-auto hidden max-w-400 items-end justify-between gap-8 px-8 pt-8 pb-3 md:flex">
        <span className="text-fg text-5xl leading-none font-black tracking-[-0.04em] uppercase lg:text-6xl xl:text-7xl">
          studio
        </span>

        <nav aria-label="Primary" className="mb-2 flex-1">
          <ul className="flex items-center justify-center gap-8">
            {LINKS.map(link => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  className="text-fg hover:text-accent-text duration-base text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <span className="text-fg text-5xl leading-none font-black tracking-[-0.04em] uppercase italic lg:text-6xl xl:text-7xl">
          atelier
        </span>
      </div>

      {/* Mobile — simpler, stacked */}
      <div className="flex items-center justify-between px-4 py-4 md:hidden">
        <a
          href="#home"
          className="text-fg text-2xl leading-none font-black tracking-tighter uppercase"
        >
          studio<span className="text-accent italic">/atelier</span>
        </a>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="text-fg -mr-2 flex h-11 w-11 items-center justify-center"
        >
          {open ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'border-border bg-bg absolute inset-x-0 top-full z-40 border-b-2 md:hidden',
          'duration-base transition-[opacity,transform]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <ul className="px-6 py-4">
          {LINKS.map(link => (
            <li key={link} className="border-border/50 border-b last:border-b-0">
              <a
                href={`#${link}`}
                onClick={() => setOpen(false)}
                className="text-fg block py-3 text-xl font-bold tracking-tight uppercase"
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
