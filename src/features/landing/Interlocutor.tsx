// ═══════════════════════════════════════════════════
// Interlocutor — landing S09 (focal contact + restricted circle)
//
// WHAT: Two-column section — left holds the focal interlocutor card
//       (default: Salvatore — photo placeholder + name + bio + 4 direct
//       channels). Right holds the two supporting circle members in
//       compact stacked cards.
//
//       Owner direction : "c'est une question d'égo — faut que les
//       autres si on veut les mettre en avant aient la même taille
//       que Salva." → clicking on a circle member promotes them into
//       the focal slot ; clicking again brings Salvatore back. Channels
//       always stay on the original Salvatore record because he is the
//       operational single point of contact — non-Salva focals show
//       a "Contact via Salvatore" deeplink instead.
//
// WHEN: Anchored at #s09.
// CHANGE DATA: edit MEMBERS array below.
// ═══════════════════════════════════════════════════

import { useReveal } from '@hooks/useReveal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FOCAL_CHANNELS = {
  phone: '+41 78 749 81 70',
  phoneTel: '+41787498170',
  email: 'info@saw-next.ch',
  whatsapp: 'https://wa.me/41787498170',
  linkedin: '#',
} as const;

interface Member {
  key: 'salva' | 'harry' | 'bokar';
  firstName: string;
  lastName: string;
}

const MEMBERS: ReadonlyArray<Member> = [
  { key: 'salva', firstName: 'Salvatore', lastName: 'Montemagno' },
  { key: 'harry', firstName: 'Harry', lastName: 'Novillo' },
  { key: 'bokar', firstName: 'Bokar', lastName: 'Guissé' },
] as const;

/** Landing S09 — promotable focal interlocutor + supporting circle. */
export const Interlocutor = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>();
  const [focalKey, setFocalKey] = useState<Member['key']>('salva');

  const focal = MEMBERS.find(m => m.key === focalKey) ?? MEMBERS[0]!;
  const circle = MEMBERS.filter(m => m.key !== focalKey);
  const isSalvaFocal = focal.key === 'salva';

  const focalBio = t(
    isSalvaFocal ? 'landing.interlocutor.salvaBio' : `landing.interlocutor.${focal.key}.bio`,
  );
  const focalTag = isSalvaFocal
    ? t('landing.interlocutor.focalTag')
    : t(`landing.interlocutor.${focal.key}.tag`);

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

      {/* ─── Main split : focal (full size) + circle (compact stack) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr]">
        {/* ─── Focal card ─── */}
        <article
          className="bg-surface border-border duration-base flex flex-col gap-8 border-b p-8 transition-all md:border-r md:border-b-0 md:p-12"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">
                {focalTag}
              </span>
              <h3 className="font-mono text-[clamp(1.5rem,3.5vw,3rem)] leading-[0.92] font-medium tracking-[-0.025em] uppercase">
                {focal.firstName}
                <br />
                {focal.lastName}.
              </h3>
            </div>
            <div
              aria-hidden="true"
              className="border-border bg-bg/40 aspect-3/4 w-24 shrink-0 border md:w-32"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, color-mix(in srgb, var(--color-fg) 8%, transparent) 0%, color-mix(in srgb, var(--color-fg) 18%, transparent) 100%)',
              }}
            />
          </div>

          <span className="font-mono text-[12px] tracking-[0.18em] uppercase">
            {t('landing.interlocutor.role')}
          </span>
          <p className="text-fg max-w-prose text-sm leading-relaxed md:text-base">{focalBio}</p>

          {/* Channels — only when Salvatore is focal. Otherwise a single
              "via Salvatore" link, since he is the operational contact. */}
          {isSalvaFocal ? (
            <ul className="border-border mt-2 border-t">
              {[
                {
                  href: `tel:${FOCAL_CHANNELS.phoneTel}`,
                  label: t('landing.interlocutor.phone'),
                  value: FOCAL_CHANNELS.phone,
                },
                {
                  href: `mailto:${FOCAL_CHANNELS.email}`,
                  label: t('landing.interlocutor.email'),
                  value: FOCAL_CHANNELS.email,
                },
                {
                  href: FOCAL_CHANNELS.whatsapp,
                  label: t('landing.interlocutor.whatsapp'),
                  value: t('landing.interlocutor.whatsappAction'),
                },
                {
                  href: FOCAL_CHANNELS.linkedin,
                  label: t('landing.interlocutor.linkedin'),
                  value: t('landing.interlocutor.linkedinAction'),
                },
              ].map(channel => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    className="border-border text-fg flex items-center justify-between border-b py-3 font-mono text-[11px] tracking-wider uppercase transition-[padding] duration-200 hover:pl-2"
                  >
                    <span>{channel.label}</span>
                    <span className="text-muted">{channel.value}&nbsp;↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-border mt-2 flex items-center justify-between gap-4 border-t pt-4">
              <span className="text-muted font-mono text-[11px] tracking-[0.18em] uppercase">
                Contact opérationnel · Salvatore
              </span>
              <button
                type="button"
                onClick={() => setFocalKey('salva')}
                className="border-fg text-fg hover:bg-fg hover:text-bg duration-base inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors"
              >
                Voir Salvatore
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}
        </article>

        {/* ─── Circle — promotable cards ─── */}
        <aside className="flex flex-col">
          <div className="border-border flex items-center justify-between border-b px-8 py-5 font-mono text-[10px] tracking-[0.3em] uppercase md:px-12">
            <span>↘ {t('landing.interlocutor.circleTag')}</span>
            <span className="text-muted">{t('landing.interlocutor.circleCount')}</span>
          </div>
          {circle.map((member, i) => {
            // Bio key : Salva has a different bio field name (salvaBio).
            const bioKey =
              member.key === 'salva'
                ? 'landing.interlocutor.salvaBio'
                : `landing.interlocutor.${member.key}.bio`;
            const tagKey =
              member.key === 'salva'
                ? 'landing.interlocutor.focalTag'
                : `landing.interlocutor.${member.key}.tag`;
            return (
              <article key={member.key} className={i === 0 ? 'border-border border-b' : ''}>
                <button
                  type="button"
                  onClick={() => setFocalKey(member.key)}
                  aria-label={`Mettre en avant ${member.firstName} ${member.lastName}`}
                  className="hover:bg-bg/40 focus-visible:ring-fg/30 group w-full text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="flex flex-col gap-5 p-8 md:p-12">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-muted font-mono text-[9px] tracking-[0.3em] uppercase">
                          {t(tagKey)}
                        </span>
                        <h3 className="font-mono text-[clamp(1.25rem,2.6vw,2rem)] leading-[0.95] font-medium tracking-[-0.02em] uppercase">
                          {member.firstName}
                          <br />
                          {member.lastName}.
                        </h3>
                      </div>
                      <div
                        aria-hidden="true"
                        className="border-border bg-bg/40 aspect-3/4 w-16 shrink-0 border md:w-20"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, color-mix(in srgb, var(--color-fg) 6%, transparent) 0%, color-mix(in srgb, var(--color-fg) 14%, transparent) 100%)',
                        }}
                      />
                    </div>
                    <p className="text-fg/85 text-sm leading-relaxed">{t(bioKey)}</p>
                    <span className="text-muted group-hover:text-fg font-mono text-[10px] tracking-[0.3em] uppercase transition-colors">
                      Mettre en avant ↗
                    </span>
                  </div>
                </button>
              </article>
            );
          })}
        </aside>
      </div>
    </section>
  );
};
