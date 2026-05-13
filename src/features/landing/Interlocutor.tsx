// ═══════════════════════════════════════════════════
// Interlocutor — landing S09 (focal contact + restricted circle)
//
// WHAT: Two-column section — left holds the focal interlocutor card
//       (Salvatore : photo placeholder + name + bio + 4 direct channels).
//       Right holds the two supporting circle members (Harry Novillo +
//       Bokar Guissé) in compact stacked cards — name + role + short bio,
//       no direct channels (Salvatore is the operational single point
//       of contact, the circle is shown to signal depth).
// WHEN: Always second-to-last, before the footer. Anchored at #s09.
// CHANGE DATA: edit TEAM array below.
//              Migrate to Sanity `team` collection in v0.6.x.
// ═══════════════════════════════════════════════════

import { useReveal } from '@hooks/useReveal';
import { useTranslation } from 'react-i18next';

const FOCAL = {
  firstName: 'Salvatore',
  lastName: 'Montemagno',
  phone: '+41 78 749 81 70',
  phoneTel: '+41787498170',
  email: 'info@saw-next.ch',
  whatsapp: 'https://wa.me/41787498170',
  linkedin: '#',
} as const;

const CIRCLE = [
  { key: 'harry', firstName: 'Harry', lastName: 'Novillo' },
  { key: 'bokar', firstName: 'Bokar', lastName: 'Guissé' },
] as const;

/** Landing S09 — focal interlocutor + supporting circle of two. */
export const Interlocutor = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="s09" ref={ref} className="border-border border-b">
      {/* ─── Header strip — eyebrow + monumental title ─── */}
      <div className="border-border border-b px-8 py-8 md:px-12 md:py-10">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.1em] uppercase">
          <span>↘ 09 / {t('landing.interlocutor.eyebrowTeam')}</span>
          <span className="text-muted">{t('landing.interlocutor.countLabel')}</span>
        </div>
        <h2 className="mt-6 font-mono text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[0.95] font-medium tracking-[-0.02em] uppercase">
          {t('landing.interlocutor.headlineA')}
          <br />
          <span className="text-muted">{t('landing.interlocutor.headlineB')}</span>
        </h2>
      </div>

      {/* ─── Main split : focal (Salvatore) + circle (Harry + Bokar) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr]">
        {/* ─── Focal — Salvatore ─── */}
        <article className="bg-surface border-border flex flex-col gap-8 border-b p-8 md:border-r md:border-b-0 md:p-12">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                {t('landing.interlocutor.focalTag')}
              </span>
              <h3 className="font-mono text-[clamp(1.5rem,3.5vw,3rem)] leading-[0.92] font-medium tracking-[-0.025em] uppercase">
                {FOCAL.firstName}
                <br />
                {FOCAL.lastName}.
              </h3>
            </div>
            <div
              aria-hidden="true"
              className="border-border bg-bg/40 aspect-[3/4] w-24 shrink-0 border md:w-32"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, color-mix(in srgb, var(--color-fg) 8%, transparent) 0%, color-mix(in srgb, var(--color-fg) 18%, transparent) 100%)',
              }}
            />
          </div>

          <span className="font-mono text-[12px] tracking-[0.18em] uppercase">
            {t('landing.interlocutor.role')}
          </span>
          <p className="text-fg max-w-prose text-sm leading-relaxed md:text-base">
            {t('landing.interlocutor.salvaBio')}
          </p>

          <ul className="border-border mt-2 border-t">
            {[
              {
                href: `tel:${FOCAL.phoneTel}`,
                label: t('landing.interlocutor.phone'),
                value: FOCAL.phone,
              },
              {
                href: `mailto:${FOCAL.email}`,
                label: t('landing.interlocutor.email'),
                value: FOCAL.email,
              },
              {
                href: FOCAL.whatsapp,
                label: t('landing.interlocutor.whatsapp'),
                value: t('landing.interlocutor.whatsappAction'),
              },
              {
                href: FOCAL.linkedin,
                label: t('landing.interlocutor.linkedin'),
                value: t('landing.interlocutor.linkedinAction'),
              },
            ].map(channel => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  className="border-border text-fg flex items-center justify-between border-b py-3 font-mono text-[11px] tracking-[0.05em] uppercase transition-[padding] duration-200 hover:pl-2"
                >
                  <span>{channel.label}</span>
                  <span className="text-muted">{channel.value}&nbsp;↗</span>
                </a>
              </li>
            ))}
          </ul>
        </article>

        {/* ─── Circle — Harry + Bokar (compact, no channels) ─── */}
        <aside className="flex flex-col">
          <div className="border-border flex items-center justify-between border-b px-8 py-5 font-mono text-[10px] tracking-[0.3em] uppercase md:px-12">
            <span>↘ {t('landing.interlocutor.circleTag')}</span>
            <span className="text-muted">{t('landing.interlocutor.circleCount')}</span>
          </div>
          {CIRCLE.map((member, i) => (
            <article key={member.key} className={i === 0 ? 'border-border border-b' : ''}>
              <div className="flex flex-col gap-5 p-8 md:p-12">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-muted font-mono text-[9px] tracking-[0.3em] uppercase">
                      0{i + 2} · {t(`landing.interlocutor.${member.key}.tag`)}
                    </span>
                    <h3 className="font-mono text-[clamp(1.25rem,2.6vw,2rem)] leading-[0.95] font-medium tracking-[-0.02em] uppercase">
                      {member.firstName}
                      <br />
                      {member.lastName}.
                    </h3>
                  </div>
                  <div
                    aria-hidden="true"
                    className="border-border bg-bg/40 aspect-[3/4] w-16 shrink-0 border md:w-20"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, color-mix(in srgb, var(--color-fg) 6%, transparent) 0%, color-mix(in srgb, var(--color-fg) 14%, transparent) 100%)',
                    }}
                  />
                </div>
                <p className="text-fg/85 text-sm leading-relaxed">
                  {t(`landing.interlocutor.${member.key}.bio`)}
                </p>
              </div>
            </article>
          ))}
        </aside>
      </div>
    </section>
  );
};
