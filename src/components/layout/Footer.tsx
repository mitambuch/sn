// ═══════════════════════════════════════════════════
// Footer — minimal monochrome footer for public surface
//
// WHAT: Renders a hairline border + brand mark + a thin row of legal
//       links + copyright. No newsletter, no social, no decoration.
// WHEN: Mounted at the bottom of PublicLayout.
// EDIT COPY: src/locales/{fr,en}.json under public.footer.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { siteConfig } from '@config/site';
import { ROUTES } from '@constants/routes';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useTranslation();
  const { localePath } = useLocale();

  return (
    <footer className="border-border mt-24 border-t">
      <div className="mx-auto flex w-full max-w-[2440px] flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-4">
          <Link
            to={localePath(ROUTES.HOME)}
            className="text-fg focus-visible:ring-accent rounded-sm text-sm font-medium tracking-tight focus-visible:ring-2 focus-visible:outline-none"
          >
            {siteConfig.name}
          </Link>
          <span className="text-muted text-xs tracking-widest uppercase">
            {t('public.footer.rights')}
          </span>
        </div>
        <nav
          aria-label="Legal links"
          className="text-muted flex items-center gap-6 text-xs tracking-widest uppercase"
        >
          <span>{t('public.footer.imprint')}</span>
          <span>{t('public.footer.privacy')}</span>
        </nav>
      </div>
    </footer>
  );
};
