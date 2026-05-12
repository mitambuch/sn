// ═══════════════════════════════════════════════════
// Access — landing S08 (cooptation gate)
//
// WHAT: Two stacked panels.
//       (A) Main panel — large title + description + 3-step Card grid
//           + primary CTA opening the FreeFormInquiryDrawer (real form,
//           routes to Salva like the dashboard intent drawers).
//       (B) Secondary panel — dark band with "Espace privé" CTA pointing
//           to /:locale/login for existing clients.
// WHEN: The "demander un accès" hub. Anchored at #s08.
// CHANGE STEPS: edit landing.access.step1..3 in fr.json.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { ROUTES } from '@constants/routes';
import { FreeFormInquiryDrawer } from '@features/inquiry/FreeFormInquiryDrawer';
import { SectionTag } from '@features/landing/SectionTag';
import { useReveal } from '@hooks/useReveal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/** Landing S08 — cooptation access gate (drawer form + existing-client login). */
export const Access = () => {
  const { t } = useTranslation();
  const { localePath } = useLocale();
  const ref = useReveal<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <p className="text-fg max-w-130 text-base leading-relaxed">
            {t('landing.access.description')}
          </p>

          {/* ─── "Ce qui se passe derrière" — premium teaser, value-prop ─── */}
          <div className="flex flex-col gap-4">
            <span className="text-muted font-mono text-[10px] tracking-widest uppercase">
              ↘ {t('landing.access.behindEyebrow')}
            </span>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map(n => (
                <Card key={n} padding="none" className="min-h-60 md:min-h-72">
                  <Card.Body density="spacious" className="gap-3">
                    <Card.Eyebrow className="text-fg/80 font-mono">
                      {t(`landing.access.behind${String(n)}Num`)}
                    </Card.Eyebrow>
                    <Card.Title size="lg" className="text-fg">
                      {t(`landing.access.behind${String(n)}Title`)}
                    </Card.Title>
                    <Card.Meta className="text-muted text-sm leading-relaxed">
                      {t(`landing.access.behind${String(n)}Desc`)}
                    </Card.Meta>
                    <Card.Footer className="border-border mt-auto border-t pt-3">
                      <span className="text-fg/70 font-mono text-[10px] tracking-widest uppercase">
                        {t(`landing.access.behind${String(n)}Hint`)}
                      </span>
                    </Card.Footer>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setDrawerOpen(true);
              }}
              className="font-mono text-xs tracking-widest uppercase"
            >
              {t('landing.access.openForm')}
              <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Secondary panel — existing clients ─── */}
      <div className="bg-fg text-bg grid grid-cols-1 items-center gap-6 px-5 py-8 md:grid-cols-[1fr_auto] md:gap-12 md:px-12 md:py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
          <span className="text-bg/50 font-mono text-[10px] tracking-widest uppercase">
            ↘ {t('landing.access.tagSecondary')}
          </span>
          <span className="font-mono text-[clamp(1.25rem,2.5vw,2rem)] leading-tight font-medium tracking-[-0.015em] uppercase">
            {t('landing.access.privateAreaTitle')}
          </span>
          <span className="text-bg/65 max-w-120 text-[13px] leading-normal">
            {t('landing.access.privateAreaDesc')}
          </span>
        </div>

        <Link
          to={localePath(ROUTES.LOGIN)}
          className="border-bg bg-bg text-fg hover:text-bg inline-flex items-center gap-2.5 rounded-full border px-6 py-3 font-mono text-xs tracking-widest uppercase transition-colors hover:bg-transparent"
        >
          {t('landing.access.connect')}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {/* ─── Inquiry drawer — wired to existing Salva pipeline ─── */}
      <FreeFormInquiryDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        source="concierge"
        intentTitle={t('landing.access.drawerTitle')}
        intentLede={t('landing.access.drawerLede')}
        placeholder={t('landing.access.drawerPlaceholder')}
      />
    </section>
  );
};
