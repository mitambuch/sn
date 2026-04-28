import { cn } from '@utils/cn';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const PRIMARY = ['services', 'cases'] as const;
const SECONDARY = ['journal', 'about'] as const;

/** Asymmetric split — logo mark left, primary + secondary groups separated by
 *  vertical rule, CTA hard right. Visual gravity pulls rightward. */
export function AsymmetricSplit() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/70 bg-bg relative border-b">
      <div className="mx-auto flex max-w-400 items-stretch px-4 md:px-8">
        {/* Logo mark — small square + wordmark */}
        <a href="#home" className="flex items-center gap-2.5 py-4 md:py-5">
          <span className="bg-accent text-on-accent flex h-8 w-8 items-center justify-center text-lg font-black md:h-9 md:w-9">
            N
          </span>
          <span className="text-fg hidden text-base font-semibold tracking-tight sm:inline md:text-lg">
            north/works
          </span>
        </a>

        {/* Desktop nav — pushed right with flex-1 spacer */}
        <div className="hidden flex-1 items-center justify-end gap-8 md:flex lg:gap-12">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-8">
              {PRIMARY.map(link => (
                <li key={link}>
                  <a
                    href={`#${link}`}
                    className="text-fg hover:text-accent-text duration-base text-sm font-medium tracking-tight transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <span className="bg-border/70 h-6 w-px" />

          <nav aria-label="Secondary">
            <ul className="flex items-center gap-6">
              {SECONDARY.map(link => (
                <li key={link}>
                  <a
                    href={`#${link}`}
                    className="text-muted hover:text-fg duration-base text-xs tracking-wide uppercase transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="#quote"
            className="border-fg text-fg hover:bg-fg hover:text-bg duration-base inline-flex items-center gap-2 rounded-none border px-4 py-2 text-sm font-semibold tracking-tight transition-colors"
          >
            Get quote
            <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </div>

        {/* Mobile — CTA + burger */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <a
            href="#quote"
            className="text-fg inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-tight uppercase"
          >
            Quote
            <ArrowRight size={12} strokeWidth={2.5} />
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="text-fg -mr-2 flex h-11 w-11 items-center justify-center"
          >
            {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'border-border bg-bg absolute inset-x-0 top-full z-40 border-b md:hidden',
          'duration-base transition-[opacity,transform]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <div className="px-6 py-6">
          <ul className="mb-4">
            {PRIMARY.map(link => (
              <li key={link} className="border-border/50 border-b">
                <a
                  href={`#${link}`}
                  onClick={() => setOpen(false)}
                  className="text-fg block py-3 text-lg font-semibold tracking-tight"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <ul>
            {SECONDARY.map(link => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  onClick={() => setOpen(false)}
                  className="text-muted block py-2 text-sm tracking-wide uppercase"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
