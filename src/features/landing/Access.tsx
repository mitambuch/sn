// ═══════════════════════════════════════════════════
// Access — landing S08 (cooptation gate)
//
// WHAT: Two stacked panels.
//       (A) Main panel — large title + description + 3-step grid +
//           primary CTA ("Ouvrir le formulaire", tonight stubbed to #).
//       (B) Secondary panel — dark band with "Espace privé" CTA pointing
//           to /:locale/login for existing clients.
// WHEN: The "demander un accès" hub. Anchored at #s08.
// CHANGE STEPS: edit landing.access.step1..3 in fr.json.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { ROUTES } from '@constants/routes';
import { SectionTag } from '@features/landing/SectionTag';
import { useReveal } from '@hooks/useReveal';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/** Landing S08 — cooptation access gate (form CTA + existing-client login). */
export const Access = () => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="s08" className="border-border border-b">
      {/* ─── Main panel ─── */}
      <div
        ref={ref}
        className="grid min-h-[80vh] grid-cols-1 items-center gap-8 px-5 py-16 md:grid-cols-[1fr_1.6fr] md:gap-20 md:px-12 md:py-32"
      >
        <div className="flex flex-col gap-8">
          <SectionTag num="08.A" label={t('landing.access.tagPrimary')} />
          <h2 className="font-mono text-[clamp(3rem,9vw,9rem)] leading-[0.88] font-medium tracking-[-0.035em] uppercase">
            {t('landing.access.h2line1')}
            <br />
            {t('landing.access.h2line2')}
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          <p className="text-fg max-w-[520px] text-base leading-[1.55]">
            {t('landing.access.description')}
          </p>

          <div className="border-fg/60 bg-fg/60 grid grid-cols-1 gap-px border md:grid-cols-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-bg flex flex-col gap-2.5 p-5">
                <span className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
                  {String(n).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs font-medium tracking-[0.05em] uppercase">
                  {t(`landing.access.step${String(n)}Label`)}
                </span>
                <span className="text-muted text-xs leading-[1.4]">
                  {t(`landing.access.step${String(n)}Info`)}
                </span>
              </div>
            ))}
          </div>

          <div>
            <button
              type="button"
              disabled
              className="border-fg bg-fg text-bg inline-flex items-center gap-2.5 border px-5 py-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              title={t('landing.access.openFormSoon')}
            >
              {t('landing.access.openForm')}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Secondary panel — existing clients ─── */}
      <div className="bg-fg text-bg grid grid-cols-1 items-center gap-6 px-5 py-6 md:grid-cols-[1fr_auto] md:gap-12 md:px-12 md:py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
          <span className="text-bg/50 font-mono text-[10px] tracking-[0.12em] uppercase">
            ↘ {t('landing.access.tagSecondary')}
          </span>
          <span className="font-mono text-[clamp(1.25rem,2.5vw,2rem)] leading-tight font-medium tracking-[-0.015em] uppercase">
            {t('landing.access.privateAreaTitle')}
          </span>
          <span className="text-bg/65 max-w-[480px] text-[13px] leading-[1.5]">
            {t('landing.access.privateAreaDesc')}
          </span>
        </div>

        <Link
          to={localePath(ROUTES.LOGIN)}
          className="border-bg bg-bg text-fg hover:text-bg inline-flex items-center gap-2.5 border px-5 py-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors hover:bg-transparent"
        >
          {t('landing.access.connect')}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
};
