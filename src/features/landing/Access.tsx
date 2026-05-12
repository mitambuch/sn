// ═══════════════════════════════════════════════════
// Access — landing S08 (cooptation gate)
//
// WHAT: Single main panel — large title + description + 3-step Card
//       grid (premium teaser of what's behind the door) + primary CTA
//       opening the FreeFormInquiryDrawer (real form, routes to Salva
//       like the dashboard intent drawers). Secondary "Espace privé"
//       panel removed in round 9 (owner direction 2026-05-13).
// WHEN: The "demander un accès" hub. Anchored at #s08.
// CHANGE STEPS: edit landing.access.step1..3 in fr.json.
// ═══════════════════════════════════════════════════

import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { FreeFormInquiryDrawer } from '@features/inquiry/FreeFormInquiryDrawer';
import { SectionTag } from '@features/landing/SectionTag';
import { useReveal } from '@hooks/useReveal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/** Landing S08 — cooptation access gate (drawer form). */
export const Access = () => {
  const { t } = useTranslation();
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
          <h2 className="font-mono text-[clamp(1.75rem,4vw,4rem)] leading-[0.95] font-medium tracking-tight uppercase">
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
