// ═══════════════════════════════════════════════════
// Footer — minimal monochrome footer for public surface
//
// WHAT: Renders a hairline border + brand mark + copyright + legal nav.
//       Copyright + (optional) contact line are sourced from the Sanity
//       `siteConfig` singleton when populated, with i18n fallback so the
//       footer never goes blank if Sanity is empty or unconfigured.
// WHEN: Mounted at the bottom of PublicLayout.
// EDIT COPY:
//       - copyright + contactEmail/Phone : edit in Sanity Studio
//         (Configuration globale singleton). Live across all pages.
//       - imprint / privacy labels : src/locales/{fr,en}.json under
//         public.footer.* — these are UI labels, not editorial copy.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { BrandMark } from '@components/brand/BrandMark';
import { ROUTES } from '@constants/routes';
import { useSiteConfig } from '@hooks/useSiteConfig';
import { resolveFieldOrFallback } from '@lib/i18nField';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useTranslation();
  const { localePath, locale } = useLocale();
  const { data: siteConfig } = useSiteConfig();

  const copyright = siteConfig?.copyright ?? t('public.footer.rights');
  const tagline = resolveFieldOrFallback(siteConfig?.footerTagline, locale, '');
  const contactEmail = siteConfig?.contactEmail;

  return (
    <footer className="border-border mt-24 border-t">
      <div className="mx-auto flex w-full max-w-[2440px] flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-4">
          <Link
            to={localePath(ROUTES.HOME)}
            className="text-fg focus-visible:ring-accent rounded-sm focus-visible:ring-2 focus-visible:outline-none"
            aria-label="SAW NEXT — home"
          >
            <BrandMark className="text-sm" />
          </Link>
          <span className="text-muted text-xs tracking-widest uppercase">{copyright}</span>
          {tagline && (
            <span className="text-muted hidden text-xs tracking-widest uppercase md:inline">
              · {tagline}
            </span>
          )}
        </div>
        <nav
          aria-label="Legal links"
          className="text-muted flex items-center gap-6 text-xs tracking-widest uppercase"
        >
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="hover:text-fg focus-visible:ring-accent rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {contactEmail}
            </a>
          )}
          <span>{t('public.footer.imprint')}</span>
          <span>{t('public.footer.privacy')}</span>
        </nav>
      </div>
    </footer>
  );
};
