// ═══════════════════════════════════════════════════
// LandingFooter — landing footer (v2 : compacted, animated wordmark)
//
// WHAT: Three compact column blocks (Navigation / Legal / Siège) above
//       a full-width SAW NEXT wordmark with the infinite breathing
//       stroke-draw + liquid-fill loop. Contact column dropped (handled
//       by Valmont's interlocutor section), bottom legal strip dropped
//       (no document-version metadata in the visible footer), ticker
//       handled by TerminalBar.
// WHEN: Last block of the landing, before the TerminalBar.
// CHANGE COLUMNS:
//       - Seat city : edit via Sanity Studio (landing singleton →
//         footerLocation field). Falls back to landing.footer.seatCity
//         in src/locales/{fr,en}.json when Sanity is empty.
//       - Nav / legal / canton / type : src/locales/{fr,en}.json under
//         landing.footer.*
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { useLandingContext } from '@context/LandingContentContext';
import { AnimatedFooterMark } from '@features/landing/AnimatedFooterMark';
import { resolveFieldOrFallback } from '@lib/i18nField';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/** Landing footer — compact 3-col block + infinite breathing wordmark. */
export const LandingFooter = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { data: landing } = useLandingContext();

  const seatCity = resolveFieldOrFallback(
    landing?.footerLocation,
    locale,
    t('landing.footer.seatCity'),
  );

  return (
    <footer className="bg-bg relative overflow-hidden">
      {/* ─── 3-col block — Nav / Legal / Siège (compact) ─── */}
      <div className="border-border divide-border grid grid-cols-1 divide-y border-y font-mono text-[10px] tracking-[0.18em] uppercase sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <FooterCol label={t('landing.footer.colNavLabel')}>
          <FooterLink href="#s01">{t('landing.footer.navIntro')}</FooterLink>
          <FooterLink href="#s03">{t('landing.footer.navPresentation')}</FooterLink>
          <FooterLink href="#s04">{t('landing.principles.tag')}</FooterLink>
          <FooterLink href="#s05">{t('landing.domains.tag')}</FooterLink>
          <FooterLink href="#s06">{t('landing.footer.navAccess')}</FooterLink>
          <FooterLink href="#s07">{t('landing.footer.navContact')}</FooterLink>
        </FooterCol>

        {/* Legal — non-interactive until real pages exist. WHY: shipping
            dead href="#" links is worse than a muted "pending" label; the
            client provides the Mentions/Confidentialité/CGU content, then
            these become real links to the published pages. */}
        <FooterCol label={t('landing.footer.colLegalLabel')}>
          <FooterPending>{t('landing.footer.legalMentions')}</FooterPending>
          <FooterPending>{t('landing.footer.legalPrivacy')}</FooterPending>
          <FooterPending>{t('landing.footer.legalTerms')}</FooterPending>
        </FooterCol>

        <FooterCol label={t('landing.footer.colSeatLabel')}>
          <span className="text-fg block py-0.5 text-[11px] tracking-normal normal-case">
            {seatCity}
          </span>
          <span className="text-muted block py-0.5 text-[11px] tracking-normal normal-case">
            {t('landing.footer.seatCanton')}
          </span>
          <span className="text-muted block py-0.5 text-[11px] tracking-normal normal-case">
            {t('landing.footer.seatType')}
          </span>
        </FooterCol>
      </div>

      {/* ─── Full-width breathing wordmark (infinite loop) ─── */}
      <div className="py-10 md:py-14">
        <AnimatedFooterMark />
      </div>
    </footer>
  );
};

const FooterCol = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-0.5 px-5 py-5 md:px-6 md:py-6">
    <span className="text-muted mb-2 block text-[10px] tracking-[0.18em]">↘ {label}</span>
    {children}
  </div>
);

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="text-fg hover:border-fg w-fit border-b border-transparent py-0.5 text-[11px] transition-colors"
  >
    {children}
  </a>
);

/** Non-interactive footer label — used for legal entries whose pages do not
 *  exist yet, so no dead href="#" link ships. Replace with FooterLink once the
 *  client supplies the legal content and the pages are wired. */
const FooterPending = ({ children }: { children: ReactNode }) => (
  <span className="text-muted w-fit py-0.5 text-[11px]">{children}</span>
);
