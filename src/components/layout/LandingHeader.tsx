// ═══════════════════════════════════════════════════
// LandingHeader — public landing top-bar (logo + anchor nav + CTA)
//
// WHAT: Sticky transparent header at the top of the public landing.
//       Logomark at left, anchor nav in the middle (positionnement,
//       expertise, méthode, équipe), magnetic CONTACTER button at
//       right. Backdrops with blur once scrolled.
// WHEN: Mounted by LandingLayout for `/` and `/invite/:code`.
// CHANGE NAV ITEMS: NAV array below — anchors must match section ids
//       in pages/Home.tsx.
// ═══════════════════════════════════════════════════

import { Logomark } from '@components/ui/Logomark';
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
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300',
        scrolled
          ? 'border-fg/10 bg-bg/85 border-b backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex w-full max-w-[2560px] items-center justify-between px-6 py-5 md:px-12 md:py-6">
        {/* Left — Logomark */}
        <a
          href="#hero"
          aria-label="SAW Next — retour en haut"
          className="text-fg focus-visible:ring-fg/30 inline-flex rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <Logomark className="h-6 w-auto md:h-7" />
        </a>

        {/* Middle — anchor nav (hidden on small screens) */}
        <nav aria-label="Sections" className="hidden items-center gap-8 md:flex lg:gap-12">
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-fg/70 hover:text-fg focus-visible:ring-fg/30 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right — Contacter button (always visible) */}
        <MagneticButton strength={0.25} range={120}>
          <a
            href="#contact"
            className={cn(
              'border-fg text-fg hover:bg-fg hover:text-bg focus-visible:ring-fg/30',
              'inline-flex items-center gap-3 rounded-full border px-5 py-2.5 font-mono text-[10px] font-semibold tracking-[0.35em] uppercase transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            <span>CONTACTER</span>
            <span aria-hidden="true">→</span>
          </a>
        </MagneticButton>
      </div>
    </header>
  );
};
