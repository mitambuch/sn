// ═══════════════════════════════════════════════════
// Access — landing S08 (cooptation gate, v2 — pièce maîtresse)
//
// WHAT: Refonte v2 — la section "Demander un accès" devient la finalité
//       de la landing. Trois temps : (1) headline éditoriale + lede
//       vendeur, (2) deux events tease (concrets, visuels — Gala ONU,
//       Art Basel) qui montrent ce qui se passe derrière, (3) une grille
//       de cards floutées ("et le reste, derrière la porte") qui force
//       le geste de demande, (4) deux CTA — Demander / J'ai un code —
//       qui ouvrent l'<AccessRequestModal> en mode pré-sélectionné.
// WHEN: Anchored at #s08, après Domaines et avant Interlocutor.
// CHANGE COPY: src/locales/{fr,en}.json under landing.access.*
// CHANGE EVENTS: edit landing.access.evt01 / evt02 keys.
// ═══════════════════════════════════════════════════

import { AccessRequestModal } from '@features/access/AccessRequestModal';
import { SectionTag } from '@features/landing/SectionTag';
import { useReveal } from '@hooks/useReveal';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { unsplash } from '@/mocks/unsplash';

type ModalMode = 'request' | 'code';

interface EventTeaser {
  imgSlug: string;
  imgAlt: string;
  keyBase: 'evt01' | 'evt02';
}

const EVENTS: EventTeaser[] = [
  { imgSlug: 'geneva-united-nations-gala', imgAlt: 'Palais des Nations en gala', keyBase: 'evt01' },
  { imgSlug: 'art-basel-fair', imgAlt: 'Art Basel galerie principale', keyBase: 'evt02' },
];

const LOCKED_KEYS = ['locked1', 'locked2', 'locked3', 'locked4'] as const;

/** Landing S08 — cooptation access gate (v2). */
export const Access = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('request');

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <section id="s08" data-landing-dark="true" className="bg-ink text-white">
      <div
        ref={ref}
        className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-24 md:gap-24 md:px-12 md:py-40"
      >
        {/* ─── Header — eyebrow + monumental headline + lede ─── */}
        <header className="flex flex-col gap-6">
          <SectionTag num="08.A" label={t('landing.access.eyebrow')} />
          <h2 className="max-w-5xl font-mono text-[clamp(2rem,6vw,5.5rem)] leading-[0.92] font-medium tracking-tight uppercase">
            {t('landing.access.heroTitleA')}
            <br />
            <span className="text-white/60">{t('landing.access.heroTitleB')}</span>
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            {t('landing.access.heroLede')}
          </p>
        </header>

        {/* ─── 2 events tease — concrete, visual, named ─── */}
        <div className="flex flex-col gap-6">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
            {t('landing.access.eventsEyebrow')}
          </span>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {EVENTS.map(evt => (
              <article
                key={evt.keyBase}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-white/15 bg-white/[0.03]"
              >
                <div className="bg-ink relative aspect-[5/3] w-full overflow-hidden">
                  <img
                    src={unsplash(evt.imgSlug)}
                    alt={evt.imgAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="from-ink/85 via-ink/30 absolute inset-0 bg-gradient-to-t to-transparent"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6 md:p-8">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-white/60 uppercase">
                    {t(`landing.access.${evt.keyBase}.tag`)}
                  </span>
                  <h3 className="font-mono text-xl leading-tight font-medium tracking-tight md:text-2xl">
                    {t(`landing.access.${evt.keyBase}.title`)}
                  </h3>
                  <p className="text-xs leading-relaxed text-white/55">
                    {t(`landing.access.${evt.keyBase}.venue`)}
                  </p>
                  <p className="text-sm leading-relaxed text-white/80">
                    {t(`landing.access.${evt.keyBase}.teaser`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ─── Locked grid — "et le reste, derrière la porte" ─── */}
        <div className="flex flex-col gap-6">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
            ↘ {t('landing.access.lockedEyebrow')}
          </span>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {LOCKED_KEYS.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  openModal('request');
                }}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-lg border border-white/15 bg-white/[0.04] p-4 text-left',
                  'duration-base transition-colors hover:border-white/40 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none',
                )}
                aria-label={t('landing.access.lockedHint')}
              >
                {/* Blurred background — fake "locked content" silhouette */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: `linear-gradient(${String((i * 47) % 180)}deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.12))`,
                    filter: 'blur(18px) saturate(0.6)',
                  }}
                />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase">
                    0{i + 1}
                  </span>
                  <span className="text-sm leading-snug font-medium text-white/85 blur-[2px] filter transition-[filter] duration-300 select-none group-hover:blur-[1px]">
                    {t(`landing.access.${key}`)}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.3em] text-white/50 uppercase transition-colors group-hover:text-white">
                    ↗ {t('landing.access.lockedHint')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Dual CTA — Request / Code ─── */}
        <div className="flex flex-col gap-6 border-t border-white/15 pt-12 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">
            {t('landing.access.modal.lede')}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => {
                openModal('request');
              }}
              className={cn(
                'text-ink inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-mono text-xs tracking-[0.3em] uppercase',
                'duration-base transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none',
              )}
            >
              {t('landing.access.ctaRequest')}
              <span aria-hidden="true">↗</span>
            </button>
            <button
              type="button"
              onClick={() => {
                openModal('code');
              }}
              className={cn(
                'inline-flex items-center justify-center gap-3 rounded-full border border-white/40 px-7 py-4 font-mono text-xs tracking-[0.3em] text-white uppercase',
                'duration-base transition-colors hover:border-white hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none',
              )}
            >
              {t('landing.access.ctaCode')}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Modal popup centré — dual-mode ─── */}
      <AccessRequestModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        initialMode={modalMode}
      />
    </section>
  );
};
