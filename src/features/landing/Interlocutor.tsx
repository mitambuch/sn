// ═══════════════════════════════════════════════════
// Interlocutor — landing S09 (single point of contact)
//
// WHAT: Two-column section — left (surface bg) holds the founder photo
//       placeholder + name; right holds the role, bio and four direct
//       channels (phone, email, WhatsApp, LinkedIn). Tonight uses static
//       data ; Sanity-driven version lands tomorrow.
// WHEN: Always second-to-last (before the footer). Anchored at #s09.
// CHANGE DATA: edit INTERLOCUTOR object below (static tonight, moves to
//       Sanity `interlocutor` singleton in v0.6.1).
// ═══════════════════════════════════════════════════

import { useReveal } from '@hooks/useReveal';
import { useTranslation } from 'react-i18next';

const INTERLOCUTOR = {
  firstName: 'Salvatore',
  lastName: 'Montemagno',
  phone: '+41 78 749 81 70',
  phoneTel: '+41787498170',
  email: 'info@saw-next.ch',
  whatsapp: 'https://wa.me/41787498170',
  linkedin: '#',
} as const;

/** Landing S09 — interlocutor block with static founder data. */
export const Interlocutor = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="s09"
      ref={ref}
      className="border-border grid min-h-[90vh] grid-cols-1 border-b md:grid-cols-[1fr_1.2fr]"
    >
      {/* ─── Left : surface bg + photo + name ─── */}
      <div className="bg-surface border-border flex flex-col justify-between gap-8 border-b p-8 md:border-r md:border-b-0 md:p-12">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.1em] uppercase">
          <span>↘ 09 / {t('landing.interlocutor.eyebrow')}</span>
          <span aria-hidden="true">↗</span>
        </div>

        <div
          aria-hidden="true"
          className="border-border bg-bg/40 mx-auto my-8 aspect-[3/4] w-full max-w-[280px] border"
          style={{
            backgroundImage:
              'linear-gradient(135deg, color-mix(in srgb, var(--color-fg) 8%, transparent) 0%, color-mix(in srgb, var(--color-fg) 18%, transparent) 100%)',
          }}
        />

        <h2 className="font-mono text-[clamp(1.75rem,4.2vw,4rem)] leading-[0.92] font-medium tracking-[-0.025em] uppercase">
          {INTERLOCUTOR.firstName}
          <br />
          {INTERLOCUTOR.lastName}.
        </h2>
      </div>

      {/* ─── Right : role + bio + channels ─── */}
      <div className="flex max-w-[600px] flex-col justify-center gap-8 p-8 md:p-16">
        <span className="text-muted font-mono text-[10px] tracking-[0.12em] uppercase">
          {t('landing.interlocutor.header')}
        </span>
        <span className="font-mono text-[13px] tracking-[0.05em] uppercase">
          {t('landing.interlocutor.role')}
        </span>
        <p className="font-mono text-lg leading-[1.45] tracking-[-0.01em] uppercase">
          {t('landing.interlocutor.bio')}
        </p>

        <ul className="border-border mt-2 border-t">
          {[
            {
              href: `tel:${INTERLOCUTOR.phoneTel}`,
              label: t('landing.interlocutor.phone'),
              value: INTERLOCUTOR.phone,
            },
            {
              href: `mailto:${INTERLOCUTOR.email}`,
              label: t('landing.interlocutor.email'),
              value: INTERLOCUTOR.email,
            },
            {
              href: INTERLOCUTOR.whatsapp,
              label: t('landing.interlocutor.whatsapp'),
              value: t('landing.interlocutor.whatsappAction'),
            },
            {
              href: INTERLOCUTOR.linkedin,
              label: t('landing.interlocutor.linkedin'),
              value: t('landing.interlocutor.linkedinAction'),
            },
          ].map(channel => (
            <li key={channel.label}>
              <a
                href={channel.href}
                className="border-border text-fg flex items-center justify-between border-b py-3.5 font-mono text-[11px] tracking-[0.05em] uppercase transition-[padding] duration-200 hover:pl-2"
              >
                <span>{channel.label}</span>
                <span className="text-muted">{channel.value}&nbsp;↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
