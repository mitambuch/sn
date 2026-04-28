import { useBodyScrollLock } from '@hooks/useBodyScrollLock';
import { cn } from '@utils/cn';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type MegaPanel = {
  label: string;
  sections: { heading: string; links: string[] }[];
  featured: { eyebrow: string; title: string; cta: string };
};

const PANELS: MegaPanel[] = [
  {
    label: 'solutions',
    sections: [
      {
        heading: 'By industry',
        links: ['Hospitality', 'Retail', 'B2B SaaS', 'Editorial'],
      },
      {
        heading: 'By stage',
        links: ['Early concept', 'Rebrand', 'Scale-up', 'Consolidation'],
      },
    ],
    featured: {
      eyebrow: 'Case study',
      title: 'HDVA — rebuilding the digital table',
      cta: 'Read the story',
    },
  },
  {
    label: 'resources',
    sections: [
      {
        heading: 'Read',
        links: ['Journal', 'Field notes', 'Process', 'Guides'],
      },
      {
        heading: 'Reach',
        links: ['Podcast', 'Newsletter', 'Events'],
      },
    ],
    featured: {
      eyebrow: 'Latest',
      title: 'A pattern for building slowly — on purpose',
      cta: 'Read the essay',
    },
  },
];

const SIMPLE = ['studio', 'contact'] as const;

/** Mega dropdown — opens a full-width panel with structured content (sections
 *  + featured card) instead of flat link lists. Desktop: hover/click to open,
 *  ESC or outside-click to close. Mobile: accordions in a drawer. */
export function MegaDropdown() {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  useBodyScrollLock(mobileOpen);

  // Close desktop panel on ESC + outside click
  useEffect(() => {
    if (!openPanel) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenPanel(null);
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [openPanel]);

  return (
    <header ref={headerRef} className="border-border/60 bg-bg relative border-b">
      <div className="mx-auto flex max-w-400 items-center justify-between px-4 py-4 md:px-8 md:py-5">
        <a href="#home" className="text-fg text-lg font-semibold tracking-tight md:text-xl">
          ravel & co
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {PANELS.map(p => (
              <li key={p.label}>
                <button
                  type="button"
                  aria-expanded={openPanel === p.label}
                  onClick={() => setOpenPanel(v => (v === p.label ? null : p.label))}
                  onMouseEnter={() => setOpenPanel(p.label)}
                  className={cn(
                    'text-fg hover:text-accent-text duration-base inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium tracking-tight transition-colors',
                    openPanel === p.label && 'text-accent-text',
                  )}
                >
                  {p.label}
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={cn(
                      'duration-base transition-transform',
                      openPanel === p.label && 'rotate-180',
                    )}
                  />
                </button>
              </li>
            ))}
            {SIMPLE.map(link => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  className="text-fg hover:text-accent-text duration-base inline-block rounded-md px-3 py-2 text-sm font-medium tracking-tight transition-colors"
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
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
          className="text-fg -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        >
          {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
        </button>
      </div>

      {/* Desktop mega panel */}
      {PANELS.map(p => (
        <div
          key={p.label}
          onMouseLeave={() => setOpenPanel(null)}
          className={cn(
            'border-border/60 bg-bg absolute inset-x-0 top-full z-30 hidden border-b shadow-xl md:block',
            'duration-base origin-top transition-[opacity,transform]',
            openPanel === p.label
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-1 opacity-0',
          )}
        >
          <div className="mx-auto grid max-w-400 grid-cols-[1fr_1fr_minmax(280px,1.5fr)] gap-10 px-8 py-10">
            {p.sections.map(s => (
              <div key={s.heading}>
                <h4 className="text-muted mb-4 font-mono text-[10px] tracking-[0.2em] uppercase">
                  {s.heading}
                </h4>
                <ul className="space-y-2.5">
                  {s.links.map(l => (
                    <li key={l}>
                      <a
                        href={`#${l}`}
                        className="text-fg hover:text-accent-text duration-base text-base font-medium tracking-tight transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-surface/60 border-border/50 flex flex-col rounded-lg border p-6">
              <span className="text-accent-text mb-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                {p.featured.eyebrow}
              </span>
              <h5 className="text-fg mb-auto text-xl leading-tight font-medium tracking-tight">
                {p.featured.title}
              </h5>
              <a
                href="#featured"
                className="text-fg hover:text-accent-text duration-base mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                {p.featured.cta}
                <ArrowRight size={14} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Mobile drawer with accordions */}
      <div
        className={cn(
          'border-border bg-bg absolute inset-x-0 top-full z-40 border-b md:hidden',
          'duration-base transition-[opacity,transform]',
          mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {PANELS.map(p => (
            <details key={p.label} className="border-border/50 border-b py-2">
              <summary className="text-fg flex cursor-pointer items-center justify-between py-2 text-lg font-semibold tracking-tight marker:hidden [&::-webkit-details-marker]:hidden">
                {p.label}
                <ChevronDown size={16} strokeWidth={2} />
              </summary>
              <div className="space-y-4 py-3">
                {p.sections.map(s => (
                  <div key={s.heading}>
                    <h4 className="text-muted mb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                      {s.heading}
                    </h4>
                    <ul className="space-y-1">
                      {s.links.map(l => (
                        <li key={l}>
                          <a
                            href={`#${l}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-fg block py-1.5 text-base"
                          >
                            {l}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ))}
          {SIMPLE.map(link => (
            <a
              key={link}
              href={`#${link}`}
              onClick={() => setMobileOpen(false)}
              className="text-fg border-border/50 block border-b py-4 text-lg font-semibold tracking-tight last:border-b-0"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
