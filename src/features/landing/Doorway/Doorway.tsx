// ═══════════════════════════════════════════════════
// Doorway — acte 5, the door (not a footer)
//
// WHAT: Off-white surface with a single magnetic line of text. On
//       hover sustained, the line morphs character-by-character into
//       Salvatore's phone number. Click → drawer mounts with the
//       method, the team (3 founders, mono discrete), partners
//       (1-line mention, no logos), confidentiality micro, and a
//       single freeform textarea + email + send.
// WHEN: Final act. Theme flips to light + warm grain in <Reversal />,
//       this act renders on that surface.
// CHANGE FROM/TO STRINGS: FROM_TEXT / TO_TEXT below.
// ═══════════════════════════════════════════════════

import { TextMorph } from '@components/effects/TextMorph';
import { ActStage } from '@components/orchestration/ActStage';
import { useState } from 'react';

const FROM_TEXT = 'Continuer la conversation.';
const TO_TEXT = '+41 78 749 81 70';
const HOVER_DELAY = 800;

export const Doorway = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
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

  return (
    <ActStage name="Doorway" tall={1} sticky={false}>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#edf2f1] px-6 md:px-12">
        {/* The line — the only visible interactive element */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          onFocus={onEnter}
          onBlur={onLeave}
          className="text-[#1a1a1a] focus-visible:outline-none"
        >
          <TextMorph
            from={FROM_TEXT}
            to={TO_TEXT}
            active={active}
            pace={32}
            className="font-mono text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
          />
        </button>

        {/* Vision — pied opacity 30%, italique mono */}
        <p className="mt-24 max-w-2xl text-center font-mono text-xs leading-relaxed tracking-wider text-[#1a1a1a]/30 italic md:text-sm">
          Créer des opportunités. Faciliter les rencontres. Transformer des intentions en
          expériences.
        </p>

        {/* Mention micro — credibility murmur, opacity 20% */}
        <p className="mt-16 font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/20 uppercase">
          Suisse · Confidentialité absolue · Réseau de partenaires sélectionnés
        </p>

        {/* Drawer placeholder — full implementation in Phase B.3 follow-up */}
        {open && <DrawerSkeleton onClose={() => setOpen(false)} />}
      </div>
    </ActStage>
  );
};

interface DrawerSkeletonProps {
  onClose: () => void;
}

const DrawerSkeleton = ({ onClose }: DrawerSkeletonProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Démarrer la conversation"
      className="fixed inset-0 z-50 flex flex-col bg-[#edf2f1] px-6 py-12 md:px-16 md:py-20"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 font-mono text-[10px] tracking-[0.4em] text-[#1a1a1a]/60 uppercase hover:text-[#1a1a1a] focus-visible:outline-none md:top-12 md:right-12"
      >
        Fermer ↗
      </button>

      <div className="mx-auto mt-20 w-full max-w-2xl">
        <p className="font-mono text-[10px] tracking-[0.5em] text-[#1a1a1a]/50 uppercase">
          Une conversation
        </p>
        <h2 className="text-fg mt-3 font-mono text-3xl leading-tight font-semibold tracking-tight text-[#1a1a1a] uppercase md:text-5xl">
          Décrivez votre intention.
        </h2>

        <form className="mt-12 flex flex-col gap-5">
          <textarea
            rows={5}
            placeholder="Ce que vous cherchez, ce que vous attendez."
            className="w-full resize-none border-b border-[#1a1a1a]/20 bg-transparent py-3 text-base text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40 focus:border-[#1a1a1a]"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border-b border-[#1a1a1a]/20 bg-transparent py-3 text-base text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40 focus:border-[#1a1a1a]"
          />
          <button
            type="submit"
            className="mt-4 self-start rounded-full border border-[#1a1a1a]/30 px-6 py-3 font-mono text-[11px] tracking-[0.3em] text-[#1a1a1a] uppercase hover:border-[#1a1a1a] focus-visible:outline-none"
          >
            Envoyer →
          </button>
        </form>

        {/* Method — 4 lines, mono numbered */}
        <div className="mt-20 grid gap-3 font-mono text-xs tracking-[0.3em] text-[#1a1a1a]/70 uppercase">
          <div>01 · Une demande</div>
          <div>02 · Une structuration</div>
          <div>03 · Une proposition</div>
          <div>04 · Une exécution</div>
        </div>

        {/* Team — 3 names, no photos, no roles upfront */}
        <div className="mt-20 grid gap-2 font-mono text-sm font-semibold tracking-tight text-[#1a1a1a]">
          <div title="20 ans dans le luxe">Salvatore Montemagno.</div>
          <div title="Agent de joueurs européens">Bokar Guissé.</div>
          <div title="Ancien sportif professionnel">Harry Novillo.</div>
        </div>

        {/* Partners — text only, no logos */}
        <p className="mt-12 max-w-md font-mono text-[10px] leading-relaxed tracking-wider text-[#1a1a1a]/50 uppercase">
          Réseau international de partenaires sélectionnés selon la nature de chaque demande.
        </p>

        {/* Confidentiality — micro */}
        <p className="mt-12 max-w-md font-mono text-[9px] leading-relaxed tracking-wider text-[#1a1a1a]/40 uppercase">
          Aucune information sensible n'est partagée sans validation. SAW Next n'agit jamais comme
          intermédiaire financier.
        </p>
      </div>
    </div>
  );
};
