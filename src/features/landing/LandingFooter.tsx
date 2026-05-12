// ═══════════════════════════════════════════════════
// LandingFooter — landing footer with big wordmark
//
// WHAT: 4-column nav + legal + contact + siège, followed by the giant
//       SAW↗NEXT wordmark (font-size ~clamp(80px, 28vw, 440px)) used as
//       brand sign-off, plus the legal bottom strip (©, document
//       confidentiel, version tag).
// WHEN: Last section before the TerminalBar (which is fixed). Mounted
//       once at the bottom of the landing.
// CHANGE WORDMARK SIZE: edit clamp() values in className.
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/** Landing footer — nav columns + monumental wordmark + legal bottom. */
export const LandingFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="overflow-hidden px-5 pt-20 pb-6 md:px-12 md:pt-24">
      {/* ─── 4-col nav grid ─── */}
      <div className="mb-16 grid grid-cols-1 gap-8 font-mono text-[11px] tracking-[0.08em] uppercase sm:grid-cols-2 md:grid-cols-4">
        <FooterCol label={t('landing.footer.colNavLabel')}>
          <FooterLink href="#s01">{t('landing.footer.navIntro')}</FooterLink>
          <FooterLink href="#s03">{t('landing.footer.navPresentation')}</FooterLink>
          <FooterLink href="#s08">{t('landing.footer.navAccess')}</FooterLink>
          <FooterLink href="#s09">{t('landing.footer.navContact')}</FooterLink>
        </FooterCol>

        <FooterCol label={t('landing.footer.colLegalLabel')}>
          <FooterLink href="#">{t('landing.footer.legalMentions')}</FooterLink>
          <FooterLink href="#">{t('landing.footer.legalPrivacy')}</FooterLink>
          <FooterLink href="#">{t('landing.footer.legalTerms')}</FooterLink>
        </FooterCol>

        <FooterCol label={t('landing.footer.colContactLabel')}>
          <FooterLink href="tel:+41787498170">+41 78 749 81 70</FooterLink>
          <FooterLink href="mailto:info@saw-next.ch">info@saw-next.ch</FooterLink>
          <FooterLink href="https://wa.me/41787498170">WhatsApp</FooterLink>
        </FooterCol>

        <FooterCol label={t('landing.footer.colSeatLabel')}>
          <span>{t('landing.footer.seatCity')}</span>
          <span>{t('landing.footer.seatCanton')}</span>
          <span>{t('landing.footer.seatType')}</span>
        </FooterCol>
      </div>

      {/* ─── Monumental wordmark sign-off ─── */}
      <div className="-mx-4 my-6 text-center font-mono text-[clamp(5rem,28vw,27.5rem)] leading-[0.85] font-semibold tracking-[-0.055em] whitespace-nowrap md:-mx-14">
        <BrandMark className="block tracking-[-0.055em]" />
      </div>

      {/* ─── Legal bottom strip ─── */}
      <div className="border-border text-muted mb-16 grid grid-cols-1 gap-1.5 border-t pt-5 font-mono text-[10px] tracking-[0.1em] uppercase md:grid-cols-3">
        <span>{t('landing.footer.copyright')}</span>
        <span className="md:text-center">{t('landing.footer.confidential')}</span>
        <span className="md:text-right">{t('landing.footer.version')}</span>
      </div>
    </footer>
  );
};

const FooterCol = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-muted mb-3 text-[10px]">↘ {label}</span>
    {children}
  </div>
);

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="text-fg hover:border-fg w-fit border-b border-transparent py-1 transition-colors"
  >
    {children}
  </a>
);
