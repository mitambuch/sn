// ═══════════════════════════════════════════════════
// LandingFooter — landing footer with breathing wordmark
//
// WHAT: 4-column grid with hairline dividers (nav / legal / contact /
//       siège) so the columns don't float independently. Followed by
//       the monumental SAW↗NEXT wordmark — Reveal animation on scroll-
//       in (fade-up + blur clear) plus a slow letter-spacing breathing
//       loop so the word stays alive. Legal bottom strip closes the
//       footer.
// WHEN: Last section before the TerminalBar. Mounted once at the
//       bottom of the landing.
// CHANGE WORDMARK SIZE: edit clamp() values in className.
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { useReveal } from '@hooks/useReveal';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/** Landing footer — gridded nav columns + breathing wordmark + legal bottom. */
export const LandingFooter = () => {
  const { t } = useTranslation();
  const wordmarkRef = useReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <footer className="bg-bg relative overflow-hidden px-5 pt-20 pb-6 md:px-12 md:pt-24">
      {/* ─── 4-col nav grid with hairline dividers (no more floating contact) ─── */}
      <div className="border-border divide-border rounded-card mb-16 grid grid-cols-1 divide-y overflow-hidden border font-mono text-[11px] tracking-wider uppercase sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4">
        <FooterCol label={t('landing.footer.colNavLabel')}>
          <FooterLink href="#s01">{t('landing.footer.navIntro')}</FooterLink>
          <FooterLink href="#s03">{t('landing.footer.navPresentation')}</FooterLink>
          <FooterLink href="#s04">{t('landing.principles.tag')}</FooterLink>
          <FooterLink href="#s05">{t('landing.domains.tag')}</FooterLink>
          <FooterLink href="#s08">{t('landing.footer.navAccess')}</FooterLink>
          <FooterLink href="#s09">{t('landing.footer.navContact')}</FooterLink>
        </FooterCol>

        <FooterCol label={t('landing.footer.colLegalLabel')}>
          <FooterLink href="#">{t('landing.footer.legalMentions')}</FooterLink>
          <FooterLink href="#">{t('landing.footer.legalPrivacy')}</FooterLink>
          <FooterLink href="#">{t('landing.footer.legalTerms')}</FooterLink>
        </FooterCol>

        <FooterCol label={t('landing.footer.colContactLabel')}>
          <FooterContactLine href="tel:+41787498170" hint={t('landing.interlocutor.phone')}>
            +41 78 749 81 70
          </FooterContactLine>
          <FooterContactLine href="mailto:info@saw-next.ch" hint={t('landing.interlocutor.email')}>
            info@saw-next.ch
          </FooterContactLine>
          <FooterContactLine
            href="https://wa.me/41787498170"
            hint={t('landing.interlocutor.whatsapp')}
          >
            WhatsApp
          </FooterContactLine>
        </FooterCol>

        <FooterCol label={t('landing.footer.colSeatLabel')}>
          <span className="text-fg block py-1 text-[11px]">{t('landing.footer.seatCity')}</span>
          <span className="text-muted block py-1 text-[10px] normal-case">
            {t('landing.footer.seatCanton')}
          </span>
          <span className="text-muted block py-1 text-[10px]">{t('landing.footer.seatType')}</span>
        </FooterCol>
      </div>

      {/* ─── Monumental wordmark — Reveal scroll-in + slow breathing loop ─── */}
      <div
        ref={wordmarkRef}
        className={cn(
          '-mx-4 my-6 text-center font-mono text-[clamp(5rem,28vw,27.5rem)] leading-[0.85] font-semibold tracking-[-0.055em] whitespace-nowrap md:-mx-14',
          'animate-wordmark-breathe',
        )}
        style={{ ['--reveal-y-md' as string]: '60px' }}
      >
        <BrandMark className="block tracking-[-0.055em]" />
      </div>

      {/* ─── Legal bottom strip ─── */}
      <div className="border-border text-muted mb-16 grid grid-cols-1 gap-1.5 border-t pt-5 font-mono text-[10px] tracking-widest uppercase md:grid-cols-3">
        <span>{t('landing.footer.copyright')}</span>
        <span className="md:text-center">{t('landing.footer.confidential')}</span>
        <span className="md:text-right">{t('landing.footer.version')}</span>
      </div>
    </footer>
  );
};

const FooterCol = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1 p-5 md:p-6">
    <span className="text-muted mb-3 block text-[10px] tracking-widest">↘ {label}</span>
    <div className="flex flex-col gap-1">{children}</div>
  </div>
);

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="text-fg hover:border-fg w-fit border-b border-transparent py-1 text-[11px] transition-colors"
  >
    {children}
  </a>
);

/** Contact line with hint label so the value never floats orphaned. */
const FooterContactLine = ({
  href,
  hint,
  children,
}: {
  href: string;
  hint: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    className="border-border hover:border-fg group flex flex-col gap-0.5 border-b py-2 transition-colors last:border-b-0"
  >
    <span className="text-muted text-[9px] tracking-widest uppercase">{hint}</span>
    <span className="text-fg text-[12px] tracking-tight normal-case transition-transform group-hover:translate-x-0.5">
      {children}
    </span>
  </a>
);
