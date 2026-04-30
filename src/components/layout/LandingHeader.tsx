import { MagneticButton } from '@components/ui/MagneticButton';
import { cn } from '@utils/cn';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '#positionnement', label: 'POSITIONNEMENT' },
  { href: '#expertise', label: 'EXPERTISE' },
  { href: '#methode', label: 'MÉTHODE' },
  { href: '#equipe', label: 'ÉQUIPE' },
];

export const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-[background-color,backdrop-filter,border-color,transform] duration-300',
        scrolled
          ? 'border-fg/10 bg-bg/85 border-b backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex w-full max-w-400 items-center justify-between gap-5 px-5 py-4 md:px-6 md:py-5">
        <a
          href="#hero"
          aria-label="SAW Next — retour en haut"
          className="text-fg focus-visible:ring-fg/30 group inline-flex items-center rounded-sm font-mono text-sm font-semibold tracking-[0.32em] uppercase focus-visible:ring-2 focus-visible:outline-none md:text-base"
        >
          SN
        </a>

        <nav
          aria-label="Sections"
          className="border-fg/10 bg-bg/55 hidden items-center gap-1 rounded-sm border px-1 py-1 backdrop-blur-md md:flex"
        >
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted hover:text-fg focus-visible:ring-fg/30 group relative px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.26em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none lg:px-5"
            >
              <span>{item.label}</span>
              <span
                aria-hidden="true"
                className="bg-fg absolute right-4 bottom-1.5 left-4 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <MagneticButton strength={0.22} range={110}>
          <a
            href="#contact"
            className="border-fg text-fg hover:bg-fg hover:text-bg focus-visible:ring-fg/30 inline-flex h-10 items-center gap-3 rounded-sm border px-4 font-mono text-[10px] font-semibold tracking-[0.28em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:h-11 md:px-5"
          >
            <span>CONTACTER</span>
            <span aria-hidden="true">→</span>
          </a>
        </MagneticButton>
      </div>
    </header>
  );
};
