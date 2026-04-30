// ═══════════════════════════════════════════════════
// ConversationFooter — closing section, anchors the relationship
//
// WHAT: Final section of the landing. Big monospace headline, a
//       silhouette card for Salvatore (placeholder image until owner
//       supplies a hi-res one), two magnetic CTAs (call + copy email),
//       and the legal end-line. Mirrors the PDF "Votre interlocuteur"
//       block, augmented with click-to-copy + tel:.
// WHEN: Last section before the page bottom; siblings of <Manifesto />.
// CHANGE CONTACT: edit the constants below — they'll move to siteConfig
//                 once /brief is run for client.md.
// ═══════════════════════════════════════════════════

import { Logomark } from '@components/ui/Logomark';
import { MagneticButton } from '@components/ui/MagneticButton';
import { MaskedReveal } from '@components/ui/MaskedReveal';
import { useState } from 'react';

const CONTACT = {
  name: 'Salvatore Montemagno',
  role: 'Votre interlocuteur unique',
  phone: '+41 78 749 81 70',
  phoneRaw: '+41787498170',
  email: 'info@saw-next.ch',
};

interface ConversationFooterProps {
  id?: string;
}

export const ConversationFooter = ({ id = 'conversation' }: ConversationFooterProps) => {
  const [copied, setCopied] = useState(false);

  const onCopyEmail = () => {
    navigator.clipboard
      .writeText(CONTACT.email)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2400);
      })
      .catch(() => {
        // clipboard unavailable — silent, the mailto: anchor still works
      });
  };

  return (
    <section id={id} className="relative w-full px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-16">
        <div className="text-fg/50 col-span-12 font-mono text-[10px] tracking-[0.4em] uppercase md:col-span-3">
          <span className="text-fg/30">05 / </span>
          <span>Conversation</span>
        </div>

        <div className="col-span-12 md:col-span-9">
          <MaskedReveal>
            <h2 className="text-fg font-mono text-3xl leading-[0.95] tracking-tight uppercase md:text-5xl lg:text-6xl">
              Chaque expérience commence
              <br />
              par une conversation.
            </h2>
          </MaskedReveal>

          <div className="mt-16 grid gap-12 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
            {/* Salvatore card — placeholder silhouette, swap once we have hi-res */}
            <div className="flex items-center gap-5">
              <div
                aria-hidden="true"
                className="bg-fg/8 ring-fg/10 relative h-20 w-20 overflow-hidden rounded-full ring-1"
              >
                <div className="from-fg/20 to-fg/5 absolute inset-0 bg-linear-to-br" />
                <span className="text-fg/40 absolute inset-0 flex items-center justify-center font-mono text-xs tracking-[0.3em] uppercase">
                  SM
                </span>
              </div>
              <div>
                <p className="text-fg font-mono text-sm tracking-wider uppercase">{CONTACT.name}</p>
                <p className="text-muted mt-1 font-mono text-[10px] tracking-[0.3em] uppercase">
                  {CONTACT.role}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <MagneticButton strength={0.3} range={140}>
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  className="border-fg/30 hover:border-fg text-fg focus-visible:ring-fg/40 inline-flex items-center justify-center gap-3 rounded-full border px-6 py-3 font-mono text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span aria-hidden="true">↗</span>
                  <span>{CONTACT.phone}</span>
                </a>
              </MagneticButton>

              <MagneticButton strength={0.3} range={140}>
                <button
                  type="button"
                  onClick={onCopyEmail}
                  className="border-fg/30 hover:border-fg text-fg focus-visible:ring-fg/40 inline-flex items-center justify-center gap-3 rounded-full border px-6 py-3 font-mono text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span aria-hidden="true">{copied ? '✓' : '⎘'}</span>
                  <span>{copied ? 'Copié' : CONTACT.email}</span>
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* End-cap — Logomark + legal */}
      <div className="border-fg/10 mx-auto mt-24 flex max-w-6xl flex-col items-start justify-between gap-6 border-t pt-8 md:flex-row md:items-center">
        <Logomark className="text-fg/80 h-5 w-auto" />
        <p className="text-fg/40 font-mono text-[10px] tracking-[0.4em] uppercase">
          © 2026 SAW Next — Genève · Strictement confidentiel
        </p>
      </div>
    </section>
  );
};
