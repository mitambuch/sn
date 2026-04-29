// ═══════════════════════════════════════════════════
// Home — Sawnext public landing
//
// WHAT: Renders a sober, monochrome landing for the public surface.
//       Brand mark + Swiss tagline + tightly-set intro paragraph + a
//       single "access your space" CTA pointing to /login.
// WHEN: Index of /:locale/.
// EDIT COPY: src/locales/{fr,en}.json under public.* — never inline.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { SeoHead } from '@components/features/SeoHead';
import { Container } from '@components/layout/Container';
import { ROUTES } from '@constants/routes';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  const { localePath } = useLocale();

  return (
    <>
      <SeoHead />
      <Container size="md">
        <section className="flex min-h-[calc(100vh-10rem)] flex-col justify-center py-24">
          {/* Brand mark — initials, monochrome, no decoration */}
          <span aria-hidden="true" className="text-fg font-mono text-xs tracking-[0.4em] uppercase">
            S — N
          </span>

          {/* Tagline */}
          <p className="text-muted mt-12 text-xs tracking-[0.3em] uppercase">
            {t('public.tagline')}
          </p>

          {/* Headline */}
          <h1 className="text-fg mt-4 max-w-3xl text-4xl font-light tracking-tight text-balance md:text-6xl lg:text-7xl">
            {t('auth.tagline')}
          </h1>

          {/* Lede */}
          <p className="text-muted mt-6 max-w-xl text-base leading-relaxed text-pretty md:text-lg">
            {t('public.intro')}
          </p>

          {/* Hairline + CTA */}
          <div className="mt-12 flex flex-col items-start gap-6">
            <span className="bg-fg block h-px w-12" aria-hidden="true" />
            <Link
              to={localePath(ROUTES.LOGIN)}
              className="border-border text-fg duration-base hover:border-fg/60 focus-visible:ring-accent inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase transition-[border-color,background-color,color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {t('public.loginCta')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
