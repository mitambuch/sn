// ═══════════════════════════════════════════════════
// Doorway — acte 5, CONVERSATION + ESPACE CLIENT (50/50)
//
// WHAT: Two side-by-side blocks. Left : the contact panel — the
//       phone (TextMorph "CONTINUER LA CONVERSATION." → number on
//       hover), email click-to-copy, WhatsApp, hours. Right : the
//       client login — "CLIENTS EXISTANTS" section with email field
//       to receive a magic link, plus a link to the full /login.
//       Stack vertical on mobile.
// WHEN: Final act. Closes the page with both new-prospect path and
//       returning-client path.
// CHANGE COPY: constants below + the contact dictionary.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { TextMorph } from '@components/effects/TextMorph';
import { ActStage } from '@components/orchestration/ActStage';
import { TechFrame } from '@components/orchestration/TechFrame';
import { BrandArrow } from '@components/ui/BrandArrow';
import { ROUTES } from '@constants/routes';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CONTACT = {
  phoneDisplay: '+41 78 749 81 70',
  phoneRaw: '+41787498170',
  email: 'info@saw-next.ch',
  whatsappUrl:
    'https://wa.me/41787498170?text=' +
    encodeURIComponent('Bonjour Salvatore, je souhaiterais entrer en contact avec SAW Next.'),
  hours: 'Lun – Ven · 09h00 — 19h00 · CET',
};

const HOVER_DELAY = 600;

export const Doorway = () => {
  const { localePath } = useLocale();
  const [active, setActive] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<number | null>(null);

  const onEnter = () => {
    const t = window.setTimeout(() => setActive(true), HOVER_DELAY);
    setHoverTimer(t);
  };
  const onLeave = () => {
    if (hoverTimer) window.clearTimeout(hoverTimer);
    setActive(false);
    setHoverTimer(null);
  };

  const onCopyEmail = () => {
    navigator.clipboard
      .writeText(CONTACT.email)
      .then(() => {
        setEmailCopied(true);
        window.setTimeout(() => setEmailCopied(false), 2400);
      })
      .catch(() => {
        // silent
      });
  };

  return (
    <ActStage name="Doorway" tall={1} sticky={false}>
      <div className="relative w-full px-6 py-32 md:px-12 md:py-40">
        <TechFrame index="005" label="CONVERSATION" />

        <div className="mx-auto w-full max-w-6xl">
          <h2 className="font-mono text-2xl leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-4xl lg:text-5xl">
            CHAQUE EXPÉRIENCE
            <br />
            COMMENCE PAR
            <br />
            UNE CONVERSATION.
          </h2>

          <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-24">
            {/* Bloc gauche — CONVERSATION (nouveau prospect) */}
            <div className="flex flex-col gap-10 border-t border-[#1a1a1a]/15 pt-10">
              <div className="flex items-center gap-4 font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/50 uppercase">
                <span>05.A</span>
                <span className="block h-px w-8 bg-[#1a1a1a]/30" />
                <span>NOUVEAU CONTACT</span>
              </div>

              <button
                type="button"
                onPointerEnter={onEnter}
                onPointerLeave={onLeave}
                onFocus={onEnter}
                onBlur={onLeave}
                onClick={() => {
                  window.location.href = `tel:${CONTACT.phoneRaw}`;
                }}
                className="group flex flex-col items-start gap-2 text-left text-[#1a1a1a] focus-visible:outline-none"
              >
                <span className="font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/50 uppercase">
                  HOVER POUR RÉVÉLER · CLIC POUR APPELER
                </span>
                <TextMorph
                  from="CONTINUER LA CONVERSATION."
                  to={CONTACT.phoneDisplay}
                  active={active}
                  pace={28}
                  className="font-mono text-xl leading-tight font-semibold tracking-tight uppercase md:text-3xl lg:text-4xl"
                />
              </button>

              <ul className="flex flex-col gap-4 font-mono text-sm text-[#1a1a1a] uppercase">
                <li className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
                  <button
                    type="button"
                    onClick={onCopyEmail}
                    className="flex items-center gap-3 tracking-wider focus-visible:outline-none"
                  >
                    <span className="font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/50">
                      EMAIL
                    </span>
                    <span className="font-mono text-base font-semibold tracking-tight">
                      {emailCopied ? 'COPIÉ' : CONTACT.email}
                    </span>
                  </button>
                  <BrandArrow className="h-[0.8em] text-[#1a1a1a]/40" />
                </li>
                <li className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
                  <a
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 tracking-wider focus-visible:outline-none"
                  >
                    <span className="font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/50">
                      WHATSAPP
                    </span>
                    <span className="font-mono text-base font-semibold tracking-tight">
                      MESSAGE PRÉ-RÉDIGÉ
                    </span>
                  </a>
                  <BrandArrow className="h-[0.8em] text-[#1a1a1a]/40" />
                </li>
                <li className="flex items-center gap-3 pt-2 font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/50">
                  <span>HORAIRES</span>
                  <span className="block h-px w-6 bg-[#1a1a1a]/30" />
                  <span>{CONTACT.hours}</span>
                </li>
              </ul>
            </div>

            {/* Bloc droit — ESPACE CLIENT (existant) */}
            <div className="flex flex-col gap-10 border-t border-[#1a1a1a]/15 pt-10">
              <div className="flex items-center gap-4 font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/50 uppercase">
                <span>05.B</span>
                <span className="block h-px w-8 bg-[#1a1a1a]/30" />
                <span>ESPACE CLIENT</span>
              </div>

              <h3 className="font-mono text-xl leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-3xl lg:text-4xl">
                CLIENTS EXISTANTS.
                <br />
                ACCÈS PRIVÉ.
              </h3>

              <p className="max-w-md text-base leading-relaxed text-[#1a1a1a]/75">
                Un lien de connexion sécurisé est envoyé sur votre email. Aucun mot de passe à
                retenir.
              </p>

              <ClientLoginForm />

              <Link
                to={localePath(ROUTES.LOGIN)}
                className="group inline-flex items-center gap-3 font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/60 uppercase hover:text-[#1a1a1a]"
              >
                <span>OU SE CONNECTER AVEC UN CODE D&apos;INVITATION</span>
                <BrandArrow className="h-[0.8em] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* End-cap : vision + legal mention */}
          <div className="mt-32 border-t border-[#1a1a1a]/15 pt-10">
            <p className="max-w-2xl font-mono text-xs leading-relaxed tracking-wider text-[#1a1a1a]/40 italic md:text-sm">
              Créer des opportunités. Faciliter les rencontres. Transformer des intentions en
              expériences.
            </p>
            <p className="mt-12 max-w-md font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/30 uppercase">
              SUISSE · CONFIDENTIALITÉ ABSOLUE · RÉSEAU DE PARTENAIRES SÉLECTIONNÉS · SAW NEXT
              N&apos;AGIT JAMAIS COMME INTERMÉDIAIRE FINANCIER
            </p>
          </div>
        </div>
      </div>
    </ActStage>
  );
};

const ClientLoginForm = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSent(true);
    // TODO: wire to Supabase magic link in lot A.5
  };

  if (sent) {
    return (
      <p className="font-mono text-xs leading-relaxed tracking-wider text-[#1a1a1a]/70 uppercase">
        LIEN DE CONNEXION ENVOYÉ → VÉRIFIEZ VOTRE BOÎTE.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
      <div className="flex flex-1 flex-col gap-2">
        <label
          htmlFor="doorway-email"
          className="font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/50 uppercase"
        >
          EMAIL
        </label>
        <input
          id="doorway-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="vous@domaine.ch"
          className="border-b border-[#1a1a1a]/30 bg-transparent py-3 text-base text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/30 focus:border-[#1a1a1a]"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-3 rounded-full border border-[#1a1a1a]/30 px-6 py-3 font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a] uppercase hover:border-[#1a1a1a] focus-visible:outline-none"
      >
        <span>RECEVOIR LE LIEN</span>
        <BrandArrow className="h-[0.8em]" />
      </button>
    </form>
  );
};
